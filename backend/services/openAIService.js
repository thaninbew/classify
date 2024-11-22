const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = openai;

exports.generatePlaylistDescription = async ({ genre, energy, valence }) => {
  const prompt = `Create a short, creative playlist name and vibe description based on:
  Genre: ${genre}, Energy: ${energy.toFixed(2)}, Valence: ${valence.toFixed(2)}.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a creative assistant.' },
      { role: 'user', content: prompt },
    ],
    max_tokens: 50,
    temperature: 0.7,
  });

  return response.choices[0].message.content.trim();
};
