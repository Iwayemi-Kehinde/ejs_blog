const jwt = require("jsonwebtoken");

function checkAuthenticated(req, res, next) {
  const token = req.cookies.token;
  
  res.locals.isAuthenticated = false;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.locals.isAuthenticated = false;
        return next(); 
      }

      res.locals.isAuthenticated = true;
      return next(); 
    });
  } else {
    return next(); 
  }
}

module.exports = checkAuthenticated;
