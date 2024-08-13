const express = require('express');
const User = require('../Models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const createTokenAndSaveCookie = require('../jwt/jwtTokenGenerate')
const secureRoute = require('../middleware/secureRoute');
router.post('/api/signup', async (req, res) => {
    
    try {
        const { fullname, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            res.status(400).json({ error: 'password does not match' });
        }

        const user = await User.findOne({ email });
        if (user) {
            res.status(400).json({ error: 'user already exist' });
        }
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(password, salt);
        const newuser = await User.create({ fullname, email, password: secPassword });
       
        
        if (newuser) {
            createTokenAndSaveCookie(newuser._id, res);
            res.status(200).json({ message: 'success', user: {_id: newuser._id, fullname: newuser.fullname, email: newuser.email } });
        }


    }
    catch (e) {
        console.log(e)
        res.status(200).json({ error: 'errofefr' })
    }
})

router.post('/api/login', async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ error: "user does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: "invalid password" });
        }

        createTokenAndSaveCookie(user._id, res);

        res.status(200).json({ message: 'user logged in successfully', user: { _id: user._id, fullname: user.fullname, email: user.email } });
    }

    catch (e) {
        console.log(e)
        res.status(400).json({ message: "server error" });
    }
})

router.post('/api/logout', async (req, res) => {
    try {

        res.clearCookie("jwt");
        res.status(200).json({ message: 'user logout successfully' });
    }
    catch (e) {
        res.status(400).json({ message: 'something went wrong' });
    }
})

router.get('/api/alluser',secureRoute, async (req, res) => {
    
    try {
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({
          _id: { $ne: loggedInUser },
        }).select("-password");
        res.status(201).json(filteredUsers);
      } catch (error) {
        console.log("Error in allUsers Controller: " + error);
      }
})
module.exports = router;