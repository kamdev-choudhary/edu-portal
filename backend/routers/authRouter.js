const express = require("express");
const router = express(express.Router);
const signUpSchema = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");

const authController = require("../controllers/authController");

router.route("/login").post(authController.login);

router
  .route("/user/:id")
  .get(authController.getUserData)
  .put(authController.updateUserData);

router.route("/register").post(authController.register);

module.exports = router;
