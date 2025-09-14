// middleware/authOptional.js
import jwt from "jsonwebtoken";

export const authOptional = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id; // set userId if token is valid
    } catch (err) {
      // invalid token → just ignore, act as guest
      req.userId = null;
    }
  } else {
    req.userId = null; // no token → guest
  }

  next();
};
