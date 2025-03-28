// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import connectToMongo from './db';
import path from 'path'; // Import the path module
import cors from 'cors';
import authRouter from './routes/auth';
import propertiesRouter from './routes/properties';

const app = express();
const port: number = 8000; // Define the port

// Enable CORS for all origins (you can configure it further as needed)
app.use(cors({
  origin: true, // Allow all origins during development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'auth-token', 'Accept'],
  exposedHeaders: ['Cross-Origin-Opener-Policy']
}));

// Add security headers middleware
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, auth-token, Accept');
  next();
});

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use the authentication router
app.use('/api/auth', authRouter);

// Use the property router
app.use('/api/property', propertiesRouter);

// Connect to MongoDB
connectToMongo();

// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log('Server is running and watching for changes...');
});
