const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();

require("dotenv").config();

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB connect"))
  .catch((err) => console.log("DB connection err", err));

//middleware
app.use(express.json());

app.use(cors());
app.use(morgan("dev"));

// router middleware
app.use("/api", require("./routes/user"));
// app.use("/api", require("./routes/stripe"));

const port = process.env.PORT || 8000;

app.listen(port, console.log(`server is running in port: ${port}`));
