// Authentication and authorization middleware

// Middleware to verify if user is authenticated
const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header provided' });
  }

  try {
    // Extract staff info from authorization header
    // Format: "Bearer {staff_id}:{role_id}"
    const token = authHeader.replace('Bearer ', '');
    const [staffId, roleId] = token.split(':');
    
    if (!staffId || !roleId) {
      return res.status(401).json({ error: 'Invalid authorization format' });
    }

    // Attach user info to request
    req.user = {
      staffId: parseInt(staffId),
      roleId: parseInt(roleId)
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid authorization token' });
  }
};

// Middleware to verify if user is admin (role_id = 1)
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.roleId !== 1) {
    return res.status(403).json({ 
      error: 'Access denied. Admin privileges required.',
      message: 'Only administrators can perform this action'
    });
  }

  next();
};

// Middleware to verify if user is admin or manager (role_id = 1 or 2)
const isAdminOrManager = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.roleId !== 1 && req.user.roleId !== 2) {
    return res.status(403).json({ 
      error: 'Access denied. Admin or Manager privileges required.'
    });
  }

  next();
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isAdminOrManager
};
