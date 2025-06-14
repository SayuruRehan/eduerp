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
import { courseService } from "@/services/courseService"
import { CourseCategory } from "@/types/models"
import { toast } from "sonner"

export function EditCourse() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    courseName: "",
    category: "",
    courseFee: "",
    duration: "",
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) {
        setError("Course ID is missing")
        setLoading(false)
        return
      }
      try {
        const data = await courseService.getCourseById(id)
        if (!data) {
          setError("Course not found")
          return
        }
        setFormData({
          courseName: data.courseName,
          category: data.category,
          courseFee: data.courseFee.toString(),
          duration: data.duration,
        })
      } catch (err) {
        setError("Failed to fetch course")
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setSaving(true)
    try {
      const courseData = {
        ...formData,
        courseFee: parseFloat(formData.courseFee),
      }
      await courseService.updateCourse(id, courseData)
      toast.success("Course updated successfully")
      navigate("/courses")
    } catch (error) {
      toast.error("Failed to update course")
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (loading) return <div className="p-4">Loading course details...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Course</h2>
        <p className="text-muted-foreground">Update the course details.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="courseName" className="text-sm font-medium">Course Name</label>
            <Input id="courseName" name="courseName" value={formData.courseName} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">Category</label>
            <Select
              name="category"
              value={formData.category}
              onValueChange={(value) => handleChange({ target: { name: "category", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(CourseCategory).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="courseFee" className="text-sm font-medium">Course Fee</label>
            <Input id="courseFee" name="courseFee" type="number" step="0.01" value={formData.courseFee} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="duration" className="text-sm font-medium">Duration</label>
            <Input id="duration" name="duration" value={formData.duration} onChange={handleChange} required />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate("/courses")}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
        </div>
      </form>
    </div>
  )
} 