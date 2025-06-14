import { Outlet } from "react-router-dom"
import { Sidebar } from "./sidebar"

export function MainLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  )
} 