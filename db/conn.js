import mongoose from "mongoose";
import {config} from "dotenv";

config();

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI);
    console.log("Database connected successfully");
    return mongoose.connection;
  } catch (error) {
    console.log("Error while connecting to database", error);
  }
};


export default dbConnection;
