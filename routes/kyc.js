
const express = require('express');
const multer = require('multer');
const Kyc = require('../models/Kyc');
const User = require('../models/User');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');
const router = express.Router();

// File upload setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Submit KYC
router.post('/', verifyToken, upload.single('document'), async (req, res) => {
    try {
        const newKyc = new Kyc({
            documentPath: req.file.path,
            user: req.user.id,
        });
        await newKyc.save();
        res.status(201).send('KYC submitted successfully');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get KYC submissions
router.get('/', verifyToken, async (req, res) => {
    try {
        const kycs = req.user.role === 'admin'
            ? await Kyc.find().populate('user')
            : await Kyc.find({ user: req.user.id });
        const kycsWithFilePath = kycs.map(kyc => {
            const filePath = kyc.documentPath
                ? `${req.protocol}://${req.get('host')}/${kyc.documentPath}` 
                : null; 
            
            return {
                ...kyc.toObject(),
                filePath 
            };
        });

        res.json(kycsWithFilePath);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Approve/Reject KYC
router.put('/:id/:action', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { id, action } = req.params;
        const status = action === 'approve' ? 'approved' : 'rejected';
        await Kyc.findByIdAndUpdate(id, { status });
        res.send(`KYC ${action}d successfully`);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Get KYC status counts
router.get('/dashboard', verifyToken,  async (req, res) => {
    try {
        console.log('im here');
        const statusCounts = await Kyc.aggregate([
            {
                $group: {
                    _id: '$status', 
                    count: { $sum: 1 } 
                }
            },
            {
                $project: {
                    _id: 0, 
                    status: '$_id', 
                    count: 1
                }
            }
        ]);
        const counts = {
            pending: 0,
            approved: 0,
            rejected: 0,
        };

        statusCounts.forEach(item => {
            if (item.status === 'pending') {
                counts.pending = item.count;
            } else if (item.status === 'approved') {
                counts.approved = item.count;
            } else if (item.status === 'rejected') {
                counts.rejected = item.count;
            }
        });

         const totalUsers = await User.countDocuments();

         res.status(200).json({
             kycCounts: counts,
             totalUsers: totalUsers
         });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
        