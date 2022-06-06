const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields, validateJWT, haveRole } = require("../middlewares");
const { categoryExists } = require("../helpers/db-validators");

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");

const router = Router();

router.get("/", getCategories);

router.get(
  "/:id",
  [
    check("id", "Id is not valid").isMongoId(),
    check("id").custom(categoryExists),
    validateFields,
  ],
  getCategoryById
);

router.post(
  "/",
  [
    validateJWT,
    check("name", "Name is required").not().isEmpty(),
    validateFields,
  ],
  createCategory
);

router.put(
  "/:id",
  [
    validateJWT,
    check("name", "Name is required").not().isEmpty(),
    check("id", "Id is not valid").isMongoId(),
    check("id").custom(categoryExists),
    validateFields,
  ],
  updateCategory
);

router.delete(
  "/:id",
  [
    validateJWT,
    haveRole("ADMIN_ROLE"),
    check("id", "Id is not valid").isMongoId(),
    check("id").custom(categoryExists),
    validateFields,
  ],
  deleteCategory
);

module.exports = router;
