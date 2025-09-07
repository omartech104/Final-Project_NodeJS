const isAdmin = (req, res, next) => {
  if (['admin', 'superadmin'].includes(req.user?.role)) {
    return next();
  }
  return res.status(403).json({ message: 'Admin access required' });
};

module.exports=isAdmin;
