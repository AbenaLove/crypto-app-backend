const jwt = require('jsonwebtoken');

const protect = (req,res,next) => {
  //get the token from the cookie
  const token = req.cookies.token;

  //to handle a request missing a token
  if (!token) {
    return res.status(401).json({message: 'Unauthorized, no token found'});
  }
  try {
    //to verify that the token is valid and untempered with
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    //proceed to the next route 
    next();
  } catch (error) {
    return res.status(401).json({message: 'Unauthorized, token not valid'});
  }
};

module.exports = {protect};