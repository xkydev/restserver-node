const path = require("path");
const fs = require("fs");
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { uploadFiles } = require("../helpers");
const { User, Product } = require("../models");

const uploadFile = async (req, res) => {
  try {
    // Images
    const fileName = await uploadFiles(req.files, undefined, "images");

    // txt, md
    // const fileName = await uploadFiles(req.files, ["txt", "md"], "textFiles");

    res.status(200).json({ msg: "File uploaded", fileName });
  } catch (msg) {
    res.status(400).json(msg);
  }
};

const updateImage = async (req, res) => {
  const { collection, id } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `User with id ${id} not found`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `Product with id ${id} not found`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Collection not implemented" });
  }

  if (model.img) {
    const pathImage = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(pathImage)) {
      fs.unlinkSync(pathImage);
    }
  }

  const fileName = await uploadFiles(req.files, undefined, collection);
  model.img = fileName;

  await model.save();

  res.json(model);
};


const updateImageCloudinary = async (req, res) => {
  const { collection, id } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `User with id ${id} not found`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `Product with id ${id} not found`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Collection not implemented" });
  }

  if (model.img) {
    const nameArr = model.img.split('/');
    const name = nameArr[nameArr.length - 1];
    const [ public_id ] = name.split('.');
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  model.img = secure_url;

  await model.save();

  res.json(model);
};



const showImage = async (req, res) => {
  const { collection, id } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `User with id ${id} not found`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `Product with id ${id} not found`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Collection not implemented" });
  }

  if (model.img) {
    const pathImage = path.join(__dirname, "../uploads", collection, model.img);
    if (fs.existsSync(pathImage)) {
      return res.sendFile(pathImage);
    }
  }

  const pathImage = path.join(__dirname, "../assets/no-image.jpg");
  res.sendFile(pathImage);

};

module.exports = {
  uploadFile,
  updateImage,
  showImage,
  updateImageCloudinary
};
