import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { batchService } from "@/services/batchService"
import { Batch } from "@/types/models"
import { toast } from "sonner"
import { format } from "date-fns"

export function ViewBatch() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [batch, setBatch] = useState<Batch | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBatch = async () => {
      if (!id) {
        setError("Batch Code is missing")
        setLoading(false)
        return
      }
      try {
        const data = await batchService.getBatchByCode(id)
        if (data) {
          setBatch(data)
        } else {
          setError("Batch not found")
        }
      } catch (err) {
        setError("Failed to fetch batch")
        toast.error("Failed to fetch batch details.")
      } finally {
        setLoading(false)
      }
    }
    fetchBatch()
  }, [id])

  if (loading) return <div className="p-4">Loading batch details...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>
  if (!batch) return <div className="p-4 text-muted-foreground">Batch not found.</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Batch Details</h2>
        <p className="text-muted-foreground">Information about the batch.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Batch Code</label>
          <p className="text-base font-normal">{batch.batchCode}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Branch</label>
          <p className="text-base font-normal">{batch.branch}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Course Name</label>
          <p className="text-base font-normal">{batch.courseName}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Lecturer</label>
          <p className="text-base font-normal">{batch.lecturer}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Coordinator</label>
          <p className="text-base font-normal">{batch.coordinator}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Number of Students</label>
          <p className="text-base font-normal">{batch.noOfStudents}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Planned Date</label>
          <p className="text-base font-normal">{format(new Date(batch.plannedDate), "PPP")}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <p className="text-base font-normal">{batch.startDate ? format(new Date(batch.startDate), "PPP") : "N/A"}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Locked Date</label>
          <p className="text-base font-normal">{batch.lockedDate ? format(new Date(batch.lockedDate), "PPP") : "N/A"}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <p className="text-base font-normal">{batch.status}</p>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => navigate("/batches")}>Back to Batches</Button>
        <Button onClick={() => navigate(`/batches/edit/${batch.batchCode}`)}>Edit Batch</Button>
      </div>
    </div>
  )
} 