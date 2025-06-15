import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { EmployeeRole } from "@/types/models"

interface NavItem {
  title: string
  href: string
  roles: EmployeeRole[]
}

const navigation: NavItem[] = [
  {
    title: "Admin Dashboard",
    href: "/admin",
    roles: [EmployeeRole.ADMIN],
  },
  {
    title: "Marketing",
    href: "/marketing",
    roles: [EmployeeRole.ADMIN, EmployeeRole.STUDENT_COUNSELOR],
  },
  {
    title: "Sales",
    href: "/sales",
    roles: [EmployeeRole.ADMIN, EmployeeRole.STUDENT_COUNSELOR],
  },
  {
    title: "Registrations",
    href: "/registrations",
    roles: [EmployeeRole.ADMIN, EmployeeRole.STUDENT_COUNSELOR],
  },
  {
    title: "Student Management",
    href: "/students",
    roles: [EmployeeRole.ADMIN, EmployeeRole.STUDENT_COUNSELOR],
  },
  {
    title: "Courses",
    href: "/courses",
    roles: [EmployeeRole.ADMIN, EmployeeRole.STUDENT_COUNSELOR],
  },
  {
    title: "Batches",
    href: "/batches",
    roles: [EmployeeRole.ADMIN, EmployeeRole.STUDENT_COUNSELOR],
  },
  {
    title: "Certificates",
    href: "/certificates",
    roles: [EmployeeRole.ADMIN],
  },
  {
    title: "Users",
    href: "/users",
    roles: [EmployeeRole.ADMIN],
  },
  {
    title: "Settings",
    href: "/settings",
    roles: [EmployeeRole.ADMIN, EmployeeRole.STUDENT_COUNSELOR],
  },
  
]

export function Sidebar() {
  const location = useLocation()
  // TODO: Get user role from auth context
  const userRole = EmployeeRole.ADMIN

  const filteredNav = navigation.filter((item) => item.roles.includes(userRole))

  return (
    <div className="w-64 bg-gray-100 dark:bg-gray-800 p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">EduERP</h1>
      </div>
      <nav className="space-y-2">
        {filteredNav.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium rounded-md",
              location.pathname === item.href
                ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
          >
            <span className="ml-3">{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
} 