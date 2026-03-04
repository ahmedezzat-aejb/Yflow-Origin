const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8081;

// YFlow Automation Platform Server
const server = http.createServer((req, res) => {
  console.log(`📡 ${req.method} ${req.url}`);
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.url === '/') {
    // Serve the main YFlow platform
    const filePath = path.join(__dirname, 'yflow-multilang-demo.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  } else if (req.url === '/api') {
    // Mock API endpoint
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'YFlow API Running',
      version: '1.0.0',
      features: ['Automation', 'Multilingual', 'YooKassa Payment'],
      projects: [
        {
          id: 'pluy50d1U3Kh4eTz0RlIV',
          name: 'YFlow Demo Project',
          flows: 5,
          status: 'active'
        }
      ]
    }));
  } else if (req.url.startsWith('/projects/')) {
    // Mock projects endpoint like yflow
    const projectId = req.url.split('/')[2];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      id: projectId,
      name: 'YFlow Automation Project',
      flows: [
        {
          id: 'flow1',
          name: 'Email Automation',
          status: 'active',
          lastRun: new Date().toISOString()
        },
        {
          id: 'flow2', 
          name: 'Data Sync',
          status: 'inactive',
          lastRun: null
        }
      ]
    }));
  } else if (req.url === '/flows') {
    // Mock flows endpoint
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      flows: [
        {
          id: 'flow1',
          name: 'YFlow Email Automation',
          description: 'Automated email processing',
          status: 'active',
          trigger: 'Email Received',
          actions: ['Process Data', 'Send Response']
        },
        {
          id: 'flow2',
          name: 'YFlow Payment Processing',
          description: 'YooKassa payment automation',
          status: 'active',
          trigger: 'Payment Received',
          actions: ['Validate Payment', 'Update Database']
        }
      ],
      total: 2,
      limit: 10
    }));
  } else if (req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'running', 
      port: PORT,
      platform: 'YFlow Automation Platform',
      features: ['Multilingual Support', 'YooKassa Integration', 'White Label'],
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
  console.log('🚀 YFLOW AUTOMATION PLATFORM');
  console.log('=' .repeat(50));
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  console.log(`📊 Projects: http://localhost:${PORT}/projects`);
  console.log(`⚡ Flows: http://localhost:${PORT}/flows`);
  console.log(`🌍 Languages: Russian, English, Arabic, Chinese`);
  console.log(`💳 Payment: YooKassa + СБП`);
  console.log(`🕐 Started: ${new Date().toLocaleString()}`);
  console.log('=' .repeat(50));
  console.log('🔗 Available Endpoints:');
  console.log(`   • Main: http://localhost:${PORT}`);
  console.log(`   • API: http://localhost:${PORT}/api`);
  console.log(`   • Projects: http://localhost:${PORT}/projects`);
  console.log(`   • Flows: http://localhost:${PORT}/flows`);
  console.log(`   • Status: http://localhost:${PORT}/status`);
  console.log('');
  console.log('🎯 YFlow Automation Platform is running!');
  console.log('Press Ctrl+C to stop');
});
