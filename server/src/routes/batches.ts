import express from "express"
import pool from "../config/db"
import { BatchStatus, Branch } from "../types/models"
import { v4 as uuidv4 } from "uuid"

const router = express.Router()

// Get all batches
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM batches")
    res.json(rows)
  } catch (err) {
    console.error("Error fetching batches:", err)
    res.status(500).send("Server error")
  }
})

// Get batch by code
router.get("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await pool.query("SELECT * FROM batches WHERE batchCode = ?", [id])
    if ((rows as any).length === 0) {
      return res.status(404).send("Batch not found")
    }
    res.json((rows as any)[0])
  } catch (err) {
    console.error(`Error fetching batch with code ${id}:`, err)
    res.status(500).send("Server error")
  }
})

// Create new batch
router.post("/", async (req, res) => {
  const { batchCode, branch, courseName, lecturer, coordinator, plannedDate, startDate, lockedDate, status } = req.body

  if (!batchCode || !branch || !courseName || !lecturer || !coordinator || !plannedDate || !status) {
    return res.status(400).send("Missing required fields")
  }

  try {
    // Check for unique batchCode
    const [existingBatches] = await pool.query("SELECT batchCode FROM batches WHERE batchCode = ?", [batchCode])
    if ((existingBatches as any).length > 0) {
      return res.status(409).send("Batch code already exists")
    }

    await pool.query(
      "INSERT INTO batches (batchCode, branch, courseName, lecturer, coordinator, plannedDate, startDate, lockedDate, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [batchCode, branch, courseName, lecturer, coordinator, new Date(plannedDate), startDate ? new Date(startDate) : null, lockedDate ? new Date(lockedDate) : null, status]
    )

    const [newBatchRows] = await pool.query(
      "SELECT * FROM batches WHERE batchCode = ?",
      [batchCode]
    )

    res.status(201).json((newBatchRows as any)[0])
  } catch (err) {
    console.error("Error creating batch:", err)
    res.status(500).send("Server error")
  }
})

// Update batch
router.put("/:id", async (req, res) => {
  const { id } = req.params
  const { branch, courseName, lecturer, coordinator, plannedDate, startDate, lockedDate, status } = req.body

  try {
    const [result] = await pool.query(
      "UPDATE batches SET branch = ?, courseName = ?, lecturer = ?, coordinator = ?, plannedDate = ?, startDate = ?, lockedDate = ?, status = ? WHERE batchCode = ?",
      [branch, courseName, lecturer, coordinator, new Date(plannedDate), startDate ? new Date(startDate) : null, lockedDate ? new Date(lockedDate) : null, status, id]
    )

    if ((result as any).affectedRows === 0) {
      return res.status(404).send("Batch not found")
    }

    const [updatedBatchRows] = await pool.query(
      "SELECT * FROM batches WHERE batchCode = ?",
      [id]
    )
    res.json((updatedBatchRows as any)[0])
  } catch (err) {
    console.error(`Error updating batch with code ${id}:`, err)
    res.status(500).send("Server error")
  }
})

// Delete batch
router.delete("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const [result] = await pool.query("DELETE FROM batches WHERE batchCode = ?", [id])

    if ((result as any).affectedRows === 0) {
      return res.status(404).send("Batch not found")
    }
    res.status(204).send()
  } catch (err) {
    console.error(`Error deleting batch with code ${id}:`, err)
    res.status(500).send("Server error")
  }
})

export default router 