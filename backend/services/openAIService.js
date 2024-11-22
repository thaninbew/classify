const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generatePlaylistDescription = async ({ genre, energy, valence }) => {
  const prompt = `Context:
  - Energy: A number from 0.0 - 1.0 representing intensity and activity (e.g., 0.8 is energetic).
  - Valence: A number from 0.0 - 1.0 indicating mood (e.g., 1.0 is happy, 0.0 is sad).
  
  Genre:${genre},Energy:${energy.toFixed(1)},Valence:${valence.toFixed(1)}.
###
Name:<name>
Desc:<one sentence description>
Description MUST be one sentence and less than 15 words.
###`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You generate playlist names and descriptions.'},
      { role: 'user', content: prompt },
    ],
    max_tokens: 50,
    temperature: 0.2,
  });
  console.log('API Response:', response);

  const output = response.choices[0].message.content.trim();

  // Parse the output to extract the name and description
  const match = output.match(/Name: (.+)\nDesc: (.+)/);
  if (match) {
    return {
      name: match[1].trim(),
      description: match[2].trim(),
    };
  } else {
    throw new Error('Failed to parse the response from the AI');
  }
};

module.exports = { openai, generatePlaylistDescription };
