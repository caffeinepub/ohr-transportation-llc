import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";



actor {
  // Data Types
  type CustomerInfo = {
    name : Text;
    contactDetails : Text;
    company : ?Text;
  };

  type Address = {
    street : Text;
    city : Text;
    state : Text;
    zip : Text;
    country : Text;
  };

  type ShipmentDetails = {
    pickup : Address;
    destination : Address;
    weight : Float;
    dimensions : Text; // e.g. "12x15x10"
    itemDescription : Text;
  };

  type ServiceType = {
    #regional;
    #longHaul;
    #dedicatedFreight;
    #expedited;
  };

  type ShipmentStatus = {
    #pickedUp;
    #inTransit;
    #outForDelivery;
    #delivered;
  };

  module ShipmentStatus {
    public func toText(status : ShipmentStatus) : Text {
      switch (status) {
        case (#pickedUp) { "Picked Up" };
        case (#inTransit) { "In Transit" };
        case (#outForDelivery) { "Out For Delivery" };
        case (#delivered) { "Delivered" };
      };
    };
  };

  type TrackingEntry = {
    location : Text;
    status : ShipmentStatus;
    timestamp : Int;
    notes : ?Text;
  };

  type Booking = {
    customer : CustomerInfo;
    shipment : ShipmentDetails;
    serviceType : ServiceType;
    pickupTime : Int;
    shipmentId : Text;
    trackingHistory : [TrackingEntry];
    currentStatus : ShipmentStatus;
    estimatedDelivery : Int;
  };

  // Persistent Storage
  let bookings = Map.empty<Text, Booking>();
  var idCounter = 0;

  module Booking {
    public func compareByPickupTime(booking1 : Booking, booking2 : Booking) : Order.Order {
      Int.compare(booking1.pickupTime, booking2.pickupTime);
    };
  };

  // Public Methods

  public shared ({ caller }) func estimateQuote(
    pickup : Address,
    destination : Address,
    weight : Float,
    itemType : Text,
    serviceType : ServiceType,
  ) : async Float {
    // Simple estimation logic based on weight and service type
    let baseRate : Float = switch (serviceType) {
      case (#regional) { 1.0 };
      case (#longHaul) { 2.0 };
      case (#dedicatedFreight) { 2.5 };
      case (#expedited) { 3.0 };
    };
    weight * baseRate * 100.0;
  };

  public shared ({ caller }) func createBooking(
    customer : CustomerInfo,
    shipment : ShipmentDetails,
    serviceType : ServiceType,
    pickupTime : Int,
  ) : async Text {
    idCounter += 1;
    let shipmentId = "SHIP" # idCounter.toText();

    let initialTracking : TrackingEntry = {
      location = shipment.pickup.city;
      status = #pickedUp;
      timestamp = Time.now();
      notes = ?"Shipment created";
    };

    let booking : Booking = {
      customer;
      shipment;
      serviceType;
      pickupTime;
      shipmentId;
      trackingHistory = [initialTracking];
      currentStatus = #pickedUp;
      estimatedDelivery = pickupTime + 172800; // +2 days
    };

    bookings.add(shipmentId, booking);
    shipmentId;
  };

  public query ({ caller }) func getBooking(shipmentId : Text) : async Booking {
    switch (bookings.get(shipmentId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) { booking };
    };
  };

  public shared ({ caller }) func updateTracking(
    shipmentId : Text,
    location : Text,
    status : ShipmentStatus,
    notes : ?Text,
  ) : async () {
    switch (bookings.get(shipmentId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let newEntry : TrackingEntry = {
          location;
          status;
          timestamp = Time.now();
          notes;
        };

        let existingHistory = List.fromArray<TrackingEntry>(booking.trackingHistory);
        existingHistory.add(newEntry);
        let updatedTrackingHistory = existingHistory.toArray();

        let updatedBooking : Booking = {
          booking with
          trackingHistory = updatedTrackingHistory;
          currentStatus = status;
        };

        bookings.add(shipmentId, updatedBooking);
      };
    };
  };

  public query ({ caller }) func trackShipment(shipmentId : Text) : async {
    currentStatus : ShipmentStatus;
    trackingHistory : [TrackingEntry];
    estimatedDelivery : Int;
  } {
    switch (bookings.get(shipmentId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        {
          currentStatus = booking.currentStatus;
          trackingHistory = booking.trackingHistory;
          estimatedDelivery = booking.estimatedDelivery;
        };
      };
    };
  };

  public query ({ caller }) func getBookingsByStatus(status : ShipmentStatus) : async [Booking] {
    bookings.values().toArray().filter(
      func(b) { b.currentStatus == status }
    );
  };

  public query ({ caller }) func getAllBookingsByPickupTime() : async [Booking] {
    bookings.values().toArray().sort(Booking.compareByPickupTime);
  };
};
