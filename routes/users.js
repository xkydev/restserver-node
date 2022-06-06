const { Router } = require("express");
const { check } = require("express-validator");

const { 
    validateFields,
    validateJWT,
    validateRoles,
    haveRole
} = require('../middlewares');

const {
  isValidRole,
  emailExists,
  userExistsById,
} = require("../helpers/db-validators");

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const router = Router();

router.get("/", getUsers);

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    check("email", "Email not valid").isEmail(),
    check("email").custom(emailExists),
    check("role").custom(isValidRole),
    validateFields,
  ],
  createUser
);

router.put(
  "/:id",
  [
    check("id", "Id is not valid").isMongoId(),
    check("id").custom(userExistsById),
    check("role").custom(isValidRole),
    validateFields,
  ],
  updateUser
);

router.delete(
  "/:id",
  [
    validateJWT,
    // validateRoles,
    haveRole("ADMIN_ROLE", "SALES_ROLE"),
    check("id", "Id is not valid").isMongoId(),
    check("id").custom(userExistsById),
    validateFields,
  ],
  deleteUser
);

module.exports = router;
