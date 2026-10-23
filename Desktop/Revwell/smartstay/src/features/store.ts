
import { Platform } from "react-native";

export type PaymentMethod = "MPESA" | "CARD" | "HOTEL";

export type BookingStatus =
  | "Pending Payment"
  | "Confirmed"
  | "Cancelled";

export type PaymentStatus =
  | "Pending"
  | "Simulated Paid"
  | "Pay at Hotel"
  | "Demo only";

export type Booking = {
  id: string;
  hotelId: string;
  hotelName: string;
  roomId: string;
  roomName: string;
  guestName: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  total: number;
  status: BookingStatus;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
};

const STORAGE_KEY = "smartstay.demo.bookings";

function getStorage(): Storage | null {
  if (Platform.OS !== "web" || typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getBookings(): Booking[] {
  const storage = getStorage();

  if (!storage) return [];

  try {
    const data = storage.getItem(STORAGE_KEY);

    if (!data) return [];

    const bookings = JSON.parse(data);

    return Array.isArray(bookings) ? bookings : [];
  } catch {
    return [];
  }
}

function writeBookings(bookings: Booking[]): boolean {
  const storage = getStorage();

  if (!storage) return false;

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    return true;
  } catch {
    return false;
  }
}

export function saveBooking(booking: Booking): boolean {
  const bookings = getBookings();

  if (bookings.some((item) => item.id === booking.id)) {
    return false;
  }

  return writeBookings([booking, ...bookings]);
}

export function getBookingById(
  id: string
): Booking | undefined {
  return getBookings().find((booking) => booking.id === id);
}

export function updateBooking(
  id: string,
  changes: Partial<Booking>
): boolean {
  const bookings = getBookings();

  const index = bookings.findIndex(
    (booking) => booking.id === id
  );

  if (index === -1) return false;

  bookings[index] = {
    ...bookings[index],
    ...changes,
    id: bookings[index].id,
  };

  return writeBookings(bookings);
}

export function createBookingId(): string {
  return `SS-${Date.now()}-${Math.floor(
    Math.random() * 100000
  )}`;
}

export function calculateNights(
  checkIn: string,
  checkOut: string
): number {
  if (!checkIn || !checkOut) return 0;

  const start = Date.parse(`${checkIn}T00:00:00Z`);
  const end = Date.parse(`${checkOut}T00:00:00Z`);

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return 0;
  }

  return Math.max(0, Math.round((end - start) / 86400000));
}
