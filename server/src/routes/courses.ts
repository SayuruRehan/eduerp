import { Router, Request, Response } from 'express'
import pool from '../config/db'

const router = Router()

// Get all courses
router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM courses')
    const courses = (rows as any[]).map(row => ({
      ...row,
      courseFee: parseFloat(row.courseFee),
    }))
    res.json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    res.status(500).json({ message: 'Failed to fetch courses' })
  }
})

// Get course by ID
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params
  try {
    const [rows] = await pool.query('SELECT * FROM courses WHERE courseId = ?', [id])
    if ((rows as any[]).length > 0) {
      const course = (rows as any[])[0]
      res.json({
        ...course,
        courseFee: parseFloat(course.courseFee),
      })
    } else {
      res.status(404).json({ message: 'Course not found' })
    }
  } catch (error) {
    console.error('Error fetching course:', error)
    res.status(500).json({ message: 'Failed to fetch course' })
  }
})

// Create course
router.post('/', async (req: Request, res: Response) => {
  const { courseName, category, courseFee, duration } = req.body
  try {
    // Generate new courseId
    const [rows] = await pool.query('SELECT courseId FROM courses ORDER BY courseId DESC LIMIT 1')
    let nextNum = 1
    if ((rows as any[]).length > 0) {
      const lastId = (rows as any[])[0].courseId
      const lastNum = parseInt(lastId.replace('COURSE', ''))
      nextNum = lastNum + 1
    }
    const newCourseId = `COURSE${nextNum.toString().padStart(3, '0')}`
    await pool.query(
      'INSERT INTO courses (courseId, courseName, category, courseFee, duration) VALUES (?, ?, ?, ?, ?)',
      [newCourseId, courseName, category, courseFee, duration]
    )
    const [insertedRows] = await pool.query('SELECT * FROM courses WHERE courseId = ?', [newCourseId])
    res.status(201).json((insertedRows as any[])[0])
  } catch (error) {
    console.error('Error creating course:', error)
    res.status(500).json({ message: 'Failed to create course' })
  }
})

// Update course
router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params
  const updates = req.body
  try {
    await pool.query('UPDATE courses SET ? WHERE courseId = ?', [updates, id])
    const [updatedRows] = await pool.query('SELECT * FROM courses WHERE courseId = ?', [id])
    if ((updatedRows as any[]).length > 0) {
      res.json((updatedRows as any[])[0])
    } else {
      res.status(404).json({ message: 'Course not found' })
    }
  } catch (error) {
    console.error('Error updating course:', error)
    res.status(500).json({ message: 'Failed to update course' })
  }
})

// Delete course
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM courses WHERE courseId = ?', [id])
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting course:', error)
    res.status(500).json({ message: 'Failed to delete course' })
  }
})

export default router; 