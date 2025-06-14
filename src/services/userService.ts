import { Employee } from "../types/models"

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-production-backend.com/api'
  : 'http://localhost:5001/api';

class UserService {
  async getAllUsers(): Promise<Employee[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data as Employee[];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users. Please check your backend server.");
    }
  }

  async getUserById(id: string): Promise<Employee | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data as Employee;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error("Failed to fetch user. Please check your backend server.");
    }
  }

  async createUser(user: Omit<Employee, "employeeId" | "dateJoined">): Promise<Employee> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data as Employee;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user. Please check your backend server.");
    }
  }

  async updateUser(id: string, user: Partial<Employee>): Promise<Employee> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data as Employee;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user. Please check your backend server.");
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user. Please check your backend server.");
    }
  }
}

export const userService = new UserService(); 