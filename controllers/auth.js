const bcryptjs = require("bcryptjs");
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");
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

const googleSignIn = async (req, res) => {
  const { id_token } = req.body;

  try {
    const { name, img, email } = await googleVerify(id_token);
    
    let user = await User.findOne({ email });
    
    if (!user) {
      const data = {
        name,
        email,
        password: ':v',
        img,
        google: true,
      }
      
      user = new User(data);
      await user.save();
    }
    
    if (!user.status) {
      return res.status(401).json({
        msg: "User with status false",
      });
    }

    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });

  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Google Sign In Error",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
