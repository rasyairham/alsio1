const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If no token is provided
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied, please login first.",
      });
    }

    // 2. Verify Token
    // Wrapped in try-catch or handled by main catch
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Fetch user data
    // .select('-password') is important for security
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found or token is invalid.",
      });
    }

    // 4. Attach user to request object
    req.user = user;
    next();
    
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);

    // Specific JWT error handling
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Your session has expired, please login again.",
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid or corrupted token.",
      });
    }

    // Other general errors
    res.status(500).json({
      success: false,
      message: "An error occurred on the server while verifying your account.",
    });
  }
};

module.exports = { protect };