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
import { Employee } from "@/types/models"
import { useNavigate } from "react-router-dom"
import { ColumnDef } from "@/components/ui/data-table"
import { userService } from "@/services/userService"
import { toast } from "sonner"
import { createContext } from 'react'

interface AllUsersContextType {
  fetchUsers: () => void
}

const AllUsersContext = createContext<AllUsersContextType | undefined>(undefined)

export default function AllUsers() {
  const [users, setUsers] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("Fetching users...")
      const data = await userService.getAllUsers()
      console.log("Users fetched:", data)
      setUsers(data)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch users")
      toast.error("Failed to fetch users. Please check the console for details.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (employeeId: string) => {
    try {
      await userService.deleteUser(employeeId)
      toast.success("User deleted successfully")
      fetchUsers()
    } catch (error) {
      toast.error("Failed to delete user")
      console.error("Error deleting user:", error)
    }
  }

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "employeeId",
      header: "Employee ID",
    },
    {
      accessorKey: "empName",
      header: "Name",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "contactNumber",
      header: "Contact",
    },
    {
      accessorKey: "dateJoined",
      header: "Date Joined",
      cell: ({ row }: any) => {
        const date = new Date(row.getValue("dateJoined"))
        return date.toLocaleDateString()
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const employee = row.original

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
                  onClick={() => navigate(`/users/view/${employee.employeeId}`)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/users/edit/${employee.employeeId}`)}
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
                  user and remove their data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={() => handleDelete(employee.employeeId)}>Continue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      },
    },
  ]

  if (loading) {
    return <div className="p-4">Loading users...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
        <Button 
          className="ml-4" 
          onClick={fetchUsers}
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <AllUsersContext.Provider value={{ fetchUsers }}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <Button onClick={() => navigate("/users/add")}>
            Add User
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={users}
          searchKey="empName"
        />
      </div>
    </AllUsersContext.Provider>
  )
} 