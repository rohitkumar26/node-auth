const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');
const { check, body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
router.get('/', auth, async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        res.json(user);
    } catch (error) {
        res.status(500).send('server error');
    }
})
router.post('/', [
    // username must be an email
    check('email', 'please include a valid email').isEmail(),
    // password must be at least 5 chars long
    check('password', 'password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email }).select("+password").exec();
        console.log(password);
        console.log(user);
        if (!user) {
            return res.status(400).json({ errors: [{ msg: "invalid credentials" }] })
        }
        let matchpassword = await user.matchPassword(password);
        if (!matchpassword) {
            return res.status(400).json({ errors: [{ msg: "invalid credentials" }] })
        }
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