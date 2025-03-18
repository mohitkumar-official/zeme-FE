import express, { Request, Response } from 'express';
import connectToMongo from './db';
import path from 'path'; // Import the path module
import cors from 'cors';
import authRouter from './routes/auth';
import propertiesRouter from './routes/properties';

const app = express();
const port: number = 8000; // Define the port

// Enable CORS for all origins (you can configure it further as needed)
app.use(cors());

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
