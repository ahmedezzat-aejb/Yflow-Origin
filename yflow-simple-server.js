const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8083;

console.log('🚀 Starting YFlow Platform...');
console.log('🌍 Languages: Russian, English, Arabic, Chinese');
console.log('💳 Payment: YooKassa + СБП');
console.log('🎨 White Label: Complete');

// Simple HTTP Server - No Dependencies
const server = http.createServer((req, res) => {
  console.log(`📡 Request: ${req.method} ${req.url}`);
  
  // Set headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.url === '/') {
    // Serve the main YFlow platform
    const filePath = path.join(__dirname, 'yflow-final-demo.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('❌ Error reading file:', err);
        res.writeHead(500);
        res.end('Server Error');
        return;
      }
      console.log('✅ Serving YFlow demo page');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  } else if (req.url === '/status') {
    // Status endpoint
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'running', 
      port: PORT,
      message: 'YFlow Multilingual Demo is working!',
      languages: ['Russian', 'English', 'Arabic', 'Chinese'],
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Error handling
server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🚀 YFLOW MULTILINGUAL PLATFORM');
  console.log('=' .repeat(50));
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🌍 Languages: Russian, English, Arabic, Chinese`);
  console.log(`🕐 Started: ${new Date().toLocaleString()}`);
  console.log('=' .repeat(50));
  console.log('🔗 Links:');
  console.log(`   • Main: http://localhost:${PORT}`);
  console.log(`   • Status: http://localhost:${PORT}/status`);
  console.log('');
  console.log('🎯 YFlow White Label - Complete!');
  console.log('Press Ctrl+C to stop');
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});
