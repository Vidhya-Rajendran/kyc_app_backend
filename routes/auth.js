
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

const { verifyToken } = require('../middlewares/auth');
const Kyc = require('../models/Kyc');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({message: 'User registered successfully', user});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: 'Login failed' });
    }
});

//user detail with file status
router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const kycDoc = await Kyc.findOne({ user: req.user.id });

        let fileStatus = { uploaded: false };

        if (kycDoc && kycDoc.documentPath) {
            fileStatus = { uploaded: true, status:kycDoc.status, filePath: `${req.protocol}://${req.get('host')}/${kycDoc.documentPath}` };
        }
        
        // Respond with user details and file status
        res.status(200).json({
            user,
            fileStatus
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
        