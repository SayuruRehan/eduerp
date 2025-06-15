import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { registrationService } from "@/services/registrationService"
import { Registration } from "@/types/models"
import { toast } from "sonner"

export function ViewRegistration() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRegistration = async () => {
      if (!id) {
        setLoading(false)
        return
      }
      try {
        const data = await registrationService.getRegistrationById(id)
        setRegistration(data)
      } catch (error) {
        toast.error("Failed to fetch registration details")
      } finally {
        setLoading(false)
      }
    }
    fetchRegistration()
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!registration) {
    return <div>Registration not found</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Registration Details</h2>
        <p className="text-muted-foreground">
          View registration information
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Registration ID</label>
          <p className="text-base font-normal">{registration.registrationId}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Student Name</label>
          <p className="text-base font-normal">{registration.studentName}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Course</label>
          <p className="text-base font-normal">{registration.courseName}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Batch Code</label>
          <p className="text-base font-normal">{registration.batchCode}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Branch</label>
          <p className="text-base font-normal">{registration.branch}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Type</label>
          <p className="text-base font-normal">{registration.paymentType}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Method</label>
          <p className="text-base font-normal">{registration.paymentMethod}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <p className="text-base font-normal">{registration.status}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Student Counselor</label>
          <p className="text-base font-normal">{registration.studentCounselor}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate("/registrations")}
        >
          Back to List
        </Button>
        <Button
          onClick={() => navigate(`/registrations/edit/${registration.registrationId}`)}
        >
          Edit Registration
        </Button>
      </div>
    </div>
  )
} 