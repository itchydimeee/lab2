import * as http from 'http'
import { type IncomingMessage, type ServerResponse } from 'node:http'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function handleRequest (request: IncomingMessage, response: ServerResponse) {
  const url = request.url
  const method = request.method

  console.log('Debugging -- url is', url, 'while method is', method)
  response
    // 200 tells the browser the response is successful, memorize the common ones: 200, 401, 403, 404, 500
    // see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    .writeHead(200)
    .end('Knock knock' + url)
}

const server = http.createServer(handleRequest)

server.listen(3001, () => {
  console.log('Server started at http://localhost:3001')
})
