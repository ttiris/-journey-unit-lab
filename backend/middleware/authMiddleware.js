import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const isOwner = (req, res, next) => {
  // Verify that the user owns the resource
  if (req.user._id !== req.params.userId && req.user._id !== req.body.user_id) {
    return res.status(403).json({ error: 'Not authorized to access this resource' });
  }
  next();
};
