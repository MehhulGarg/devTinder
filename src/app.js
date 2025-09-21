const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// it will work for every api call
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');
const userRouter = require('./routes/user');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
