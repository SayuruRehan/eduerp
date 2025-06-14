import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { MainLayout } from "@/components/layout/main-layout"
import AllUsers from "@/pages/users/all-users"
import { AddUser } from "@/pages/users/add-user"
import { ViewUser } from "@/pages/users/view-user"
import { EditUser } from "@/pages/users/edit-user"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="users" element={<AllUsers />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/view/:id" element={<ViewUser />} />
          <Route path="users/edit/:id" element={<EditUser />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
