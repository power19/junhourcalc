const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// Secret key - must match the one in Android app
const APP_SECRET = 'junlin-hours-app-2024-secret';

// Access denied page
const ACCESS_DENIED_HTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Access Denied</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            color: #fff;
        }
        .container {
            text-align: center;
            padding: 40px;
        }
        h1 { color: #f44336; font-size: 3rem; margin-bottom: 20px; }
        p { color: #b0bec5; font-size: 1.2rem; }
        .icon { font-size: 5rem; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">🔒</div>
        <h1>Access Denied</h1>
        <p>This application is only accessible via the Junlin Hours mobile app.</p>
        <p>Please download the app to continue.</p>
    </div>
</body>
</html>
`;

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Junlin-App-Key, X-API-Key, X-API-Secret');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Check for app secret header (skip for API proxy which has its own auth)
    const appKey = req.headers['x-junlin-app-key'];
    const isApiRequest = pathname.startsWith('/api/');

    if (!isApiRequest && appKey !== APP_SECRET) {
        res.writeHead(403, { 'Content-Type': 'text/html' });
        res.end(ACCESS_DENIED_HTML);
        return;
    }

    // Proxy API requests to ERPNext
    if (pathname.startsWith('/api/proxy')) {
        const targetUrl = parsedUrl.query.url;
        const apiKey = req.headers['x-api-key'];
        const apiSecret = req.headers['x-api-secret'];

        if (!targetUrl) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing url parameter' }));
            return;
        }

        try {
            const proxyUrl = new URL(targetUrl);
            const options = {
                hostname: proxyUrl.hostname,
                port: proxyUrl.port || 443,
                path: proxyUrl.pathname + proxyUrl.search,
                method: 'GET',
                headers: {
                    'Authorization': `token ${apiKey}:${apiSecret}`,
                    'Content-Type': 'application/json'
                }
            };

            const proxyReq = https.request(options, (proxyRes) => {
                let data = '';
                proxyRes.on('data', chunk => data += chunk);
                proxyRes.on('end', () => {
                    res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
                    res.end(data);
                });
            });

            proxyReq.on('error', (error) => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            });

            proxyReq.end();
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
        return;
    }

    // Serve static files
    let filePath = pathname === '/' ? '/index.html' : pathname;
    filePath = path.join(__dirname, filePath);

    const extname = path.extname(filePath);
    const contentTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.ico': 'image/x-icon'
    };

    const contentType = contentTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 ERPNext Hours Calculator Server`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📍 Server running on port ${PORT}`);
    console.log(`🔒 App-only access enabled`);
    console.log(`\nPress Ctrl+C to stop the server\n`);
});
