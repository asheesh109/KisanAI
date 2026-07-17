import fs from 'fs';
import path from 'path';
import { cropKnowledgeDocs } from '../src/data/cropKnowledgeDocs.js';

// Parse API key manually from .env.local
let apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf-8');
    const match = envContent.match(/NEXT_PUBLIC_GEMINI_API_KEY\s*=\s*([^\s#]+)/);
    if (match) apiKey = match[1].trim();
  } catch (e) {
    console.error('⚠️ Could not read .env.local file:', e.message);
  }
}

if (!apiKey) {
  console.error('❌ Error: NEXT_PUBLIC_GEMINI_API_KEY is not configured in .env.local or environment');
  process.exit(1);
}

const EMBEDDING_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`;

async function getEmbedding(text) {
  const response = await fetch(EMBEDDING_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'models/gemini-embedding-001',
      content: {
        parts: [{ text }]
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini Embeddings API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const vector = data.embedding?.values;
  
  if (!vector || !Array.isArray(vector)) {
    throw new Error('Invalid response format from Gemini Embeddings API');
  }

  return vector;
}

async function run() {
  console.log('🌱 Starting document embedding generation via Gemini...');
  console.log(`📑 Found ${cropKnowledgeDocs.length} documents to embed.`);

  const embeddedDocs = [];

  for (let i = 0; i < cropKnowledgeDocs.length; i++) {
    const doc = cropKnowledgeDocs[i];
    console.log(`[${i + 1}/${cropKnowledgeDocs.length}] Embedding: "${doc.title}"...`);
    
    try {
      // Embed both title and content for better search match
      const textToEmbed = `Title: ${doc.title}\nContent: ${doc.content}`;
      const embedding = await getEmbedding(textToEmbed);
      
      embeddedDocs.push({
        ...doc,
        embedding
      });
      
      // Prevent rate limit hits (short sleep)
      await new Promise(resolve => setTimeout(resolve, 600));
    } catch (err) {
      console.error(`❌ Failed to embed "${doc.title}":`, err.message);
      process.exit(1);
    }
  }

  const outputPath = path.join('src', 'data', 'embeddedCropKnowledge.json');
  
  try {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(embeddedDocs, null, 2), 'utf-8');
    console.log(`\n✅ Success! Embedded database written to: ${outputPath}`);
  } catch (err) {
    console.error('❌ Failed to write embedded database file:', err.message);
    process.exit(1);
  }
}

run();
