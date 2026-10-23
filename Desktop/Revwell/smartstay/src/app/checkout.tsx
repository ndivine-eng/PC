
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import BookingCalendar from "../components/BookingCalendar";
import { hotels, formatKES } from "../features/data";
import {
  calculateNights,
  createBookingId,
  saveBooking,
  type Booking,
} from "../features/store";

const NAVY = "#10233F";
const GOLD = "#C69C43";

function dateString(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function nextDay(value: string): string {
  const [y, m, d] = value.split("-").map(Number);
  return dateString(new Date(y, m - 1, d + 1));
}

export default function CheckoutScreen() {
  const { hotelId, roomId } = useLocalSearchParams<{
    hotelId?: string;
    roomId?: string;
  }>();

  const hotel = hotels.find((h) => h.id === hotelId);
  const room = hotel?.rooms.find((r) => r.id === roomId);

  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [error, setError] = useState("");

  const today = dateString(new Date());
  const minCheckout = nextDay(checkIn || today);

  const nights = useMemo(
    () => calculateNights(checkIn, checkOut),
    [checkIn, checkOut]
  );

  const total = room ? room.price * Math.max(nights, 0) : 0;

  function continueToPayment() {
    if (!hotel || !room) return;

    const count = Number(guests);

    if (guestName.trim().length < 2) {
      setError("Enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(checkIn) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(checkOut) ||
      nights <= 0 ||
      checkIn < today
    ) {
      setError("Select valid future check-in and check-out dates.");
      return;
    }

    if (
      !Number.isInteger(count) ||
      count < 1 ||
      count > room.capacity
    ) {
      setError(`This room accommodates 1–${room.capacity} guests.`);
      return;
    }

    const booking: Booking = {
      id: createBookingId(),
      hotelId: hotel.id,
      hotelName: hotel.name,
      roomId: room.id,
      roomName: room.name,
      guestName: guestName.trim(),
      email: email.trim().toLowerCase(),
      checkIn,
      checkOut,
      guests: count,
      nights,
      total,
      status: "Pending Payment",
      paymentStatus: "Pending",
      createdAt: new Date().toISOString(),
    };

    if (!saveBooking(booking)) {
      setError("Unable to save booking. Use SmartStay on the web.");
      return;
    }

    router.push({
      pathname: "/payment",
      params: { bookingId: booking.id },
    });
  }

  if (!hotel || !room) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.container}>
          <Text style={styles.title}>Room not found</Text>
          <Pressable onPress={() => router.replace("/customer")}>
            <Text style={styles.link}>Return to hotels</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>← Back to hotels</Text>
        </Pressable>

        <Text style={styles.title}>Complete your reservation</Text>
        <Text style={styles.subtitle}>
          Enter your information and choose your stay dates.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Selected room</Text>
          <Text style={styles.hotel}>{hotel.name}</Text>
          <Text style={styles.muted}>{room.name}</Text>
          <Text style={styles.price}>
            {formatKES(room.price)} / night
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Guest information</Text>

          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            value={guestName}
            onChangeText={setGuestName}
            placeholder="Your full name"
          />

          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Check-in date</Text>
          <BookingCalendar
            value={checkIn}
            onChange={(value) => {
              setCheckIn(value);
              setCheckOut("");
            }}
            minDate={today}
            placeholder="Select check-in date"
          />

          <Text style={styles.label}>Check-out date</Text>
          <BookingCalendar
            value={checkOut}
            onChange={setCheckOut}
            minDate={minCheckout}
            placeholder="Select check-out date"
          />

          {nights > 0 && (
            <Text style={styles.nights}>
              {nights} {nights === 1 ? "night" : "nights"} selected
            </Text>
          )}

          <Text style={styles.label}>Number of guests</Text>
          <TextInput
            style={styles.input}
            value={guests}
            onChangeText={setGuests}
            keyboardType="number-pad"
          />
          <Text style={styles.muted}>
            Maximum {room.capacity} guests
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Price summary</Text>

          <View style={styles.row}>
            <Text>Nightly rate</Text>
            <Text>{formatKES(room.price)}</Text>
          </View>

          <View style={styles.row}>
            <Text>Nights</Text>
            <Text>{Math.max(nights, 0)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.total}>Total</Text>
            <Text style={styles.total}>{formatKES(total)}</Text>
          </View>

          <Text style={styles.notice}>
            Demo prices only. Taxes and additional fees are not modeled.
          </Text>
        </View>

        {!!error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={styles.button}
          onPress={continueToPayment}
        >
          <Text style={styles.buttonText}>
            Continue to Payment →
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F6FA" },
  container: {
    maxWidth: 760,
    width: "100%",
    alignSelf: "center",
    padding: 22,
    paddingBottom: 60,
  },
  link: {
    color: NAVY,
    fontWeight: "800",
    marginBottom: 20,
  },
  title: {
    color: NAVY,
    fontSize: 30,
    fontWeight: "900",
  },
  subtitle: {
    color: "#718096",
    marginTop: 8,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 15,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E5EAF0",
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: NAVY,
    marginBottom: 15,
  },
  hotel: {
    fontSize: 20,
    fontWeight: "800",
    color: NAVY,
  },
  muted: {
    color: "#718096",
    marginTop: 7,
  },
  price: {
    color: "#946D1E",
    fontWeight: "900",
    fontSize: 18,
    marginTop: 14,
  },
  label: {
    color: NAVY,
    fontWeight: "700",
    marginTop: 17,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#DCE2E9",
    borderRadius: 9,
    padding: 14,
    color: NAVY,
  },
  nights: {
    backgroundColor: "#E8F4ED",
    color: "#20734B",
    padding: 12,
    marginTop: 14,
    borderRadius: 8,
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5EAF0",
    marginVertical: 12,
  },
  total: {
    fontSize: 21,
    fontWeight: "900",
    color: NAVY,
  },
  notice: {
    color: "#718096",
    fontSize: 12,
    marginTop: 14,
    lineHeight: 19,
  },
  error: {
    color: "#B42318",
    fontWeight: "800",
    marginBottom: 15,
  },
  button: {
    backgroundColor: GOLD,
    padding: 18,
    borderRadius: 11,
    alignItems: "center",
  },
  buttonText: {
    color: NAVY,
    fontWeight: "900",
    fontSize: 16,
  },
});
