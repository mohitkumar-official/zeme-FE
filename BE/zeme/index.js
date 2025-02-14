const express = require('express');
const connectToMongo = require('./db');
const app = express();
const port = 8000;
const cors = require('cors');

// Enable CORS for all origins (you can configure it further as needed)
app.use(cors());

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the authentication router
app.use('/api/auth', require('./routes/auth'));

// Use the property router
app.use('/api/property', require('./routes/properties'));

// Connect to MongoDB
connectToMongo();

// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
