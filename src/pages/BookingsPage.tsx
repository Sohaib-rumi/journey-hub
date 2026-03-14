import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useBookings } from '@/context/BookingContext';
import { csrList } from '@/data/mock-data';
import { getTotalCost, getTotalSelling, formatCurrency, getStatusColor } from '@/lib/booking-utils';
import { Search, Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

export default function BookingsPage() {
  const { bookings, deleteBooking } = useBookings();
  const [search, setSearch] = useState('');
  const [csrFilter, setCsrFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.id.toLowerCase().includes(search.toLowerCase()) ||
        b.customerName.toLowerCase().includes(search.toLowerCase());
      const matchesCsr = csrFilter === 'all' || b.csr === csrFilter;
      const matchesType = typeFilter === 'all' || b.bookingType === typeFilter;
      return matchesSearch && matchesCsr && matchesType;
    });
  }, [bookings, search, csrFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (id: string, name: string) => {
    deleteBooking(id);
    toast.success(`Booking for ${name} deleted`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {filtered.length} booking{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <Link to="/bookings/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Create Booking
            </Button>
          </Link>
        </div>

        <Card className="p-4 card-shadow">
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID or customer..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 h-9 bg-secondary border-0"
                maxLength={100}
              />
            </div>
            <Select value={csrFilter} onValueChange={(v) => { setCsrFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[160px] h-9 bg-secondary border-0">
                <SelectValue placeholder="CSR" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All CSR</SelectItem>
                {csrList.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[160px] h-9 bg-secondary border-0">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pl-3 font-medium text-muted-foreground text-xs">Booking ID</th>
                  <th className="pb-3 font-medium text-muted-foreground text-xs">Customer / Agent</th>
                  <th className="pb-3 font-medium text-muted-foreground text-xs hidden md:table-cell">CSR</th>
                  <th className="pb-3 font-medium text-muted-foreground text-xs hidden lg:table-cell">Date</th>
                  <th className="pb-3 font-medium text-muted-foreground text-xs hidden sm:table-cell">Services</th>
                  <th className="pb-3 font-medium text-muted-foreground text-xs hidden lg:table-cell text-right">Cost</th>
                  <th className="pb-3 font-medium text-muted-foreground text-xs text-right">Selling</th>
                  <th className="pb-3 font-medium text-muted-foreground text-xs text-right hidden sm:table-cell">Profit</th>
                  <th className="pb-3 font-medium text-muted-foreground text-xs">Status</th>
                  <th className="pb-3 pr-3 font-medium text-muted-foreground text-xs"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((b) => {
                  const cost = getTotalCost(b.services);
                  const selling = getTotalSelling(b.services);
                  const profit = selling - cost;
                  return (
                    <tr key={b.id} className="border-b last:border-0 hover:bg-secondary/40 transition-colors">
                      <td className="py-3 pl-3 font-mono text-xs">{b.id}</td>
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{b.customerName}</p>
                          <p className="text-xs text-muted-foreground capitalize">{b.bookingType}</p>
                        </div>
                      </td>
                      <td className="py-3 hidden md:table-cell text-muted-foreground">{b.csr}</td>
                      <td className="py-3 hidden lg:table-cell text-muted-foreground">{b.bookingDate}</td>
                      <td className="py-3 hidden sm:table-cell">
                        <Badge variant="secondary" className="text-xs">{b.services.length}</Badge>
                      </td>
                      <td className="py-3 hidden lg:table-cell text-right font-mono">{formatCurrency(cost)}</td>
                      <td className="py-3 text-right font-mono">{formatCurrency(selling)}</td>
                      <td className="py-3 text-right hidden sm:table-cell">
                        <span className={`font-mono font-medium ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {formatCurrency(profit)}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-1 rounded-full border capitalize ${getStatusColor(b.status)}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <div className="flex gap-1">
                          <Link to={`/bookings/${b.id}`}>
                            <Button variant="ghost" size="sm" className="text-xs h-7">View</Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7"
                            onClick={() => handleDelete(b.id, b.customerName)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
