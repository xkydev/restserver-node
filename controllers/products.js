const { Product } = require('../models');

const getProducts = async (req, res) => {
    const { limit = 5, skip = 0 } = req.query;

    const [total, products] = await Promise.all([
        Product.countDocuments({ status: true }),
        Product.find({ status: true }).limit(limit).skip(skip)
            .populate("user", "name")
            .populate("category", "name"),
    ]);

    res.json({
        total,
        products,
    });
}

const getProductById = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const product = await Product.findById(id)
            .populate("user", "name")
            .populate("category", "name");
    
    res.json(product);
}

const createProduct = async (req, res) => {
    const { status, user, ...body } = req.body;

    const productDB = await Product.findOne({name: body.name});
    if (productDB) {
        return res.status(400).json({
            message: `The product: ${productDB.name} already exists`,
        });
    }

    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id,
    }

    const product = new Product(data);
    await product.save();

    res.status(201).json(product);
}

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { status, user, ...data } = req.body;

    if (data.name) {
        data.name = data.name.toUpperCase();
    }

    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.json(product);
}

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, { status: false }, { new: true });

    res.json(product);
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}