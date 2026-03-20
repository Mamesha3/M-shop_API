const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mshop')
  .then(() => {
    console.log('Connected to MongoDB for cleanup');
    
    // Drop the users collection to clear any old indexes
    mongoose.connection.db.dropCollection('users', (err, result) => {
      if (err) {
        console.log('Error dropping collection:', err);
      } else {
        console.log('Users collection dropped:', result);
      }
      
      // Close connection
      mongoose.connection.close();
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
