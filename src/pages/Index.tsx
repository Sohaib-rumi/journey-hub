import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { useBookings } from '@/context/BookingContext';
import { getTotalCost, getTotalSelling, formatCurrency } from '@/lib/booking-utils';
import { BookOpen, TrendingUp, Users, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { bookings } = useBookings();

  const stats = [
    {
      label: 'Total Bookings',
      value: bookings.length,
      icon: BookOpen,
      change: '+12%',
      color: 'text-primary bg-primary/10',
    },
    {
      label: 'Revenue',
      value: formatCurrency(bookings.reduce((s, b) => s + getTotalSelling(b.services), 0)),
      icon: TrendingUp,
      change: '+8%',
      color: 'text-success bg-success/10',
    },
    {
      label: 'Total Travelers',
      value: bookings.reduce((s, b) => s + b.travelers.length, 0),
      icon: Users,
      change: '+5%',
      color: 'text-hotel bg-hotel/10',
    },
    {
      label: 'Total Profit',
      value: formatCurrency(
        bookings.reduce(
          (s, b) => s + getTotalSelling(b.services) - getTotalCost(b.services),
          0
        )
      ),
      icon: Plane,
      change: '+15%',
      color: 'text-insurance bg-insurance/10',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back! Here's your booking overview.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-5 card-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-success">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </Card>
          ))}
        </div>

        <Card className="p-5 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Recent Bookings</h2>
            <Link to="/bookings" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {bookings.slice(0, 4).map((booking) => (
              <Link
                key={booking.id}
                to={`/bookings/${booking.id}`}
                className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-secondary/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    {booking.customerName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{booking.customerName}</p>
                    <p className="text-xs text-muted-foreground">{booking.id} · {booking.services.length} services</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(getTotalSelling(booking.services))}</p>
                  <p className="text-xs text-muted-foreground">{booking.bookingDate}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
