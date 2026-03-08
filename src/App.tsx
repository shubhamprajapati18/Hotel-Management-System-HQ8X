import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Rooms from "./pages/Rooms";
import RoomDetail from "./pages/RoomDetail";
import Login from "./pages/Login";
import GuestDashboard from "./pages/GuestDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminHousekeeping from "./pages/admin/AdminHousekeeping";
import AdminReports from "./pages/admin/AdminReports";
import AdminMaintenance from "./pages/admin/AdminMaintenance";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminGuests from "./pages/admin/AdminGuests";
import Amenities from "./pages/Amenities";
import Dining from "./pages/Dining";
import Experiences from "./pages/Experiences";
import Offers from "./pages/Offers";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/amenities" element={<Amenities />} />
          <Route path="/dining" element={<Dining />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-stay" element={<GuestDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/reservations" element={<AdminReservations />} />
          <Route path="/admin/rooms" element={<AdminRooms />} />
          <Route path="/admin/guests" element={<AdminGuests />} />
          <Route path="/admin/housekeeping" element={<AdminHousekeeping />} />
          <Route path="/admin/maintenance" element={<AdminMaintenance />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/staff" element={<AdminStaff />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
