import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Booking } from '@/types/booking';
import { mockBookings as initialBookings } from '@/data/mock-data';

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  getBooking: (id: string) => Booking | undefined;
  generateId: () => string;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [counter, setCounter] = useState(initialBookings.length + 1);

  const generateId = useCallback(() => {
    const id = `BK-2024-${String(counter).padStart(3, '0')}`;
    setCounter(c => c + 1);
    return id;
  }, [counter]);

  const addBooking = useCallback((booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  }, []);

  const updateBooking = useCallback((id: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  }, []);

  const deleteBooking = useCallback((id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  }, []);

  const getBooking = useCallback((id: string) => {
    return bookings.find(b => b.id === id);
  }, [bookings]);

  return (
    <BookingContext.Provider value={{ bookings, addBooking, updateBooking, deleteBooking, getBooking, generateId }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBookings must be used within BookingProvider');
  return ctx;
}
