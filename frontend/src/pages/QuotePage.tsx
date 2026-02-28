import { useState, useEffect } from 'react';
import { Calculator, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEstimateQuote } from '../hooks/useQueries';
import { ServiceType } from '../backend';
import FormFieldError from '../components/FormFieldError';
import InlineBanner from '../components/InlineBanner';
import MotionSection from '../components/MotionSection';

type Page = 'home' | 'quote' | 'booking' | 'tracking';

interface QuotePageProps {
  onNavigate: (page: Page, selectedService?: ServiceType) => void;
  preSelectedService?: ServiceType;
}

export default function QuotePage({ onNavigate, preSelectedService }: QuotePageProps) {
  const [pickupStreet, setPickupStreet] = useState('');
  const [pickupCity, setPickupCity] = useState('');
  const [pickupState, setPickupState] = useState('');
  const [pickupZip, setPickupZip] = useState('');
  const [destStreet, setDestStreet] = useState('');
  const [destCity, setDestCity] = useState('');
  const [destState, setDestState] = useState('');
  const [destZip, setDestZip] = useState('');
  const [weight, setWeight] = useState('');
  const [itemType, setItemType] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>(
    preSelectedService || ServiceType.regional
  );
  const [estimate, setEstimate] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const estimateQuoteMutation = useEstimateQuote();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setShowSuccess(false);

    if (!validateForm()) {
      return;
    }

    const pickup = {
      street: pickupStreet,
      city: pickupCity,
      state: pickupState,
      zip: pickupZip,
      country: 'USA',
    };

    const destination = {
      street: destStreet,
      city: destCity,
      state: destState,
      zip: destZip,
      country: 'USA',
    };

    try {
      const result = await estimateQuoteMutation.mutateAsync({
        pickup,
        destination,
        weight: parseFloat(weight),
        itemType,
        serviceType,
      });

      setEstimate(result);
      setShowSuccess(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to calculate quote. Please try again.'
      );
    }
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <MotionSection>
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Get a Quote</h1>
            <p className="text-lg text-muted-foreground">
              Enter your shipment details to receive an instant price estimate
            </p>
          </div>
        </MotionSection>

        <MotionSection delay={100}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Quote Estimation Form
              </CardTitle>
              <CardDescription>
                Fill in the details below to calculate your shipping cost
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitError && (
                <div className="mb-6">
                  <InlineBanner
                    variant="error"
                    title="Quote Calculation Failed"
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
                {/* Pickup Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Pickup Location</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
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

                {/* Destination Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Destination Location</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
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
                      <Label htmlFor="itemType">Item Type *</Label>
                      <Input
                        id="itemType"
                        value={itemType}
                        onChange={(e) => setItemType(e.target.value)}
                        placeholder="Electronics, Furniture, etc."
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
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
                  </div>
                </div>

                <Button
                  type="submit"
                  className="btn-pressed w-full transition-transform"
                  disabled={estimateQuoteMutation.isPending || Object.keys(errors).length > 0}
                >
                  {estimateQuoteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    'Calculate Quote'
                  )}
                </Button>
              </form>

              {showSuccess && estimate !== null && (
                <div className="mt-6 space-y-4">
                  <InlineBanner
                    variant="success"
                    message="Quote calculated successfully!"
                    onDismiss={() => setShowSuccess(false)}
                  />
                  <div className="rounded-lg bg-primary/10 p-6 text-center">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Estimated Cost
                    </p>
                    <p className="text-4xl font-bold text-primary">${estimate.toFixed(2)}</p>
                    <p className="mt-4 text-sm text-muted-foreground">
                      This is an estimate. Final pricing may vary based on additional factors.
                    </p>
                    <Button
                      onClick={() => onNavigate('booking', serviceType)}
                      className="btn-pressed mt-4 transition-transform"
                    >
                      Proceed to Booking
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </MotionSection>
      </div>
    </div>
  );
}
