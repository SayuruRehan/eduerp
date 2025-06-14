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
import { Employee, EmployeeRole } from "@/types/models"
import { userService } from "@/services/userService"
import { toast } from "sonner"

export function EditUser() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<Omit<Employee, "employeeId" | "dateJoined"> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
          setFormData({ 
            empName: data.empName,
            role: data.role,
            email: data.email,
            password: data.password, // Be cautious with sending password back
            contactNumber: data.contactNumber,
          })
        } else {
          setError("User not found")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch user for editing")
        toast.error("Failed to fetch user for editing.")
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !formData) return

    setIsSubmitting(true)
    try {
      await userService.updateUser(id, formData)
      toast.success("User updated successfully")
      navigate("/users")
    } catch (err) {
      toast.error("Failed to update user")
      console.error("Error updating user:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  if (loading) {
    return <div className="p-4">Loading user data for editing...</div>
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

  if (!formData) {
    return (
      <div className="p-4 text-muted-foreground">
        User data not available for editing.
        <Button className="ml-4" onClick={() => navigate("/users")}>
          Back to Users
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit User</h2>
        <p className="text-muted-foreground">
          Edit details for {formData.empName}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="empName" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="empName"
              name="empName"
              value={formData.empName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <Select
              name="role"
              value={formData.role}
              onValueChange={(value: string) =>
                handleChange({ target: { name: "role", value } })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(EmployeeRole).map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password (Leave blank to keep current)
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contactNumber" className="text-sm font-medium">
              Contact Number
            </label>
            <Input
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/users")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
} 