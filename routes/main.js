const express = require("express")
const router = express.Router()
const isAuth = require("../middlewares/partialsMiddleware.js")
const Post = require("../models/Post.js")

router.get("/", isAuth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 })
    const locals = {
      title: "Home",
      isAuthenticated: res.locals.isAuthenticated
    }
    res.render("home", { layout: "../views/layout/main", locals, posts })
  } catch (error) {
    console.log({ error })
    res.status(500).json({ "message": "internal server error" })
  }
})

module.exports = router
