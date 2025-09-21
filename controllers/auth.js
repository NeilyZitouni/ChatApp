const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
  const { username, email, password } = req.body;
  const newUser = await User.create({ username, email, password });
  const accessToken = newUser.createAccessToken();
  const refreshToken = newUser.createRefreshToken();
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    //secure: true, should be true in production
    sameSite: 'Strict',
  });
  res
    .status(StatusCodes.CREATED)
    .json({ username: newUser.username, accessToken });
};

const login = async (req, res) => {
  res.send('login here');
};

const logout = async (req, res) => {
  res.send('logout here');
};

module.exports = {
  register,
  login,
  logout,
};
