const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  const locals = {
    title: "Home"
  }
  res.render("home", {layout: "../views/layout/main", locals})
})

module.exports = router
