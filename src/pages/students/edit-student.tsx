import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Student } from "@/types/models"
import { studentService } from "@/services/studentService"
import { toast } from "sonner"

export function EditStudent() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<Omit<Student, "studentId" | "paymentDue" | "status"> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) {
        setError("Student ID is missing")
        setLoading(false)
        return
      }
      try {
        const data = await studentService.getStudentById(id)
        if (data) {
          setFormData({ 
            name: data.name,
            nic: data.nic,
            email: data.email,
            address: data.address,
            whatsappNumber: data.whatsappNumber,
          })
        } else {
          setError("Student not found")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch student for editing")
        toast.error("Failed to fetch student for editing.")
      } finally {
        setLoading(false)
      }
    }
    fetchStudent()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !formData) return

    setIsSubmitting(true)
    try {
      await studentService.updateStudent(id, formData)
      toast.success("Student updated successfully")
      navigate("/students")
    } catch (err) {
      toast.error("Failed to update student")
      console.error("Error updating student:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  if (loading) {
    return <div className="p-4">Loading student data for editing...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
        <Button className="ml-4" onClick={() => navigate("/students")}>
          Back to Students
        </Button>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="p-4 text-muted-foreground">
        Student data not available for editing.
        <Button className="ml-4" onClick={() => navigate("/students")}>
          Back to Students
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Student</h2>
        <p className="text-muted-foreground">
          Edit details for {formData.name}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="nic" className="text-sm font-medium">
              NIC
            </label>
            <Input
              id="nic"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="whatsappNumber" className="text-sm font-medium">
              WhatsApp Number
            </label>
            <Input
              id="whatsappNumber"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="address" className="text-sm font-medium">
              Address
            </label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/students")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
} 