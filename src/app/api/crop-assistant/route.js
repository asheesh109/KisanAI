import { NextResponse } from 'next/server';
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

    // Step 2: Perform Cosine Similarity against embedded crop database
    const scoredDocs = embeddedDocs.map(doc => {
      const similarity = cosineSimilarity(queryVector, doc.embedding);
      return {
        title: doc.title,
        category: doc.category,
        content: doc.content,
        similarity
      };
    });

    // Sort descending by similarity
    scoredDocs.sort((a, b) => b.similarity - a.similarity);

    // Similarity threshold (e.g. 0.55 for crop queries)
    const threshold = 0.55;
    const matchedDocs = scoredDocs.filter(doc => doc.similarity >= threshold).slice(0, 3);

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

    // Step 4: Call Gemini completions (gemini-2.0-flash)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const completionResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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
      })
    });

    if (!completionResponse.ok) {
      const errText = await completionResponse.text();
      console.error('Gemini Completions API Error:', errText);
      throw new Error(`Completions generation failed: ${completionResponse.status}`);
    }

    const completionData = await completionResponse.json();
    const answer = completionData.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, failed to generate an answer.";

    // Cleaned source list
    const sources = matchedDocs.map(d => ({
      title: d.title,
      category: d.category,
      similarity: d.similarity
    }));

    return NextResponse.json({
      answer,
      sources
    }, { status: 200 });

  } catch (error) {
    console.error('Crop Assistant API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request', details: error.message },
      { status: 500 }
    );
  }
}
