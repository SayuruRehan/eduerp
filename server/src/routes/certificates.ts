import { Router, Request, Response } from 'express'
import pool from '../config/db'

const router = Router()

// Get all certificates
router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM certificates')
    const certificates = (rows as any[]).map(row => ({
      ...row,
      issueDate: new Date(row.issueDate).toISOString().split('T')[0],
    }))
    res.json(certificates)
  } catch (error) {
    console.error('Error fetching certificates:', error)
    res.status(500).json({ message: 'Failed to fetch certificates' })
  }
})

// Get certificate by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM certificates WHERE certificateId = ?', [req.params.id])
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ message: 'Certificate not found' })
    }
    const certificate = {
      ...(rows as any[])[0],
      issueDate: new Date((rows as any[])[0].issueDate).toISOString().split('T')[0],
    }
    res.json(certificate)
  } catch (error) {
    console.error('Error fetching certificate:', error)
    res.status(500).json({ message: 'Failed to fetch certificate' })
  }
})

// Create new certificate
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      studentId,
      studentName,
      courseId,
      courseName,
      batchCode,
      issueDate,
      certificateNumber,
      status,
      remarks,
    } = req.body

    // Generate certificate ID
    const [result] = await pool.query('SELECT MAX(CAST(SUBSTRING(certificateId, 4) AS UNSIGNED)) as maxNum FROM certificates')
    const maxNum = (result as any[])[0].maxNum || 0
    const newCertificateId = `CERT${(maxNum + 1).toString().padStart(3, '0')}`

    await pool.query(
      'INSERT INTO certificates (certificateId, studentId, studentName, courseId, courseName, batchCode, issueDate, certificateNumber, status, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [newCertificateId, studentId, studentName, courseId, courseName, batchCode, new Date(issueDate).toISOString().split('T')[0], certificateNumber, status, remarks]
    )

    const [newCertificate] = await pool.query('SELECT * FROM certificates WHERE certificateId = ?', [newCertificateId])
    res.status(201).json({
      ...(newCertificate as any[])[0],
      issueDate: new Date((newCertificate as any[])[0].issueDate).toISOString().split('T')[0],
    })
  } catch (error) {
    console.error('Error creating certificate:', error)
    res.status(500).json({ message: 'Failed to create certificate' })
  }
})

// Update certificate
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const {
      studentId,
      studentName,
      courseId,
      courseName,
      batchCode,
      issueDate,
      certificateNumber,
      status,
      remarks,
    } = req.body

    await pool.query(
      'UPDATE certificates SET studentId = ?, studentName = ?, courseId = ?, courseName = ?, batchCode = ?, issueDate = ?, certificateNumber = ?, status = ?, remarks = ? WHERE certificateId = ?',
      [studentId, studentName, courseId, courseName, batchCode, new Date(issueDate).toISOString().split('T')[0], certificateNumber, status, remarks, req.params.id]
    )

    const [updatedCertificate] = await pool.query('SELECT * FROM certificates WHERE certificateId = ?', [req.params.id])
    if ((updatedCertificate as any[]).length === 0) {
      return res.status(404).json({ message: 'Certificate not found' })
    }

    res.json({
      ...(updatedCertificate as any[])[0],
      issueDate: new Date((updatedCertificate as any[])[0].issueDate).toISOString().split('T')[0],
    })
  } catch (error) {
    console.error('Error updating certificate:', error)
    res.status(500).json({ message: 'Failed to update certificate' })
  }
})

// Delete certificate
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query('DELETE FROM certificates WHERE certificateId = ?', [req.params.id])
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Certificate not found' })
    }
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting certificate:', error)
    res.status(500).json({ message: 'Failed to delete certificate' })
  }
})

export default router 