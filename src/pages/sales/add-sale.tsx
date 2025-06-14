import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
import { salesService } from "@/services/salesService"
import { courseService } from "@/services/courseService"
import { Course } from "@/types/models"
import { toast } from "sonner"

export function AddSale() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [formData, setFormData] = useState({
    studentName: "",
    courseId: "",
    courseName: "",
    amount: "",
    paymentMethod: "",
    paymentStatus: "Pending",
    saleDate: new Date().toISOString().split('T')[0],
    notes: "",
  })

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getAllCourses()
        setCourses(data)
      } catch (error) {
        toast.error("Failed to fetch courses")
      }
    }
    fetchCourses()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const saleData = {
        ...formData,
        amount: parseFloat(formData.amount),
        saleDate: new Date(formData.saleDate),
      }
      await salesService.createSale(saleData)
      toast.success("Sale created successfully")
      navigate("/sales")
    } catch (error) {
      toast.error("Failed to create sale")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCourseChange = (courseId: string) => {
    const selected = courses.find(c => c.courseId === courseId)
    setFormData(prev => ({
      ...prev,
      courseId,
      courseName: selected ? selected.courseName : "",
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Add New Sale</h2>
        <p className="text-muted-foreground">
          Create a new sale record for a lead/prospect.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="studentName" className="text-sm font-medium">
              Lead/Prospect Name
            </label>
            <Input
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              required
              placeholder="Enter lead/prospect name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="courseId" className="text-sm font-medium">
              Course
            </label>
            <Select
              name="courseId"
              value={formData.courseId}
              onValueChange={handleCourseChange}
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
            <label htmlFor="amount" className="text-sm font-medium">
              Amount
            </label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              required
            />
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
                <SelectItem value="Online Payment">Online Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="paymentStatus" className="text-sm font-medium">
              Payment Status
            </label>
            <Select
              name="paymentStatus"
              value={formData.paymentStatus}
              onValueChange={(value) => handleChange({ target: { name: "paymentStatus", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="saleDate" className="text-sm font-medium">
              Sale Date
            </label>
            <Input
              id="saleDate"
              name="saleDate"
              type="date"
              value={formData.saleDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Notes
          </label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any additional notes about this sale..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/sales")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Sale"}
          </Button>
        </div>
      </form>
    </div>
  )
} 