const express = require("express");
const { adminAuth } = require("./middlewares/auth");
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require('validator');

// it will work for every api call
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignupData(req);

    const { firstName, lastName, emailId, password, age, gender, skills } =
      req.body;
    const passHash = await bcrypt.hash(password, 10);
    console.log(passHash);

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
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email address: " + value);
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPassValid = await bcrypt.compare(password, user?.password);
    if (isPassValid) {
      res.send("Login Successful!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    console.error("Cannot find user");
    res.status(400).send("Something went wrong");
  }
});
// get all data in DB
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    console.error("Cannot find user");
    res.status(400).send("Something went wrong");
  }
});
// delete data
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// update data of user
app.patch("/user/:userId", async (req, res) => {
  const data = req.body;
  const userId = req.params?.userId;
  try {
    const ALLOWED_UPDATES = [
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
      "userId",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) => {
      ALLOWED_UPDATES.includes(k);
    });
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be morethan 10");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);

    res.send("User Updated successfully");
  } catch (err) {
    res.status(404).send("Something went wrong: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("DB connected successfully!");
    app.listen(3000, () => {
      console.log("Server is successfully running on post 3000.");
    });
  })
  .catch((err) => {
    console.error("DB cannot be connected!");
  });
// middleware
// handle auth middleware for all GET, POST, in admin
app.use("/admin", adminAuth);

app.get("/getUserData", (req, res) => {
  // logic

  // throw new Error("new error in user data");
  res.send("User Data sent!");
});

app.use("/route", [
  (req, res, next) => {
    res.send("rh1---");
    next();
  },
  (req, res, next) => {
    res.send("rh2----");
  },
]);
app.use("/", (err, req, res, next) => {
  if (err) {
    // log err in system as well
    res.status(500).send("Something went wrong");
  }
});
