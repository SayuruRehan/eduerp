import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { MainLayout } from "@/components/layout/main-layout"
import AllUsers from "@/pages/users/all-users"
import { AddUser } from "@/pages/users/add-user"
import { ViewUser } from "@/pages/users/view-user"
import { EditUser } from "@/pages/users/edit-user"
import AllStudents from "@/pages/students/all-students"
import { AddStudent } from "@/pages/students/add-student"
import { ViewStudent } from "@/pages/students/view-student"
import { EditStudent } from "@/pages/students/edit-student"
import AllSales from "@/pages/sales/all-sales"
import { AddSale } from "@/pages/sales/add-sale"
import { ViewSale } from "@/pages/sales/view-sale"
import { EditSale } from "@/pages/sales/edit-sale"
import AllCourses from "@/pages/courses/all-courses"
import { AddCourse } from "@/pages/courses/add-course"
import { EditCourse } from "@/pages/courses/edit-course"
import { ViewCourse } from "@/pages/courses/view-course"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="users" element={<AllUsers />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/view/:id" element={<ViewUser />} />
          <Route path="users/edit/:id" element={<EditUser />} />
          <Route path="students" element={<AllStudents />} />
          <Route path="students/add" element={<AddStudent />} />
          <Route path="students/view/:id" element={<ViewStudent />} />
          <Route path="students/edit/:id" element={<EditStudent />} />
          <Route path="sales" element={<AllSales />} />
          <Route path="sales/add" element={<AddSale />} />
          <Route path="sales/view/:id" element={<ViewSale />} />
          <Route path="sales/edit/:id" element={<EditSale />} />
          <Route path="courses" element={<AllCourses />} />
          <Route path="courses/add" element={<AddCourse />} />
          <Route path="courses/view/:id" element={<ViewCourse />} />
          <Route path="courses/edit/:id" element={<EditCourse />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
