require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const ErrorHandler = require('./middleware/errorHandler');
const connectDB = require('./db/connectDb');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/userRoutes');
const authMiddleware = require('./middleware/auth');
const upload = require('./middleware/upload');
const uploadProfilePicture = require('./controllers/userController');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.user(
  '/api/v1/uploadpfp',
  authMiddleware,
  upload.single('profilePicture'),
  uploadProfilePicture
);

app.use(ErrorHandler);

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
