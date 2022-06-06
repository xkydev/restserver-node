const { Category } = require("../models");

const getCategories = async (req, res) => {
  const { limit = 5, skip = 0 } = req.query;

  const [total, categories] = await Promise.all([
    Category.countDocuments({ status: true }),
    Category.find({ status: true }).limit(limit).skip(skip).populate("user", "name"),
  ]);

  res.json({
    total,
    categories,
  });
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate("user", "name");
  res.json(category);
};

const createCategory = async (req, res) => {
  const name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne({ name });
  if (categoryDB) {
    return res.status(400).json({
      message: `The category: ${categoryDB.name} already exists`,
    });
  }

  const data = {
    name,
    user: req.user._id,
  };

  const category = new Category(data);
  await category.save();

  res.status(201).json(category);
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.user._id;

  const category = await Category.findByIdAndUpdate(id, data, { new: true });

  res.json(category);
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(id, { status: false }, { new: true });

  res.json(category);
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
