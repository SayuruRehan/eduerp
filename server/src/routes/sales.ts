import { Sale } from "../types/models"
import pool from "../config/db"
import { Router, Request, Response } from 'express'
import multer from 'multer'
import csv from 'csv-parse'
import { Readable } from 'stream'

// Extend Express Request type to include file property
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

// Get all sales
router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM sales"
    )
    const sales = (rows as any[]).map(row => ({
      ...row,
      amount: parseFloat(row.amount),
    }))
    res.json(sales)
  } catch (error) {
    console.error("Error fetching sales:", error)
    res.status(500).json({ message: "Failed to fetch sales" })
  }
})

// Get sale by ID
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params
  try {
    const [rows] = await pool.query(
      "SELECT * FROM sales WHERE saleId = ?",
      [id]
    )
    const sales = rows as Sale[]
    if (sales.length > 0) {
      const sale = sales[0]
      res.json({
        ...sale,
        amount: parseFloat(sale.amount as any),
      })
    } else {
      res.status(404).json({ message: "Sale not found" })
    }
  } catch (error) {
    console.error("Error fetching sale:", error)
    res.status(500).json({ message: "Failed to fetch sale" })
  }
})

// Create sale
router.post('/', async (req: Request<{}, {}, Omit<Sale, "saleId">>, res: Response) => {
  const saleData = req.body
  try {
    // Get the highest saleId and generate a new one
    const [rows] = await pool.query(
      "SELECT saleId FROM sales ORDER BY saleId DESC LIMIT 1"
    )
    const sales = rows as Sale[]
    let nextSaleNum = 1
    if (sales.length > 0) {
      const lastId = sales[0].saleId
      const lastNum = parseInt(lastId.replace('SALE', ''))
      nextSaleNum = lastNum + 1
    }
    const newSaleId = `SALE${nextSaleNum.toString().padStart(3, '0')}`

    // Convert saleDate to MySQL DATETIME format
    function toMySQLDateTime(date: string | Date): string {
      const d = new Date(date)
      const pad = (n: number) => n.toString().padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    }
    const saleDateMySQL = toMySQLDateTime(saleData.saleDate)

    const [result] = await pool.query(
      "INSERT INTO sales (saleId, studentName, courseId, courseName, amount, paymentMethod, paymentStatus, saleDate, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        newSaleId,
        saleData.studentName,
        saleData.courseId,
        saleData.courseName,
        saleData.amount,
        saleData.paymentMethod,
        saleData.paymentStatus,
        saleDateMySQL,
        saleData.notes || null
      ]
    )

    const [insertedRows] = await pool.query(
      "SELECT * FROM sales WHERE saleId = ?",
      [newSaleId]
    )
    res.status(201).json((insertedRows as Sale[])[0])
  } catch (error) {
    console.error("Error creating sale:", error)
    res.status(500).json({ message: "Failed to create sale" })
  }
})

// Update sale
router.put('/:id', async (req: Request<{ id: string }, {}, Partial<Sale>>, res: Response) => {
  const { id } = req.params
  const updates = req.body
  try {
    const fieldsToUpdate: { [key: string]: any } = { ...updates }

    // Convert saleDate to MySQL DATETIME format if present
    if (fieldsToUpdate.saleDate) {
      function toMySQLDateTime(date: string | Date): string {
        const d = new Date(date)
        const pad = (n: number) => n.toString().padStart(2, '0')
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
      }
      fieldsToUpdate.saleDate = toMySQLDateTime(fieldsToUpdate.saleDate)
    }

    // Parse amount to float if present
    if (fieldsToUpdate.amount) {
      fieldsToUpdate.amount = parseFloat(fieldsToUpdate.amount as any)
    }

    const [result] = await pool.query(
      "UPDATE sales SET ? WHERE saleId = ?",
      [fieldsToUpdate, id]
    )
    const [updatedRows] = await pool.query(
      "SELECT * FROM sales WHERE saleId = ?",
      [id]
    )
    const sales = updatedRows as Sale[]
    if (sales.length > 0) {
      res.json(sales[0])
    } else {
      res.status(404).json({ message: "Sale not found" })
    }
  } catch (error) {
    console.error("Error updating sale:", error)
    res.status(500).json({ message: "Failed to update sale" })
  }
})

// Delete sale
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params
  try {
    await pool.query("DELETE FROM sales WHERE saleId = ?", [id])
    res.status(204).send()
  } catch (error) {
    console.error("Error deleting sale:", error)
    res.status(500).json({ message: "Failed to delete sale" })
  }
})

// Import sales from CSV
router.post('/import', upload.single('file'), async (req: Request & { file?: Express.Multer.File }, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" })
  }

  const results: { success: number; failed: number; errors: string[] } = {
    success: 0,
    failed: 0,
    errors: []
  }

  const parser = csv.parse({
    columns: true,
    skip_empty_lines: true,
    trim: true
  })

  const readable = Readable.from(req.file.buffer)
  const records: any[] = []

  try {
    for await (const record of readable.pipe(parser)) {
      records.push(record)
    }

    // Get the highest saleId to generate new IDs
    const [rows] = await pool.query(
      "SELECT saleId FROM sales ORDER BY saleId DESC LIMIT 1"
    )
    const sales = rows as Sale[]
    let nextSaleNum = 1
    if (sales.length > 0) {
      const lastId = sales[0].saleId
      const lastNum = parseInt(lastId.replace('SALE', ''))
      nextSaleNum = lastNum + 1
    }

    // Process each record
    for (const record of records) {
      try {
        const newSaleId = `SALE${nextSaleNum.toString().padStart(3, '0')}`
        nextSaleNum++

        // Validate required fields
        if (!record.studentName || !record.courseId || !record.courseName || 
            !record.amount || !record.paymentMethod || !record.paymentStatus || !record.saleDate) {
          throw new Error("Missing required fields")
        }

        // Convert saleDate to MySQL DATETIME format
        const saleDate = new Date(record.saleDate)
        if (isNaN(saleDate.getTime())) {
          throw new Error("Invalid date format")
        }

        const saleDateMySQL = saleDate.toISOString().slice(0, 19).replace('T', ' ')

        // Insert the record
        await pool.query(
          "INSERT INTO sales (saleId, studentName, courseId, courseName, amount, paymentMethod, paymentStatus, saleDate, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            newSaleId,
            record.studentName,
            record.courseId,
            record.courseName,
            parseFloat(record.amount),
            record.paymentMethod,
            record.paymentStatus,
            saleDateMySQL,
            record.notes || null
          ]
        )

        results.success++
      } catch (error) {
        results.failed++
        results.errors.push(`Row ${nextSaleNum}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    res.json(results)
  } catch (error) {
    console.error("Error processing CSV:", error)
    res.status(500).json({ message: "Failed to process CSV file" })
  }
})

export default router 