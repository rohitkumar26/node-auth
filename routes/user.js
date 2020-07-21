const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { check, body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');



router.post('/register', [
    check('username', 'username is required').not().isEmpty(),
    // username must be an email
    check('email', 'please include a valid email').isEmail(),
    // password must be at least 5 chars long
    check('password', 'please include a password with 6 or more chracters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email }).exec();

        if (user) {
            return res.status(401).json({ errors: [{ msg: "user already exists" }] })
        }
        user = new User({
            username,
            email,
            password
        })
        await user.save();

        // jwt send token
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2d' }, (err, token) => {
            if (err) throw err;
            res.json({ token })
        })
    } catch (error) {
        res.status(500).send('server error');
    }
})
module.exports = router;