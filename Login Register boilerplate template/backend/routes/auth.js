import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { protect } from '../middleware/auth.js';

//Registering a new user
const router = express.Router();
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try{
        if(!username || !email || !password){
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const userExists = await User.findOne({ email });
        if(userExists){
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ username, email, password });
        const token = generateToken(user._id);
        
        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token
        });
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
})



//login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token
        });

    } catch (err) {
        console.error(err);  // ✅ add this for debugging
        res.status(500).json({ message: 'Server error' });
    }
});


router.get("/me", protect, async (req, res) => {
    res.status(200).json(req.user)
});

//generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { //stores user id in token, later when someone sends token, we can decode it and knwo who it is
        // a password only our server knows
        // JWT_SECRET is stored in .env file IS VERY IMPORTANT LOLLL
        expiresIn: '30d', //expirtes in 30 days
    });
}

export default router;