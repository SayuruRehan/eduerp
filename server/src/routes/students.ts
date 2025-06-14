import { Student } from "../types/models"
import pool from "../config/db"
import { Router, Request, Response } from 'express'

const router = Router()

// Get all students
router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM students"
    )
    res.json(rows as Student[])
  } catch (error) {
    console.error("Error fetching students:", error)
    res.status(500).json({ message: "Failed to fetch students" })
  }
})

// Get student by ID
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params
  try {
    const [rows] = await pool.query(
      "SELECT * FROM students WHERE studentId = ?",
      [id]
    )
    const students = rows as Student[]
    if (students.length > 0) {
      res.json(students[0])
    } else {
      res.status(404).json({ message: "Student not found" })
    }
  } catch (error) {
    console.error("Error fetching student:", error)
    res.status(500).json({ message: "Failed to fetch student" })
  }
})

// Create student
router.post('/', async (req: Request<{}, {}, Omit<Student, "studentId" | "paymentDue" | "status">>, res: Response) => {
  let student: Omit<Student, "studentId" | "paymentDue" | "status"> = req.body
  try {
    console.log("Creating student with data:", student)

    // Validate required fields
    if (!student.name || !student.nic || !student.email || !student.address || !student.whatsappNumber) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Get the highest studentId and generate a new one
    const [rows] = await pool.query(
      "SELECT studentId FROM students ORDER BY studentId DESC LIMIT 1"
    )
    const students = rows as Student[]
    let nextStudentNum = 1
    if (students.length > 0) {
      const lastId = students[0].studentId
      const lastNum = parseInt(lastId.replace('STU', ''))
      nextStudentNum = lastNum + 1
    }
    const newStudentId = `STU${nextStudentNum.toString().padStart(3, '0')}`;

    // Add the generated studentId to the student object
    const newStudent = {
      ...student,
      studentId: newStudentId,
      paymentDue: 0,
      status: 'Active'
    };

    console.log("Inserting new student:", newStudent)

    const [result] = await pool.query(
      "INSERT INTO students (studentId, name, nic, email, address, whatsappNumber, paymentDue, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [newStudent.studentId, newStudent.name, newStudent.nic, newStudent.email, newStudent.address, newStudent.whatsappNumber, newStudent.paymentDue, newStudent.status]
    )
    const [insertedRows] = await pool.query(
      "SELECT * FROM students WHERE studentId = ?",
      [newStudentId]
    )
    console.log("Student created successfully:", (insertedRows as Student[])[0])
    res.status(201).json((insertedRows as Student[])[0])
  } catch (error) {
    console.error("Error creating student:", error)
    if (error instanceof Error) {
      if (error.message.includes('Duplicate entry')) {
        return res.status(400).json({ message: "A student with this email or NIC already exists" })
      }
    }
    res.status(500).json({ message: "Failed to create student" })
  }
})

// Update student
router.put('/:id', async (req: Request<{ id: string }, {}, Partial<Student>>, res: Response) => {
  const { id } = req.params
  const student: Partial<Student> = req.body
  try {
    const updates = Object.entries(student)
      .filter(([_, value]) => value !== undefined)
      .map(([key]) => `${key} = ?`)
      .join(", ")
    const values = Object.entries(student)
      .filter(([_, value]) => value !== undefined)
      .map(([_, value]) => value)

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" })
    }

    await pool.query(
      `UPDATE students SET ${updates} WHERE studentId = ?`,
      [...values, id]
    )
    const [rows] = await pool.query(
      "SELECT * FROM students WHERE studentId = ?",
      [id]
    )
    res.json((rows as Student[])[0])
  } catch (error) {
    console.error("Error updating student:", error)
    res.status(500).json({ message: "Failed to update student" })
  }
})

// Delete student
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params
  try {
    await pool.query("DELETE FROM students WHERE studentId = ?", [id])
    res.status(204).send()
  } catch (error) {
    console.error("Error deleting student:", error)
    res.status(500).json({ message: "Failed to delete student" })
  }
})

export default router; 