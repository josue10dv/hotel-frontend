import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./presentation/pages/HomePage";
import { ReservationPage } from "./presentation/pages/ReservationPage";
import LoginPage from "./presentation/pages/LoginPage";
import RegisterPage from "./presentation/pages/RegisterPage";
import ForgotPasswordPage from "./presentation/pages/ForgotPasswordPage";
import Header from "./presentation/components/Header";
import DevTools from "./presentation/components/DevTools";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/listing/:id" element={<ReservationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
      <DevTools />
    </Router>
  );
}
