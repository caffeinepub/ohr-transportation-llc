import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Address, CustomerInfo, ServiceType, ShipmentDetails } from '../backend';

export function useEstimateQuote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pickup,
      destination,
      weight,
      itemType,
      serviceType,
    }: {
      pickup: Address;
      destination: Address;
      weight: number;
      itemType: string;
      serviceType: ServiceType;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.estimateQuote(pickup, destination, weight, itemType, serviceType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customer,
      shipment,
      serviceType,
      pickupTime,
    }: {
      customer: CustomerInfo;
      shipment: ShipmentDetails;
      serviceType: ServiceType;
      pickupTime: bigint;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createBooking(customer, shipment, serviceType, pickupTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useTrackShipment(shipmentId: string) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['tracking', shipmentId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      if (!shipmentId) throw new Error('Shipment ID required');
      return actor.trackShipment(shipmentId);
    },
    enabled: !!actor && !isFetching && !!shipmentId,
    retry: false,
  });
}

export function useGetBooking(shipmentId: string) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['booking', shipmentId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      if (!shipmentId) throw new Error('Shipment ID required');
      return actor.getBooking(shipmentId);
    },
    enabled: !!actor && !isFetching && !!shipmentId,
  });
}
