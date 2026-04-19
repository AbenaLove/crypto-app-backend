const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//function to help generate a jwt token 
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email }, 
    process.env.JWT_SECRET,
    {expiresIn: '7d'}
  ); 
};

//REGISTER 
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    //to check first if the user exists 
    const existingUser = await User.findOne({ email });
    if (existingUser){
      return res.status(400).json({message: 'Email is already in use'});
    }

    //to hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //to create the new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    //generate the token 
    const token = generateToken(user);

    //to store the token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: 'User has been successfully registered',
      user: {id: user._id, name: user.name, email: user.email}
    });
  } catch (error){
    res.status(500).json({message: 'Server error', error: error.message});
  }
};

//LOGIN 
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the entered password with the hashed one in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    // Store token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// LOGOUT
const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

// PROFILE (protected)
const getProfile = (req, res) => {
  // req.user was set by the auth middleware
  res.status(200).json({
    message: 'Profile fetched successfully',
    user: req.user
  });
};

module.exports = { register, login, logout, getProfile };