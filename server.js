const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const dataFile = path.join(__dirname, 'data.json');
const publicDir = path.join(__dirname, 'public');

function readProducts() {
    try {
        const data = fs.readFileSync(dataFile, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

function writeProducts(products) {
    fs.writeFileSync(dataFile, JSON.stringify(products, null, 2));
}

const server = http.createServer((req, res) => {
    if (req.url.startsWith('/api/products')) {
        if (req.method === 'GET') {
            const products = readProducts();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(products));
        } else if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                try {
                    const product = JSON.parse(body);
                    const products = readProducts();
                    products.push(product);
                    writeProducts(products);
                    res.statusCode = 201;
                    res.end('created');
                } catch (err) {
                    res.statusCode = 400;
                    res.end('invalid');
                }
            });
        } else {
            res.statusCode = 405;
            res.end();
        }
    } else {
        // serve static files
        let filePath = req.url === '/' ? '/index.html' : req.url;
        const absPath = path.join(publicDir, filePath);
        fs.readFile(absPath, (err, data) => {
            if (err) {
                res.statusCode = 404;
                res.end('Not found');
            } else {
                if (filePath.endsWith('.html')) res.setHeader('Content-Type', 'text/html');
                if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
                if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
                res.end(data);
            }
        });
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
