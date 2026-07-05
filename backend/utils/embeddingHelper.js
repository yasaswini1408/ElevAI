const { pipeline } = require('@xenova/transformers');

let embedder = null;
const generateEmbedding = async (text) => {
  try {
    if (!embedder) {
      console.log('Loading embedding model for first time, this takes a minute...');
      embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      console.log('Embedding model loaded successfully');
    }

    const trimmedText = text.substring(0, 5000);
    const output = await embedder(trimmedText, {
      pooling: 'mean',
      normalize: true
    });

    const embeddingArray = Array.from(output.data);
    console.log('Embedding generated, dimensions:', embeddingArray.length);
    return embeddingArray;
  } catch (error) {
    console.log('Embedding error:', error.message);
    throw error;
  }
};

module.exports = {generateEmbedding};