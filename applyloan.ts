import * as http from 'http'
import { type IncomingMessage, type ServerResponse } from 'node:http'
import * as fs from 'fs/promises'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function handleRequest (request: IncomingMessage, response: ServerResponse) {
  const url = request.url
  const method = request.method

  console.log('Debugging -- url is', url, 'while method is', method)

  if (url === '/applyloan') {
    fs.readFile('applyloan.html', 'utf8')
      .then(contents => {
        response.writeHead(200, { 'Content-Type': 'text/html' })
        response.end(contents)
      })
      .catch(error => {
        console.error('Error reading file:', error)
        response.writeHead(500, { 'Content-Type': 'text/plain' })
        response.end('Internal Server Error')
      })
  } else {
    response
      // 200 tells the browser the response is successful, memorize the common ones: 200, 401, 403, 404, 500
      // see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      .writeHead(200)
      .end('Knock knock' + url)
  }
}

const server = http.createServer(handleRequest)

server.listen(3002, () => {
  console.log('Server started at http://localhost:3002 ')
})
