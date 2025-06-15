import { Batch } from "@/types/models"
import { api } from "@/lib/api"

class BatchService {
  async getAllBatches(): Promise<Batch[]> {
    const response = await api.get("/batches")
    return response.data
  }

  async getBatchByCode(batchCode: string): Promise<Batch> {
    const response = await api.get(`/batches/${batchCode}`)
    return response.data
  }

  async createBatch(data: Omit<Batch, "noOfStudents">): Promise<Batch> {
    const response = await api.post("/batches", data)
    return response.data
  }

  async updateBatch(batchCode: string, data: Partial<Omit<Batch, "noOfStudents">>): Promise<Batch> {
    const response = await api.put(`/batches/${batchCode}`, data)
    return response.data
  }

  async deleteBatch(batchCode: string): Promise<void> {
    await api.delete(`/batches/${batchCode}`)
  }
}

export const batchService = new BatchService() 