import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OTPgenrator } from "../lib/OTPgenerator.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();

export const createUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = new User(req.body);

    // Check If User Exists In The Database
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    //amount of times salts are generated into the password, makes it harder to crack
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashedPassword;

    await user.save();
    res.status(201).json({
      status: "success",
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while trying to create a user",
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { userName, password } = req.body;

    //check for passowrd and username
    if (!userName || !password) {
      return res
        .status(400)
        .json({ message: "Please provide a username and password" });
    }

    // Check If User Exists In The Database
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    7;

    //compare passwords
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      token,
    });
  } catch (err) {
    res.status(500).multerjson({
      status: "error",
      message: "An error occurred while trying to login",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.find({}, { password: 0 }); // Exclude the password field from the response
    return res.status(200).json({ users });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Error fetching users" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { userName } = req.params;
    let { newPassword, oldPassword } = req.body;

    if (newPassword === oldPassword)
      res.status(400).json({
        message: "new password cannot be the same as old password",
      });

    const user = await User.findOne({ userName });
    if (!user) res.status(400).json({ message: "user not found" });

    const isOldPassword = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPassword)
      res.status(400).json({
        message: "please input the correct old password",
      });

    const saltRounds = 10;
    newPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = newPassword;
    user.save();

    res.status(200).json({
      message: "password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "password could not be updated",
      status: "error",
    });
  }
};

export const updateUserName = async (req, res) => {
  try {
    const userName = req.params.userName;

    const { newUserName } = req.body;

    const user = await User.findOne({ userName });

    if (!user) res.status(400).json({ message: "user not found" });

    user.userName = newUserName;

    user.save();
    res.status(200).json({
      message: "userName updated successfully",
    });
  } catch (error) {
    res.status(500).send("error updting username");
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ message: "Please provide an email" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });


    // const otp = await OTPgenrator(user._id, user.userName);
    const otp = await OTPgenrator();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "dejixice@gmail.com",
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: '"Deji Ice PLC" <dejixice@gmail.com>', // sender address
      to: user?.email, // list of receivers
      subject: "Password Reset", // Subject line
      text: `Your OTP code is ${otp}. It is valid for the next 30 seconds.`, // Plain text body
      html: `<p>Your OTP code is <b>${otp}</b>. It is valid for the next 30 seconds.</p>`, // HTML body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ", info.response);
        res.status(200).json({
          message: "OTP sent successfully",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while trying to send OTP",
    });
  }
};

export const login_otp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Please provide an email and otp" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while trying to login with OTP",
    });
  }
};

export const updatePasswordOTP = async (req, res) => {
  try {
    const { email } = req.params;
    const { newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide an email and new password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    user.save();

    res
      .status(200)
      .json({ status: "success", message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while trying to update password with OTP",
    });
  }
};
// export const accountLogin = async (req, res) => {
//   try {
//     const { account } = req.params;
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Please provide an email and password" });
//     }
//     if (account === "instructor") {
//       const instructor = await Instructor.findOne({ email });
//       if (!instructor) {
//         return res.status(400).json({ message: "Invalid credentials" });
//       }
//       const isCorrectPassword = await bcrypt.compare(
//         password,
//         instructor.password
//       );
//       if (!isCorrectPassword) {
//         return res.status(400).json({ message: "Invalid credentials" });
//       }

//       res.status(200).json({
//         status: "success",
//         message: "Instructor logged in successfully",
//       });
//     } else if (account ==="student"){

//     } else {
//       return res.status(400).json({ message: "Invalid account type" });
//     }
//   } catch (error) {

//   }
// };
