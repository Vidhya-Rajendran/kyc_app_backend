
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
}

function verifyAdmin(req, res, next) {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    next();
}

module.exports = { verifyToken, verifyAdmin };
        