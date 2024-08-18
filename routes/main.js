const express = require("express")
const router = express.Router()
const isAuth = require("../middlewares/partialsMiddleware.js")
const Post = require("../models/Post.js")
const authMiddleware = require("../middlewares/authMiddleware.js")
const multer = require("multer")
const Blog = require("../models/Post.js")

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

const uploads = multer({ dest: "uploads/" })



router.get("/create-post", isAuth, authMiddleware, async (req, res) => {
  const locals = {
    title: "Create blog post",
    isAuthenticated: res.locals.isAuthenticated,
    userId: req.userId
  }
  res.render("createpost", { layout: "../views/layout/main", locals })
})

router.post("/create-post", uploads.single("coverImage"), async (req, res) => {
  try {
    const { title, content, tags, category, isPublished } = req.body
    const author = "req.userId"
    const coverImage = req.file ? req.filename : ""

    const blog = new Blog({
      title,
      content,
      author,
      tags: tags.split(','),
      category,
      coverImage,
      isPublished: isPublished ? true : false
    });

    await blog.save()
    req.flash("success_msg", "Successfully created the blog")
    res.redirect("/users/profile")
  } catch (error) {
    console.log({ error: error.message })
    req.flash("error_msg", "An error occured")
    res.redirect("/create-post")
  }

})

module.exports = router
