import { useState, useEffect, createContext, useContext, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ColumnDef, DataTable } from "@/components/ui/data-table"
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
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { registrationService } from "@/services/registrationService"
import { Registration } from "@/types/models"
import { toast } from "sonner"
import { DateRange } from "react-day-picker"

interface AllRegistrationsContextType {
  fetchRegistrations: () => void
}

const AllRegistrationsContext = createContext<AllRegistrationsContextType | undefined>(undefined)

export const useAllRegistrationsContext = () => {
  const context = useContext(AllRegistrationsContext)
  if (!context) {
    throw new Error('useAllRegistrationsContext must be used within an AllRegistrationsProvider')
  }
  return context
}

export default function AllRegistrations() {
  const navigate = useNavigate()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const dateRangeRef = useRef(dateRange);

  useEffect(() => {
    dateRangeRef.current = dateRange;
  }, [dateRange]);

  const fetchRegistrations = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await registrationService.getAllRegistrations()
      setRegistrations(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch registrations"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const handleDelete = async (registrationId: string) => {
    try {
      await registrationService.deleteRegistration(registrationId)
      toast.success("Registration deleted successfully")
      fetchRegistrations()
    } catch (error) {
      toast.error("Failed to delete registration")
    }
  }

  const columns: ColumnDef<Registration>[] = [
    {
      accessorKey: "registrationId",
      header: "Registration ID",
    },
    {
      accessorKey: "studentName",
      header: "Student Name",
    },
    {
      accessorKey: "courseName",
      header: "Course",
    },
    {
      accessorKey: "batchCode",
      header: "Batch",
    },
    {
      accessorKey: "branch",
      header: "Branch",
    },
    {
      accessorKey: "paymentType",
      header: "Payment Type",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "studentCounselor",
      header: "Student Counselor",
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const registration = row.original

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
                  onClick={() => navigate(`/registrations/view/${registration.registrationId}`)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/registrations/edit/${registration.registrationId}`)}
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
                  registration and remove its data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={() => handleDelete(registration.registrationId)}>Continue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      },
    },
  ]

  const handleExport = (rows: Registration[]) => {
    console.log("Exporting registrations:", rows)
  }

  const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
    const currentFrom = dateRangeRef.current?.from?.getTime();
    const currentTo = dateRangeRef.current?.to?.getTime();
    const newFrom = range?.from?.getTime();
    const newTo = range?.to?.getTime();

    if (currentFrom !== newFrom || currentTo !== newTo) {
      setDateRange(range);
      // TODO: Implement filtering logic based on dateRange
    }
  }, [])

  if (loading) {
    return <div className="p-4">Loading registrations...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
        <Button 
          className="ml-4" 
          onClick={fetchRegistrations}
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <AllRegistrationsContext.Provider value={{ fetchRegistrations }}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Registrations</h2>
          <Button onClick={() => navigate("/registrations/add")}>
            Add Registration
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={registrations}
          searchKey="courseName"
          onExport={handleExport}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
        />
      </div>
    </AllRegistrationsContext.Provider>
  )
} 