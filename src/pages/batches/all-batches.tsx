import { useState, useEffect, createContext, useContext } from "react"
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
import { batchService } from "@/services/batchService"
import { Batch } from "@/types/models"
import { toast } from "sonner"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"

interface AllBatchesContextType {
  fetchBatches: () => void
}

const AllBatchesContext = createContext<AllBatchesContextType | undefined>(undefined)

export const useAllBatchesContext = () => {
  const context = useContext(AllBatchesContext)
  if (!context) {
    throw new Error('useAllBatchesContext must be used within an AllBatchesProvider')
  }
  return context
}

export default function AllBatches() {
  const navigate = useNavigate()
  const [batches, setBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  const fetchBatches = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await batchService.getAllBatches()
      setBatches(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch batches"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBatches()
  }, [])

  const handleDelete = async (batchCode: string) => {
    try {
      await batchService.deleteBatch(batchCode)
      toast.success("Batch deleted successfully")
      fetchBatches()
    } catch (error) {
      toast.error("Failed to delete batch")
    }
  }

  const columns: ColumnDef<Batch>[] = [
    {
      accessorKey: "batchCode",
      header: "Batch Code",
    },
    {
      accessorKey: "branch",
      header: "Branch",
    },
    {
      accessorKey: "courseName",
      header: "Course",
    },
    {
      accessorKey: "lecturer",
      header: "Lecturer",
    },
    {
      accessorKey: "coordinator",
      header: "Coordinator",
    },
    {
      accessorKey: "noOfStudents",
      header: "No. of Students",
    },
    {
      accessorKey: "plannedDate",
      header: "Planned Date",
      cell: ({ row }: any) => format(new Date(row.getValue("plannedDate")), "PPP"),
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }: any) => row.getValue("startDate") ? format(new Date(row.getValue("startDate")), "PPP") : "N/A",
    },
    {
      accessorKey: "lockedDate",
      header: "Locked Date",
      cell: ({ row }: any) => row.getValue("lockedDate") ? format(new Date(row.getValue("lockedDate")), "PPP") : "N/A",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const batch = row.original

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
                  onClick={() => navigate(`/batches/view/${batch.batchCode}`)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/batches/edit/${batch.batchCode}`)}
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
                  batch and remove its data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={() => handleDelete(batch.batchCode)}>Continue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      },
    },
  ]

  if (loading) {
    return <div className="p-4">Loading batches...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
        <Button 
          className="ml-4" 
          onClick={fetchBatches}
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <AllBatchesContext.Provider value={{ fetchBatches }}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Batches</h2>
          <Button onClick={() => navigate("/batches/add")}>
            Add Batch
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={batches}
          searchKey="batchCode"
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>
    </AllBatchesContext.Provider>
  )
} 