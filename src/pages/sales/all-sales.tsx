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
import { Sale } from "@/types/models"
import { useNavigate } from "react-router-dom"
import { ColumnDef } from "@/components/ui/data-table"
import { salesService } from "@/services/salesService"
import { toast } from "sonner"
import { createContext, useContext } from 'react'
import { ImportSalesDialog } from "@/components/sales/import-sales-dialog"
import { DateRange } from "react-day-picker"

interface AllSalesContextType {
  fetchSales: () => void
}

const AllSalesContext = createContext<AllSalesContextType | undefined>(undefined)

export function useAllSales() {
  const context = useContext(AllSalesContext)
  if (!context) {
    throw new Error('useAllSales must be used within an AllSalesProvider')
  }
  return context
}

export default function AllSales() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  const fetchSales = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await salesService.getAllSales()
      setSales(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch sales"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSales()
  }, [])

  const handleDelete = async (saleId: string) => {
    try {
      await salesService.deleteSale(saleId)
      toast.success("Sale deleted successfully")
      fetchSales()
    } catch (error) {
      console.error("Error deleting sale:", error)
      toast.error("Failed to delete sale")
    }
  }

  const columns: ColumnDef<Sale>[] = [
    {
      accessorKey: "saleId",
      header: "Sale ID",
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
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number
        return `Rs. ${amount.toFixed(2)}`
      },
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment Method",
    },
    {
      accessorKey: "paymentStatus",
      header: "Status",
    },
    {
      accessorKey: "saleDate",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("saleDate"))
        return date.toLocaleDateString()
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const sale = row.original

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
                <DropdownMenuItem onClick={() => navigate(`/sales/view/${sale.saleId}`)}>
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/sales/edit/${sale.saleId}`)}>
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
                  This action cannot be undone. This will permanently delete the
                  sale record from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={() => handleDelete(sale.saleId)}>Continue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      },
    },
  ]

  if (loading) {
    return <div className="p-4">Loading sales...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
        <Button 
          className="ml-4" 
          onClick={fetchSales}
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <AllSalesContext.Provider value={{ fetchSales }}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
          <div className="flex items-center gap-2">
            <ImportSalesDialog />
            <Button onClick={() => navigate("/sales/add")}>
              Add Sale
            </Button>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={sales}
          searchKey="saleId"
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          dateColumnKey="saleDate"
        />
      </div>
    </AllSalesContext.Provider>
  )
} 