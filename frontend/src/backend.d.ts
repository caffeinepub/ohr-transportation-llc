import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TrackingEntry {
    status: ShipmentStatus;
    notes?: string;
    timestamp: bigint;
    location: string;
}
export interface ShipmentDetails {
    weight: number;
    destination: Address;
    itemDescription: string;
    pickup: Address;
    dimensions: string;
}
export interface CustomerInfo {
    name: string;
    company?: string;
    contactDetails: string;
}
export interface Booking {
    serviceType: ServiceType;
    customer: CustomerInfo;
    estimatedDelivery: bigint;
    shipment: ShipmentDetails;
    pickupTime: bigint;
    trackingHistory: Array<TrackingEntry>;
    shipmentId: string;
    currentStatus: ShipmentStatus;
}
export interface Address {
    zip: string;
    street: string;
    country: string;
    city: string;
    state: string;
}
export enum ServiceType {
    expedited = "expedited",
    dedicatedFreight = "dedicatedFreight",
    longHaul = "longHaul",
    regional = "regional"
}
export enum ShipmentStatus {
    outForDelivery = "outForDelivery",
    inTransit = "inTransit",
    pickedUp = "pickedUp",
    delivered = "delivered"
}
export interface backendInterface {
    createBooking(customer: CustomerInfo, shipment: ShipmentDetails, serviceType: ServiceType, pickupTime: bigint): Promise<string>;
    estimateQuote(pickup: Address, destination: Address, weight: number, itemType: string, serviceType: ServiceType): Promise<number>;
    getAllBookingsByPickupTime(): Promise<Array<Booking>>;
    getBooking(shipmentId: string): Promise<Booking>;
    getBookingsByStatus(status: ShipmentStatus): Promise<Array<Booking>>;
    trackShipment(shipmentId: string): Promise<{
        estimatedDelivery: bigint;
        trackingHistory: Array<TrackingEntry>;
        currentStatus: ShipmentStatus;
    }>;
    updateTracking(shipmentId: string, location: string, status: ShipmentStatus, notes: string | null): Promise<void>;
}
