import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { courseService } from "@/services/courseService"
import { Course } from "@/types/models"

export function ViewCourse() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
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
        if (data) {
          setCourse(data)
        } else {
          setError("Course not found")
        }
      } catch (err) {
        setError("Failed to fetch course")
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [id])

  if (loading) return <div className="p-4">Loading course details...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>
  if (!course) return <div className="p-4 text-muted-foreground">Course not found.</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Course Details</h2>
        <p className="text-muted-foreground">Information about the course.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Course ID</label>
          <p className="text-base font-normal">{course.courseId}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Course Name</label>
          <p className="text-base font-normal">{course.courseName}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <p className="text-base font-normal">{course.category}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Fee</label>
          <p className="text-base font-normal">Rs. {course.courseFee.toFixed(2)}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Duration</label>
          <p className="text-base font-normal">{course.duration}</p>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => navigate("/courses")}>Back to Courses</Button>
        <Button onClick={() => navigate(`/courses/edit/${course.courseId}`)}>Edit Course</Button>
      </div>
    </div>
  )
} 