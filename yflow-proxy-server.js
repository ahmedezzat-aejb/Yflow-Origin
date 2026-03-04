const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 8082;

// YFlow Proxy Server - Routes to cloud.yflow.com
const server = http.createServer((req, res) => {
  console.log(`📡 ${req.method} ${req.url}`);

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.url === '/') {
    // Serve the final YFlow platform
    const filePath = require('path').join(__dirname, 'yflow-final-demo.html');
    require('fs').readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  } else if (req.url.startsWith('/projects/')) {
    // Route to cloud.yflow.com projects
    const projectId = req.url.split('/')[2];
    const targetUrl = `https://cloud.yflow.com/projects/${projectId}`;
    console.log(`🔄 Redirecting to: ${targetUrl}`);

    const proxyReq = https.request(targetUrl, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    req.pipe(proxyReq);
  } else if (req.url === '/templates') {
    // Route to cloud.yflow.com templates
    const targetUrl = 'https://cloud.yflow.com/templates';
    console.log(`🔄 Redirecting to: ${targetUrl}`);

    const proxyReq = https.request(targetUrl, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    req.pipe(proxyReq);
  } else if (req.url === '/impact') {
    // Route to cloud.yflow.com impact
    const targetUrl = 'https://cloud.yflow.com/impact';
    console.log(`🔄 Redirecting to: ${targetUrl}`);

    const proxyReq = https.request(targetUrl, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    req.pipe(proxyReq);
  } else if (req.url === '/leaderboard') {
    // Route to cloud.yflow.com leaderboard
    const targetUrl = 'https://cloud.yflow.com/leaderboard';
    console.log(`🔄 Redirecting to: ${targetUrl}`);

    const proxyReq = https.request(targetUrl, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    req.pipe(proxyReq);
  } else if (req.url.startsWith('/flows')) {
    // Route to cloud.yflow.com flows
    const targetUrl = `https://cloud.yflow.com${req.url}`;
    console.log(`🔄 Redirecting to: ${targetUrl}`);

    const proxyReq = https.request(targetUrl, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    req.pipe(proxyReq);
  } else if (req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'running',
      port: PORT,
      platform: 'YFlow Proxy Server',
      target: 'cloud.yflow.com',
      message: 'YFlow Proxy is working! Redirecting to cloud.yflow.com',
      routes: [
        '/projects/*',
        '/templates',
        '/impact',
        '/leaderboard',
        '/flows/*'
      ],
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
  console.log('🚀 YFLOW PROXY SERVER');
  console.log('=' .repeat(50));
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🎯 Target: cloud.yflow.com`);
  console.log(`🌍 Languages: Russian, English, Arabic, Chinese`);
  console.log(`🕐 Started: ${new Date().toLocaleString()}`);
  console.log('=' .repeat(50));
  console.log('🔗 Available Routes:');
  console.log(`   • YFlow Demo: http://localhost:${PORT}`);
  console.log(`   • Projects: http://localhost:${PORT}/projects/*`);
  console.log(`   • Templates: http://localhost:${PORT}/templates`);
  console.log(`   • Impact: http://localhost:${PORT}/impact`);
  console.log(`   • Leaderboard: http://localhost:${PORT}/leaderboard`);
  console.log(`   • Flows: http://localhost:${PORT}/flows/*`);
  console.log(`   • Status: http://localhost:${PORT}/status`);
  console.log('');
  console.log('🎯 Now you can access:');
  console.log(`   • http://localhost:${PORT}/projects/pluy50d1U3Kh4eTz0RlIV/flows?limit=10`);
  console.log(`   • http://localhost:${PORT}/flows/SjChQAutmXPdvd5OeFKNP`);
  console.log(`   • http://localhost:${PORT}/templates`);
  console.log(`   • http://localhost:${PORT}/impact`);
  console.log(`   • http://localhost:${PORT}/leaderboard`);
  console.log('');
  console.log('Press Ctrl+C to stop server');
});
