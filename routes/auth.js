const router = require("express").Router();

const { check } = require("express-validator");
const { createUser, userLogin, renewToken } = require("../controllers/auth");
const { checkFields } = require("../middleware/check_fields");
const { checkJWT } = require("../middleware/check_jwt");

router.post(
  "/login",
  [
    check("schoolId", "School id is required").isString(),
    check("password", "password must be at least 6 characters").isLength({
      min: 6,
    }),
    checkFields,
  ],
  userLogin
);

router.post(
  "/new",
  [
    check("schoolId", "School id is required").isString(),
    check("password", "password must be at least 6 characters").isLength({
      min: 6,
    }),
    checkFields,
  ],
  createUser
);

router.get("/renew", [checkJWT], renewToken);

module.exports = router;
