const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; 
  if (token == null) return res.redirect('/users/login'); 
  jwt.verify(token, process.env.JWT_SECRET, async (err, userId) => {
    if (err) return res.redirect('/users/login'); 
    req.userId = userId.userId;
    next();
  });
};

module.exports = authenticateToken; 
