import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL || "mongodb://localhost:27017/food_delivery_db";
    const conn = await mongoose.connect(mongoUrl);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("Database failed to connect:", error.message);
    process.exit(1);
  }
};

export default dbConnection;