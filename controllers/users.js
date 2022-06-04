const User = require("../models/user");
const bcrypt = require("bcryptjs");

const usersGet = async (req, res) => {
  const { limit = 5, skip = 0 } = req.query;

  const [total, users] = await Promise.all([
    User.countDocuments({ status: true }),
    User.find({ status: true }).limit(limit).skip(skip),
  ]);

  res.json({
    total,
    users,
  });
};

const usersPost = async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  // Encrypt password
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(password, salt);

  await user.save();
  res.json(user);
};

const usersPut = async (req, res) => {
  const { id } = req.params;
  const { _id, password, google, email, ...body } = req.body;

  if (password) {
    const salt = bcrypt.genSaltSync(10);
    body.password = bcrypt.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, body);

  res.json(user);
};

const usersDelete = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(id, { status: false });

  res.json({user});
};

const usersPatch = (req, res) => {
  res.json({
    msg: "patch API",
  });
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersPatch,
  usersDelete,
};
