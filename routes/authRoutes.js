import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { client } from "../config/sanityClient.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await client.fetch('*[_type == "user" && email == $email][0]', { email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in Sanity
    const newUser = await client.create({
      _type: "user",
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await client.fetch('*[_type == "user" && email == $email][0]', { email });
    if (!user) return res.status(400).json({ error: "User does not exist!" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "User does not exist!" });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

export default router;
