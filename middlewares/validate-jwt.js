const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateJWT = async (req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No token provided",
    });
  }
  
  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(uid);

    if (!user) {
        return res.status(401).json({
            msg: "Invalid token",
        });
    }

    if (!user.status) {
        return res.status(401).json({
            msg: "User is not active",
        });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
        msg: "Invalid token",
    });
  }
};

module.exports = {
  validateJWT,
};
