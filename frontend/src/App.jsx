import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserFacilitiesPage from "./pages/UserFacilitiesPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import FacilitiesPage from "./pages/admin/FacilitiesPage";
import AddFacilityPage from "./pages/admin/AddFacilityPage";
import EditFacilityPage from "./pages/admin/EditFacilityPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/facilities" element={<UserFacilitiesPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="facilities" element={<FacilitiesPage />} />
          <Route path="facilities/add" element={<AddFacilityPage />} />
          <Route path="facilities/edit/:id" element={<EditFacilityPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;