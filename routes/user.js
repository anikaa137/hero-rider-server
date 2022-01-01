const express = require("express");

const router = express.Router();

// controllers

const {
  register,
  login,
  allRegisterUser,
  getUserBySearch,
  getSingleUser,
} = require("../controllers/user");

router.post("/register", register);
router.post("/login", login);
router.get("/all-register-user", allRegisterUser);
// router.get("/single-user/:id", getSingleUser);
router.get("/search-user/:name", getUserBySearch);

module.exports = router;
