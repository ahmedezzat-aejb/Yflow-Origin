const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4300;

console.log('Starting YFlow Platform - Complete Project');
console.log('Languages: Russian, English, Arabic, Chinese');
console.log('Payment: YooKassa + SBP');
console.log('White Label: Complete');
console.log('');

// Create a simple static file server for the React app
const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.url === '/') {
    // Try to serve the React app's index.html
    const indexPath = path.join(__dirname, 'packages/react-ui/index.html');
    fs.readFile(indexPath, 'utf8', (err, data) => {
      if (err) {
        // Fallback to our demo if React app not found
        const demoPath = path.join(__dirname, 'yflow-final-demo.html');
        fs.readFile(demoPath, 'utf8', (demoErr, demoData) => {
          if (demoErr) {
            res.writeHead(500);
            res.end('Server Error');
            return;
          }
          console.log('Serving YFlow demo page');
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(demoData);
        });
        return;
      }
      console.log('Serving React app');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  } else if (req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'running', 
      port: PORT,
      platform: 'YFlow Complete Platform',
      message: 'YFlow White Label is working!',
      languages: ['Russian', 'English', 'Arabic', 'Chinese'],
      payment: 'YooKassa + SBP',
      timestamp: new Date().toISOString()
    }));
  } else {
    // Try to serve static files from React app
    const filePath = path.join(__dirname, 'packages/react-ui', req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }
      // Determine content type based on file extension
      const ext = path.extname(filePath);
      let contentType = 'text/plain';
      if (ext === '.js') contentType = 'application/javascript';
      if (ext === '.css') contentType = 'text/css';
      if (ext === '.json') contentType = 'application/json';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('YFLOW COMPLETE PLATFORM');
  console.log('='.repeat(50));
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Languages: Russian, English, Arabic, Chinese`);
  console.log(`Payment: YooKassa + SBP`);
  console.log(`White Label: Complete`);
  console.log(`Started: ${new Date().toLocaleString()}`);
  console.log('='.repeat(50));
  console.log('Links:');
  console.log(`   Main: http://localhost:${PORT}`);
  console.log(`   Status: http://localhost:${PORT}/status`);
  console.log('');
  console.log('YFlow Complete Platform is running!');
  console.log('Press Ctrl+C to stop');
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});
