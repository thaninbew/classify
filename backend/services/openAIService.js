const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generatePlaylistDescription = async ({ genre, energy, valence }) => {
  const prompt = `
  Genre: ${genre}, Energy: ${energy.toFixed(2)}, Valence: ${valence.toFixed(2)}.
  ###
  Playlist Name: <name>
  Description: <description max 20 words>
  ###
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a creative playlist name & description maker' },
      { role: 'user', content: prompt },
    ],
    max_tokens: 50,
    temperature: 0.7,
  });

  return response.choices[0].message.content.trim();
};

module.exports = { openai, generatePlaylistDescription };
