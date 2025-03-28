const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key';

// Import the server code (without starting it)
const app = express();
app.use(bodyParser.json());

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Routes to test
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

describe('Authentication API', () => {
  // Test signup route
  describe('POST /signup', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/signup')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User created successfully');

      // Verify user was created in the database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user.name).toBe(userData.name);
    });

    it('should not allow duplicate emails', async () => {
      const userData = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'password123'
      };

      // Create first user
      await request(app)
        .post('/signup')
        .send(userData)
        .expect(201);

      // Try to create same user again
      const response = await request(app)
        .post('/signup')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('User already exists');
    });
  });

  // Test login route
  describe('POST /login', () => {
    it('should login an existing user', async () => {
      // Create a user first
      const userData = {
        name: 'Login Test',
        email: 'login@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/signup')
        .send(userData);

      // Try to login
      const response = await request(app)
        .post('/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(response.body.token).toBeTruthy();
      expect(response.body.result.email).toBe(userData.email);
    });

    it('should not login with incorrect password', async () => {
      // Create a user first
      const userData = {
        name: 'Password Test',
        email: 'password@example.com',
        password: 'correctpassword'
      };

      await request(app)
        .post('/signup')
        .send(userData);

      // Try to login with wrong password
      const response = await request(app)
        .post('/login')
        .send({
          email: userData.email,
          password: 'wrongpassword'
        })
        .expect(400);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should not login non-existent user', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });
  });
});