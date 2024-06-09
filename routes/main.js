import express from "express"
import { Post } from "../models/Post.js"

const router = express.Router()

router.get("/home", async (req, res) => {
  try {
    const locals = {
      title: "Node Blog",
      description: "Simple blog in EJS"
    }
    let perPage = 10;
    let page = req.query.page || 1;
    const data = await Post.aggregate([{
      $sort: {createdAt: -1}
    }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec()
    const count = await Post.countDocuments()
    const nextPage = parseInt(page) + 1
    const hasNextPage = nextPage <= Math.ceil(count / perPage)
    res.render("index", {locals, data, current: page, nextPage: hasNextPage ? nextPage : null, currentRoute: "/"})
  } catch (error) {
    console.error(error.message)
  }
})


router.get("/post/:id", async (req, res) => {
  try {
    const { id } = req.params
    const data = await Post.findById({ _id: id })
    const locals = { 
      title: data.title,
    }
    res.render("post", {locals, data, currentRoute: `/post/${id}`})
  } catch (error) {
    console.error(error.message)
  }
})



router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search"
    }
    let searchTerm = req.body.searchTerm
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")
    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
  
      ]
    })
    res.render("search", {data, locals})
  } catch (error) {
    console.log(error.message)
  }
})







// router.get("/home", async (req, res) => {
//   const locals = {
//     title: "Node Blog",
//     description: "Simple blog in EJS"
//   }
//   try {
//     let perPage = 10;
//     let page = req.query.page || 1;
//     const data await post.aggregate();
//     const data = await Post.find( )
//     res.render("index", {locals, data })
//   } catch (error) {
//     console.error(error.message)
//   }
// })

router.get("/about", (req, res) => {
  const locals = {
    title: "About"
  }
  res.render("about", {locals, currentRoute: "/about"})
})

router.get("/contact", (req, res) => {
  const locals = {
    title: "Contact"
  }
  res.render("contact", {locals})
})

function insertPostData() {
  Post.insertMany([
    {
      title: "BUILDING A BLOG",
      body: "This is the body text"
    },
    {
      title: "Building a Blog: Choosing the Right Platform",
      body: "When it comes to building a blog, one of the first decisions you'll need to make is which platform to use. There are many options out there, each with its own strengths and weaknesses..."
    },
    {
      title: "Optimizing Your Blog for Search Engines",
      body: "In order to attract readers to your blog, it's important to make sure it's optimized for search engines. This means using relevant keywords in your titles and content, optimizing your meta tags, and building high-quality backlinks..."
    },
    {
      title: "The Importance of Consistent Blogging",
      body: "One of the keys to building a successful blog is consistency. Regularly publishing new content not only keeps your readers engaged, but it also helps improve your search engine rankings..."
    },
    {
      title: "Monetizing Your Blog: Strategies for Success",
      body: "Once you've built a following for your blog, you may want to explore ways to monetize it. There are several strategies you can use, including advertising, affiliate marketing, sponsored content, and selling digital products..."
    },
    {
      title: "Engaging Your Audience: Tips for Creating Compelling Content",
      body: "Creating compelling content is essential for keeping your audience engaged and coming back for more. Some tips for creating engaging content include understanding your audience, telling stories, using visuals, and encouraging interaction..."
    },
    {
      title: "Promoting Your Blog: Effective Marketing Techniques",
      body: "In order to attract readers to your blog, you'll need to promote it effectively. This can involve a variety of marketing techniques, including social media marketing, email marketing, search engine optimization (SEO), and guest posting..."
    },
    {
      title: "Engaging Your Audience: Tips for Creating Compelling Content",
      body: "Creating compelling content is essential for keeping your audience engaged and coming back for more. Some tips for creating engaging content include understanding your audience, telling stories, using visuals, and encouraging interaction..."
    },
    {
      title: "Promoting Your Blog: Effective Marketing Techniques",
      body: "In order to attract readers to your blog, you'll need to promote it effectively. This can involve a variety of marketing techniques, including social media marketing, email marketing, search engine optimization (SEO), and guest posting..."
    },
    {
      title: "Increasing Blog Traffic: Proven Strategies",
      body: "Every blogger wants more traffic to their website. Discover proven strategies for increasing your blog's traffic, including optimizing for search engines, leveraging social media, and creating valuable content that attracts readers..."
    },
    {
      title: "Building a Successful Blog: Key Principles",
      body: "What does it take to build a successful blog? Learn about the key principles behind building a blog that attracts readers, engages audiences, and ultimately achieves your goals. From content creation to community building, we cover it all..."
    },
    {
      title: "Mastering Blog SEO: Tips and Tricks",
      body: "Search engine optimization (SEO) is crucial for getting your blog noticed online. Master the art of blog SEO with these tips and tricks, including keyword research, on-page optimization, and link building strategies..."
    },
    {
      title: "The Power of Storytelling in Blogging",
      body: "Storytelling is a powerful tool for bloggers. Explore how storytelling can captivate your audience, evoke emotions, and make your blog more memorable. Learn techniques for incorporating storytelling into your blog posts and connecting with readers on a deeper level..."
    },
    {
      title: "Creating Shareable Content: A Guide for Bloggers",
      body: "Want your blog posts to go viral? Discover the secrets to creating shareable content that gets noticed and shared by readers. From attention-grabbing headlines to multimedia content, we'll show you how to create content that people can't help but share..."
    },
    {
      title: "The Art of Blog Monetization: Maximizing Revenue Streams",
      body: "Ready to turn your blog into a money-making machine? Explore the art of blog monetization and discover how to maximize your revenue streams. From ad placement to affiliate marketing, we'll show you how to monetize your blog like a pro..."
    },
    {
      title: "Blogging for Beginners: Getting Started Guide",
      body: "Thinking about starting a blog? Get started on the right foot with our comprehensive guide for beginners. Learn everything you need to know, from choosing a niche to setting up your blog, creating content, and attracting your first readers..."
    },
  ])
}
insertPostData()


  

export default router