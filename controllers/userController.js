const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const logger = require('../logger/mylogger.log'); 
const getuser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    logger.log('User fetched successfully', { context: 'getuser',  metadata: user });
    return res.send(user);
  } catch (error) {
    logger.error('Unable to get user', { context: 'getuser',  metadata: error });
    res.status(500).send("Unable to get user");
  }
};

const getallusers = async (req, res) => {
  try {
    const users = await User.find()
      .find({ _id: { $ne: req.locals } })
      .select("-password");
      logger.log('All users fetched successfully', { context: 'getallusers', metadata: users });
    return res.send(users);
  } catch (error) {
    logger.error('Unable to get all users', { context: 'getallusers', metadata: error });
    res.status(500).send("Unable to get all users");
  }
};

const login = async (req, res) => {
  try {
    const emailPresent = await User.findOne({ email: req.body.email });
    if (!emailPresent) {
      logger.error('Incorrect credentials', { context: 'login', metadata: { email: req.body.email } });
      return res.status(400).send("Incorrect credentials");
    }
    const verifyPass = await bcrypt.compare(
      req.body.password,
      emailPresent.password
    );
    if (!verifyPass) {
      logger.error('Incorrect credentials', { context: 'login', metadata: { email: req.body.email } });
      return res.status(400).send("Incorrect credentials");
    }
    const token = jwt.sign(
      { userId: emailPresent._id, isAdmin: emailPresent.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "2 days",
      }
    );
    logger.log('User logged in successfully', { context: 'login', metadata: { userId: emailPresent._id } });
    return res.status(201).send({ msg: "User logged in successfully", token });
  } catch (error) {
    logger.error('Unable to login user', { context: 'login', metadata: error });
    res.status(500).send("Unable to login user");
  }
};

const register = async (req, res) => {
  try {
    const emailPresent = await User.findOne({ email: req.body.email });
    if (emailPresent) {
      logger.error('Email already exists', { context: 'register', metadata: { email: req.body.email } });
      return res.status(400).send("Email already exists");
    }
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const user = await User({ ...req.body, password: hashedPass });
    const result = await user.save();
    if (!result) {
      logger.error('Unable to register user', { context: 'register', metadata: user });
      return res.status(500).send("Unable to register user");
    }
    logger.log('User registered successfully', { context: 'register', metadata: { userId: user._id } })
    return res.status(201).send("User registered successfully");
  } catch (error) {
    logger.error('Unable to register user', { context: 'register', metadata: error });
    res.status(500).send("Unable to register user");
  }
};

const updateprofile = async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const result = await User.findByIdAndUpdate(
      { _id: req.locals },
      { ...req.body, password: hashedPass }
    );
    if (!result) {
      logger.error('Unable to update user', { context: 'updateprofile', metadata: { userId: req.locals } });
      return res.status(500).send("Unable to update user");
    }
    logger.log('User updated successfully', { context: 'updateprofile', metadata: { userId: req.locals } });
    return res.status(201).send("User updated successfully");
  } catch (error) {
    logger.error('Unable to update user', { context: 'updateprofile', metadata: error });
    res.status(500).send("Unable to update user");
  }
};

const deleteuser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.body.userId);
    const removeDoc = await Doctor.findOneAndDelete({
      userId: req.body.userId,
    });
    const removeAppoint = await Appointment.findOneAndDelete({
      userId: req.body.userId,
    });
    logger.log('User deleted successfully', { context: 'deleteuser', metadata: { userId: req.body.userId } });
    return res.send("User deleted successfully");
  } catch (error) {
    logger.error('Unable to delete user', { context: 'deleteuser', metadata: error });
    res.status(500).send("Unable to delete user");
  }
};

module.exports = {
  getuser,
  getallusers,
  login,
  register,
  updateprofile,
  deleteuser,
};
