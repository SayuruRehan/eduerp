import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { certificateService } from "@/services/certificateService"
import { studentService } from "@/services/studentService"
import { courseService } from "@/services/courseService"
import { batchService } from "@/services/batchService"
import { Student, Course, Batch, Certificate, CertificateStatus } from "@/types/models"
import { toast } from "sonner"

export function EditCertificate() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [formData, setFormData] = useState<Omit<Certificate, "certificateId"> | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Certificate ID is missing")
        setLoading(false)
        return
      }

      try {
        const [certificateData, studentsData, coursesData, batchesData] = await Promise.all([
          certificateService.getCertificateById(id),
          studentService.getAllStudents(),
          courseService.getAllCourses(),
          batchService.getAllBatches(),
        ])

        setFormData({
          studentId: certificateData.studentId,
          studentName: certificateData.studentName,
          courseId: certificateData.courseId,
          courseName: certificateData.courseName,
          batchCode: certificateData.batchCode,
          issueDate: certificateData.issueDate,
          certificateNumber: certificateData.certificateNumber,
          status: certificateData.status,
          remarks: certificateData.remarks || "",
        })
        setStudents(studentsData)
        setCourses(coursesData)
        setBatches(batchesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data")
        toast.error("Failed to fetch data")
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
      const selectedStudent = students.find(s => s.studentId === formData.studentId)
      const selectedCourse = courses.find(c => c.courseId === formData.courseId)
      const selectedBatch = batches.find(b => b.batchCode === formData.batchCode)

      if (!selectedStudent || !selectedCourse || !selectedBatch) {
        throw new Error("Invalid selection")
      }

      const certificateData = {
        ...formData,
        studentName: selectedStudent.name,
        courseName: selectedCourse.courseName,
        issueDate: new Date(formData.issueDate),
      }

      await certificateService.updateCertificate(id, certificateData)
      toast.success("Certificate updated successfully")
      navigate("/certificates")
    } catch (error) {
      toast.error("Failed to update certificate")
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }
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

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>
  if (!formData) return <div className="p-4">Certificate not found</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Certificate</h2>
        <p className="text-muted-foreground">
          Edit certificate details for {formData.studentName}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="studentId" className="text-sm font-medium">
              Student
            </label>
            <Select
              name="studentId"
              value={formData.studentId}
              onValueChange={(value) => handleChange({ target: { name: "studentId", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.studentId} value={student.studentId}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <SelectValue placeholder="Select course" />
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
              Batch
            </label>
            <Select
              name="batchCode"
              value={formData.batchCode}
              onValueChange={(value) => handleChange({ target: { name: "batchCode", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select batch" />
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
            <label htmlFor="issueDate" className="text-sm font-medium">
              Issue Date
            </label>
            <Input
              id="issueDate"
              name="issueDate"
              type="date"
              value={new Date(formData.issueDate).toISOString().split('T')[0]}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="certificateNumber" className="text-sm font-medium">
              Certificate Number
            </label>
            <Input
              id="certificateNumber"
              name="certificateNumber"
              value={formData.certificateNumber}
              onChange={handleChange}
              required
            />
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
                {Object.values(CertificateStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="remarks" className="text-sm font-medium">
              Remarks
            </label>
            <Textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/certificates")}
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