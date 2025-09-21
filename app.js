require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/connectDb');
const authRouter = require('./routes/auth');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);

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
