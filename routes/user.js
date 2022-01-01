const express = require("express");

const router = express.Router();

// controllers

const {
  register,
  login,
  allRegisterUser,
  getUserBySearch,
} = require("../controllers/user");

router.post("/register", register);
router.post("/login", login);
router.get("/all-register-user", allRegisterUser);

router.get("/search-user/:name", getUserBySearch);

module.exports = router;
