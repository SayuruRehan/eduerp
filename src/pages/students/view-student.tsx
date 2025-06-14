import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { studentService } from "@/services/studentService"
import { Student } from "@/types/models"
import { toast } from "sonner"

export function ViewStudent() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
          setStudent(data)
        } else {
          setError("Student not found")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch student")
        toast.error("Failed to fetch student. Please check the console for details.")
      } finally {
        setLoading(false)
      }
    }
    fetchStudent()
  }, [id])

  if (loading) {
    return <div className="p-4">Loading student details...</div>
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

  if (!student) {
    return (
      <div className="p-4 text-muted-foreground">
        Student not found.
        <Button className="ml-4" onClick={() => navigate("/students")}>
          Back to Students
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Student Details</h2>
        <p className="text-muted-foreground">
          Information about {student.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Student ID</label>
          <p className="text-base font-normal">{student.studentId}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <p className="text-base font-normal">{student.name}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">NIC</label>
          <p className="text-base font-normal">{student.nic}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <p className="text-base font-normal">{student.email}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">WhatsApp Number</label>
          <p className="text-base font-normal">{student.whatsappNumber}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Due</label>
          <p className="text-base font-normal">Rs. {Number(student.paymentDue).toFixed(2)}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <p className="text-base font-normal">{student.status}</p>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Address</label>
          <p className="text-base font-normal">{student.address}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate("/students")}
        >
          Back to Students
        </Button>
        <Button
          onClick={() => navigate(`/students/edit/${student.studentId}`)}
        >
          Edit Student
        </Button>
      </div>
    </div>
  )
} 