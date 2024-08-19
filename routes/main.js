const express = require("express")
const router = express.Router()
const isAuth = require("../middlewares/partialsMiddleware.js")
const authMiddleware = require("../middlewares/authMiddleware.js")
const Blog = require("../models/Post.js")
const upload = require("../config/upload.js")

router.get("/", isAuth, async (req, res) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 }).populate("author", "username email").exec()
    const locals = {
      title: "Home",
      isAuthenticated: res.locals.isAuthenticated
    }
    console.log(posts)
    res.render("home", { layout: "../views/layout/main", locals, posts })
  } catch (error) {
    console.log({ error })
    res.status(500).json({ "message": "internal server error" })
  }
})



router.get("/create-post",authMiddleware, isAuth, async (req, res) => {
  const locals = {
    title: "Create blog post",
    isAuthenticated: res.locals.isAuthenticated,
  }
  res.render("createpost", { layout: "../views/layout/main", locals })
})


router.post("/create-post", authMiddleware,upload.single("coverImage"), async (req, res) => {
  try {
    const { title, content, tags, category, isPublished } = req.body
    const author = req.userId
    const coverImage = req.file ? req.filename : ""
    console.log(coverImage)
    const blog = new Blog({
      title,
      content,
      author,
      tags,
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
