import { Sale } from "../types/models"

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-production-backend.com/api'
  : 'http://localhost:5001/api';

class SalesService {
  async getAllSales(): Promise<Sale[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/sales`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data as Sale[];
    } catch (error) {
      console.error("Error fetching sales:", error);
      throw new Error("Failed to fetch sales. Please check your backend server.");
    }
  }

  async getSaleById(id: string): Promise<Sale | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/sales/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data as Sale;
    } catch (error) {
      console.error("Error fetching sale:", error);
      throw new Error("Failed to fetch sale. Please check your backend server.");
    }
  }

  async createSale(sale: Omit<Sale, "saleId">): Promise<Sale> {
    try {
      const response = await fetch(`${API_BASE_URL}/sales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sale),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data as Sale;
    } catch (error) {
      console.error("Error creating sale:", error);
      throw error;
    }
  }

  async updateSale(id: string, sale: Partial<Sale>): Promise<Sale> {
    try {
      const response = await fetch(`${API_BASE_URL}/sales/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sale),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data as Sale;
    } catch (error) {
      console.error("Error updating sale:", error);
      throw error;
    }
  }

  async deleteSale(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/sales/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
      throw error;
    }
  }

  async importSalesFromCSV(file: File): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_BASE_URL}/sales/import`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error importing sales:", error)
      throw error
    }
  }
}

export const salesService = new SalesService(); 