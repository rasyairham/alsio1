const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Akses ditolak, token hilang!" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Menyimpan ID user ke request
    next();
  } catch (error) {
    res.status(401).json({ message: "Token tidak valid!" });
  }
};

module.exports = { protect };