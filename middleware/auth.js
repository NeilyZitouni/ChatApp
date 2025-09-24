const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');

const authMiddleware = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: 'Unauthorized acess to this route' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = {
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
    };
    next();
  } catch (error) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: 'Must provide a valid token' });
  }
};

module.exports = authMiddleware;
