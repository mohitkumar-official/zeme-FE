const router = require('express').Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = "mysecret@key";

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const { password } = req.body;
    const salt = await bcrypt.genSalt(10); //create salt (the salt is adding extra string to the password to make it more secure)
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const user = new User(req.body);
    await user.save();
    jwt.sign({ id: user._id }, JWT_SECRET, (err, token) => {
      if (err) {
        console.log(err);
      }
      res.status(201).send({ message: "User registered successfully", user, token });
    })
  } catch (error) {
    // Check for validation errors
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0].message;
      console.log(firstError)
      return res.status(400).json({ error: firstError });
    }

    // Handle unique field errors (duplicate email)
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Default server error
    res.status(500).json({ error: "Server Error" });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let success = false;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    jwt.sign({ id: user._id }, JWT_SECRET, (err, token) => {
      if (err) {
        console.log(err);
      }
      success = true;
      res.status(200).send({ success, message: "User logged in successfully", user, token });
    })
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

//get Logged in user details (login required)
router.get("/getuser", fetchuser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); //select all fields except password
    res.status(200).send(user);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});


module.exports = router;