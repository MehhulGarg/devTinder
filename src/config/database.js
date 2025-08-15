const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://mehulgargh:Emjee.123@mycluster.m16mnl0.mongodb.net/devTinder"
  );
};

module.exports = {connectDB};