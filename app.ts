import http, { type IncomingMessage, type ServerResponse } from 'http'
import fs from 'fs/promises'
import { URLSearchParams } from 'url'
import crypto from 'crypto'
import {
  saveLoanApplication,
  type LoanApplication,
  getLoanApplicationByToken
} from './db'

function createToken (): string {
  return crypto.randomBytes(32).toString('base64url')
}

async function processForm (request: IncomingMessage): Promise<URLSearchParams> {
  return await new Promise((resolve, reject) => {
    let body = ''
    request.on('data', chunk => {
      body += chunk.toString()
    })
    request.on('end', () => {
      const formData = new URLSearchParams(body)
      resolve(formData)
    })
    request.on('error', error => {
      reject(error)
    })
  })
}

async function handleRequest (
  request: IncomingMessage,
  response: ServerResponse
): Promise<void> {
  const url = request.url
  const method = request.method

  if (url === '/apply-loan') {
    const contents = await fs.readFile('./applyloan.html', 'utf8')
    response.writeHead(200, { 'Content-Type': 'text/html' }).end(contents)
  } else if (url === '/apply-loan-success' && method === 'POST') {
    try {
      const formData = await processForm(request)

      const applicationData: LoanApplication = {
        name: formData.get('username') ?? '',
        email: formData.get('email') ?? '',
        phone_number: parseInt(formData.get('phoneNum') ?? '0', 10),
        loan_amount: parseInt(formData.get('loanAmount') ?? '0', 10),
        loan_reason: formData.get('reason') ?? '',
        loan_status: 'APPLIED',
        unique_token: createToken()
      }

      await saveLoanApplication(applicationData)
      response
        .writeHead(200, { 'Content-Type': 'text/plain' })
        .end('Loan application successful!')
    } catch (error) {
      console.error('Error:', error)
      response
        .writeHead(500, { 'Content-Type': 'text/html' })
        .end('Error')
    }
  } else {
    if (url != null && url.includes('/')) {
      const urlParts = url.split('/')
      const uniqueToken = urlParts[urlParts.length - 1]
      try {
        const loanApplication = await getLoanApplicationByToken(uniqueToken)

        if (loanApplication != null) {
          const html = `
              <!DOCTYPE html>
              <html lang="en">
    
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Loan Application Details</title>
              </head>
    
              <body>
                <h1>Loan Application Details</h1>
                <p>Name: ${loanApplication.name}</p>
                <p>Email: ${loanApplication.email}</p>
                <p>Phone Number: ${loanApplication.phone_number}</p>
                <p>Loan Amount: ${loanApplication.loan_amount}</p>
                <p>Loan Reason: ${loanApplication.loan_reason}</p>
                <p>Loan Status: ${loanApplication.loan_status}</p>
                <p>Unique Token: ${loanApplication.unique_token}</p>
              </body>
    
              </html>
            `

          response.writeHead(200, { 'Content-Type': 'text/html' }).end(html)
        } else {
          response
            .writeHead(404, { 'Content-Type': 'text/html' })
            .end('You sent me: ' + url)
        }
      } catch (error) {
        console.error('Error:', error)
        response
          .writeHead(500, { 'Content-Type': 'text/html' })
          .end('Error')
      }
    } else {
      response
        .writeHead(400, { 'Content-Type': 'text/html' })
        .end('Error')
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = http.createServer(handleRequest)

server.listen(3000, () => {
  console.log('Server started at http://localhost:3000')
})
