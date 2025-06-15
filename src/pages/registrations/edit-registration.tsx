import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { registrationService } from "@/services/registrationService"
import { batchService } from "@/services/batchService"
import { courseService } from "@/services/courseService"
import { userService } from "@/services/userService"
import { RegistrationStatus, Course, Batch, Employee, EmployeeRole, Registration, Branch } from "@/types/models"
import { toast } from "sonner"

export function EditRegistration() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [batches, setBatches] = useState<Batch[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [studentCounselors, setStudentCounselors] = useState<Employee[]>([])
  const [formData, setFormData] = useState<Omit<Registration, "registrationId"> | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setLoading(false)
        return
      }
      try {
        const [registrationData, batchesData, coursesData, employeesData] = await Promise.all([
          registrationService.getRegistrationById(id),
          batchService.getAllBatches(),
          courseService.getAllCourses(),
          userService.getAllUsers(),
        ])

        if (!registrationData) {
          setLoading(false)
          return
        }

        setFormData({
          studentName: registrationData.studentName,
          courseId: registrationData.courseId,
          courseName: registrationData.courseName,
          batchCode: registrationData.batchCode,
          branch: registrationData.branch,
          paymentType: registrationData.paymentType,
          paymentMethod: registrationData.paymentMethod,
          status: registrationData.status,
          studentCounselor: registrationData.studentCounselor,
        })
        setBatches(batchesData)
        setCourses(coursesData)
        setStudentCounselors(employeesData.filter(emp => emp.role === EmployeeRole.STUDENT_COUNSELOR))
      } catch (error) {
        toast.error("Failed to fetch required data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData || !id) return

    setSaving(true)
    try {
      await registrationService.updateRegistration(id, formData)
      toast.success("Registration updated successfully")
      navigate("/registrations")
    } catch (error) {
      toast.error("Failed to update registration")
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target
    setFormData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const handleBatchChange = (value: string) => {
    const selectedBatch = batches.find(batch => batch.batchCode === value)
    setFormData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        batchCode: value,
        branch: selectedBatch ? selectedBatch.branch : "" as Branch,
      }
    })
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!formData) {
    return <div>Registration not found</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Registration</h2>
        <p className="text-muted-foreground">
          Update registration information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="studentName" className="text-sm font-medium">
              Student Name
            </label>
            <Input
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="courseId" className="text-sm font-medium">
              Course
            </label>
            <Select
              name="courseId"
              value={formData.courseId}
              onValueChange={(value) => handleChange({ target: { name: "courseId", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.courseId} value={course.courseId}>
                    {course.courseName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="batchCode" className="text-sm font-medium">
              Batch Code
            </label>
            <Select
              name="batchCode"
              value={formData.batchCode}
              onValueChange={handleBatchChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch.batchCode} value={batch.batchCode}>
                    {batch.batchCode} - {batch.courseName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="branch" className="text-sm font-medium">
              Branch
            </label>
            <Input
              id="branch"
              name="branch"
              value={formData.branch}
              readOnly
              disabled
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="studentCounselor" className="text-sm font-medium">
              Student Counselor
            </label>
            <Select
              name="studentCounselor"
              value={formData.studentCounselor}
              onValueChange={(value) => handleChange({ target: { name: "studentCounselor", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a student counselor" />
              </SelectTrigger>
              <SelectContent>
                {studentCounselors.map((counselor) => (
                  <SelectItem key={counselor.employeeId} value={counselor.empName}>
                    {counselor.empName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="paymentType" className="text-sm font-medium">
              Payment Type
            </label>
            <Select
              name="paymentType"
              value={formData.paymentType}
              onValueChange={(value) => handleChange({ target: { name: "paymentType", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full">Full Payment</SelectItem>
                <SelectItem value="Installment">Installment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="paymentMethod" className="text-sm font-medium">
              Payment Method
            </label>
            <Select
              name="paymentMethod"
              value={formData.paymentMethod}
              onValueChange={(value) => handleChange({ target: { name: "paymentMethod", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select
              name="status"
              value={formData.status}
              onValueChange={(value) => handleChange({ target: { name: "status", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(RegistrationStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/registrations")}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
} 