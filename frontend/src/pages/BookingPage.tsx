import { useState, useEffect } from 'react';
import { Package, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateBooking } from '../hooks/useQueries';
import { ServiceType } from '../backend';
import FormFieldError from '../components/FormFieldError';
import InlineBanner from '../components/InlineBanner';
import MotionSection from '../components/MotionSection';

type Page = 'home' | 'quote' | 'booking' | 'tracking';

interface BookingPageProps {
  onNavigate: (page: Page, selectedService?: ServiceType) => void;
  preSelectedService?: ServiceType;
}

export default function BookingPage({ onNavigate, preSelectedService }: BookingPageProps) {
  const [customerName, setCustomerName] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [company, setCompany] = useState('');
  const [pickupStreet, setPickupStreet] = useState('');
  const [pickupCity, setPickupCity] = useState('');
  const [pickupState, setPickupState] = useState('');
  const [pickupZip, setPickupZip] = useState('');
  const [destStreet, setDestStreet] = useState('');
  const [destCity, setDestCity] = useState('');
  const [destState, setDestState] = useState('');
  const [destZip, setDestZip] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>(
    preSelectedService || ServiceType.regional
  );
  const [pickupDate, setPickupDate] = useState('');
  const [shipmentId, setShipmentId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const createBookingMutation = useCreateBooking();

  useEffect(() => {
    if (preSelectedService) {
      setServiceType(preSelectedService);
    }
  }, [preSelectedService]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (weight && parseFloat(weight) <= 0) {
      newErrors.weight = 'Weight must be greater than 0';
    }

    if (pickupDate) {
      const selectedDate = new Date(pickupDate);
      const now = new Date();
      if (selectedDate < now) {
        newErrors.pickupDate = 'Pickup date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWeightChange = (value: string) => {
    setWeight(value);
    if (value && parseFloat(value) <= 0) {
      setErrors((prev) => ({ ...prev, weight: 'Weight must be greater than 0' }));
    } else {
      setErrors((prev) => {
        const { weight, ...rest } = prev;
        return rest;
      });
    }
  };

  const handlePickupDateChange = (value: string) => {
    setPickupDate(value);
    if (value) {
      const selectedDate = new Date(value);
      const now = new Date();
      if (selectedDate < now) {
        setErrors((prev) => ({ ...prev, pickupDate: 'Pickup date must be in the future' }));
      } else {
        setErrors((prev) => {
          const { pickupDate, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    const customer = {
      name: customerName,
      contactDetails,
      company: company || undefined,
    };

    const shipment = {
      pickup: {
        street: pickupStreet,
        city: pickupCity,
        state: pickupState,
        zip: pickupZip,
        country: 'USA',
      },
      destination: {
        street: destStreet,
        city: destCity,
        state: destState,
        zip: destZip,
        country: 'USA',
      },
      weight: parseFloat(weight),
      dimensions,
      itemDescription,
    };

    const pickupTime = BigInt(new Date(pickupDate).getTime() * 1_000_000);

    try {
      const result = await createBookingMutation.mutateAsync({
        customer,
        shipment,
        serviceType,
        pickupTime,
      });

      setShipmentId(result);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to create booking. Please try again.'
      );
    }
  };

  if (shipmentId) {
    return (
      <div className="container py-12">
        <div className="mx-auto max-w-2xl">
          <MotionSection>
            <Card className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
                <CardDescription>Your shipment has been successfully booked</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-background p-6 text-center">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Your Shipment ID
                  </p>
                  <p className="text-3xl font-bold text-primary">{shipmentId}</p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Save this ID to track your shipment
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    We've received your booking request. You'll receive a confirmation email shortly
                    with all the details.
                  </p>
                  <p className="text-muted-foreground">
                    You can track your shipment status anytime using the shipment ID above.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    onClick={() => onNavigate('tracking')}
                    className="btn-pressed flex-1 transition-transform"
                  >
                    Track Shipment
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShipmentId(null);
                      setSubmitError(null);
                      // Reset form
                      setCustomerName('');
                      setContactDetails('');
                      setCompany('');
                      setPickupStreet('');
                      setPickupCity('');
                      setPickupState('');
                      setPickupZip('');
                      setDestStreet('');
                      setDestCity('');
                      setDestState('');
                      setDestZip('');
                      setWeight('');
                      setDimensions('');
                      setItemDescription('');
                      setPickupDate('');
                      setErrors({});
                    }}
                    className="btn-pressed flex-1 transition-transform"
                  >
                    New Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </MotionSection>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <MotionSection>
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Book a Shipment</h1>
            <p className="text-lg text-muted-foreground">
              Complete the form below to schedule your shipment
            </p>
          </div>
        </MotionSection>

        <MotionSection delay={100}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Shipment Booking Form
              </CardTitle>
              <CardDescription>
                Provide your contact and shipment details to complete the booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitError && (
                <div className="mb-6">
                  <InlineBanner
                    variant="error"
                    title="Booking Failed"
                    message={submitError}
                    onDismiss={() => setSubmitError(null)}
                    action={{
                      label: 'Try Again',
                      onClick: () => setSubmitError(null),
                    }}
                  />
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Customer Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactDetails">Contact Details *</Label>
                      <Input
                        id="contactDetails"
                        value={contactDetails}
                        onChange={(e) => setContactDetails(e.target.value)}
                        placeholder="email@example.com or phone"
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="company">Company Name (Optional)</Label>
                      <Input
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="ABC Corporation"
                      />
                    </div>
                  </div>
                </div>

                {/* Pickup Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Pickup Address</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="pickupStreet">Street Address *</Label>
                      <Input
                        id="pickupStreet"
                        value={pickupStreet}
                        onChange={(e) => setPickupStreet(e.target.value)}
                        placeholder="123 Main St"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickupCity">City *</Label>
                      <Input
                        id="pickupCity"
                        value={pickupCity}
                        onChange={(e) => setPickupCity(e.target.value)}
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickupState">State *</Label>
                      <Input
                        id="pickupState"
                        value={pickupState}
                        onChange={(e) => setPickupState(e.target.value)}
                        placeholder="NY"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickupZip">ZIP Code *</Label>
                      <Input
                        id="pickupZip"
                        value={pickupZip}
                        onChange={(e) => setPickupZip(e.target.value)}
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Delivery Address</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="destStreet">Street Address *</Label>
                      <Input
                        id="destStreet"
                        value={destStreet}
                        onChange={(e) => setDestStreet(e.target.value)}
                        placeholder="456 Oak Ave"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destCity">City *</Label>
                      <Input
                        id="destCity"
                        value={destCity}
                        onChange={(e) => setDestCity(e.target.value)}
                        placeholder="Los Angeles"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destState">State *</Label>
                      <Input
                        id="destState"
                        value={destState}
                        onChange={(e) => setDestState(e.target.value)}
                        placeholder="CA"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destZip">ZIP Code *</Label>
                      <Input
                        id="destZip"
                        value={destZip}
                        onChange={(e) => setDestZip(e.target.value)}
                        placeholder="90001"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Shipment Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Shipment Details</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (lbs) *</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.01"
                        value={weight}
                        onChange={(e) => handleWeightChange(e.target.value)}
                        placeholder="1000"
                        required
                        aria-invalid={!!errors.weight}
                        aria-describedby={errors.weight ? 'weight-error' : undefined}
                      />
                      <FormFieldError message={errors.weight} id="weight-error" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dimensions">Dimensions (L x W x H) *</Label>
                      <Input
                        id="dimensions"
                        value={dimensions}
                        onChange={(e) => setDimensions(e.target.value)}
                        placeholder="48 x 40 x 36 inches"
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="itemDescription">Item Description *</Label>
                      <Textarea
                        id="itemDescription"
                        value={itemDescription}
                        onChange={(e) => setItemDescription(e.target.value)}
                        placeholder="Describe the items being shipped..."
                        rows={3}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceType">Service Type *</Label>
                      <Select
                        value={serviceType}
                        onValueChange={(value) => setServiceType(value as ServiceType)}
                      >
                        <SelectTrigger id="serviceType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ServiceType.regional}>Regional</SelectItem>
                          <SelectItem value={ServiceType.longHaul}>Long Haul</SelectItem>
                          <SelectItem value={ServiceType.expedited}>Expedited</SelectItem>
                          <SelectItem value={ServiceType.dedicatedFreight}>
                            Dedicated Freight
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickupDate">Preferred Pickup Date *</Label>
                      <Input
                        id="pickupDate"
                        type="datetime-local"
                        value={pickupDate}
                        onChange={(e) => handlePickupDateChange(e.target.value)}
                        required
                        aria-invalid={!!errors.pickupDate}
                        aria-describedby={errors.pickupDate ? 'pickupDate-error' : undefined}
                      />
                      <FormFieldError message={errors.pickupDate} id="pickupDate-error" />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="btn-pressed w-full transition-transform"
                  disabled={createBookingMutation.isPending || Object.keys(errors).length > 0}
                >
                  {createBookingMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Booking...
                    </>
                  ) : (
                    'Complete Booking'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </MotionSection>
      </div>
    </div>
  );
}
