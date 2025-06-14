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
import { Student } from "@/types/models"
import { useNavigate } from "react-router-dom"
import { ColumnDef } from "@/components/ui/data-table"
import { studentService } from "@/services/studentService"
import { toast } from "sonner"
import { createContext, useContext } from 'react'

interface AllStudentsContextType {
  fetchStudents: () => void
}

const AllStudentsContext = createContext<AllStudentsContextType | undefined>(undefined)

export const useAllStudentsContext = () => {
  const context = useContext(AllStudentsContext)
  if (!context) {
    throw new Error('useAllStudentsContext must be used within an AllStudentsProvider')
  }
  return context
}

export default function AllStudents() {
  console.log("AllStudents component rendering")
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const fetchStudents = async () => {
    console.log("Starting to fetch students...")
    setLoading(true)
    setError(null)
    try {
      const data = await studentService.getAllStudents()
      console.log("Students fetched successfully:", data)
      setStudents(data)
    } catch (err) {
      console.error("Error in fetchStudents:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch students"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log("AllStudents useEffect running")
    fetchStudents()
  }, [])

  const handleDelete = async (studentId: string) => {
    try {
      await studentService.deleteStudent(studentId)
      toast.success("Student deleted successfully")
      fetchStudents()
    } catch (error) {
      console.error("Error deleting student:", error)
      toast.error("Failed to delete student")
    }
  }

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "studentId",
      header: "Student ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "nic",
      header: "NIC",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "whatsappNumber",
      header: "WhatsApp",
    },
    {
      accessorKey: "paymentDue",
      header: "Payment Due",
      cell: ({ row }: any) => {
        const rawAmount = row.getValue("paymentDue")
        console.log("Raw paymentDue value:", rawAmount, "Type:", typeof rawAmount)

        let amount
        if (typeof rawAmount === 'string') {
          amount = parseFloat(rawAmount)
        } else if (typeof rawAmount === 'number') {
          amount = rawAmount
        } else {
          console.error("paymentDue has unexpected type or value:", rawAmount)
          return "N/A - Invalid Type"
        }

        console.log("Parsed amount for paymentDue:", amount, "Type:", typeof amount)

        if (!Number.isFinite(amount)) {
          console.error("paymentDue is not a finite number after parsing:", rawAmount)
          return "N/A - Not a Number"
        }
        return `Rs. ${amount.toFixed(2)}`
      },
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const student = row.original

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
                <DropdownMenuItem
                  onClick={() => navigate(`/students/view/${student.studentId}`)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/students/edit/${student.studentId}`)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                  >
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
                  This action cannot be undone. This will permanently delete the
                  student and remove their data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={() => handleDelete(student.studentId)}>Continue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      },
    },
  ]

  const handleExport = (rows: Student[]) => {
    console.log("Exporting students:", rows)
  }

  console.log("Current state:", { loading, error, studentsCount: students.length })

  if (loading) {
    return <div className="p-4">Loading students...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
        <Button 
          className="ml-4" 
          onClick={fetchStudents}
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <AllStudentsContext.Provider value={{ fetchStudents }}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Students</h2>
          <Button onClick={() => navigate("/students/add")}>
            Add Student
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={students}
          searchKey="name"
          onExport={handleExport}
        />
      </div>
    </AllStudentsContext.Provider>
  )
} 