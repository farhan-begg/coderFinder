const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const { check, validationResult } = require('express-validator/check');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
// @route Post api/users
// @desc  Register User
// @access Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email address').isEmail(),
    check(
      'password',
      'Please enter your password with 6 or more characters'
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body
    try {
      let user = await User.findOne({ email })

      if (user) {
        res.status(400).json({ errors: [{ msg: "User already exists" }] })
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })

      user = new User({
        name,
        email,
        avatar,
        password
      })

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();






      res.send("User ReGISTERED")
    } catch (err) {

      console.error(err.message);
      res.status(500).send("Server error")

    }





  }
);

module.exports = router;
