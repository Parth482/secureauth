// api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://3.109.122.70:3000', // Replace with your backend URL
});

export const fetchData = async () => {
  try {
    const response = await api.get('/some-endpoint');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// Add other functions for different API calls as needed
