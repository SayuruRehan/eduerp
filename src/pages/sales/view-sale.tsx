import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { salesService } from "@/services/salesService"
import { Sale } from "@/types/models"
import { toast } from "sonner"

export function ViewSale() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [sale, setSale] = useState<Sale | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSale = async () => {
      if (!id) {
        setError("Sale ID is missing")
        setLoading(false)
        return
      }
      try {
        const data = await salesService.getSaleById(id)
        if (data) {
          setSale(data)
        } else {
          setError("Sale not found")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch sale")
        toast.error("Failed to fetch sale. Please check the console for details.")
      } finally {
        setLoading(false)
      }
    }
    fetchSale()
  }, [id])

  if (loading) {
    return <div className="p-4">Loading sale details...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
        <Button className="ml-4" onClick={() => navigate("/sales")}>
          Back to Sales
        </Button>
      </div>
    )
  }

  if (!sale) {
    return (
      <div className="p-4 text-muted-foreground">
        Sale not found.
        <Button className="ml-4" onClick={() => navigate("/sales")}>
          Back to Sales
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sale Details</h2>
        <p className="text-muted-foreground">
          Information about the sale for {sale.studentName}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Sale ID</label>
          <p className="text-base font-normal">{sale.saleId}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Student Name</label>
          <p className="text-base font-normal">{sale.studentName}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Course Name</label>
          <p className="text-base font-normal">{sale.courseName}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <p className="text-base font-normal">Rs. {sale.amount.toFixed(2)}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Method</label>
          <p className="text-base font-normal">{sale.paymentMethod}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Status</label>
          <p className="text-base font-normal">{sale.paymentStatus}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Sale Date</label>
          <p className="text-base font-normal">{new Date(sale.saleDate).toLocaleDateString()}</p>
        </div>
        {sale.notes && (
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Notes</label>
            <p className="text-base font-normal">{sale.notes}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate("/sales")}
        >
          Back to Sales
        </Button>
        <Button
          onClick={() => navigate(`/sales/edit/${sale.saleId}`)}
        >
          Edit Sale
        </Button>
      </div>
    </div>
  )
} 