const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields, validateFile } = require("../middlewares");
const { uploadFile, updateImage, showImage, updateImageCloudinary } = require("../controllers/upload");
const { allowedCollections } = require("../helpers");

const router = Router();

router.post("/", validateFile, uploadFile);

router.put(
  "/:collection/:id",
  [
    validateFile,
    check("id", "Id is not valid").isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validateFields
  ],
  // updateImage
  updateImageCloudinary
);

router.get('/:collection/:id', [
  check("id", "Id is not valid").isMongoId(),
  check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
  validateFields
], showImage);

module.exports = router;
