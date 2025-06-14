import { useState, useEffect } from "react"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Course } from "@/types/models"
import { useNavigate } from "react-router-dom"
import { ColumnDef } from "@/components/ui/data-table"
import { courseService } from "@/services/courseService"
import { toast } from "sonner"

export default function AllCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const fetchCourses = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await courseService.getAllCourses()
      setCourses(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch courses"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleDelete = async (courseId: string) => {
    try {
      await courseService.deleteCourse(courseId)
      toast.success("Course deleted successfully")
      fetchCourses()
    } catch (error) {
      console.error("Error deleting course:", error)
      toast.error("Failed to delete course")
    }
  }

  const columns: ColumnDef<Course>[] = [
    { accessorKey: "courseId", header: "Course ID" },
    { accessorKey: "courseName", header: "Course Name" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "courseFee", header: "Fee", cell: ({ row }) => `Rs. ${(row.getValue("courseFee") as number).toFixed(2)}` },
    { accessorKey: "duration", header: "Duration" },
    {
      id: "actions",
      cell: ({ row }) => {
        const course = row.original
        return (
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate(`/courses/view/${course.courseId}`)}>
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/courses/edit/${course.courseId}`)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the course from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={() => handleDelete(course.courseId)}>Continue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      },
    },
  ]

  if (loading) return <div className="p-4">Loading courses...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Courses</h2>
        <Button onClick={() => navigate("/courses/add")}>Add Course</Button>
      </div>
      <DataTable columns={columns} data={courses} searchKey="courseName" />
    </div>
  )
} 