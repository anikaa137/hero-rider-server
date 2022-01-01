const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Name is required",
    },
    email: {
      type: String,
      trim: true,
      required: "Email is required",
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    age: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: String,
    drivingLicence: {
      type: String,
      required: true,
    },
    nidPicture: {
      data: Buffer,
      Type: String,
    },

    // profilePicture: { type: String, default: null },
    careName: {
      type: String,
      required: true,
    },
    carModel: {
      type: String,
      required: true,
    },
    namePalate: {
      type: String,
      required: true,
    },
    vehiceType: {
      type: String,
    },
    role: { type: String, required: true, enum: ["rider", "learner", "admin"] },
    stripe_account_id: "",
    strip_seller: {},
    stripeSession: {},
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  let user = this;

  if (user.isModified("password")) {
    return bcrypt.hash(user.password, 12, function (err, hash) {
      if (err) {
        console.log("BCRYPT HASH ERR", err);
        return next(err);
      }
      user.password = hash;
      return next();
    });
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (password, next) {
  bcrypt.compare(password, this.password, function (err, match) {
    if (err) {
      console.log("COMPARE PASSWORD ERR", err);
    }

    // if no err, we ger null
    console.log("MATCH PASSWORD", match); // true
    return next(null, match);
  });
};

module.exports = mongoose.model("User", userSchema);
