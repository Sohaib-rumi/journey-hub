import { Booking } from '@/types/booking';

export const mockBookings: Booking[] = [
  {
    id: 'BK-2024-001',
    bookingType: 'customer',
    customerId: 'C001',
    customerName: 'James Richardson',
    csr: 'Sarah Johnson',
    bookingDate: '2024-03-15',
    status: 'confirmed',
    passportNumber: 'GB8374921',
    travelers: [
      { id: 't1', name: 'James Richardson', passportNumber: 'GB8374921', relationship: 'Self' },
      { id: 't2', name: 'Emma Richardson', passportNumber: 'GB8374922', relationship: 'Spouse' },
    ],
    services: [
      {
        id: 's1', type: 'airline', name: 'British Airways', vendor: 'BA Direct',
        costPrice: 850, sellingPrice: 1050,
        details: {
          flightNumber: 'BA-2471', flightClass: 'Economy', travelDate: '2024-04-10',
          departureAirport: 'LHR', arrivalAirport: 'CDG', departureTime: '08:30',
          arrivalTime: '10:45', status: 'Confirmed', baggage: '23kg', departureTerminal: 'T5',
        },
      },
      {
        id: 's2', type: 'airline', name: 'Air France', vendor: 'AF Direct',
        costPrice: 720, sellingPrice: 920,
        details: {
          flightNumber: 'AF-1681', flightClass: 'Economy', travelDate: '2024-04-15',
          departureAirport: 'CDG', arrivalAirport: 'LHR', departureTime: '16:00',
          arrivalTime: '16:15', status: 'Confirmed', baggage: '23kg', departureTerminal: 'T2E',
        },
      },
      {
        id: 's3', type: 'hotel', name: 'Le Marais Boutique', vendor: 'Hotels.com',
        costPrice: 600, sellingPrice: 780,
        details: {
          city: 'Paris', checkInDate: '2024-04-10', checkOutDate: '2024-04-15',
          days: 6, nights: 5, adults: 2, children: 0, numberOfRooms: 1,
          price: 780, checkInTime: '14:00', checkOutTime: '11:00',
        },
      },
      {
        id: 's4', type: 'travel_insurance', name: 'World Nomads', vendor: 'InsureCo',
        costPrice: 45, sellingPrice: 75,
        details: {
          policyNumber: 'WN-89234', insuranceType: 'Comprehensive',
          coverageAmount: 50000, insurancePrice: 75,
        },
      },
    ],
  },
  {
    id: 'BK-2024-002',
    bookingType: 'agent',
    subAgentId: 'AG-005',
    customerName: 'Ahmed Khan',
    passportNumber: 'PK4829173',
    csr: 'Michael Chen',
    bookingDate: '2024-03-18',
    status: 'pending',
    travelers: [
      { id: 't3', name: 'Ahmed Khan', passportNumber: 'PK4829173', relationship: 'Self' },
    ],
    services: [
      {
        id: 's5', type: 'airline', name: 'Emirates', vendor: 'Skyline Travel',
        costPrice: 1200, sellingPrice: 1500,
        details: {
          flightNumber: 'EK-201', flightClass: 'Business', travelDate: '2024-05-01',
          departureAirport: 'LHR', arrivalAirport: 'DXB', departureTime: '21:30',
          arrivalTime: '07:15', status: 'Confirmed', baggage: '40kg', departureTerminal: 'T3',
        },
      },
      {
        id: 's6', type: 'visa', name: 'UAE Tourist Visa', vendor: 'VisaPro',
        costPrice: 80, sellingPrice: 150,
        details: {
          visaType: 'Tourist', visaCountry: 'UAE',
          returnDate: '2024-05-15', processingFee: 150,
        },
      },
      {
        id: 's7', type: 'airport_parking', name: 'Heathrow T3 Parking', vendor: 'ParkBee',
        costPrice: 60, sellingPrice: 95,
        details: {
          hotelName: 'N/A', vehicleType: 'Sedan',
          vehicleNumber: 'AB12 CDE', parkingFee: 95,
        },
      },
    ],
  },
  {
    id: 'BK-2024-003',
    bookingType: 'customer',
    customerId: 'C015',
    customerName: 'Sophie Turner',
    csr: 'Sarah Johnson',
    bookingDate: '2024-03-20',
    status: 'completed',
    passportNumber: 'GB1029384',
    travelers: [
      { id: 't4', name: 'Sophie Turner', passportNumber: 'GB1029384', relationship: 'Self' },
      { id: 't5', name: 'Liam Turner', passportNumber: 'GB1029385', relationship: 'Child' },
      { id: 't6', name: 'Olivia Turner', passportNumber: 'GB1029386', relationship: 'Child' },
    ],
    services: [
      {
        id: 's8', type: 'airline', name: 'Lufthansa', vendor: 'LH Direct',
        costPrice: 1800, sellingPrice: 2300,
        details: {
          flightNumber: 'LH-901', flightClass: 'Premium Economy', travelDate: '2024-02-10',
          departureAirport: 'LHR', arrivalAirport: 'MUC', departureTime: '07:00',
          arrivalTime: '10:00', status: 'Completed', baggage: '2x23kg', departureTerminal: 'T2',
        },
      },
      {
        id: 's9', type: 'hotel', name: 'Munich Grand', vendor: 'Booking.com',
        costPrice: 900, sellingPrice: 1200,
        details: {
          city: 'Munich', checkInDate: '2024-02-10', checkOutDate: '2024-02-17',
          days: 8, nights: 7, adults: 1, children: 2, numberOfRooms: 1,
          price: 1200, checkInTime: '15:00', checkOutTime: '11:00',
        },
      },
    ],
  },
  {
    id: 'BK-2024-004',
    bookingType: 'agent',
    subAgentId: 'AG-012',
    customerName: 'Maria Garcia',
    passportNumber: 'ES7382910',
    csr: 'David Williams',
    bookingDate: '2024-03-22',
    status: 'cancelled',
    travelers: [
      { id: 't7', name: 'Maria Garcia', relationship: 'Self' },
    ],
    services: [
      {
        id: 's10', type: 'airline', name: 'Iberia', vendor: 'IB Agent',
        costPrice: 450, sellingPrice: 600,
        details: {
          flightNumber: 'IB-3210', flightClass: 'Economy', travelDate: '2024-04-20',
          departureAirport: 'LHR', arrivalAirport: 'MAD', departureTime: '12:30',
          arrivalTime: '15:50', status: 'Cancelled', baggage: '23kg', departureTerminal: 'T5',
        },
      },
    ],
  },
  {
    id: 'BK-2024-005',
    bookingType: 'customer',
    customerId: 'C022',
    customerName: 'Robert Chen',
    csr: 'Michael Chen',
    bookingDate: '2024-03-25',
    status: 'confirmed',
    travelers: [
      { id: 't8', name: 'Robert Chen', relationship: 'Self' },
      { id: 't9', name: 'Lisa Chen', relationship: 'Spouse' },
    ],
    services: [
      {
        id: 's11', type: 'airline', name: 'Singapore Airlines', vendor: 'SQ Direct',
        costPrice: 2800, sellingPrice: 3400,
        details: {
          flightNumber: 'SQ-321', flightClass: 'Business', travelDate: '2024-06-01',
          departureAirport: 'LHR', arrivalAirport: 'SIN', departureTime: '22:00',
          arrivalTime: '18:00', status: 'Confirmed', baggage: '2x30kg', departureTerminal: 'T2',
        },
      },
      {
        id: 's12', type: 'hotel', name: 'Marina Bay Sands', vendor: 'Expedia',
        costPrice: 2200, sellingPrice: 2800,
        details: {
          city: 'Singapore', checkInDate: '2024-06-02', checkOutDate: '2024-06-09',
          days: 8, nights: 7, adults: 2, children: 0, numberOfRooms: 1,
          price: 2800, checkInTime: '15:00', checkOutTime: '11:00',
        },
      },
      {
        id: 's13', type: 'travel_insurance', name: 'AXA Premium', vendor: 'AXA Direct',
        costPrice: 120, sellingPrice: 180,
        details: {
          policyNumber: 'AXA-55219', insuranceType: 'Premium',
          coverageAmount: 100000, insurancePrice: 180,
        },
      },
      {
        id: 's14', type: 'airport_parking', name: 'Heathrow T2 Long Stay', vendor: 'ParkBee',
        costPrice: 85, sellingPrice: 130,
        details: {
          hotelName: 'N/A', vehicleType: 'SUV',
          vehicleNumber: 'XY34 FGH', parkingFee: 130,
        },
      },
    ],
  },
];

export const csrList = ['Sarah Johnson', 'Michael Chen', 'David Williams', 'Emily Davis'];
export const customerList = [
  { id: 'C001', name: 'James Richardson' },
  { id: 'C015', name: 'Sophie Turner' },
  { id: 'C022', name: 'Robert Chen' },
  { id: 'C030', name: 'Anna Williams' },
];
export const agentList = [
  { id: 'AG-005', name: 'Skyline Travel Agency' },
  { id: 'AG-012', name: 'Global Trips Ltd' },
  { id: 'AG-018', name: 'WorldWide Tours' },
];
