const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// secret key for jwt
const SECRET_KEY = "0c5f477d11ad6c89c3cbf9782970dda2";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send("Error retrieving users");
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Failed retrieving the userId:", req.params.userId);
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// const addUser = async (req, res) => {
//     try {
//         const newUser = new User({
//             username: req.body.username,
//             email: req.body.email,
//             password: req.body.password
//         });
//         await newUser.save();
//         res.json(newUser);
//     } catch (error) {
//         res.status(500).json({ message: 'Error adding user' });
//     }
// };

const patchUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Failed updating the user:", req.params.userId);
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Failed deleting the user:", req.params.userId);
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Determine role
    let role = 'user';
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    const superAdminEmails = process.env.SUPERADMIN_EMAILS?.split(',') || [];
    
    if (superAdminEmails.includes(email.trim())) {
      role = 'superadmin';
    } else if (adminEmails.includes(email.trim())) {
      role = 'admin';
    }

    // Create new user with hashed password
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    // Create token (excluding password from the token payload)
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ 
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Server error during signin" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  patchUser,
  deleteUser,
  signup,
  signin,
};
