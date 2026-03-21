const app = require('./src/app');
const connectDB = require('./src/config/mongoDb')
const dotenv = require('dotenv')

dotenv.config()

const PORT = process.env.PORT || 5000;

// Enhanced startup with comprehensive error handling
async function startServer() {
  try {
    console.log('🚀 Starting M-Shop API Server...');
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔌 Port: ${PORT}`);
    console.log(`🗄️ MongoDB URI: ${process.env.MONGODB_URI ? 'configured' : 'missing'}`);
    
    // Connect to database first
    console.log('📡 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected successfully');
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🌐 Server is running on port ${PORT}`);
      console.log(`🔗 Health check: https://m-shop-api.onrender.com/health`);
      console.log(`🏠 Root endpoint: https://m-shop-api.onrender.com/`);
    });
    
    // Handle server errors
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      }
    });
    
    return server;
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('❌ Stack trace:', error.stack);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();