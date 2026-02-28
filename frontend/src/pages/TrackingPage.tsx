import { useState } from 'react';
import { Search, Loader2, MapPin, Clock, Package, CheckCircle2, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useTrackShipment } from '../hooks/useQueries';
import { ShipmentStatus } from '../backend';
import TrackingResultsSkeleton from '../components/TrackingResultsSkeleton';
import MotionSection from '../components/MotionSection';

type Page = 'home' | 'quote' | 'booking' | 'tracking';

interface TrackingPageProps {
  onNavigate: (page: Page) => void;
}

export default function TrackingPage({ onNavigate }: TrackingPageProps) {
  const [shipmentId, setShipmentId] = useState('');
  const [searchedId, setSearchedId] = useState('');
  const [copied, setCopied] = useState(false);
  const [expandedEntries, setExpandedEntries] = useState<Set<number>>(new Set());

  const { data: trackingData, isLoading, error } = useTrackShipment(searchedId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedId(shipmentId);
    setExpandedEntries(new Set());
  };

  const handleCopyShipmentId = async () => {
    try {
      await navigator.clipboard.writeText(searchedId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleEntry = (index: number) => {
    setExpandedEntries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: ShipmentStatus) => {
    switch (status) {
      case ShipmentStatus.pickedUp:
        return 'bg-blue-500';
      case ShipmentStatus.inTransit:
        return 'bg-yellow-500';
      case ShipmentStatus.outForDelivery:
        return 'bg-orange-500';
      case ShipmentStatus.delivered:
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: ShipmentStatus) => {
    switch (status) {
      case ShipmentStatus.pickedUp:
        return 'Picked Up';
      case ShipmentStatus.inTransit:
        return 'In Transit';
      case ShipmentStatus.outForDelivery:
        return 'Out For Delivery';
      case ShipmentStatus.delivered:
        return 'Delivered';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <MotionSection>
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Track Your Shipment</h1>
            <p className="text-lg text-muted-foreground">
              Enter your shipment ID to view real-time tracking information
            </p>
          </div>
        </MotionSection>

        <MotionSection delay={100}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Shipment Tracking
              </CardTitle>
              <CardDescription>Enter your shipment ID to track your delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="shipmentId" className="sr-only">
                    Shipment ID
                  </Label>
                  <Input
                    id="shipmentId"
                    value={shipmentId}
                    onChange={(e) => setShipmentId(e.target.value)}
                    placeholder="Enter shipment ID (e.g., SHIP123)"
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="btn-pressed transition-transform">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Tracking...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Track
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </MotionSection>

        {error && (
          <MotionSection delay={200}>
            <Card className="border-destructive/50 bg-destructive/10">
              <CardContent className="pt-6">
                <p className="text-center text-destructive">
                  Shipment not found. Please check your shipment ID and try again.
                </p>
              </CardContent>
            </Card>
          </MotionSection>
        )}

        {isLoading && searchedId && (
          <MotionSection delay={200}>
            <TrackingResultsSkeleton />
          </MotionSection>
        )}

        {trackingData && !isLoading && (
          <MotionSection delay={200}>
            <div className="space-y-6">
              {/* Status Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Shipment Status</CardTitle>
                    <Badge className={getStatusColor(trackingData.currentStatus)}>
                      {getStatusText(trackingData.currentStatus)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <CardDescription>Shipment ID: {searchedId}</CardDescription>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={handleCopyShipmentId}
                      aria-label="Copy shipment ID"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-lg border p-4">
                      <Clock className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Estimated Delivery
                        </p>
                        <p className="font-semibold">{formatDate(trackingData.estimatedDelivery)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border p-4">
                      <Package className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                        <p className="font-semibold">{getStatusText(trackingData.currentStatus)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tracking Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Tracking History</CardTitle>
                  <CardDescription>Detailed timeline of your shipment's journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative space-y-6">
                    {trackingData.trackingHistory
                      .slice()
                      .reverse()
                      .map((entry, index) => {
                        const isExpanded = expandedEntries.has(index);
                        const hasNotes = !!entry.notes;

                        return (
                          <div key={index} className="relative flex gap-4">
                            {/* Timeline line */}
                            {index !== trackingData.trackingHistory.length - 1 && (
                              <div className="absolute left-4 top-10 h-full w-0.5 bg-border" />
                            )}

                            {/* Status icon */}
                            <div
                              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${getStatusColor(entry.status)} text-white`}
                            >
                              {entry.status === ShipmentStatus.delivered ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <MapPin className="h-4 w-4" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 rounded-lg border bg-card p-4">
                              <div className="mb-2 flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <p className="font-semibold">{getStatusText(entry.status)}</p>
                                  <p className="text-sm text-muted-foreground">{entry.location}</p>
                                </div>
                                <Badge variant="outline" className="shrink-0">
                                  {formatDate(entry.timestamp)}
                                </Badge>
                              </div>
                              {hasNotes && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-2 h-auto p-0 text-xs hover:bg-transparent"
                                    onClick={() => toggleEntry(index)}
                                    aria-expanded={isExpanded}
                                    aria-label={isExpanded ? 'Hide details' : 'Show details'}
                                  >
                                    {isExpanded ? (
                                      <>
                                        <ChevronUp className="mr-1 h-3 w-3" />
                                        Hide details
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown className="mr-1 h-3 w-3" />
                                        Show details
                                      </>
                                    )}
                                  </Button>
                                  {isExpanded && (
                                    <div className="mt-3 rounded-md bg-muted/50 p-3">
                                      <p className="text-sm text-muted-foreground">{entry.notes}</p>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Actions */}
              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="mb-4 text-sm text-muted-foreground">
                      Need help with your shipment?
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                      <Button
                        variant="outline"
                        onClick={() => onNavigate('home')}
                        className="btn-pressed transition-transform"
                      >
                        Back to Home
                      </Button>
                      <Button
                        onClick={() => onNavigate('booking')}
                        className="btn-pressed transition-transform"
                      >
                        Book Another Shipment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </MotionSection>
        )}
      </div>
    </div>
  );
}
