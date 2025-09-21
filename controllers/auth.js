require('dotenv').config();
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
  const { password, email } = req.body;
  if (!email || !password) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'you must provide an email and a password' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: 'no user with the email provided' });
  }
  const isMatch = user.comparePassword(password);
  if (!isMatch) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: 'the password you provided is invalid' });
  }
  const refreshToken = user.createRefreshToken();
  const accessToken = user.createAccessToken();
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'Strict',
  });
  res.status(StatusCodes.OK).json({ username: user.username, accessToken });
};

const logout = async (req, res) => {
  const cookieRefreshToken = req.cookies.refreshToken;
  if (!cookieRefreshToken) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: 'you must provide a refresh token' });
  }
  res.clearCookie('refreshToken', {
    httpOnly: true,
    //secure: true, set to true in production
    sameSite: 'Strict',
  });
  res.status(StatusCodes.OK).json({ msg: 'logged out succefully' });
};

module.exports = {
  register,
  login,
  logout,
};
