const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // Store userId as ObjectId
  },
  propertyIds: {
    type: [mongoose.Schema.Types.ObjectId],  // Array of ObjectIds for multiple properties
    required: true,  // Make sure propertyIds is required
  },
  savedAt: {
    type: Date,
    default: Date.now  // Store the timestamp of when the property is added
  }
});

const Favourite = mongoose.model('Favourite', favouriteSchema);

module.exports = Favourite;
