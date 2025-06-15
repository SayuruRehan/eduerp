import { Certificate } from "@/types/models"
import { api } from "@/lib/api"

class CertificateService {
  async getAllCertificates(): Promise<Certificate[]> {
    const response = await api.get("/certificates")
    return response.data
  }

  async getCertificateById(certificateId: string): Promise<Certificate> {
    const response = await api.get(`/certificates/${certificateId}`)
    return response.data
  }

  async createCertificate(data: Omit<Certificate, "certificateId">): Promise<Certificate> {
    const response = await api.post("/certificates", data)
    return response.data
  }

  async updateCertificate(certificateId: string, data: Partial<Omit<Certificate, "certificateId">>): Promise<Certificate> {
    const response = await api.put(`/certificates/${certificateId}`, data)
    return response.data
  }

  async deleteCertificate(certificateId: string): Promise<void> {
    await api.delete(`/certificates/${certificateId}`)
  }
}

export const certificateService = new CertificateService() 