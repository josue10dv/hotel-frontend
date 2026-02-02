import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./presentation/context/AuthContext";
import HomePage from "./presentation/pages/HomePage";
import { ReservationPage } from "./presentation/pages/ReservationPage";
import LoginPage from "./presentation/pages/LoginPage";
import RegisterPage from "./presentation/pages/RegisterPage";
import ForgotPasswordPage from "./presentation/pages/ForgotPasswordPage";
import HostPage from "./presentation/pages/HostPage";
import RoomManagementPage from "./presentation/pages/RoomManagementPage";
import DashboardPage from "./presentation/pages/DashboardPage";
import MyReservationsPage from "./presentation/pages/MyReservationsPage";
import ProfilePage from "./presentation/pages/ProfilePage";
import { WishlistPage } from "./presentation/pages/WishlistPage";
import { NotificationsPage } from "./presentation/pages/NotificationsPage";
import OwnerReservationsPage from "./presentation/pages/OwnerReservationsPage";
import DevTools from "./presentation/components/DevTools";

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes with MainLayout */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/listing/:id" element={<ReservationPage />} />

                    {/* Auth Routes - No Layout */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                    {/* Protected Routes with DashboardLayout */}
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/reservations" element={<MyReservationsPage />} />
                    <Route path="/host" element={<HostPage />} />
                    <Route path="/host/reservations" element={<OwnerReservationsPage />} />
                    <Route path="/host/hotels/:hotelId/rooms" element={<RoomManagementPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
                <DevTools />
            </Router>
        </AuthProvider>
    );
}
