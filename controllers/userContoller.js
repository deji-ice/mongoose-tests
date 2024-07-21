import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

export const updatePassword = async () => {
  try {
    const { userName } = req.params;
    const { newPassword, oldPassword } = req.body;

    if (newPassword === oldPassword)
      res.status(400).json({
        message: "new password cannot be the same as old password",
      });

    const user = await User.findOne({ userName });

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
