const { Role, User, Category, Product } = require("../models");

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
  const userExist = await User.findById(id);
  if (!userExist) {
    throw new Error(`User with id: ${id} does not exist`);
  }
};

const categoryExists = async (id) => {
  const categoryExist = await Category.findById(id);
  if (!categoryExist) {
    throw new Error(`Category with id: ${id} does not exist`);
  }
};

const productExists = async (id) => {
  const productExist = await Product.findById(id);
  if (!productExist) {
    throw new Error(`Product with id: ${id} does not exist`);
  }
}

const allowedCollections = async (collection, allowedCollections) => {
  if (!allowedCollections.includes(collection)) {
    throw new Error(`Collection: ${collection} is not allowed`);
  }
  return true;
}

module.exports = {
  isValidRole,
  emailExists,
  userExistsById,
  categoryExists,
  productExists,
  allowedCollections
};
