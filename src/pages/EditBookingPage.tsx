import { useParams, Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBookings } from '@/context/BookingContext';
import { csrList } from '@/data/mock-data';
import { SERVICE_LABELS, serviceIconMap, serviceColorMap, formatCurrency, getProfit } from '@/lib/booking-utils';
import { ArrowLeft, Plus, Trash2, Save, Edit } from 'lucide-react';
import { useState } from 'react';
import { Traveler, BookingService, ServiceType, BookingStatus } from '@/types/booking';
import { toast } from 'sonner';

const STATUS_OPTIONS: BookingStatus[] = ['confirmed', 'pending', 'cancelled', 'completed'];

export default function EditBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBooking, updateBooking } = useBookings();
  const booking = getBooking(id!);

  const [travelers, setTravelers] = useState<Traveler[]>(booking?.travelers ?? []);
  const [services, setServices] = useState<BookingService[]>(booking?.services ?? []);
  const [csr, setCsr] = useState(booking?.csr ?? '');
  const [status, setStatus] = useState<BookingStatus>(booking?.status ?? 'confirmed');
  const [passportNumber, setPassportNumber] = useState(booking?.passportNumber ?? '');
  const [travelerName, setTravelerName] = useState('');
  const [travelerPassport, setTravelerPassport] = useState('');
  const [travelerRel, setTravelerRel] = useState('');

  if (!booking) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground">Booking not found</p>
          <Link to="/bookings"><Button variant="outline" className="mt-4">Back</Button></Link>
        </div>
      </DashboardLayout>
    );
  }

  const addTraveler = () => {
    if (!travelerName.trim()) return;
    setTravelers([...travelers, {
      id: crypto.randomUUID(),
      name: travelerName.trim(),
      passportNumber: travelerPassport.trim() || undefined,
      relationship: travelerRel.trim() || 'Self',
    }]);
    setTravelerName('');
    setTravelerPassport('');
    setTravelerRel('');
  };

  const updateServicePrice = (serviceId: string, field: 'costPrice' | 'sellingPrice', value: number) => {
    setServices(services.map(s => s.id === serviceId ? { ...s, [field]: Math.max(0, value) } : s));
  };

  const removeService = (serviceId: string) => {
    setServices(services.filter(s => s.id !== serviceId));
  };

  const handleSave = () => {
    updateBooking(id!, {
      travelers,
      services,
      csr,
      status,
      passportNumber: passportNumber || undefined,
    });
    toast.success('Booking updated successfully!');
    navigate(`/bookings/${id}`);
  };

  const totalCost = services.reduce((s, sv) => s + sv.costPrice, 0);
  const totalSelling = services.reduce((s, sv) => s + sv.sellingPrice, 0);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={`/bookings/${id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Edit {booking.id}</h1>
          </div>
          <Button onClick={handleSave} className="gap-1">
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </div>

        {/* Booking Info */}
        <Card className="p-5 card-shadow space-y-4">
          <h3 className="text-sm font-semibold">Booking Info</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">CSR</Label>
              <Select value={csr} onValueChange={setCsr}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {csrList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as BookingStatus)}>
                <SelectTrigger className="mt-1 capitalize"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Passport Number</Label>
              <Input value={passportNumber} onChange={e => setPassportNumber(e.target.value)} className="mt-1" maxLength={20} />
            </div>
          </div>
        </Card>

        {/* Travelers */}
        <Card className="p-5 card-shadow space-y-4">
          <h3 className="text-sm font-semibold">Travelers ({travelers.length})</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Name</Label>
                <Input value={travelerName} onChange={e => setTravelerName(e.target.value)} className="mt-1" maxLength={100} />
              </div>
              <div>
                <Label className="text-xs">Passport</Label>
                <Input value={travelerPassport} onChange={e => setTravelerPassport(e.target.value)} className="mt-1" maxLength={20} />
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label className="text-xs">Relationship</Label>
                  <Input value={travelerRel} onChange={e => setTravelerRel(e.target.value)} className="mt-1" maxLength={50} />
                </div>
                <Button size="sm" onClick={addTraveler} className="gap-1 shrink-0">
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              </div>
            </div>
          </div>
          {travelers.map(t => (
            <div key={t.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{t.name}</span>
                <Badge variant="secondary" className="text-xs">{t.relationship}</Badge>
                {t.passportNumber && <span className="text-xs text-muted-foreground font-mono">{t.passportNumber}</span>}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setTravelers(travelers.filter(x => x.id !== t.id))}>
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          ))}
        </Card>

        {/* Services */}
        <Card className="p-5 card-shadow space-y-4">
          <h3 className="text-sm font-semibold">Services ({services.length})</h3>
          {services.map(s => {
            const Icon = serviceIconMap[s.type];
            return (
              <div key={s.id} className="p-4 rounded-xl border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${serviceColorMap[s.type]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold">{s.name}</span>
                    <Badge variant="secondary" className="text-xs">{SERVICE_LABELS[s.type]}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeService(s.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Cost Price</Label>
                    <Input
                      type="number"
                      min="0"
                      value={s.costPrice}
                      onChange={e => updateServicePrice(s.id, 'costPrice', +e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Selling Price</Label>
                    <Input
                      type="number"
                      min="0"
                      value={s.sellingPrice}
                      onChange={e => updateServicePrice(s.id, 'sellingPrice', +e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Profit</Label>
                    <p className={`mt-2.5 text-sm font-semibold ${getProfit(s.costPrice, s.sellingPrice) >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {formatCurrency(getProfit(s.costPrice, s.sellingPrice))}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          {services.length > 0 && (
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-sm font-medium">Total</span>
              <div className="flex gap-6 text-sm">
                <span className="text-muted-foreground">Cost: <strong>{formatCurrency(totalCost)}</strong></span>
                <span className="text-muted-foreground">Selling: <strong>{formatCurrency(totalSelling)}</strong></span>
                <span className={totalSelling - totalCost >= 0 ? 'text-success' : 'text-destructive'}>
                  Profit: <strong>{formatCurrency(totalSelling - totalCost)}</strong>
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
