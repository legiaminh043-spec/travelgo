import { Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Hero from "./components/home/Hero";
import Services from "./components/home/Services";
import Destinations from "./components/home/Destinations";
import Footer from "./components/layout/Footer";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import SearchResults from "./pages/SearchResults";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import BookingSuccess from "./pages/BookingSuccess";
import MyBookings from "./pages/MyBookings";
import Notifications from "./pages/Notifications";
import FlightDetail from "./pages/FlightDetail";
import FlightReview from "./pages/FlightReview";
import MapGuide from "./pages/MapGuide";
import Profile from "./pages/Profile";

import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminFlights from "./pages/Admin/AdminFlights";
import AdminSeats from "./pages/AdminSeats";
import AdminBookings from "./pages/Admin/AdminBookings";
import AdminUsers from "./pages/AdminUsers";
import AdminPromotions from "./pages/AdminPromotions";
import AdminReviews from "./pages/AdminReviews";
import AdminRevenue from "./pages/AdminRevenue";
import AdminNotifications from "./pages/AdminNotifications";
function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <Destinations />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      {/* Trang người dùng */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/payment" element={<Payment />} />
      <Route
        path="/booking-success"
        element={<BookingSuccess />}
      />
      <Route
        path="/my-bookings"
        element={<MyBookings />}
      />
      <Route
        path="/notifications"
        element={<Notifications />}
      />
      <Route
        path="/flight-detail"
        element={<FlightDetail />}
      />
      <Route
        path="/flight-review"
        element={<FlightReview />}
      />
      <Route
        path="/map"
        element={<MapGuide />}
      />
      <Route
        path="/profile"
        element={<Profile />}
      />

      {/* Trang Admin */}
      <Route element={<AdminRoute />}>
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />
        <Route
          path="/admin/flights"
          element={<AdminFlights />}
        />
        <Route
          path="/admin/seats"
          element={<AdminSeats />}
        />
        <Route
          path="/admin/bookings"
          element={<AdminBookings />}
        />
        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />
        <Route
          path="/admin/promotions"
          element={<AdminPromotions />}
        />
        <Route
          path="/admin/reviews"
          element={<AdminReviews />}
        />
        <Route
          path="/admin/revenue"
          element={<AdminRevenue />}
        />
        <Route
          path="/admin/notifications"
          element={<AdminNotifications />}
        />
      </Route>
    </Routes>
  );
}

export default App;