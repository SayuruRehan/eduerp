import { Employee } from "../types/models"
import pool from "../config/db"
import { Router, Request, Response } from 'express'

const router = Router()

// Get all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      "SELECT employeeId, empName, role, dateJoined, email, contactNumber FROM employees"
    )
    res.json(rows as Employee[])
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ message: "Failed to fetch users" })
  }
})

// Get user by ID
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params
  try {
    const [rows] = await pool.query(
      "SELECT employeeId, empName, role, dateJoined, email, contactNumber FROM employees WHERE employeeId = ?",
      [id]
    )
    const employees = rows as Employee[]
    if (employees.length > 0) {
      res.json(employees[0])
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({ message: "Failed to fetch user" })
  }
})

// Create user
router.post('/', async (req: Request<{}, {}, Omit<Employee, "dateJoined">, {}>, res: Response) => {
  let user: Omit<Employee, "dateJoined"> = req.body
  try {
    // Get the highest employeeId and generate a new one
    const [rows] = await pool.query(
      "SELECT employeeId FROM employees ORDER BY employeeId DESC LIMIT 1"
    )
    const employees = rows as Employee[]
    let nextEmployeeNum = 1
    if (employees.length > 0) {
      const lastId = employees[0].employeeId
      const lastNum = parseInt(lastId.replace('EMP', ''))
      nextEmployeeNum = lastNum + 1
    }
    const newEmployeeId = `EMP${nextEmployeeNum.toString().padStart(3, '0')}`;

    // Add the generated employeeId to the user object
    user = { ...user, employeeId: newEmployeeId };

    const [result] = await pool.query(
      "INSERT INTO employees (employeeId, empName, role, email, password, contactNumber) VALUES (?, ?, ?, ?, ?, ?)",
      [user.employeeId, user.empName, user.role, user.email, user.password, user.contactNumber]
    )
    const [insertedRows] = await pool.query(
      "SELECT employeeId, empName, role, dateJoined, email, contactNumber FROM employees WHERE employeeId = ?",
      [newEmployeeId]
    )
    res.status(201).json((insertedRows as Employee[])[0])
  } catch (error) {
    console.error("Error creating user:", error)
    res.status(500).json({ message: "Failed to create user" })
  }
})

// Update user
router.put('/:id', async (req: Request<{ id: string }, {}, Partial<Employee>>, res: Response) => {
  const { id } = req.params
  const user: Partial<Employee> = req.body
  try {
    const updates = Object.entries(user)
      .filter(([_, value]) => value !== undefined)
      .map(([key]) => `${key} = ?`)
      .join(", ")
    const values = Object.entries(user)
      .filter(([_, value]) => value !== undefined)
      .map(([_, value]) => value)

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" })
    }

    await pool.query(
      `UPDATE employees SET ${updates} WHERE employeeId = ?`,
      [...values, id]
    )
    const [rows] = await pool.query(
      "SELECT employeeId, empName, role, dateJoined, email, contactNumber FROM employees WHERE employeeId = ?",
      [id]
    )
    res.json((rows as Employee[])[0])
  } catch (error) {
    console.error("Error updating user:", error)
    res.status(500).json({ message: "Failed to update user" })
  }
})

// Delete user
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params
  try {
    await pool.query("DELETE FROM employees WHERE employeeId = ?", [id])
    res.status(204).send()
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({ message: "Failed to delete user" })
  }
})

export default router 