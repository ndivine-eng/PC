
import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import { formatKES } from "../features/data";
import { getBookingById } from "../features/store";

const NAVY = "#10233F";
const GOLD = "#C69C43";

function ReceiptRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function BookingSuccessScreen() {
  const { bookingId } = useLocalSearchParams<{
    bookingId?: string;
  }>();

  const booking = bookingId
    ? getBookingById(bookingId)
    : undefined;

  if (!booking) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.container}>
          <Text style={styles.title}>Booking not found</Text>
          <Pressable onPress={() => router.replace("/customer")}>
            <Text style={styles.link}>Return to hotels</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const confirmed = booking.status === "Confirmed";

  const paymentName =
    booking.paymentMethod === "MPESA"
      ? "M-Pesa"
      : booking.paymentMethod === "CARD"
      ? "Card"
      : booking.paymentMethod === "HOTEL"
      ? "Pay at Hotel"
      : "Not selected";

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.checkCircle}>
            <Text style={styles.check}>
              {confirmed ? "✓" : "!"}
            </Text>
          </View>

          <Text style={styles.title}>
            {confirmed
              ? "Demo Booking Confirmed!"
              : booking.status}
          </Text>

          <Text style={styles.subtitle}>
            {confirmed
              ? "Your reservation has been recorded in the SmartStay demonstration system."
              : "Your demonstration reservation has not been fully confirmed."}
          </Text>

          <View style={styles.demoBanner}>
            <Text style={styles.demoText}>
              DEMO RECEIPT — NOT PROOF OF REAL PAYMENT
            </Text>
          </View>

          <Text style={styles.sectionTitle}>
            Reservation details
          </Text>

          <ReceiptRow label="Reference" value={booking.id} />
          <ReceiptRow label="Guest" value={booking.guestName} />
          <ReceiptRow label="Email" value={booking.email} />
          <ReceiptRow label="Hotel" value={booking.hotelName} />
          <ReceiptRow label="Room" value={booking.roomName} />
          <ReceiptRow label="Check-in" value={booking.checkIn} />
          <ReceiptRow label="Check-out" value={booking.checkOut} />
          <ReceiptRow
            label="Stay"
            value={`${booking.nights} night(s)`}
          />
          <ReceiptRow
            label="Guests"
            value={String(booking.guests)}
          />

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Payment details</Text>

          <ReceiptRow label="Method" value={paymentName} />
          <ReceiptRow
            label="Payment status"
            value={booking.paymentStatus}
          />
          <ReceiptRow
            label="Booking status"
            value={booking.status}
          />

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.total}>
              {formatKES(booking.total)}
            </Text>
          </View>

          <Pressable
            style={styles.button}
            onPress={() => router.push("/my-bookings")}
          >
            <Text style={styles.buttonText}>
              View My Bookings
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.replace("/customer")}
          >
            <Text style={styles.secondaryText}>
              Book Another Room
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("/reservations")}
          >
            <Text style={styles.secondaryText}>
              View Manager Reservations
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F6FA" },
  container: {
    padding: 20,
    paddingBottom: 60,
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 660,
    backgroundColor: "white",
    padding: 26,
    borderRadius: 18,
    alignItems: "center",
  },
  checkCircle: {
    backgroundColor: "#E8F4ED",
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  check: {
    color: "#21834C",
    fontSize: 38,
    fontWeight: "900",
  },
  title: {
    color: NAVY,
    fontSize: 27,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: "#718096",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 18,
    lineHeight: 22,
  },
  demoBanner: {
    backgroundColor: "#FFF3D8",
    padding: 13,
    borderRadius: 9,
    width: "100%",
    marginBottom: 25,
  },
  demoText: {
    color: "#875A0B",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },
  sectionTitle: {
    color: NAVY,
    fontSize: 18,
    fontWeight: "900",
    alignSelf: "flex-start",
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    width: "100%",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderColor: "#EEF1F5",
  },
  label: {
    color: "#718096",
    flex: 1,
  },
  value: {
    color: NAVY,
    fontWeight: "800",
    flex: 1,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#DCE2E9",
    width: "100%",
    marginVertical: 22,
  },
  totalRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  totalLabel: {
    color: NAVY,
    fontSize: 21,
    fontWeight: "900",
  },
  total: {
    color: NAVY,
    fontSize: 23,
    fontWeight: "900",
  },
  button: {
    backgroundColor: GOLD,
    width: "100%",
    padding: 17,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: NAVY,
    fontWeight: "900",
  },
  secondaryButton: {
    padding: 15,
  },
  secondaryText: {
    color: NAVY,
    fontWeight: "800",
  },
  link: {
    color: NAVY,
    fontWeight: "800",
    marginTop: 20,
  },
});
