const axios = require('axios');

const testGenerateDescription = async () => {
  try {
    const response = await axios.post('http://localhost:3001/generate-description', {
      genre: 'Indie Acoustic',
      energy: 0.45,
      valence: 0.65,
    });

    console.log('Generated Description:', response.data.description);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

testGenerateDescription();
