import { Truck, Clock, MapPin, Zap, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ServiceType } from '../backend';

interface ServiceDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: {
    title: string;
    description: string;
    icon: typeof Truck;
    color: string;
  } | null;
  onNavigateToQuote: (serviceType: ServiceType) => void;
  onNavigateToBooking: (serviceType: ServiceType) => void;
}

const serviceDetails = {
  Regional: {
    whatsIncluded: [
      'Same-day or next-day delivery within region',
      'Dedicated regional routes',
      'Real-time GPS tracking',
      'Flexible pickup and delivery windows',
    ],
    idealFor: 'Businesses requiring regular, scheduled deliveries within neighboring states',
    timeline: '1-2 business days',
    serviceType: ServiceType.regional,
  },
  'Long Haul': {
    whatsIncluded: [
      'Coast-to-coast transportation',
      'Experienced long-distance drivers',
      'Modern fleet with advanced safety features',
      'Regular status updates',
    ],
    idealFor: 'Cross-country shipments requiring reliable, efficient transportation',
    timeline: '3-7 business days',
    serviceType: ServiceType.longHaul,
  },
  Expedited: {
    whatsIncluded: [
      'Priority handling and routing',
      'Fastest delivery times available',
      'Direct routes with minimal stops',
      '24/7 customer support',
    ],
    idealFor: 'Time-critical shipments and urgent deliveries',
    timeline: '1-3 business days',
    serviceType: ServiceType.expedited,
  },
  'Dedicated Freight': {
    whatsIncluded: [
      'Exclusive truck capacity',
      'Consistent, reliable scheduling',
      'Customized routing options',
      'Volume discount pricing',
    ],
    idealFor: 'High-volume shippers requiring committed transportation capacity',
    timeline: 'Scheduled based on your needs',
    serviceType: ServiceType.dedicatedFreight,
  },
};

export default function ServiceDetailsDialog({
  open,
  onOpenChange,
  service,
  onNavigateToQuote,
  onNavigateToBooking,
}: ServiceDetailsDialogProps) {
  if (!service) return null;

  const details = serviceDetails[service.title as keyof typeof serviceDetails];
  if (!details) return null;

  const Icon = service.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="mb-4 flex items-center gap-3">
            <div className={`rounded-lg bg-primary/10 p-3 ${service.color}`}>
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{service.title}</DialogTitle>
              <DialogDescription className="mt-1">{service.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 font-semibold">What's Included</h3>
            <ul className="space-y-2">
              {details.whatsIncluded.map((item, index) => (
                <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="mb-1 text-sm font-medium text-muted-foreground">Ideal For</p>
              <p className="text-sm">{details.idealFor}</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="mb-1 text-sm font-medium text-muted-foreground">Typical Timeline</p>
              <p className="text-sm font-semibold">{details.timeline}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="flex-1 gap-2"
              onClick={() => {
                onNavigateToQuote(details.serviceType);
                onOpenChange(false);
              }}
            >
              Get Quote <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onNavigateToBooking(details.serviceType);
                onOpenChange(false);
              }}
            >
              Book Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
