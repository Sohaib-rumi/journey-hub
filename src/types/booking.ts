export type BookingType = 'customer' | 'agent';
export type ServiceType = 'airline' | 'hotel' | 'visa' | 'travel_insurance' | 'airport_parking';
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

export interface Traveler {
  id: string;
  name: string;
  passportNumber?: string;
  relationship: string;
}

export interface FlightDetails {
  flightNumber: string;
  flightClass: string;
  travelDate: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  baggage: string;
  departureTerminal: string;
}

export interface HotelDetails {
  city: string;
  checkInDate: string;
  checkOutDate: string;
  days: number;
  nights: number;
  adults: number;
  children: number;
  numberOfRooms: number;
  price: number;
  checkInTime: string;
  checkOutTime: string;
}

export interface VisaDetails {
  visaType: string;
  visaCountry: string;
  returnDate: string;
  processingFee: number;
}

export interface InsuranceDetails {
  policyNumber: string;
  insuranceType: string;
  coverageAmount: number;
  insurancePrice: number;
}

export interface ParkingDetails {
  hotelName: string;
  vehicleType: string;
  vehicleNumber: string;
  parkingFee: number;
}

export interface BookingService {
  id: string;
  type: ServiceType;
  name: string;
  vendor: string;
  costPrice: number;
  sellingPrice: number;
  details: FlightDetails | HotelDetails | VisaDetails | InsuranceDetails | ParkingDetails;
}

export interface Booking {
  id: string;
  bookingType: BookingType;
  customerId?: string;
  customerName: string;
  subAgentId?: string;
  passportNumber?: string;
  csr: string;
  bookingDate: string;
  status: BookingStatus;
  travelers: Traveler[];
  services: BookingService[];
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
  airline: 'Airline',
  hotel: 'Hotel',
  visa: 'Visa',
  travel_insurance: 'Travel Insurance',
  airport_parking: 'Airport Parking',
};

export const SERVICE_ICONS: Record<ServiceType, string> = {
  airline: '✈️',
  hotel: '🏨',
  visa: '🛂',
  travel_insurance: '🛡️',
  parking: '🚗',
} as unknown as Record<ServiceType, string>;
