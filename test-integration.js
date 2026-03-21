// Comprehensive Frontend-Backend Integration Test
const https = require('https');

function testEndpoint(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'm-shop-api.onrender.com',
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://m-shop-food-delivery.netlify.app',
        'Access-Control-Request-Method': method,
        'Access-Control-Request-Headers': 'Content-Type,Authorization'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: responseData,
          path: path,
          corsHeaders: {
            'access-control-allow-origin': res.headers['access-control-allow-origin'],
            'access-control-allow-credentials': res.headers['access-control-allow-credentials'],
            'access-control-allow-methods': res.headers['access-control-allow-methods'],
            'access-control-allow-headers': res.headers['access-control-allow-headers']
          }
        });
      });
    });

    req.on('error', (error) => reject(error));
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runIntegrationTests() {
  console.log('🔍 Testing Frontend-Backend Integration\n');
  console.log('🌐 Frontend: https://m-shop-food-delivery.netlify.app');
  console.log('🔧 Backend: https://m-shop-api.onrender.com\n');

  const tests = [
    { path: '/', name: 'Root Route' },
    { path: '/health', name: 'Health Check' },
    { path: '/api/products', name: 'Products API' },
    { path: '/api/products/featured', name: 'Featured Products' },
    { path: '/api/users/register', name: 'Registration Endpoint', method: 'POST', data: { email: 'test@example.com', password: 'password123' } }
  ];

  for (const test of tests) {
    try {
      console.log(`📊 Testing ${test.name}...`);
      const result = await testEndpoint(test.path, test.method || 'GET', test.data || null);
      
      console.log(`✅ Status: ${result.status}`);
      console.log(`🌐 CORS Origin: ${result.corsHeaders['access-control-allow-origin'] || 'Not set'}`);
      console.log(`🔐 CORS Credentials: ${result.corsHeaders['access-control-allow-credentials'] || 'Not set'}`);
      console.log(`📡 CORS Methods: ${result.corsHeaders['access-control-allow-methods'] || 'Not set'}`);
      console.log(`📋 Data Length: ${result.data.length} characters\n`);
      
      // Check CORS issues
      if (!result.corsHeaders['access-control-allow-origin']) {
        console.log('❌ CORS Issue: No Access-Control-Allow-Origin header');
      } else if (result.corsHeaders['access-control-allow-origin'] !== 'https://m-shop-food-delivery.netlify.app' && 
                 result.corsHeaders['access-control-allow-origin'] !== '*') {
        console.log('❌ CORS Issue: Origin not matching frontend URL');
      } else {
        console.log('✅ CORS: Properly configured');
      }
      
    } catch (error) {
      console.log(`❌ Error testing ${test.name}: ${error.message}`);
    }
    console.log('---');
  }

  console.log('\n🎯 Integration Test Complete!');
  console.log('💡 If CORS issues persist, wait 2-3 minutes for Render deployment');
}

runIntegrationTests();
