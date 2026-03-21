// Test basic endpoint availability
const https = require('https');

async function testBasicEndpoint() {
  console.log('🔍 Testing basic server connectivity...\n');
  
  try {
    // Test the main endpoint
    const response = await fetch('https://m-shop-api.onrender.com');
    const text = await response.text();
    
    console.log(`📊 Status: ${response.status}`);
    console.log(`📄 Response: ${text}`);
    console.log(`🔗 Headers:`, Object.fromEntries(response.headers));
    
    if (response.status === 404 && text === 'Not Found') {
      console.log('\n❌ Issue: Server is running but routes are not found');
      console.log('💡 This means the latest deployment hasn\'t propagated yet');
      console.log('⏳ Wait 2-3 more minutes for Render deployment');
    } else if (response.status === 200) {
      console.log('\n✅ Server is responding correctly');
    } else {
      console.log('\n⚠️ Unexpected response from server');
    }
    
  } catch (error) {
    console.log(`❌ Connection error: ${error.message}`);
    console.log('💡 Server might be starting up or down');
  }
}

testBasicEndpoint();
