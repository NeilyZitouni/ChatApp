const register = async (req, res) => {
  res.send('hello there');
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
