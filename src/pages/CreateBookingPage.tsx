import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { csrList, customerList, agentList } from '@/data/mock-data';
import { Booking, BookingType, ServiceType, Traveler, BookingService } from '@/types/booking';
import { SERVICE_LABELS, serviceIconMap, serviceColorMap, formatCurrency, getProfit } from '@/lib/booking-utils';
import { ArrowLeft, ArrowRight, Plus, Trash2, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const STEPS = ['Booking Type', 'Travelers', 'Services', 'Summary'];

const emptyFlight = () => ({
  flightNumber: '', flightClass: 'Economy', travelDate: '', departureAirport: '',
  arrivalAirport: '', departureTime: '', arrivalTime: '', status: 'Confirmed',
  baggage: '23kg', departureTerminal: '',
});
const emptyHotel = () => ({
  city: '', checkInDate: '', checkOutDate: '', days: 1, nights: 1,
  adults: 1, children: 0, numberOfRooms: 1, price: 0, checkInTime: '14:00', checkOutTime: '11:00',
});
const emptyVisa = () => ({ visaType: '', visaCountry: '', returnDate: '', processingFee: 0 });
const emptyInsurance = () => ({ policyNumber: '', insuranceType: '', coverageAmount: 0, insurancePrice: 0 });
const emptyParking = () => ({ hotelName: '', vehicleType: '', vehicleNumber: '', parkingFee: 0 });

function getEmptyDetails(type: ServiceType) {
  switch (type) {
    case 'airline': return emptyFlight();
    case 'hotel': return emptyHotel();
    case 'visa': return emptyVisa();
    case 'travel_insurance': return emptyInsurance();
    case 'airport_parking': return emptyParking();
  }
}

export default function CreateBookingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [bookingType, setBookingType] = useState<BookingType>('customer');
  const [customerId, setCustomerId] = useState('');
  const [subAgentId, setSubAgentId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [csr, setCsr] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [travelerName, setTravelerName] = useState('');
  const [travelerRelationship, setTravelerRelationship] = useState('');
  const [services, setServices] = useState<BookingService[]>([]);
  const [editingService, setEditingService] = useState<Partial<BookingService> | null>(null);
  const [serviceType, setServiceType] = useState<ServiceType>('airline');

  const addTraveler = () => {
    if (!travelerName.trim()) return;
    setTravelers([...travelers, { id: crypto.randomUUID(), name: travelerName, relationship: travelerRelationship || 'Self' }]);
    setTravelerName('');
    setTravelerRelationship('');
  };

  const removeTraveler = (id: string) => setTravelers(travelers.filter(t => t.id !== id));

  const startNewService = () => {
    setEditingService({
      id: crypto.randomUUID(),
      type: serviceType,
      name: '',
      vendor: '',
      costPrice: 0,
      sellingPrice: 0,
      details: getEmptyDetails(serviceType),
    });
  };

  const saveService = () => {
    if (!editingService?.name) return;
    const existing = services.findIndex(s => s.id === editingService.id);
    if (existing >= 0) {
      const updated = [...services];
      updated[existing] = editingService as BookingService;
      setServices(updated);
    } else {
      setServices([...services, editingService as BookingService]);
    }
    setEditingService(null);
  };

  const removeService = (id: string) => setServices(services.filter(s => s.id !== id));

  const totalCost = services.reduce((s, sv) => s + sv.costPrice, 0);
  const totalSelling = services.reduce((s, sv) => s + sv.sellingPrice, 0);
  const totalProfit = totalSelling - totalCost;

  const canNext = () => {
    if (step === 0) return csr && bookingDate && (bookingType === 'customer' ? customerId : subAgentId && customerName);
    if (step === 1) return travelers.length > 0;
    if (step === 2) return services.length > 0;
    return true;
  };

  const handleSubmit = () => {
    toast.success('Booking created successfully!');
    navigate('/bookings');
  };

  const updateDetail = (key: string, value: any) => {
    if (!editingService) return;
    setEditingService({
      ...editingService,
      details: { ...(editingService.details as any), [key]: value },
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <Link to="/bookings">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Create Booking</h1>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 transition-colors ${
                i < step ? 'bg-success text-success-foreground' :
                i === step ? 'bg-primary text-primary-foreground' :
                'bg-secondary text-muted-foreground'
              }`}>
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 rounded ${i < step ? 'bg-success' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm font-medium">{STEPS[step]}</p>

        {/* Step 0: Booking Type */}
        {step === 0 && (
          <Card className="p-5 card-shadow space-y-4">
            <div>
              <Label className="text-xs mb-2 block">Booking Type</Label>
              <div className="grid grid-cols-2 gap-3">
                {(['customer', 'agent'] as BookingType[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setBookingType(t)}
                    className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                      bookingType === t
                        ? 'border-primary bg-accent text-accent-foreground ring-1 ring-primary'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    {t === 'customer' ? '👤 Customer Booking' : '🏢 Agent Booking'}
                  </button>
                ))}
              </div>
            </div>

            {bookingType === 'customer' ? (
              <div>
                <Label className="text-xs">Customer</Label>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select customer" /></SelectTrigger>
                  <SelectContent>
                    {customerList.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Sub Agent</Label>
                  <Select value={subAgentId} onValueChange={setSubAgentId}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select agent" /></SelectTrigger>
                    <SelectContent>
                      {agentList.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Customer Name</Label>
                  <Input value={customerName} onChange={e => setCustomerName(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Passport Number</Label>
                  <Input value={passportNumber} onChange={e => setPassportNumber(e.target.value)} className="mt-1" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">CSR</Label>
                <Select value={csr} onValueChange={setCsr}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select CSR" /></SelectTrigger>
                  <SelectContent>
                    {csrList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Booking Date</Label>
                <Input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="mt-1" />
              </div>
            </div>
          </Card>
        )}

        {/* Step 1: Travelers */}
        {step === 1 && (
          <Card className="p-5 card-shadow space-y-4">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Label className="text-xs">Name</Label>
                <Input value={travelerName} onChange={e => setTravelerName(e.target.value)} className="mt-1" placeholder="Traveler name" />
              </div>
              <div className="w-40">
                <Label className="text-xs">Relationship</Label>
                <Input value={travelerRelationship} onChange={e => setTravelerRelationship(e.target.value)} className="mt-1" placeholder="Self, Spouse..." />
              </div>
              <Button onClick={addTraveler} size="sm" className="gap-1 shrink-0">
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>
            {travelers.length > 0 && (
              <div className="space-y-2">
                {travelers.map(t => (
                  <div key={t.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-secondary/50">
                    <div>
                      <span className="text-sm font-medium">{t.name}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">{t.relationship}</Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeTraveler(t.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Step 2: Services */}
        {step === 2 && (
          <div className="space-y-4">
            {!editingService && (
              <Card className="p-5 card-shadow space-y-4">
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Label className="text-xs">Service Type</Label>
                    <Select value={serviceType} onValueChange={(v) => setServiceType(v as ServiceType)}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(SERVICE_LABELS).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={startNewService} className="gap-1 shrink-0">
                    <Plus className="h-3.5 w-3.5" /> Add Service
                  </Button>
                </div>
              </Card>
            )}

            {editingService && (
              <Card className="p-5 card-shadow space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{SERVICE_LABELS[editingService.type!]} Details</h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingService(null)}>Cancel</Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Name</Label>
                    <Input value={editingService.name} onChange={e => setEditingService({ ...editingService, name: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Vendor</Label>
                    <Input value={editingService.vendor} onChange={e => setEditingService({ ...editingService, vendor: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Cost Price</Label>
                    <Input type="number" value={editingService.costPrice} onChange={e => setEditingService({ ...editingService, costPrice: +e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Selling Price</Label>
                    <Input type="number" value={editingService.sellingPrice} onChange={e => setEditingService({ ...editingService, sellingPrice: +e.target.value })} className="mt-1" />
                  </div>
                </div>

                {/* Dynamic fields based on service type */}
                <ServiceDetailFields type={editingService.type!} details={editingService.details as any} onChange={updateDetail} />

                <Button onClick={saveService} className="w-full gap-1">
                  <Check className="h-3.5 w-3.5" /> Save Service
                </Button>
              </Card>
            )}

            {services.length > 0 && (
              <Card className="p-4 card-shadow">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2 text-xs font-medium text-muted-foreground">Type</th>
                        <th className="pb-2 text-xs font-medium text-muted-foreground">Name</th>
                        <th className="pb-2 text-xs font-medium text-muted-foreground hidden sm:table-cell">Vendor</th>
                        <th className="pb-2 text-xs font-medium text-muted-foreground text-right">Cost</th>
                        <th className="pb-2 text-xs font-medium text-muted-foreground text-right">Selling</th>
                        <th className="pb-2 text-xs font-medium text-muted-foreground text-right hidden sm:table-cell">Profit</th>
                        <th className="pb-2 text-xs font-medium text-muted-foreground"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map(s => {
                        const Icon = serviceIconMap[s.type];
                        return (
                          <tr key={s.id} className="border-b last:border-0">
                            <td className="py-2.5">
                              <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${serviceColorMap[s.type]}`}>
                                <Icon className="h-3.5 w-3.5" />
                              </div>
                            </td>
                            <td className="py-2.5 font-medium">{s.name}</td>
                            <td className="py-2.5 text-muted-foreground hidden sm:table-cell">{s.vendor}</td>
                            <td className="py-2.5 text-right font-mono">{formatCurrency(s.costPrice)}</td>
                            <td className="py-2.5 text-right font-mono">{formatCurrency(s.sellingPrice)}</td>
                            <td className="py-2.5 text-right font-mono hidden sm:table-cell">
                              <span className={getProfit(s.costPrice, s.sellingPrice) >= 0 ? 'text-success' : 'text-destructive'}>
                                {formatCurrency(getProfit(s.costPrice, s.sellingPrice))}
                              </span>
                            </td>
                            <td className="py-2.5">
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setEditingService(s)}>Edit</Button>
                                <Button variant="ghost" size="sm" className="h-7" onClick={() => removeService(s.id)}>
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
              </Card>
            )}
          </div>
        )}

        {/* Step 3: Summary */}
        {step === 3 && (
          <div className="space-y-4">
            <Card className="p-5 card-shadow">
              <h3 className="text-sm font-semibold mb-3">Travelers ({travelers.length})</h3>
              {travelers.map(t => (
                <div key={t.id} className="flex items-center gap-2 py-1.5">
                  <span className="text-sm">{t.name}</span>
                  <Badge variant="secondary" className="text-xs">{t.relationship}</Badge>
                </div>
              ))}
            </Card>
            <Card className="p-5 card-shadow">
              <h3 className="text-sm font-semibold mb-3">Services ({services.length})</h3>
              <div className="space-y-2">
                {services.map(s => (
                  <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{s.name}</span>
                      <Badge variant="secondary" className="text-xs">{SERVICE_LABELS[s.type]}</Badge>
                    </div>
                    <span className="text-sm font-mono">{formatCurrency(s.sellingPrice)}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5 card-shadow">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                  <p className="text-xl font-bold">{formatCurrency(totalCost)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Selling</p>
                  <p className="text-xl font-bold">{formatCurrency(totalSelling)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Profit</p>
                  <p className={`text-xl font-bold ${totalProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatCurrency(totalProfit)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-2">
          <Button variant="outline" onClick={() => step > 0 ? setStep(step - 1) : navigate('/bookings')} className="gap-1">
            <ArrowLeft className="h-4 w-4" /> {step === 0 ? 'Cancel' : 'Back'}
          </Button>
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canNext()} className="gap-1">
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="gap-1">
              <Check className="h-4 w-4" /> Save Booking
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function ServiceDetailFields({ type, details, onChange }: { type: ServiceType; details: any; onChange: (key: string, value: any) => void }) {
  const field = (label: string, key: string, inputType = 'text') => (
    <div key={key}>
      <Label className="text-xs">{label}</Label>
      <Input
        type={inputType}
        value={details?.[key] ?? ''}
        onChange={e => onChange(key, inputType === 'number' ? +e.target.value : e.target.value)}
        className="mt-1"
      />
    </div>
  );

  switch (type) {
    case 'airline':
      return (
        <div className="grid grid-cols-2 gap-3">
          {field('Flight Number', 'flightNumber')}
          {field('Class', 'flightClass')}
          {field('Travel Date', 'travelDate', 'date')}
          {field('Departure Airport', 'departureAirport')}
          {field('Arrival Airport', 'arrivalAirport')}
          {field('Departure Time', 'departureTime', 'time')}
          {field('Arrival Time', 'arrivalTime', 'time')}
          {field('Baggage', 'baggage')}
          {field('Terminal', 'departureTerminal')}
          {field('Status', 'status')}
        </div>
      );
    case 'hotel':
      return (
        <div className="grid grid-cols-2 gap-3">
          {field('City', 'city')}
          {field('Check-in Date', 'checkInDate', 'date')}
          {field('Check-out Date', 'checkOutDate', 'date')}
          {field('Days', 'days', 'number')}
          {field('Nights', 'nights', 'number')}
          {field('Adults', 'adults', 'number')}
          {field('Children', 'children', 'number')}
          {field('Rooms', 'numberOfRooms', 'number')}
          {field('Check-in Time', 'checkInTime', 'time')}
          {field('Check-out Time', 'checkOutTime', 'time')}
        </div>
      );
    case 'visa':
      return (
        <div className="grid grid-cols-2 gap-3">
          {field('Visa Type', 'visaType')}
          {field('Country', 'visaCountry')}
          {field('Return Date', 'returnDate', 'date')}
          {field('Processing Fee', 'processingFee', 'number')}
        </div>
      );
    case 'travel_insurance':
      return (
        <div className="grid grid-cols-2 gap-3">
          {field('Policy Number', 'policyNumber')}
          {field('Insurance Type', 'insuranceType')}
          {field('Coverage Amount', 'coverageAmount', 'number')}
          {field('Insurance Price', 'insurancePrice', 'number')}
        </div>
      );
    case 'airport_parking':
      return (
        <div className="grid grid-cols-2 gap-3">
          {field('Hotel Name', 'hotelName')}
          {field('Vehicle Type', 'vehicleType')}
          {field('Vehicle Number', 'vehicleNumber')}
          {field('Parking Fee', 'parkingFee', 'number')}
        </div>
      );
  }
}
