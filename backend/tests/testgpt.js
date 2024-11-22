const axios = require('axios');

//base URL of backend
const BASE_URL = 'http://localhost:3001';

//test data for the prompt
const testInput = {
  genre: 'Bedroom Pop',
  energy: 0.45,
  valence: 0.65,
};

const testGenerateDescription = async () => {
  console.log('--- Testing /generate-description Endpoint ---');
  console.log('Input:', testInput);

  try {
    //send a POST request to backend
    const response = await axios.post(`${BASE_URL}/openai/generate-description`, testInput);

    console.log('--- Backend Response ---');
    console.log('Generated Description:', response.data.description);
  } catch (error) {
    console.error('--- Error Testing Backend ---');
    if (error.response) {
      console.error('Status Code:', error.response.status);
      console.error('Error Data:', error.response.data);
    } else {
      console.error('Error Message:', error.message);
    }
  }
};

testGenerateDescription();
