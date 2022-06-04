const bcryptjs = require("bcryptjs");
const { generateJWT } = require("../helpers/generate-jwt");
const User = require("../models/user");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "User / Password are not correct - Email",
      });
    }

    if (!user.status) {
      return res.status(400).json({
        msg: "User / Password are not correct - Status: false",
      });
    }

    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "User / Password are not correct - Password",
      });
    }

    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

module.exports = {
  login,
};
