import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserFacilitiesPage from "./pages/UserFacilitiesPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import FacilitiesPage from "./pages/admin/FacilitiesPage";
import AddFacilityPage from "./pages/admin/AddFacilityPage";
import EditFacilityPage from "./pages/admin/EditFacilityPage";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const AppRoutes = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/facilities"
          element={
            <ProtectedRoute>
              <UserFacilitiesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="facilities" element={<FacilitiesPage />} />
          <Route path="facilities/add" element={<AddFacilityPage />} />
          <Route path="facilities/edit/:id" element={<EditFacilityPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

function App() {
  if (!GOOGLE_CLIENT_ID) {
    return <AppRoutes />;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppRoutes />
    </GoogleOAuthProvider>
  );
}

export default App;