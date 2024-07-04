// import express from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { Post } from "../models/Post.js";
// import { User } from "../models/User.js";

// import router from "./main";

// const router = express.Router();

// const adminLayout = "../views/layout/admin";

// const authMiddleWare = (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) {
//     res.redirect("/unauthorized");
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     console.log(error.message());
//   }
// };
// router.get("/", async (req, res) => {
//   try {
//     const locals = {
//       title: "Admin",
//     };
//     res.render("index", { locals, layout: adminLayout });
//   } catch (error) {}
// });

// router.get("/dashboard", authMiddleWare, async (req, res) => {
//   const locals = {
//     title: "Dashboard",
//   };
//   try {
//     const data = await Post.find();
//     res.render("admin/dashboard", { locals, data });
//   } catch (error) {
//     console.log(error.message);
//   }
// });
// router.get("/unauthorized", (req, res) => {
//   res.render("admin/unauthorized");
// });
// router.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user) res.status(401).json({ message: "Invalid credentials" });
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid)
//       res.status(401).json({ message: "Invalid Credentials" });
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
//     res.cookie("token", token, { httpOnly: true });
//     res.redirect("/dashboard");
//   } catch (error) {}
// });

// router.post("/register", async (req, res) => {
//   try {
//     const errors = [];
//     const { username, password } = req.body;
//     const userCheck = await User.findOne({ username });

//     if (!username || !password) {
//       errors.push("All field are required");
//     }
//     if (username && userCheck) {
//       errors.push("username already exists");
//     }

//     if (password && (password.length < 6 || password.length > 12)) {
//       errors.push(
//         "password must be a minimum of 6 and maximum of 12 character"
//       );
//     }

//     if (errors.length > 0) {
//       return res.render("admin/index", { errors: errors, layout: adminLayout });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({ username, password: hashedPassword });
//     jwt.sign({ user: user._id }, process.env.JWT_SECRET, (error, token) => {
//       if (error) {
//         console.log(error);
//         return res.status(500).json({ message: "Internal server error" });
//       }
//       res.cookie("token", token, { httpOnly: true })
//       return res.render("admin/dashboard", {username})
//     })
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: error });
//   }
// });

// router.put("/edit/post/:id", authMiddleWare, async (req, res) => {
//   try {
//     await Post.findByIdAndUpdate(req.params.id, {
//       title: req.body.title,
//       body: req.body.body,
//       updatedAt: Date.now(),
//     });
//     res.redirect("/edit-post/" + req.params.id);
//   } catch (error) {}
// });

// router.get("/edit-post/:id", authMiddleWare, async (req, res) => {
//   try {
//     const locals = {
//       title: "Edit post",
//     };
//     const data = await Post.findOne({ _id: req.params.id });

//     res.render("edit-post", {
//       locals,
//       data,
//       layout: adminLayout,
//     });
//   } catch (error) {
//     console.log(error.message());
//   }
// });

// router.delete("/delete-post/:id", authMiddleWare, async (req, res) => {
//   try {
//     await Post.deleteOne({ _id: req.params.id });
//     res.redirect("/dashboard");
//   } catch (error) {
//     console.log(error.message());
//   }
// });

// router.get("logout", (req, res) => {
//   res.clearCookie("token");
//   res.redirect("/");
//   // res.json({message: "Logout successful"})
// });

// export default router;


const express = require("express")
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

module.exports = router