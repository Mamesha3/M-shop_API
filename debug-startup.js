// Debug server startup issues
const mongoose = require('mongoose');

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function testBasicServer() {
  console.log('🔍 Testing basic Express server...');
  
  const express = require('express');
  const app = express();
  
  app.get('/test', (req, res) => {
    console.log('Test endpoint accessed');
    res.json({ 
      message: 'Server is working',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  });
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Test server running on port ${PORT}`);
    console.log(`🌐 Test at: https://m-shop-api.onrender.com/test`);
  });
}

async function main() {
  console.log('🚀 Starting debug tests...\n');
  
  // Test database
  const dbConnected = await testDatabaseConnection();
  
  if (dbConnected) {
    console.log('📊 Database is OK, testing server...\n');
    await testBasicServer();
  } else {
    console.log('❌ Database issue found - this might be the problem');
  }
}

main().catch(console.error);
