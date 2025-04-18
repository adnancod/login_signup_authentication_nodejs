const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const dataSchema = mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

dataSchema.pre("save", async function (next) {
  const data = this;
  if (!data.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPasword = await bcrypt.hash(data.password, salt);

    data.password = hashedPasword;

    next();
  } catch (err) {
    return next(err);
  }
});

dataSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

const Data = mongoose.model("Data", dataSchema);

module.exports = Data;
