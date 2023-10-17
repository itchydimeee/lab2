"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var fs = require("fs/promises");
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function handleRequest(request, response) {
    var url = request.url;
    var method = request.method;
    console.log('Debugging -- url is', url, 'while method is', method);
    if (url === '/applyloan') {
        fs.readFile('applyloan.html', 'utf8')
            .then(function (contents) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(contents);
        })
            .catch(function (error) {
            console.error('Error reading file:', error);
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('Internal Server Error');
        });
    }
    else {
        response
            // 200 tells the browser the response is successful, memorize the common ones: 200, 401, 403, 404, 500
            // see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
            .writeHead(200)
            .end('Knock knock' + url);
    }
}
var server = http.createServer(handleRequest);
server.listen(3002, function () {
    console.log('Server started at http://localhost:3002 ');
});
