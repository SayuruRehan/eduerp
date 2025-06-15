import { Registration } from "@/types/models"
import { api } from "@/lib/api"

class RegistrationService {
  async getAllRegistrations(): Promise<Registration[]> {
    const response = await api.get("/registrations")
    return response.data
  }

  async getRegistrationById(id: string): Promise<Registration> {
    const response = await api.get(`/registrations/${id}`)
    return response.data
  }

  async createRegistration(data: Omit<Registration, "registrationId">): Promise<Registration> {
    const response = await api.post("/registrations", data)
    return response.data
  }

  async updateRegistration(id: string, data: Partial<Registration>): Promise<Registration> {
    const response = await api.put(`/registrations/${id}`, data)
    return response.data
  }

  async deleteRegistration(id: string): Promise<void> {
    await api.delete(`/registrations/${id}`)
  }
}

export const registrationService = new RegistrationService() 