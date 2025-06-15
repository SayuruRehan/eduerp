import express from "express"
import pool from "../config/db"
import { RegistrationStatus, Registration, Branch } from "../types/models"
import { v4 as uuidv4 } from "uuid"

const router = express.Router()

// Get all registrations
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM registrations")
    res.json(rows)
  } catch (err) {
    console.error("Error fetching registrations:", err)
    res.status(500).send("Server error")
  }
})

// Get registration by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await pool.query("SELECT * FROM registrations WHERE registrationId = ?", [id])
    if ((rows as any).length === 0) {
      return res.status(404).send("Registration not found")
    }
    res.json((rows as any)[0])
  } catch (err) {
    console.error(`Error fetching registration with ID ${id}:`, err)
    res.status(500).send("Server error")
  }
})

// Create new registration
router.post("/", async (req, res) => {
  const { studentName, courseId, courseName, batchCode, branch, paymentType, paymentMethod, status, studentCounselor } = req.body
  const registrationId = uuidv4().slice(0, 10).toUpperCase() // Generate a short UUID

  if (!studentName || !courseId || !courseName || !batchCode || !branch || !paymentType || !paymentMethod || !status || !studentCounselor) {
    return res.status(400).send("Missing required fields")
  }

  try {
    await pool.query(
      "INSERT INTO registrations (registrationId, studentName, courseId, courseName, batchCode, branch, paymentType, paymentMethod, status, studentCounselor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [registrationId, studentName, courseId, courseName, batchCode, branch, paymentType, paymentMethod, status, studentCounselor]
    )

    const [newRegistrationRows] = await pool.query(
      "SELECT * FROM registrations WHERE registrationId = ?",
      [registrationId]
    )

    res.status(201).json((newRegistrationRows as any)[0])
  } catch (err) {
    console.error("Error creating registration:", err)
    res.status(500).send("Server error")
  }
})

// Update registration
router.put("/:id", async (req, res) => {
  const { id } = req.params
  const { studentName, courseId, courseName, batchCode, branch, paymentType, paymentMethod, status, studentCounselor } = req.body

  try {
    const [result] = await pool.query(
      "UPDATE registrations SET studentName = ?, courseId = ?, courseName = ?, batchCode = ?, branch = ?, paymentType = ?, paymentMethod = ?, status = ?, studentCounselor = ? WHERE registrationId = ?",
      [studentName, courseId, courseName, batchCode, branch, paymentType, paymentMethod, status, studentCounselor, id]
    )

    if ((result as any).affectedRows === 0) {
      return res.status(404).send("Registration not found")
    }

    const [updatedRegistrationRows] = await pool.query(
      "SELECT * FROM registrations WHERE registrationId = ?",
      [id]
    )
    res.json((updatedRegistrationRows as any)[0])
  } catch (err) {
    console.error(`Error updating registration with ID ${id}:`, err)
    res.status(500).send("Server error")
  }
})

// Delete registration
router.delete("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const [result] = await pool.query("DELETE FROM registrations WHERE registrationId = ?", [id])

    if ((result as any).affectedRows === 0) {
      return res.status(404).send("Registration not found")
    }
    res.status(204).send()
  } catch (err) {
    console.error(`Error deleting registration with ID ${id}:`, err)
    res.status(500).send("Server error")
  }
})

export default router 