import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServiceCard } from '@/components/ServiceCard';
import { mockBookings } from '@/data/mock-data';
import { getTotalCost, getTotalSelling, formatCurrency, getStatusColor } from '@/lib/booking-utils';
import { ArrowLeft, Edit, Calendar, User, Users, Plane } from 'lucide-react';
import { FlightDetails } from '@/types/booking';

export default function BookingDetailsPage() {
  const { id } = useParams();
  const booking = mockBookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground">Booking not found</p>
          <Link to="/bookings"><Button variant="outline" className="mt-4">Back to Bookings</Button></Link>
        </div>
      </DashboardLayout>
    );
  }

  const cost = getTotalCost(booking.services);
  const selling = getTotalSelling(booking.services);
  const profit = selling - cost;
  const flights = booking.services.filter((s) => s.type === 'airline');

  const routeAirports = flights.length > 0
    ? [
        (flights[0].details as FlightDetails).departureAirport,
        ...flights.map((f) => (f.details as FlightDetails).arrivalAirport),
      ]
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link to="/bookings">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{booking.id}</h1>
                <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{booking.customerName}</p>
            </div>
          </div>
          <Link to={`/bookings/${booking.id}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" /> Edit Booking
            </Button>
          </Link>
        </div>

        {/* Info cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-4 card-shadow">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                {booking.bookingType === 'agent' ? 'Agent Booking' : 'Customer'}
              </span>
            </div>
            <p className="font-semibold">{booking.customerName}</p>
            {booking.passportNumber && (
              <p className="text-xs text-muted-foreground mt-0.5">Passport: {booking.passportNumber}</p>
            )}
          </Card>
          <Card className="p-4 card-shadow">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">CSR</span>
            </div>
            <p className="font-semibold">{booking.csr}</p>
          </Card>
          <Card className="p-4 card-shadow">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Booking Date</span>
            </div>
            <p className="font-semibold">{booking.bookingDate}</p>
          </Card>
        </div>

        {/* Route visualization */}
        {routeAirports.length > 1 && (
          <Card className="p-5 card-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Plane className="h-4 w-4 text-airline" />
              <h3 className="text-sm font-semibold">Flight Route</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {routeAirports.map((airport, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">{airport}</span>
                  {i < routeAirports.length - 1 && (
                    <span className="text-muted-foreground">→</span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Travelers */}
        <Card className="p-5 card-shadow">
          <h3 className="text-sm font-semibold mb-3">Travelers ({booking.travelers.length})</h3>
          <div className="space-y-2">
            {booking.travelers.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/50">
                <span className="text-sm font-medium">{t.name}</span>
                <Badge variant="secondary" className="text-xs">{t.relationship}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Services */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Services ({booking.services.length})</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {booking.services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>

        {/* Totals */}
        <Card className="p-5 card-shadow">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
              <p className="text-xl font-bold">{formatCurrency(cost)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Selling</p>
              <p className="text-xl font-bold">{formatCurrency(selling)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Profit</p>
              <p className={`text-xl font-bold ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(profit)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
