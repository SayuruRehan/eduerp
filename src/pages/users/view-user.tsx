import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { userService } from "@/services/userService"
import { Employee } from "@/types/models"
import { toast } from "sonner"

export function ViewUser() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        setError("User ID is missing")
        setLoading(false)
        return
      }
      try {
        const data = await userService.getUserById(id)
        if (data) {
          setUser(data)
        } else {
          setError("User not found")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch user")
        toast.error("Failed to fetch user. Please check the console for details.")
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [id])

  if (loading) {
    return <div className="p-4">Loading user details...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
        <Button className="ml-4" onClick={() => navigate("/users")}>
          Back to Users
        </Button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-4 text-muted-foreground">
        User not found.
        <Button className="ml-4" onClick={() => navigate("/users")}>
          Back to Users
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Details</h2>
        <p className="text-muted-foreground">
          Information about {user.empName}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Employee ID</label>
          <p className="text-base font-normal">{user.employeeId}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <p className="text-base font-normal">{user.empName}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <p className="text-base font-normal">{user.role}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <p className="text-base font-normal">{user.email}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Contact Number</label>
          <p className="text-base font-normal">{user.contactNumber}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Date Joined</label>
          <p className="text-base font-normal">{new Date(user.dateJoined).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => navigate("/users")}>Back to Users</Button>
      </div>
    </div>
  )
} 