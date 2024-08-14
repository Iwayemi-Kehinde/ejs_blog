const express = require("express")
const jwt = require("jsonwebtoken")
const user = require("../models/User.js")
const authMiddleWare = require("../middlewares/authMiddleware.js")
const isAuth = require("../middlewares/partialsMiddleware.js")
const bcrypt = require("bcrypt")
const router = express.Router()



router.get("/login", (req, res) => {
  const locals = {
    title: "Login"
  }
  res.render("login", { locals, layout: "../views/layout/admin" })
})


router.get("/register", (req, res) => {
  const locals = {
    title: "Register"
  }
  res.render("register", { locals, layout: "../views/layout/admin" })
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body
  const errors = []
  if (!email || !password) {
    errors.push("Fill all fields")
  } 
  if (password && password.length < 6) {
    errors.push("The password must be a minimum of 6 characters")
  }
  if (errors.length > 0) {
    req.flash('error_msg', errors);
    return res.redirect('/users/login');
  }
  try {
    const User = await user.findOne({ email })
    if (!User) {
      req.flash('success_msg', 'Account doesn\'t exist.');
      return res.redirect('/users/login');
    }
    const hashedPassword = await bcrypt.compare(password, User.password)
    if (!hashedPassword) {
      req.flash('error_msg', 'Password incorrect.');
      return res.redirect('/users/login');
    }
    const token = jwt.sign({ userId: User._id }, process.env.JWT_SECRET, {expiresIn:"1h"})
    res.cookie("token", token, {httpOnly: true, secure: process.env.NODE_ENV === "production"})
    req.flash('success_msg', 'You are now logged in');
    res.redirect("/")
  } catch (error) {
    console.error({ error })
    req.flash('error_msg', 'Internal server error.');
    return res.redirect("/users/login")
  }
})


router.post("/register", async (req, res) => {
  const {username, email,password} = req.body
  const errors = []
  if(!username || !email || !password) {
    errors.push("Fill all fields")
  }
  if(password && password.length < 6) {
    errors.push("The password must be a minimum of 6 characters")
  }
  if(errors.length > 0) {
    req.flash("error_msg", errors)
    return res.redirect("/users/register")
  }
  try {
    const UserExists = await user.findOne({email})
    if(UserExists) {
      req.flash("error_msg", "Account already exist")
      return res.redirect("/users/register")
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await user.create({username, email, password: hashedPassword})
    const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {expiresIn: "1h"})
    res.cookie("token", token, {secure: process.env.NODE_ENV === "production", httpOnly: true})
    req.flash("success_msg", "Welcome back")
    return res.redirect("/")

  } catch(error) {
    console.log({error})
    req.flash("error_msg", "Internal server error")
    res.redirect("/users/register")
    // return res.status(500).json({"message":"internal server error"})
  }
})

router.get("/profile",authMiddleWare,isAuth,(req, res) => {
  const locals = {
    title: "Profile page",
    isAuthenticated: res.locals.isAuthenticated
  }
  res.render("profile", {layout: "../views/layout/profileLayout", locals})
})

router.get("/logout", (req, res) => {
  res.clearCookie("token")
  req.flash("success_msg", "You are now logged out")
  res.redirect("/")
})



module.exports = router