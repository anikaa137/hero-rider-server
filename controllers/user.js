const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  // validation
  if (!name) return res.status(400).send("Name is required");
  if (!password || password.length < 6)
    return res
      .status(400)
      .send("Password is required and password must be 6 characters long");
  let userExist = await User.findOne({ email }).exec();
  if (userExist) return res.status(400).send("Email is taken");

  // register

  const user = new User(req.body);
  try {
    await user.save();
    console.log("USER CREATED", user);
    return res.json({ ok: true, user });
  } catch (err) {
    console.log("CREATE USER FAILED", err);
    return res.status(400).send("Error. Try again.");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if user with that email exist
    let user = await User.findOne({ email }).exec();
    console.log("USRET EXIST", user);
    if (!user) res.status(400).send("User not found with this email");

    // compare password

    user.comparePassword(password, (err, match) => {
      console.log("COMPARE PASSWORD IN LOGIN ERR", err);
      if (!match || err) return res.status(400).send("Wrong password");

      // GENERATE A TOKEN THEN SEND AS RESPONSE TO CLIENT
      let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.json({
        token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    });
  } catch (err) {
    console.log("LOGIN ERROR", err);
    res.status(400).send("SignIn failed");
  }
};

// exports.allRegisterUser = async (req, res) => {
//   try {
//     let all = await User.find({}).exec();
//     res.json(all);
//     console.log(all);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };

// exports.allRegisterUser = async (req, res) => {
//   try {
//     let { page, size } = req.query;
//     if (!page) {
//       page = 1;
//     }
//     if (!size) {
//       size = 10;
//     }
//     const limit = parseInt(size);
//     const skip = (page - 1) * size;
//     const all = await User.find({}).limit(limit).skip(skip).exec();
//     res.send({ page, size, data: all  });
//     console.log(all);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };

exports.allRegisterUser = async (req, res) => {
  try {
    const page_size = 10;
    const page = parseInt(req.query.page || "0");
    const total = await User.countDocuments({});

    const all = await User.find({})
      .limit(page_size)
      .skip(page_size * page)
      .exec();
    // res.json({total,all});
    res.json({ totalPages: Math.ceil(total / page_size), total, all });
    console.log(all);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getUserBySearch = (req, res) => {
  var regex = new RegExp(req.params.name, "i");

  User.find({ name: regex }).then((result) => {
    res.status(200).json(result);
  });
};
