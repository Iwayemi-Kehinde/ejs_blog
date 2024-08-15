const express = require("express")
const Blog = require("../models/Post")
const User = require("../models/User")
const router = express.Router()

router.get("/", async (req, res) => {
  const { id } = req.params
  const blogs = await Blog.findById("66be87916f3a7bdeb672a716")
  const author = await User.findById(blogs.author)
  const _author = author.username
  const locals = {
    title: blogs.title,
    post: blogs,
    author: _author
  }
  res.render("blog", {layout: "../views/layout/main", locals})
})
const blogsTest =
{
  "title": "The Future of AI: How Machine Learning is Transforming Industries",
  "content": "Artificial Intelligence (AI) and Machine Learning (ML) have become pivotal forces shaping various industries across the globe. From automating routine tasks to providing deep insights through data analysis, AI is revolutionizing how businesses operate. In this blog post, we'll explore how AI is transforming key sectors such as healthcare, finance, and manufacturing, and what we can expect in the coming years.\n\nIn healthcare, AI is aiding in diagnostics, predictive analytics, and even surgery, reducing human errors and improving patient outcomes. In finance, machine learning algorithms are enhancing fraud detection, automating trading, and personalizing customer experiences. The manufacturing sector is leveraging AI for predictive maintenance and optimizing supply chain operations. As these technologies advance, we can anticipate even more innovative applications, leading to smarter and more efficient systems.\n\nDespite these advancements, there are still ethical concerns surrounding AI, including data privacy, bias, and job displacement. It's crucial to address these challenges as we move forward into an increasingly AI-driven world.",
  "author": "64d0f432a9b0c13d8b8e1234", // Assuming this ObjectId references a User
  "tags": ["AI", "Machine Learning", "Technology"],
  "category": "Technology",
  "coverImage": "https://example.com/ai-future-cover.jpg",
  "isPublished": true,
  "views": 187,
  "likes": ["64d0f789a8c2e13d8b9e5678", "64d0fa56a1b0c18d8c7e7890"], // Assuming these are User ObjectIds
  "comments": [
    {
      "user": "64d0f321b9b0d15d8d7e1234",
      "comment": "This is a fantastic article! AI is definitely the future.",
      "createdAt": "2024-08-15T09:30:00Z"
    },
    {
      "user": "64d0f654a8c2d13d8d7e5678",
      "comment": "The ethical concerns raised here are important to consider.",
      "createdAt": "2024-08-15T10:15:00Z"
    }
  ]
}


const create = async () => {
  const x = await Blog.create(blogsTest)
  console.log(x)
}

create()

module.exports = router