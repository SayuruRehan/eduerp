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
import { salesService } from "@/services/salesService"
import { courseService } from "@/services/courseService"
import { Sale, Course } from "@/types/models"
import { toast } from "sonner"

export function EditSale() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [formData, setFormData] = useState<Omit<Sale, "saleId"> | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Sale ID is missing")
        setLoading(false)
        return
      }
      try {
        const [saleData, coursesData] = await Promise.all([
          salesService.getSaleById(id),
          courseService.getAllCourses(),
        ])
        if (!saleData) {
          setError("Sale not found")
          return
        }
        setFormData({
          studentName: saleData.studentName,
          courseId: saleData.courseId,
          courseName: saleData.courseName,
          amount: saleData.amount,
          paymentMethod: saleData.paymentMethod,
          paymentStatus: saleData.paymentStatus,
          saleDate: saleData.saleDate,
          notes: saleData.notes || "",
        })
        setCourses(coursesData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch data"
        setError(errorMessage)
        toast.error(errorMessage)
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
      await salesService.updateSale(id, formData)
      toast.success("Sale updated successfully")
      navigate("/sales")
    } catch (error) {
      console.error("Error updating sale:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to update sale"
      toast.error(errorMessage)
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

  const handleCourseChange = (courseId: string) => {
    const selected = courses.find(c => c.courseId === courseId)
    setFormData(prev => prev ? ({
      ...prev,
      courseId,
      courseName: selected ? selected.courseName : "",
    }) : null)
  }

  if (loading) {
    return <div className="p-4">Loading sale details...</div>
  }

  if (error || !formData) {
    return (
      <div className="p-4 text-red-500">
        Error: {error || "Failed to load sale data"}
        <Button className="ml-4" onClick={() => navigate("/sales")}>
          Back to Sales
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Sale</h2>
        <p className="text-muted-foreground">
          Update the sale details for {formData.studentName}.
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
              value={new Date(formData.saleDate).toISOString().split('T')[0]}
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
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
} 