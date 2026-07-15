import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URI;
    if (!mongoUrl) {
      console.error("MONGO_URI not set in environment");
      process.exit(1);
    }
    console.log("Connected to MongoDB database");

    const conn = await mongoose.connect(mongoUrl);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
