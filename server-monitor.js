const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/heartbeat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

function sendHeartbeat() {
  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.write(JSON.stringify({ clientId: 'server1' })); // Unique ID for this server
  req.end();
}

// Gửi tín hiệu heartbeat mỗi 5 giây
setInterval(sendHeartbeat, 5000);