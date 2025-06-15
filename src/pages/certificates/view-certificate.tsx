import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Certificate, CertificateStatus } from "@/types/models"
import { certificateService } from "@/services/certificateService"
import { toast } from "sonner"

export function ViewCertificate() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!id) {
        setError("Certificate ID is missing")
        setLoading(false)
        return
      }

      try {
        const data = await certificateService.getCertificateById(id)
        setCertificate(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch certificate")
        toast.error("Failed to fetch certificate")
      } finally {
        setLoading(false)
      }
    }

    fetchCertificate()
  }, [id])

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>
  if (!certificate) return <div className="p-4">Certificate not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Certificate Details</h2>
          <p className="text-muted-foreground">
            View certificate details for {certificate.studentName}
          </p>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate("/certificates")}
          >
            Back to List
          </Button>
          <Button
            onClick={() => navigate(`/certificates/edit/${certificate.certificateId}`)}
          >
            Edit Certificate
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Student Information</h3>
            <div className="mt-2 space-y-2">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Student Name:</span>
                <p>{certificate.studentName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Student ID:</span>
                <p>{certificate.studentId}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Course Information</h3>
            <div className="mt-2 space-y-2">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Course Name:</span>
                <p>{certificate.courseName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Course ID:</span>
                <p>{certificate.courseId}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Batch Code:</span>
                <p>{certificate.batchCode}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Certificate Information</h3>
            <div className="mt-2 space-y-2">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Certificate ID:</span>
                <p>{certificate.certificateId}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Certificate Number:</span>
                <p>{certificate.certificateNumber}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Issue Date:</span>
                <p>{new Date(certificate.issueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Status:</span>
                <p>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    certificate.status === CertificateStatus.ISSUED ? "bg-green-100 text-green-800" :
                    certificate.status === CertificateStatus.PENDING ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {certificate.status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {certificate.remarks && (
            <div>
              <h3 className="text-lg font-medium">Remarks</h3>
              <p className="mt-2 text-muted-foreground">{certificate.remarks}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 