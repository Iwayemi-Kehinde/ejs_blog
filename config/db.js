const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.12", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log("DB Connected")
  } catch (error) {
    console.error({ error: error.message })
  }
} 

module.exports = connectDB