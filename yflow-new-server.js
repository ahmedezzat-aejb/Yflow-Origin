const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8081; // منفذ جديد

const server = http.createServer((req, res) => {
  console.log(`📡 Request: ${req.method} ${req.url}`);
  
  if (req.url === '/') {
    const filePath = path.join(__dirname, 'yflow-multilang-demo.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('❌ Error reading file:', err);
        res.writeHead(500);
        res.end('Server Error');
        return;
      }
      console.log('✅ Serving YFlow demo page');
      res.writeHead(200, { 
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
    });
  } else if (req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'running', 
      port: PORT,
      message: 'YFlow Multilingual Demo is working!',
      languages: ['Russian', 'English', 'Arabic', 'Chinese'],
      timestamp: new Date().toISOString()
    }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🚀 YFLOW MULTILINGUAL PLATFORM');
  console.log('=' .repeat(40));
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🌍 Languages: Russian, English, Arabic, Chinese`);
  console.log(`🕐 Started: ${new Date().toLocaleString()}`);
  console.log('=' .repeat(40));
  console.log('🔗 Links:');
  console.log(`   • Main: http://localhost:${PORT}`);
  console.log(`   • Status: http://localhost:${PORT}/status`);
  console.log('');
  console.log('Press Ctrl+C to stop server');
});
