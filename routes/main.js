const express = require("express")
const router = express.Router()
const isAuth = require("../middlewares/partialsMiddleware.js")

router.get("/", isAuth, (req, res) => {
  const locals = {
    title: "Home",
    isAuthenticated: res.locals.isAuthenticated
  }
  console.log(locals)
  res.render("home", {layout: "../views/layout/main", locals})
})

module.exports = router
