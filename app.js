require('dotenv').config();
require('express-async-errors');
const express = require('express');
const connectDB = require('./db/connectDb');

const app = express();

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;
const start = async () => {
  try {
    await connectDB(mongoURI);
    console.log('connected to db !');
    app.listen(port, () => {
      console.log(`Server is listening to port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
