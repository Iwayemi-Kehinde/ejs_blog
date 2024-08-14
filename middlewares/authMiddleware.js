const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; 
  if (token == null) return res.redirect('/login'); 
  jwt.verify(token, process.env.JWT_SECRET, async (err, userId) => {
    if (err) return res.redirect('/login'); 
    req.userId = userId;
    next();
  });
};

module.exports = authenticateToken; 
