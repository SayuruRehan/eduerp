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
import { Certificate, CertificateStatus } from "@/types/models"
import { useNavigate } from "react-router-dom"
import { ColumnDef } from "@/components/ui/data-table"
import { certificateService } from "@/services/certificateService"
import { toast } from "sonner"
import { DateRange } from "react-day-picker"

export default function AllCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  const fetchCertificates = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await certificateService.getAllCertificates()
      setCertificates(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch certificates"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCertificates()
  }, [])

  const handleDelete = async (certificateId: string) => {
    try {
      await certificateService.deleteCertificate(certificateId)
      toast.success("Certificate deleted successfully")
      fetchCertificates()
    } catch (error) {
      console.error("Error deleting certificate:", error)
      toast.error("Failed to delete certificate")
    }
  }

  const columns: ColumnDef<Certificate>[] = [
    { accessorKey: "certificateId", header: "Certificate ID" },
    { accessorKey: "studentName", header: "Student Name" },
    { accessorKey: "courseName", header: "Course" },
    { accessorKey: "batchCode", header: "Batch" },
    { 
      accessorKey: "issueDate", 
      header: "Issue Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("issueDate"))
        return date.toLocaleDateString()
      }
    },
    { accessorKey: "certificateNumber", header: "Certificate Number" },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as CertificateStatus
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${
            status === CertificateStatus.ISSUED ? "bg-green-100 text-green-800" :
            status === CertificateStatus.PENDING ? "bg-yellow-100 text-yellow-800" :
            "bg-red-100 text-red-800"
          }`}>
            {status}
          </span>
        )
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const certificate = row.original
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
                <DropdownMenuItem onClick={() => navigate(`/certificates/view/${certificate.certificateId}`)}>
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/certificates/edit/${certificate.certificateId}`)}>
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
                  This action cannot be undone. This will permanently delete the certificate from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={() => handleDelete(certificate.certificateId)}>Continue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      },
    },
  ]

  if (loading) return <div className="p-4">Loading certificates...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Certificates</h2>
        <Button onClick={() => navigate("/certificates/add")}>Add Certificate</Button>
      </div>
      <DataTable
        columns={columns}
        data={certificates}
        searchKey="certificateId"
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        dateColumnKey="issueDate"
      />
    </div>
  )
} 