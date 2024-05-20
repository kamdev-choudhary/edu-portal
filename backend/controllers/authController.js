const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Batch = require("../models/batch");

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email: email });

    if (!userExist) {
      return res.status(400).json("Email or Password is incorrect");
    }

    const isPasswordValid = await bcrypt.compare(password, userExist.password);

    if (isPasswordValid) {
      return res.status(200).json({
        msg: "Login Successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      return res.status(401).json({ msg: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};

module.exports.register = async (req, res) => {
  const { name, email, password, mobile, currentClass } = req.body;

  try {
    let userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(400).json("Email already Registered");
    }

    const newUser = await User.create({
      name,
      email,
      password,
      mobile,
      currentClass,
    });

    return res.status(200).json({
      msg: "Registration Successful",
      token: await newUser.generateToken(),
      userId: newUser._id.toString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal Server Error");
  }
};

// GETTING USER DATA

module.exports.getUserData = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id }, { password: 0 });
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(400).json("User Not available");
    }
  } catch (error) {
    next(error);
  }
};

// UPDATE USER DATA

module.exports.updateUserData = async (req, res, next) => {
  const { id } = req.params;
  const userDataToUpdate = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, userDataToUpdate, {
      new: true,
    });
    updatedUser.isProfileUpdated = true;
    updatedUser.save();
    if (!updatedUser) {
      res.status(200).json("User not Found");
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    next(error);
  }
};
