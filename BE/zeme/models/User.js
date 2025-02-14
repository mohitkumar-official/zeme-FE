const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"], // Custom error message
  },
  middleName: {
    type: String,
    required: false, // Not required, but can be added if provided
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"], // Custom error message
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"], // Custom error message
    unique: true, // Assuming phone numbers should be unique
  },
  email: {
    type: String,
    required: [true, "Email is required"], // Custom error message
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"], // Custom error message
  },
  userType: {
    type: String,
    enum: {
      values: ['broker', 'landlord', 'user'], // Only these values are allowed
      message: '{VALUE} is not a valid user type', // Error message for invalid values
    },
    default: 'broker', // Default to 'broker' if no userType is provided
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
