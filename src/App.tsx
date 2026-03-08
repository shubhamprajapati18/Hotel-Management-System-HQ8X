import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Rooms from "./pages/Rooms";
import RoomDetail from "./pages/RoomDetail";
import Login from "./pages/Login";
import MyBookings from "./pages/my-stay/MyBookings";
import RoomServicesPage from "./pages/my-stay/RoomServices";
import HousekeepingPage from "./pages/my-stay/Housekeeping";
import MaintenancePage from "./pages/my-stay/Maintenance";
import PaymentsPage from "./pages/my-stay/Payments";
import NotificationsPage from "./pages/my-stay/Notifications";
import ProfilePage from "./pages/my-stay/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminServiceRequests from "./pages/admin/AdminServiceRequests";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminHousekeeping from "./pages/admin/AdminHousekeeping";
import AdminReports from "./pages/admin/AdminReports";
import AdminMaintenance from "./pages/admin/AdminMaintenance";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminGuests from "./pages/admin/AdminGuests";
import AdminOffers from "./pages/admin/AdminOffers";
import AdminDining from "./pages/admin/AdminDining";
import AdminContactSubmissions from "./pages/admin/AdminContactSubmissions";
import AdminBookingCalendar from "./pages/admin/AdminBookingCalendar";
import AdminGroupReservations from "./pages/admin/AdminGroupReservations";
import AdminWaitlist from "./pages/admin/AdminWaitlist";
import Amenities from "./pages/Amenities";
import Dining from "./pages/Dining";
import Experiences from "./pages/Experiences";
import Offers from "./pages/Offers";
import Contact from "./pages/Contact";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Payment from "./pages/Payment";
import BookingConfirmation from "./pages/BookingConfirmation";
import AdminTestimonials from "./pages/admin/AdminTestimonials";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/amenities" element={<Amenities />} />
            <Route path="/dining" element={<Dining />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/rooms/:id" element={<RoomDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="/booking-confirmation" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />

            {/* Protected guest route */}
            <Route path="/my-stay" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="/my-stay/room-services" element={<ProtectedRoute><RoomServicesPage /></ProtectedRoute>} />
            <Route path="/my-stay/housekeeping" element={<ProtectedRoute><HousekeepingPage /></ProtectedRoute>} />
            <Route path="/my-stay/maintenance" element={<ProtectedRoute><MaintenancePage /></ProtectedRoute>} />
            <Route path="/my-stay/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
            <Route path="/my-stay/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/my-stay/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            {/* Protected admin routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/reservations" element={<ProtectedRoute adminOnly><AdminReservations /></ProtectedRoute>} />
            <Route path="/admin/rooms" element={<ProtectedRoute adminOnly><AdminRooms /></ProtectedRoute>} />
            <Route path="/admin/guests" element={<ProtectedRoute adminOnly><AdminGuests /></ProtectedRoute>} />
            <Route path="/admin/housekeeping" element={<ProtectedRoute adminOnly><AdminHousekeeping /></ProtectedRoute>} />
            <Route path="/admin/service-requests" element={<ProtectedRoute adminOnly><AdminServiceRequests /></ProtectedRoute>} />
            <Route path="/admin/maintenance" element={<ProtectedRoute adminOnly><AdminMaintenance /></ProtectedRoute>} />
            <Route path="/admin/payments" element={<ProtectedRoute adminOnly><AdminPayments /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute adminOnly><AdminReports /></ProtectedRoute>} />
            <Route path="/admin/staff" element={<ProtectedRoute adminOnly><AdminStaff /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute adminOnly><AdminSettings /></ProtectedRoute>} />
            <Route path="/admin/offers" element={<ProtectedRoute adminOnly><AdminOffers /></ProtectedRoute>} />
            <Route path="/admin/dining" element={<ProtectedRoute adminOnly><AdminDining /></ProtectedRoute>} />
            <Route path="/admin/contact-submissions" element={<ProtectedRoute adminOnly><AdminContactSubmissions /></ProtectedRoute>} />
            <Route path="/admin/booking-calendar" element={<ProtectedRoute adminOnly><AdminBookingCalendar /></ProtectedRoute>} />
            <Route path="/admin/group-reservations" element={<ProtectedRoute adminOnly><AdminGroupReservations /></ProtectedRoute>} />
            <Route path="/admin/waitlist" element={<ProtectedRoute adminOnly><AdminWaitlist /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
