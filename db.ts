import { Pool } from 'pg'

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  password: 'bambam073004',
  database: 'postgres',
  port: 5432
})

// Interface for the loan application data
interface LoanApplication {
  name: string
  email: string
  phone_number: number
  loan_amount: number
  loan_reason: string
  loan_status: string
  unique_token: string
  approval_rejection_date?: Date
  cash_release_date?: Date
  repayment_date?: Date
}

// Function to save the loan application data to the database
export async function saveLoanApplication (
  applicationData: LoanApplication
): Promise<void> {
  try {
    // SQL query to insert the application data into the loans table
    const query = `
            INSERT INTO loans (name, email, phone_number, loan_amount, loan_reason, loan_status, unique_token) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *;
        `

    // Execute the SQL query with applicationData values
    const values = await pool.query(query, [
      applicationData.name,
      applicationData.email,
      applicationData.phone_number,
      applicationData.loan_amount,
      applicationData.loan_reason,
      applicationData.loan_status,
      applicationData.unique_token
    ])

    // Log the inserted row (if needed)
    console.log('Inserted row:', values)
  } catch (error) {
    // Handle errors (log them and throw if necessary)
    console.error('Error saving loan application:', error)
    throw error
  }
}

export async function getLoanApplicationByToken (
  token: string
): Promise<LoanApplication | null> {
  try {
    const client = await pool.connect()
    const query = 'SELECT * FROM loans WHERE unique_token = $1;'
    const { rows } = await client.query(query, [token])

    client.release()

    return rows.length > 0 ? rows[0] : null
  } catch (error) {
    console.error('Error fetching loan application:', error)
    throw error
  }
}

// Export the function for external use
// export { saveLoanApplication }
export type { LoanApplication }
export { pool }
