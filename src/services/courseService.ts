import { Course } from "../types/models"

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-production-backend.com/api'
  : 'http://localhost:5001/api';

class CourseService {
  async getAllCourses(): Promise<Course[]> {
    const response = await fetch(`${API_BASE_URL}/courses`)
    if (!response.ok) throw new Error('Failed to fetch courses')
    return response.json()
  }

  async getCourseById(id: string): Promise<Course | null> {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`)
    if (!response.ok) return null
    return response.json()
  }

  async createCourse(course: Omit<Course, "courseId">): Promise<Course> {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    })
    if (!response.ok) throw new Error('Failed to create course')
    return response.json()
  }

  async updateCourse(id: string, course: Partial<Course>): Promise<Course> {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    })
    if (!response.ok) throw new Error('Failed to update course')
    return response.json()
  }

  async deleteCourse(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete course')
  }
}

export const courseService = new CourseService(); 