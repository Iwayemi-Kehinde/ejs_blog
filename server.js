require("dotenv").config()
const express = require("express")
const expressEjsLayouts = require("express-ejs-layouts")
const session = require('express-session');
const flash = require("connect-flash")
const cookieParser = require("cookie-parser")
const connectDB = require("./config/db.js")

const app = express()
const PORT = process.env.PORT || 3000

//Mongodb connect
connectDB()


//EJS SETUP
app.set("layout", "./views/layout/main")
app.set("view engine", "ejs")

//Middlewares
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl)
  next()
})
app.use(cookieParser())
app.use(express.json());
app.use(session({
  secret: 'secret', 
  resave: false,
  saveUninitialized: true
}))
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); 
  next();
})
app.use(expressEjsLayouts)
app.use(express.urlencoded({extended: true}))

app.use(express.static("public"))
app.use("/users", require("./routes/admin"))
app.use("/", require("./routes/main"))
app.use("/post", require("./routes/blog.js"))


app.listen(PORT, () => {
  console.log("Server running on port:" + PORT) 
})