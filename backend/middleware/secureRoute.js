const  jwt= require('jsonwebtoken');
const User=require( '../Models/User');

const secureRoute = async (req, res, next) => {
  try {
    
    const token = req.cookies.jwt;
    // console.log(token)
    // console.log(token);
    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid Token" });
    }
    const user = await User.findById(decoded.userId).select("-password"); // current loggedin user
    if (!user) {
      return res.status(401).json({ error: "No user found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in secureRoute: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports= secureRoute;