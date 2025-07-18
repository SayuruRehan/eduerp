import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { batchService } from "@/services/batchService"
import { courseService } from "@/services/courseService"
import { userService } from "@/services/userService"
import { BatchStatus, Course, Employee, EmployeeRole, Branch } from "@/types/models"
import { toast } from "sonner"
import { format } from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function AddBatch() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [lecturers, setLecturers] = useState<Employee[]>([])
  const [coordinators, setCoordinators] = useState<Employee[]>([])
  const [formData, setFormData] = useState({
    branch: "",
    courseName: "",
    lecturer: "",
    coordinator: "",
    plannedDate: "",
    startDate: "",
    lockedDate: "",
    status: BatchStatus.PLANNED,
    batchCode: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, employeesData] = await Promise.all([
          courseService.getAllCourses(),
          userService.getAllUsers(),
        ])
        setCourses(coursesData)
        setLecturers(employeesData.filter(emp => emp.role === EmployeeRole.VISITING_LECTURER || emp.role === EmployeeRole.IN_HOUSE_LECTURER))
        setCoordinators(employeesData.filter(emp => emp.role === EmployeeRole.COURSE_COORDINATOR))
      } catch (error) {
        toast.error("Failed to fetch required data")
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const batchData = {
        ...formData,
        plannedDate: new Date(formData.plannedDate),
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        lockedDate: formData.lockedDate ? new Date(formData.lockedDate) : undefined,
      }
      await batchService.createBatch(batchData as any)
      toast.success("Batch created successfully")
      navigate("/batches")
    } catch (error) {
      toast.error("Failed to create batch")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date ? format(date, "yyyy-MM-dd") : "",
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Add New Batch</h2>
        <p className="text-muted-foreground">Create a new course batch.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="batchCode" className="text-sm font-medium">Batch Code</label>
            <Input id="batchCode" name="batchCode" value={formData.batchCode} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="branch" className="text-sm font-medium">Branch</label>
            <Select
              name="branch"
              value={formData.branch}
              onValueChange={(value) => handleChange({ target: { name: "branch", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a branch" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Branch).map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="courseName" className="text-sm font-medium">Course</label>
            <Select
              name="courseName"
              value={formData.courseName}
              onValueChange={(value) => handleChange({ target: { name: "courseName", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.courseId} value={course.courseName}>
                    {course.courseName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="lecturer" className="text-sm font-medium">Lecturer</label>
            <Select
              name="lecturer"
              value={formData.lecturer}
              onValueChange={(value) => handleChange({ target: { name: "lecturer", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a lecturer" />
              </SelectTrigger>
              <SelectContent>
                {lecturers.map((lecturer) => (
                  <SelectItem key={lecturer.employeeId} value={lecturer.empName}>
                    {lecturer.empName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="coordinator" className="text-sm font-medium">Coordinator</label>
            <Select
              name="coordinator"
              value={formData.coordinator}
              onValueChange={(value) => handleChange({ target: { name: "coordinator", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a coordinator" />
              </SelectTrigger>
              <SelectContent>
                {coordinators.map((coordinator) => (
                  <SelectItem key={coordinator.employeeId} value={coordinator.empName}>
                    {coordinator.empName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="plannedDate" className="text-sm font-medium">Planned Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.plannedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.plannedDate ? format(new Date(formData.plannedDate), "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.plannedDate ? new Date(formData.plannedDate) : undefined}
                  onSelect={(date) => handleDateChange("plannedDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm font-medium">Start Date (Optional)</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.startDate ? format(new Date(formData.startDate), "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.startDate ? new Date(formData.startDate) : undefined}
                  onSelect={(date) => handleDateChange("startDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <label htmlFor="lockedDate" className="text-sm font-medium">Locked Date (Optional)</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.lockedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.lockedDate ? format(new Date(formData.lockedDate), "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.lockedDate ? new Date(formData.lockedDate) : undefined}
                  onSelect={(date) => handleDateChange("lockedDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">Status</label>
            <Select
              name="status"
              value={formData.status}
              onValueChange={(value) => handleChange({ target: { name: "status", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(BatchStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate("/batches")}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Batch"}</Button>
        </div>
      </form>
    </div>
  )
} 