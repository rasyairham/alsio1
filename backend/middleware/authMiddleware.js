const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      return next(); 
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token missing' });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Session expired' });
  }
};

// Make sure to export like this
module.exports = { protect };