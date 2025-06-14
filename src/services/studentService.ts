import { Student } from "../types/models"

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-production-backend.com/api'
  : 'http://localhost:5001/api';

class StudentService {
  async getAllStudents(): Promise<Student[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/students`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data as Student[];
    } catch (error) {
      console.error("Error fetching students:", error);
      throw new Error("Failed to fetch students. Please check your backend server.");
    }
  }

  async getStudentById(id: string): Promise<Student | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data as Student;
    } catch (error) {
      console.error("Error fetching student:", error);
      throw new Error("Failed to fetch student. Please check your backend server.");
    }
  }

  async createStudent(student: Omit<Student, "studentId" | "paymentDue" | "status">): Promise<Student> {
    try {
      console.log("Creating student:", student)
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      console.log("Student created successfully:", data)
      return data as Student;
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    }
  }

  async updateStudent(id: string, student: Partial<Student>): Promise<Student> {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data as Student;
    } catch (error) {
      console.error("Error updating student:", error);
      throw new Error("Failed to update student. Please check your backend server.");
    }
  }

  async deleteStudent(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      throw new Error("Failed to delete student. Please check your backend server.");
    }
  }
}

export const studentService = new StudentService(); 