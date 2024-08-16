const express = require("express")
const Blog = require("../models/Post")
const partialMiddleware = require("../middlewares/partialsMiddleware.js")
const router = express.Router()

router.get("/:id", partialMiddleware, async (req, res) => {
  const { id } = req.params

  const blogs = await Blog.findById(id)
  const locals = {
    title: blogs.title,
    post: blogs,
    isAuthenticated: res.locals.isAuthenticated,
  }
  res.render("blog", {layout: "../views/layout/main", locals})
})

module.exports = router