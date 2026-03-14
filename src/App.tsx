import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BookingProvider } from "@/context/BookingContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import BookingsPage from "./pages/BookingsPage.tsx";
import BookingDetailsPage from "./pages/BookingDetailsPage.tsx";
import CreateBookingPage from "./pages/CreateBookingPage.tsx";
import EditBookingPage from "./pages/EditBookingPage.tsx";
import PlaceholderPage from "./pages/PlaceholderPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BookingProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/bookings/create" element={<CreateBookingPage />} />
            <Route path="/bookings/:id" element={<BookingDetailsPage />} />
            <Route path="/bookings/:id/edit" element={<EditBookingPage />} />
            <Route path="/customers" element={<PlaceholderPage title="Customers" />} />
            <Route path="/agents" element={<PlaceholderPage title="Agents" />} />
            <Route path="/vendors" element={<PlaceholderPage title="Vendors" />} />
            <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </BookingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
