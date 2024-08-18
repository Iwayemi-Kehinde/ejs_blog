const express = require("express")
const jwt = require("jsonwebtoken")
const user = require("../models/User.js")
const authMiddleWare = require("../middlewares/authMiddleware.js")
const isAuth = require("../middlewares/partialsMiddleware.js")
const bcrypt = require("bcrypt")
const router = express.Router()
const nodemailer = require('nodemailer');



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
    const token = jwt.sign({ userId: User._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
    req.flash('success_msg', 'You are now logged in');
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
    return res.redirect("/")
  } catch (error) {
    console.error({ error })
    req.flash('error_msg', 'Internal server error.');
    return res.redirect("/users/login")
  }
})


router.post("/register", async (req, res) => {
  const { username, email, password } = req.body
  const errors = []
  if (!username || !email || !password) {
    errors.push("Fill all fields")
  }
  if (password && password.length < 6) {
    errors.push("The password must be a minimum of 6 characters")
  }
  if (errors.length > 0) {
    req.flash("error_msg", errors)
    return res.redirect("/users/register")
  }
  try {
    const UserExists = await user.findOne({ email })
    if (UserExists) {
      req.flash("error_msg", "Account already exist")
      return res.redirect("/users/register")
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await user.create({ username, email, password: hashedPassword })
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
    res.cookie("token", token, { secure: process.env.NODE_ENV === "production", httpOnly: true })
    req.flash("success_msg", "Welcome back")
    return res.redirect("/")

  } catch (error) {
    console.log({ error })
    req.flash("error_msg", "Internal server error")
    return res.redirect("/users/register")
    // return res.status(500).json({"message":"internal server error"})
  }
})

router.get("/profile", authMiddleWare, isAuth, async (req, res) => {
  try {
    const User = await user.findById(req.userId);
    if (!User) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/users/login');
    }
    const locals = {
      title: "Profile page",
      isAuthenticated: res.locals.isAuthenticated,
      User
    }
    res.render("profile", { layout: "../views/layout/profileLayout", locals })
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Something went wrong');
    res.redirect('/users/login');
  }
})

router.get("/logout", (req, res) => {
  res.clearCookie("token")
  req.flash("success_msg", "You are now logged out")
  res.redirect("/")
})

router.get("/forgot", (req, res) => {
  const locals = {
    title: "Forgot password"
  }
  res.render("forgot", { locals, layout: "../views/layout/admin" })
})

router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body
    const User = await user.findOne({ email })
    if (!User) {
      req.flash("error_msg", "Email not found")
      return res.redirect("/users/forgot")
    }
    await User.save()
    const resetLink = `http://${req.headers.host}/reset/${User.resetPasswordToken}`
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.TRANSPORTER_EMAIL,
        pass: process.env.TRANSPORTER_PASSWORD
      }
    });

    const mailOptions = {
      to: user.email,
      from: 'iwayemikehinde1@gmail.com',
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
             Please click on the following link, or paste this into your browser to complete the process:
             ${resetLink}
             If you did not request this, please ignore this email and your password will remain unchanged.`
    };

    await transporter.sendMail(mailOptions);
    req.flash('success_msg', 'An email has been sent to ' + user.email + ' with further instructions.');
    res.redirect('/users/forgot');
  } catch (error) {
    console.error({ error })
    req.flash("error_msg", "An error occured")
    res.redirect("/users/forgot")
  }
})

router.get("/reset/:token", async (req, res) => {
  try {
    const User = await user.findOne({   
      resetPasswordToken: req.params.token,
      resetPasswordExpires: {$gt: Date.now()}
    }) 
    if (!User) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/users/forgot');
    }
    res.render('reset', { token: req.params.token });
  } catch(error) {
    console.error({error})
    res.redirect("/users/forgot")
  }
 
})

router.post('/reset/:token', async (req, res) => {
  try {
    const user = await user.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/users/forgot');
    }

    if (req.body.password === req.body.confirm) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      req.flash('success_msg', 'Your password has been updated.');
      res.redirect('/users/login');
    } else {
      req.flash('error_msg', 'Passwords do not match.');
      res.redirect(`/users/reset/${req.params.token}`);
    }
  } catch (error) {
    console.error(error);
    res.redirect('/users/forgot');
  }
});




module.exports = router


