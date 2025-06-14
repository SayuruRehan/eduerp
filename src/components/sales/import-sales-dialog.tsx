import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { salesService } from "@/services/salesService"
import { toast } from "sonner"
import { useAllSales } from "@/pages/sales/all-sales"

export function ImportSalesDialog() {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const { fetchSales } = useAllSales()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file to import")
      return
    }

    setLoading(true)
    try {
      const result = await salesService.importSalesFromCSV(file)
      toast.success(`Successfully imported ${result.success} sales. ${result.failed} failed.`)
      if (result.errors.length > 0) {
        console.error("Import errors:", result.errors)
      }
      setOpen(false)
      fetchSales()
    } catch (error) {
      toast.error("Failed to import sales")
      console.error("Import error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Import Sales</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Sales from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing sales data. The file should have the following columns:
            <ul className="list-disc list-inside mt-2">
              <li>studentName (required)</li>
              <li>courseId (required)</li>
              <li>courseName (required)</li>
              <li>amount (required, numeric)</li>
              <li>paymentMethod (required)</li>
              <li>paymentStatus (required)</li>
              <li>saleDate (required, YYYY-MM-DD format)</li>
              <li>notes (optional)</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!file || loading}>
            {loading ? "Importing..." : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 