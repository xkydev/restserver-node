const { ObjectId } = require("mongoose").Types;
const { User, Category, Product } = require("../models");

const allowedCollections = ["users", "categories", "products", "roles"];

const searchUsers = async (term, res) => {
  const isMongoId = ObjectId.isValid(term);
  if (isMongoId) {
    const user = await User.findById(term);
    return res.json({
      results: user ? [user] : [],
    });
  }

  const regexp = new RegExp(term, "i");

  const total = await User.count({
    $or: [{ name: regexp }, { email: regexp }],
    $and: [{ status: true }],
  });

  const users = await User.find({
    $or: [{ name: regexp }, { email: regexp }],
    $and: [{ status: true }],
  });

  return res.json({
    total,
    results: users,
  });
};

const searchCategories = async (term, res) => {
  const isMongoId = ObjectId.isValid(term);
  if (isMongoId) {
    const category = await Category.findById(term);
    return res.json({
      results: category ? [category] : [],
    });
  }

  const regexp = new RegExp(term, "i");

  const total = await Category.count({ name: regexp, status: true });

  const categories = await Category.find({ name: regexp, status: true });

  return res.json({
    total,
    results: categories,
  });
};

const searchProducts = async (term, res) => {
  const isMongoId = ObjectId.isValid(term);
  if (isMongoId) {
    const product = await Product.findById(term)
                        .populate("category", "name");
    return res.json({
      results: product ? [product] : [],
    });
  }

  const regexp = new RegExp(term, "i");

  const total = await Product.count({ name: regexp, status: true });

  const products = await Product.find({ name: regexp, status: true })
                    .populate("category", "name");

  return res.json({
    total,
    results: products,
  });
};

const search = (req, res) => {
  const { collection, term } = req.params;

  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      message: "Invalid collection",
    });
  }

  switch (collection) {
    case "users":
      searchUsers(term, res);
      break;
    case "categories":
      searchCategories(term, res);
      break;
    case "products":
      searchProducts(term, res);
      break;
    case "roles":
      break;

    default:
      return res.status(500).json({
        message: "Search not implemented",
      });
      break;
  }
};

module.exports = {
  search,
};
