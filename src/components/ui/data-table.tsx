import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
  RowSelectionState,
  FilterFn,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react"

export type { ColumnDef }

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey: string
  dateRange?: DateRange | undefined
  onDateRangeChange?: (range: DateRange | undefined) => void
  dateColumnKey?: string
}

const EMPTY_DATE_RANGE: DateRange = { from: undefined, to: undefined };

// Custom filter function for date range
const dateRangeFilter: FilterFn<any> = (row, columnId, filterValue: DateRange) => {
  if (!filterValue?.from && !filterValue?.to) return true;
  
  const date = new Date(row.getValue(columnId));
  const from = filterValue.from ? new Date(filterValue.from) : null;
  const to = filterValue.to ? new Date(filterValue.to) : null;
  
  if (from && to) {
    return date >= from && date <= to;
  } else if (from) {
    return date >= from;
  } else if (to) {
    return date <= to;
  }
  return true;
};

export function DataTable<TData extends Record<string, any>, TValue>({
  columns,
  data,
  searchKey,
  dateRange,
  onDateRangeChange,
  dateColumnKey,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  // Filter data based on date range
  const filteredData = useMemo(() => {
    if (!dateRange?.from && !dateRange?.to || !dateColumnKey) return data;
    
    return data.filter(item => {
      const date = new Date(item[dateColumnKey]);
      const from = dateRange.from ? new Date(dateRange.from) : null;
      const to = dateRange.to ? new Date(dateRange.to) : null;
      
      if (from && to) {
        return date >= from && date <= to;
      } else if (from) {
        return date >= from;
      } else if (to) {
        return date <= to;
      }
      return true;
    });
  }, [data, dateRange, dateColumnKey]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    enableRowSelection: true,
    filterFns: {
      dateRange: dateRangeFilter,
    },
  })

  const handleExportCSV = () => {
    const selectedRows = table.getSelectedRowModel().rows.map(row => row.original)
    if (selectedRows.length === 0) {
      toast.error("Please select at least one row to export")
      return
    }

    // Get headers from the first row
    const headers = Object.keys(selectedRows[0])
    
    // Create CSV content
    const csvContent = [
      headers.join(','), // Header row
      ...selectedRows.map(row => 
        headers.map(header => {
          const value = row[header]
          // Handle special cases like dates and numbers
          if (value instanceof Date) {
            return value.toISOString()
          }
          // Escape commas and quotes in string values
          if (typeof value === 'string') {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        }).join(',')
      )
    ].join('\n')

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'export.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search..."
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <DateRangePicker
            className="ml-auto"
            dateRange={dateRange ?? EMPTY_DATE_RANGE}
            onChange={(range) => {
              if (onDateRangeChange) {
                onDateRangeChange(range)
              }
            }}
          />
          <Button
            onClick={handleExportCSV}
            variant="outline"
            disabled={table.getSelectedRowModel().rows.length === 0}
          >
            Export Selected to CSV
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={table.getIsAllRowsSelected()}
                    onCheckedChange={(value: boolean) => table.toggleAllRowsSelected(value)}
                    aria-label="Select all"
                  />
                </TableHead>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead 
                      key={header.id}
                      className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {{
                          asc: <ChevronUp className="h-4 w-4" />,
                          desc: <ChevronDown className="h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? 
                          (header.column.getCanSort() ? <ArrowUpDown className="h-4 w-4" /> : null)}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  <TableCell>
                    <Checkbox
                      checked={row.getIsSelected()}
                      onCheckedChange={(value: boolean) => row.toggleSelected(value)}
                      aria-label="Select row"
                    />
                  </TableCell>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
} 