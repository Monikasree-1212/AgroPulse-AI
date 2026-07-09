const axios = require('axios');
const mongoose = require('mongoose');

async function test() {
  try {
    console.log("Registering user");
    await axios.post('http://localhost:5000/api/auth/register', {
      name: 'ApiUser', phone: '2222222222', password: 'password123', state: 'S', district: 'D'
    });
    console.log("Register success");
  } catch (err) {
    if (err.response?.status !== 409) {
      console.log("Register failed", err.response?.data);
    }
  }

  try {
    console.log("Logging in");
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      phone: '2222222222', password: 'password123'
    });
    console.log("Login success! Token:", res.data.token);
  } catch (err) {
    console.log("Login failed", err.response?.data, err.response?.status);
  }
}
test();
