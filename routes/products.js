const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields, validateJWT, haveRole } = require("../middlewares");
const { productExists, categoryExists } = require("../helpers/db-validators");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");

const router = Router();

router.get("/", getProducts);

router.get(
  "/:id",
  [
    check("id", "Id is not valid").isMongoId(),
    check("id").custom(productExists),
    validateFields,
  ],
  getProductById
);

router.post(
  "/",
  [
    validateJWT,
    check("name", "Name is required").not().isEmpty(),
    check("category", "Id is not valid").isMongoId(),
    check("category").custom(categoryExists),
    validateFields,
  ],
  createProduct
);

router.put(
  "/:id",
  [
    validateJWT,
    // check("category", "Id is not valid").isMongoId(),
    // check("category").custom(categoryExists),
    check("id", "Id is not valid").isMongoId(),
    check("id").custom(productExists),
    validateFields,
  ],
  updateProduct
);

router.delete(
  "/:id",
  [
    validateJWT,
    haveRole("ADMIN_ROLE"),
    check("id", "Id is not valid").isMongoId(),
    check("id").custom(productExists),
    validateFields,
  ],
  deleteProduct
);

module.exports = router;
