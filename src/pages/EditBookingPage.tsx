import { useParams, Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { mockBookings } from '@/data/mock-data';
import { SERVICE_LABELS, serviceIconMap, serviceColorMap, formatCurrency, getProfit } from '@/lib/booking-utils';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { useState } from 'react';
import { Traveler, BookingService } from '@/types/booking';
import { toast } from 'sonner';

export default function EditBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const booking = mockBookings.find((b) => b.id === id);

  const [travelers, setTravelers] = useState<Traveler[]>(booking?.travelers ?? []);
  const [services, setServices] = useState<BookingService[]>(booking?.services ?? []);
  const [travelerName, setTravelerName] = useState('');
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
    setTravelers([...travelers, { id: crypto.randomUUID(), name: travelerName, relationship: travelerRel || 'Self' }]);
    setTravelerName('');
    setTravelerRel('');
  };

  const updateServicePrice = (serviceId: string, field: 'costPrice' | 'sellingPrice', value: number) => {
    setServices(services.map(s => s.id === serviceId ? { ...s, [field]: value } : s));
  };

  const handleSave = () => {
    toast.success('Booking updated successfully!');
    navigate(`/bookings/${id}`);
  };

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

        {/* Travelers */}
        <Card className="p-5 card-shadow space-y-4">
          <h3 className="text-sm font-semibold">Travelers</h3>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Label className="text-xs">Name</Label>
              <Input value={travelerName} onChange={e => setTravelerName(e.target.value)} className="mt-1" />
            </div>
            <div className="w-36">
              <Label className="text-xs">Relationship</Label>
              <Input value={travelerRel} onChange={e => setTravelerRel(e.target.value)} className="mt-1" />
            </div>
            <Button size="sm" onClick={addTraveler} className="gap-1 shrink-0">
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </div>
          {travelers.map(t => (
            <div key={t.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/50">
              <div>
                <span className="text-sm font-medium">{t.name}</span>
                <Badge variant="secondary" className="ml-2 text-xs">{t.relationship}</Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setTravelers(travelers.filter(x => x.id !== t.id))}>
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          ))}
        </Card>

        {/* Services */}
        <Card className="p-5 card-shadow space-y-4">
          <h3 className="text-sm font-semibold">Services</h3>
          {services.map(s => {
            const Icon = serviceIconMap[s.type];
            return (
              <div key={s.id} className="p-4 rounded-xl border space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${serviceColorMap[s.type]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold">{s.name}</span>
                  <Badge variant="secondary" className="text-xs">{SERVICE_LABELS[s.type]}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Cost Price</Label>
                    <Input
                      type="number"
                      value={s.costPrice}
                      onChange={e => updateServicePrice(s.id, 'costPrice', +e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Selling Price</Label>
                    <Input
                      type="number"
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
        </Card>
      </div>
    </DashboardLayout>
  );
}
