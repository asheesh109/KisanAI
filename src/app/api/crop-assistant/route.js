import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import embeddedDocs from '../../../data/embeddedCropKnowledge.json';

// Helper: Vector Dot Product
function dotProduct(a, b) {
  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
  }
  return dot;
}

// Helper: Vector Magnitude
function magnitude(a) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * a[i];
  }
  return Math.sqrt(sum);
}

// Helper: Cosine Similarity
function cosineSimilarity(a, b) {
  const dot = dotProduct(a, b);
  const magA = magnitude(a);
  const magB = magnitude(b);
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

// Helper: Keyword matching score with Devanagari script support (for Hindi)
function keywordMatchScore(queryText, docText) {
  if (!queryText || !docText) return 0;
  
  // Clean special characters but preserve Devanagari Unicode block (Hindi) and standard alphanumeric
  const cleanQuery = queryText.toLowerCase().replace(/[^\w\s\u0900-\u097F]/g, " ");
  const queryWords = cleanQuery.split(/\s+/).filter(w => w.length > 2);
  
  if (queryWords.length === 0) return 0;
  
  const docLower = docText.toLowerCase();
  let matches = 0;
  
  for (const word of queryWords) {
    if (docLower.includes(word)) {
      matches++;
    }
  }
  
  return matches / queryWords.length;
}

export async function POST(request) {
  try {
    const { message, language } = await request.json();

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
    }

    // Step 1: Generate embedding for the user message
    const embedUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`;
    const embedResponse = await fetch(embedUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/gemini-embedding-001',
        content: { parts: [{ text: message }] }
      })
    });

    if (!embedResponse.ok) {
      const errText = await embedResponse.text();
      console.error('Embeddings API Error:', errText);
      throw new Error(`Embedding generation failed: ${embedResponse.status}`);
    }

    const embedData = await embedResponse.json();
    const queryVector = embedData.embedding?.values;

    if (!queryVector || !Array.isArray(queryVector)) {
      throw new Error('Invalid response format from Embeddings API');
    }

    // Step 2: Perform Hybrid Search (Cosine Similarity + Keyword Matching)
    const scoredDocs = embeddedDocs.map(doc => {
      const similarity = cosineSimilarity(queryVector, doc.embedding);
      const textToMatch = `${doc.title} ${doc.content}`;
      const keywordScore = keywordMatchScore(message, textToMatch);
      
      // Compute Hybrid Score: 70% Semantic Vector match + 30% Keyword exact match
      const hybridScore = (0.7 * similarity) + (0.3 * keywordScore);
      
      return {
        title: doc.title,
        category: doc.category,
        content: doc.content,
        similarity: similarity,
        hybridScore
      };
    });

    // Sort descending by hybridScore
    scoredDocs.sort((a, b) => b.hybridScore - a.hybridScore);

    // Hybrid Similarity threshold
    const threshold = 0.52;
    const matchedDocs = scoredDocs.filter(doc => doc.hybridScore >= threshold).slice(0, 3);

    // Step 3: Construct RAG Prompt
    let contextText = '';
    matchedDocs.forEach((doc, idx) => {
      contextText += `[Document ${idx + 1}]: Title: ${doc.title} | Category: ${doc.category}\nContent: ${doc.content}\n\n`;
    });

    let systemPrompt = '';
    const currentLang = language || 'en';

    if (matchedDocs.length > 0) {
      systemPrompt = `You are "KisanAI Crop Assistant" (AI फसल सहायक), a expert agricultural chatbot for Indian farmers. 
Your goal is to answer farmer queries accurately, professionally, and in their chosen language (${currentLang}).

Answer the query based on the following verified agricultural guidelines and disease handbooks:
---
${contextText}
---

Guidelines:
1. Provide a direct, detailed answer in ${currentLang}.
2. Use the provided context to answer. Be factual and clear.
3. Maintain a friendly, supportive, and expert agricultural advisor tone.
4. CITE the source documents you used by listing their Title in a "References / स्रोत" section at the end of your response.`;
    } else {
      systemPrompt = `You are "KisanAI Crop Assistant" (AI फसल सहायक), a expert agricultural chatbot for Indian farmers. 
Your goal is to answer farmer queries accurately, professionally, and in their chosen language (${currentLang}).

Guidelines:
1. Since no specific matches were found in our handbook database, provide standard, best practice agricultural advice based on scientific farming methods.
2. Answer in ${currentLang}.
3. Clearly mention that this is general advice and farmers should consult their local state agriculture department or Mandi for regional specificity.`;
    }

    // Step 4: Stream response using official GoogleGenAI SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContentStream({
      contents: [
        {
          role: 'user',
          parts: [{ text: `System Instructions:\n${systemPrompt}\n\nFarmer Query: ${message}` }]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1024
      }
    });

    // Create ReadableStream Response for real-time streaming chunks (SSE format)
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: chunkText })}\n\n`)
              );
            }
          }

          // Emit sources at the end of the stream
          const sources = matchedDocs.map(d => ({
            title: d.title,
            category: d.category,
            similarity: d.hybridScore
          }));
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true, sources })}\n\n`)
          );
        } catch (e) {
          console.error('Streaming Exception:', e);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: e.message })}\n\n`)
          );
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    });

  } catch (error) {
    console.error('Crop Assistant API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request', details: error.message },
      { status: 500 }
    );
  }
}
