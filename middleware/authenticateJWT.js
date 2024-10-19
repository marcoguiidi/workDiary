const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, 'your_jwt_secret', async (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        try {

            const foundUser = await User.findById(user.id);
            if (!foundUser) return res.status(404).json({ message: 'User not found' });

            req.user = {
                id: user.id,
                email: foundUser.email 
            };

            next();
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });
};

module.exports = authenticateJWT;
