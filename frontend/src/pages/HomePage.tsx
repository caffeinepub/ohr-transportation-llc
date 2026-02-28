import { useState } from 'react';
import { Truck, Clock, MapPin, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MotionSection from '../components/MotionSection';
import ServiceDetailsDialog from '../components/ServiceDetailsDialog';
import { ServiceType } from '../backend';

type Page = 'home' | 'quote' | 'booking' | 'tracking';

interface HomePageProps {
  onNavigate: (page: Page, selectedService?: ServiceType) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [selectedService, setSelectedService] = useState<{
    title: string;
    description: string;
    icon: typeof Truck;
    color: string;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const services = [
    {
      icon: MapPin,
      title: 'Regional',
      description:
        'Fast and reliable regional shipping services for businesses across neighboring states. Perfect for regular routes and scheduled deliveries.',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: Truck,
      title: 'Long Haul',
      description:
        'Cross-country freight transportation with experienced drivers and modern fleet. We handle coast-to-coast shipments with care and efficiency.',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      icon: Zap,
      title: 'Expedited',
      description:
        'Time-critical shipping for urgent deliveries. Our expedited service guarantees the fastest possible delivery times for your most important shipments.',
      color: 'text-red-600 dark:text-red-400',
    },
    {
      icon: Clock,
      title: 'Dedicated Freight',
      description:
        'Exclusive dedicated freight services with committed capacity. Ideal for high-volume shippers requiring consistent, reliable transportation solutions.',
      color: 'text-orange-600 dark:text-orange-400',
    },
  ];

  const handleServiceClick = (service: typeof services[0]) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  const handleServiceKeyDown = (e: React.KeyboardEvent, service: typeof services[0]) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleServiceClick(service);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <MotionSection>
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container py-16 md:py-24">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    Professional Trucking & Logistics Solutions
                  </h1>
                  <p className="text-lg text-muted-foreground md:text-xl">
                    Reliable freight transportation services across North America. From regional routes to
                    cross-country hauls, we deliver on time, every time.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    onClick={() => onNavigate('quote')}
                    className="btn-pressed gap-2 transition-transform"
                  >
                    Get a Quote <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => onNavigate('tracking')}
                    className="btn-pressed transition-transform"
                  >
                    Track Shipment
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/assets/generated/hero-truck.dim_1200x600.jpg"
                  alt="Trucking logistics"
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
      </MotionSection>

      {/* Services Section */}
      <section className="container py-16 md:py-24">
        <MotionSection>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Our Services</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Comprehensive logistics solutions tailored to your business needs
            </p>
          </div>
        </MotionSection>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <MotionSection key={service.title} delay={index * 100}>
              <Card
                className="interactive-card cursor-pointer"
                onClick={() => handleServiceClick(service)}
                onKeyDown={(e) => handleServiceKeyDown(e, service)}
                tabIndex={0}
                role="button"
                aria-label={`Learn more about ${service.title} service`}
              >
                <CardHeader>
                  <service.icon className={`mb-2 h-10 w-10 ${service.color}`} />
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{service.description}</CardDescription>
                </CardContent>
              </Card>
            </MotionSection>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container">
          <MotionSection>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <img
                  src="/assets/generated/warehouse-operations.dim_800x500.jpg"
                  alt="Warehouse operations"
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="flex flex-col justify-center space-y-6">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Why Choose Ohr Transportation LLC?
                </h2>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-semibold">Real-Time Tracking</h3>
                      <p className="text-sm text-muted-foreground">
                        Monitor your shipments 24/7 with our advanced tracking system
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-semibold">Modern Fleet</h3>
                      <p className="text-sm text-muted-foreground">
                        Well-maintained trucks equipped with the latest technology
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-semibold">Experienced Drivers</h3>
                      <p className="text-sm text-muted-foreground">
                        Professional drivers with years of experience and safety records
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-semibold">Competitive Pricing</h3>
                      <p className="text-sm text-muted-foreground">
                        Transparent pricing with no hidden fees or surprises
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </MotionSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 md:py-24">
        <MotionSection>
          <div className="rounded-lg bg-gradient-to-r from-primary to-primary/80 px-8 py-12 text-center text-primary-foreground shadow-xl md:px-12 md:py-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Ready to Ship with Us?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
              Get an instant quote or book your shipment today. Our team is ready to handle your
              logistics needs.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => onNavigate('quote')}
                className="btn-pressed gap-2 transition-transform"
              >
                Get Instant Quote <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate('booking')}
                className="btn-pressed border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground transition-transform hover:bg-primary-foreground/20"
              >
                Book Shipment
              </Button>
            </div>
          </div>
        </MotionSection>
      </section>

      <ServiceDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        service={selectedService}
        onNavigateToQuote={(serviceType) => onNavigate('quote', serviceType)}
        onNavigateToBooking={(serviceType) => onNavigate('booking', serviceType)}
      />
    </div>
  );
}
