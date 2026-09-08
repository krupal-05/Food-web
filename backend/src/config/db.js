import mongoose from "mongoose";

 const dbConnection = ()=>{
  try {
    const db = mongoose.connect(process.env.MONGODB_URL)
    console.log("DB connected")
  } catch (error) {
    console.log("Database Failed to connect ",error)
  }
 }

 export default dbConnection;