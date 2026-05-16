import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes - verify JWT from cookies
 */
export const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check if token exists in cookies
    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({ 
        message: 'You are not logged in. Please login to get access.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ 
        message: 'The user belonging to this token no longer exists.' 
      });
    }

    // Check if user is approved
    if (!currentUser.isApproved) {
      return res.status(403).json({ 
        message: 'Your account is pending approval by a Super Admin.' 
      });
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({ 
      message: 'Invalid token. Please login again.' 
    });
  }
};

/**
 * Restrict access to specific roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'You do not have permission to perform this action.' 
      });
    }
    next();
  };
};
