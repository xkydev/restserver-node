const Role = require("../models/role");
const User = require("../models/user");

const isValidRole = async (role = "") => {
  const roleExists = await Role.findOne({ role });
  if (!roleExists) {
    throw new Error(`Role ${role} does not exist`);
  }
};

const emailExists = async (email = "") => {
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    throw new Error(`Email: ${email} already exists`);
  }
};

const userExistsById = async (id) => {
  const userExist = await User.findById( id );
  if (!userExist) {
    throw new Error(`User with id: ${id} does not exist`);
  }
}

module.exports = {
  isValidRole,
  emailExists,
  userExistsById
};
