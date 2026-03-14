import { BookingService, ServiceType } from '@/types/booking';
import { serviceIconMap, serviceColorMap, SERVICE_LABELS, formatCurrency, getProfit } from '@/lib/booking-utils';
import { Card } from '@/components/ui/card';

interface ServiceCardProps {
  service: BookingService;
  compact?: boolean;
}

export function ServiceCard({ service, compact }: ServiceCardProps) {
  const Icon = serviceIconMap[service.type];
  const colorClass = serviceColorMap[service.type];
  const profit = getProfit(service.costPrice, service.sellingPrice);

  if (compact) {
    return (
      <div className="flex items-center gap-3 py-2">
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${colorClass}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{service.name}</p>
          <p className="text-xs text-muted-foreground">{SERVICE_LABELS[service.type]}</p>
        </div>
        <p className="text-sm font-medium">{formatCurrency(service.sellingPrice)}</p>
      </div>
    );
  }

  return (
    <Card className="p-4 card-shadow hover:card-shadow-hover transition-shadow">
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-semibold">{service.name}</h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {SERVICE_LABELS[service.type]}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Vendor: {service.vendor}</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Cost</p>
              <p className="text-sm font-medium">{formatCurrency(service.costPrice)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Selling</p>
              <p className="text-sm font-medium">{formatCurrency(service.sellingPrice)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Profit</p>
              <p className={`text-sm font-semibold ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(profit)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
