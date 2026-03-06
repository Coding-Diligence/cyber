const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1]
  if (!token) return res.status(401).json({ code: 401, message: 'Access denied' })

  jwt.verify(token, 'secret-key', (err, user) => {
    if (err) return res.status(403).json({ code: 403, message: 'Invalid token' })
    req.user = user
    next()
  })
}

module.exports = { authenticateToken }