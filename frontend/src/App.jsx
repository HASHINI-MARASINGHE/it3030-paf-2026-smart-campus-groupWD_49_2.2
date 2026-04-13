import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserFacilitiesPage from "./pages/UserFacilitiesPage";
import BookingsPage from "./pages/BookingsPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import FacilitiesPage from "./pages/admin/FacilitiesPage";
import AddFacilityPage from "./pages/admin/AddFacilityPage";
import EditFacilityPage from "./pages/admin/EditFacilityPage";
import AdminBookingsPage from "./pages/admin/BookingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/facilities" element={<UserFacilitiesPage />} />
        <Route path="/bookings" element={<BookingsPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="facilities" element={<FacilitiesPage />} />
          <Route path="facilities/add" element={<AddFacilityPage />} />
          <Route path="facilities/edit/:id" element={<EditFacilityPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;