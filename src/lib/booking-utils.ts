import { Plane, Hotel, ShieldCheck, Car, FileText } from 'lucide-react';
import { ServiceType } from '@/types/booking';

export const serviceIconMap: Record<ServiceType, React.ElementType> = {
  airline: Plane,
  hotel: Hotel,
  visa: FileText,
  travel_insurance: ShieldCheck,
  airport_parking: Car,
};

export const serviceColorMap: Record<ServiceType, string> = {
  airline: 'text-airline bg-airline/10',
  hotel: 'text-hotel bg-hotel/10',
  visa: 'text-visa bg-visa/10',
  travel_insurance: 'text-insurance bg-insurance/10',
  airport_parking: 'text-parking bg-parking/10',
};

export const SERVICE_LABELS: Record<ServiceType, string> = {
  airline: 'Airline',
  hotel: 'Hotel',
  visa: 'Visa',
  travel_insurance: 'Insurance',
  airport_parking: 'Parking',
};

export function getProfit(cost: number, selling: number) {
  return selling - cost;
}

export function getTotalCost(services: { costPrice: number }[]) {
  return services.reduce((sum, s) => sum + s.costPrice, 0);
}

export function getTotalSelling(services: { sellingPrice: number }[]) {
  return services.reduce((sum, s) => sum + s.sellingPrice, 0);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'confirmed': return 'bg-success/10 text-success border-success/20';
    case 'pending': return 'bg-warning/10 text-warning border-warning/20';
    case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'completed': return 'bg-primary/10 text-primary border-primary/20';
    default: return 'bg-muted text-muted-foreground';
  }
}
