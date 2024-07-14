// Create web server
// 1. Create a web server
// 2. Read and parse comments from comments.json
// 3. Serve comments on GET /comments
// 4. Add a new comment on POST /comments

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer((req, res) => {
    const { pathname, query } = url.parse(req.url, true);
    console.log(pathname, query);

    if (pathname === '/comments' && req.method === 'GET') {
        fs.readFile(path.join(__dirname, 'comments.json'), 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Internal server error');
            } else {
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                res.end(data);
            }
        });
    } else if (pathname === '/comments' && req.method === 'POST') {
        let body = '';
        req.on('data', data => {
            body += data.toString();
        });
        req.on('end', () => {
            const comments = require('./comments.json');
            comments.push(JSON.parse(body));
            fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments, null, 2), err => {
                if (err) {
                    res.writeHead(500);
                    res.end('Internal server error');
                } else {
                    res.writeHead(201);
                    res.end('Comment added');
                }
            });
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
