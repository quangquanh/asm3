const mongoose = require("mongoose");
const User = require("../models/User");
const Cart = require("../models/Cart");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

const comparePassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};

exports.signup = async (req, res, next) => {
  try {
    const reqData = req.body;
    const valid = validationResult(req);
    const hashPass = await bcrypt.hash(reqData.password, 12);
    // console.log("reqData:", reqData);
    if (valid.errors.length > 0) {
      console.log("valid:", valid);
      res.send(valid);
    } else {
      // console.log("hashPass:", hashPass);
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        email: reqData.email,
        fullname: reqData.fullname,
        phone: reqData.phone,
        password: hashPass,
        address: "",
      });
      const newCart = new Cart({
        userId: newUser._id,
        items: [],
        total: 0,
      });
      newUser.save();
      newCart.save();
      res.end();
    }
  } catch (error) {
    return next(new Error(error));
  }
};

exports.login = async (req, res, next) => {
  try {
    const reqData = req.body;
    // console.log("reqData:", reqData);
    const valid = validationResult(req);
    // console.log("valid:", valid);
    if (valid.errors.length <= 0) {
      const foundUser = await User.findOne({ email: reqData.email }).select(
        "email password role"
      );
      if (foundUser) {
        const isEqual = await comparePassword(
          reqData.password,
          foundUser.password
        );
        if (isEqual) {
          // Lưu lại token vào DB
          // res.send token đã lưu
          // sau khi FE nhận được, lưu vào cookie
          const token = uuidv4();
          req.session.token = token;
          req.session.userId = foundUser._id;
          req.session.role = foundUser.role;

          res.send({
            userId: foundUser._id,
            role: foundUser.role,
            token: token,
          });
        } else {
          res.json({ msg: "Password wrong" });
        }
      }
    } else {
      res.send({ msg: "Email wrong" });
    }
  } catch (error) {
    return next(new Error(error));
  }
};

exports.logout = (req, res, next) => {
  try {
    if (req.session) {
      req.session.destroy();
    }
    res.end();
  } catch (error) {
    return next(new Error(error));
  }
};

exports.getUserInfo = async (req, res, next) => {
  try {
    const reqData = req.query;
    // console.log("reqData:", reqData);

    const foundUser = await User.findById(reqData.id, { password: 0 });
    // console.log("foundUser:", foundUser);
    if (foundUser) {
      res.json(foundUser);
    } else {
      res.json({ msg: "User not found" });
    }
  } catch (error) {
    return next(new Error(error));
  }
};
