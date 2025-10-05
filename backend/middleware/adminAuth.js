import jwt from 'jsonwebtoken';

export function adminAuth(req, res, next) {
  const auth = req.headers['authorization'];
  const JWT_SECRET = process.env.JWT_SECRET;
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.admin = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }
  return res.status(401).json({ error: 'Unauthorized: Admin access required.' });
}
