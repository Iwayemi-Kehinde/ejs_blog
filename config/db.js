const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.12")
    console.log("db connected")
  } catch (error) {
    console.error({ error })
  }
} 

module.exports = connectDB