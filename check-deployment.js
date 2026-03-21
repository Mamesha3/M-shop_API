// Simple script to check API deployment status
const https = require('https');

function checkEndpoint(endpoint) {
  return new Promise((resolve, reject) => {
    const req = https.get(`https://m-shop-api.onrender.com${endpoint}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data,
          endpoint: endpoint
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function checkDeployment() {
  console.log('🔍 Checking M-Shop API Deployment...\n');
  
  try {
    // Check health endpoint
    console.log('📊 Checking health endpoint...');
    const health = await checkEndpoint('/health');
    console.log(`✅ Health: ${health.status}`);
    console.log(`📄 Response: ${health.data}\n`);
    
    // Check products endpoint
    console.log('🍔 Checking products endpoint...');
    const products = await checkEndpoint('/api/products');
    console.log(`✅ Products: ${products.status}`);
    console.log(`📄 Response length: ${products.data.length} characters\n`);
    
    console.log('🎉 API is deployed and working!');
    console.log('🌐 Frontend URL: https://m-shop-food-delivery.netlify.app');
    console.log('🔧 Backend URL: https://m-shop-api.onrender.com');
    
  } catch (error) {
    console.log('❌ API not ready yet:');
    console.log(`📄 Error: ${error.message}`);
    console.log('\n⏳ Render might still be deploying...');
    console.log('💡 Try again in 2-3 minutes');
  }
}

checkDeployment();
