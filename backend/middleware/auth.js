import jwt from 'jsonwebtoken';
const JWT_SECRET = 'your_jwt_secret'; // 生产环境请用环境变量

export function authMiddleware(req, res, next) {
  // 允许从 header 或 query 参数获取 token
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if (req.query.token) {
    token = req.query.token;
  }
  if (!token) {
    return res.status(401).json({ code: 401, msg: '未授权' });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ code: 401, msg: 'Token无效或已过期' });
  }
}
