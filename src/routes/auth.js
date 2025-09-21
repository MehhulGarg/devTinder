const express = require("express");
const authRouter = express.Router();
const validator = require("validator");
const { validateSignupData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignupData(req);

    const { firstName, lastName, emailId, password, age, gender, skills } =
      req.body;
    const passHash = await bcrypt.hash(password, 10);
    // Creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passHash,
      age,
      gender,
      skills,
    });
    await user.save();
    res.send("User added successfully!");
  } catch (err) {
    res.status(400).send("Error while saving the user" + err.message);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email address: " + value);
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPassValid = await user.validatePassword(password);
    if (isPassValid) {
      // create a jwt token and add the token to cookies for authentication
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.json({message: "Login Successful", data: user});
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logged out successfully!");
});

module.exports = authRouter;
