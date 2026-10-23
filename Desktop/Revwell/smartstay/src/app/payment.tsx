
import React, { useState } from "react";
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
import {
  getBookingById,
  updateBooking,
  type PaymentMethod,
} from "../features/store";

const NAVY = "#10233F";
const GOLD = "#C69C43";

const methods: {
  id: PaymentMethod;
  title: string;
  description: string;
  symbol: string;
}[] = [
  {
    id: "MPESA",
    title: "M-Pesa",
    description: "Simulate a mobile money payment",
    symbol: "M",
  },
  {
    id: "CARD",
    title: "Debit / Credit Card",
    description: "Simulate a card payment without entering card details",
    symbol: "C",
  },
  {
    id: "HOTEL",
    title: "Pay at Hotel",
    description: "Reserve now and simulate payment on arrival",
    symbol: "H",
  },
];

export default function PaymentScreen() {
  const { bookingId } = useLocalSearchParams<{
    bookingId?: string;
  }>();

  const booking = bookingId
    ? getBookingById(bookingId)
    : undefined;

  const [method, setMethod] = useState<PaymentMethod>("MPESA");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  function completePayment() {
    if (!booking || processing) return;

    if (booking.status !== "Pending Payment") {
      setError("This reservation is no longer awaiting payment.");
      return;
    }

    setProcessing(true);
    setError("");

    const saved = updateBooking(booking.id, {
      paymentMethod: method,
      paymentStatus:
        method === "HOTEL" ? "Pay at Hotel" : "Simulated Paid",
      status: "Confirmed",
    });

    if (!saved) {
      setProcessing(false);
      setError("Unable to update the demonstration payment.");
      return;
    }

    router.replace({
      pathname: "/booking-success",
      params: { bookingId: booking.id },
    });
  }

  if (!booking) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.container}>
          <Text style={styles.title}>Reservation not found</Text>
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
          <Text style={styles.link}>← Back to checkout</Text>
        </Pressable>

        <Text style={styles.title}>Payment</Text>
        <Text style={styles.subtitle}>
          Choose how you would like to pay.
        </Text>

        <View style={styles.warning}>
          <Text style={styles.warningTitle}>
            DEMONSTRATION PAYMENT ONLY
          </Text>
          <Text style={styles.warningText}>
            No money will be charged. Do not enter your real
            M-Pesa PIN, card number or bank information.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Reservation summary</Text>

          <Text style={styles.hotel}>{booking.hotelName}</Text>
          <Text style={styles.muted}>{booking.roomName}</Text>

          <Text style={styles.muted}>
            {booking.checkIn} → {booking.checkOut}
          </Text>

          <Text style={styles.muted}>
            {booking.nights} nights · {booking.guests} guests
          </Text>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.total}>
              {formatKES(booking.total)}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Select payment method
          </Text>

          {methods.map((item) => {
            const selected = method === item.id;

            return (
              <Pressable
                key={item.id}
                onPress={() => setMethod(item.id)}
                style={[
                  styles.method,
                  selected && styles.methodSelected,
                ]}
              >
                <View style={styles.symbol}>
                  <Text style={styles.symbolText}>
                    {item.symbol}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.methodTitle}>
                    {item.title}
                  </Text>
                  <Text style={styles.methodDescription}>
                    {item.description}
                  </Text>
                </View>

                <View
                  style={[
                    styles.radio,
                    selected && styles.radioSelected,
                  ]}
                >
                  {selected && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.info}>
          <Text style={styles.infoTitle}>
            {method === "MPESA"
              ? "M-Pesa simulation"
              : method === "CARD"
              ? "Card simulation"
              : "Pay at hotel"}
          </Text>

          <Text style={styles.infoText}>
            {method === "MPESA"
              ? "Click below to simulate a successful M-Pesa transaction. No STK push will be sent."
              : method === "CARD"
              ? "Click below to simulate a successful card transaction. No card information is required."
              : "Your demo booking will be confirmed with payment marked as due at the hotel."}
          </Text>
        </View>

        {!!error && <Text style={styles.error}>{error}</Text>}

        {booking.status === "Pending Payment" ? (
          <Pressable
            style={[
              styles.button,
              processing && { opacity: 0.6 },
            ]}
            onPress={completePayment}
            disabled={processing}
          >
            <Text style={styles.buttonText}>
              {processing
                ? "Processing..."
                : method === "HOTEL"
                ? "Confirm Pay-at-Hotel Booking"
                : `Simulate Payment — ${formatKES(booking.total)}`}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.button}
            onPress={() =>
              router.replace({
                pathname: "/booking-success",
                params: { bookingId: booking.id },
              })
            }
          >
            <Text style={styles.buttonText}>
              View Booking Status
            </Text>
          </Pressable>
        )}
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
    fontSize: 32,
    fontWeight: "900",
  },
  subtitle: {
    color: "#718096",
    marginTop: 8,
    marginBottom: 22,
  },
  warning: {
    backgroundColor: "#FFF3D8",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
  },
  warningTitle: {
    color: "#875A0B",
    fontWeight: "900",
    marginBottom: 7,
  },
  warningText: {
    color: "#875A0B",
    lineHeight: 21,
  },
  card: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 15,
    marginBottom: 18,
  },
  sectionTitle: {
    color: NAVY,
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 16,
  },
  hotel: {
    color: NAVY,
    fontWeight: "900",
    fontSize: 19,
  },
  muted: {
    color: "#718096",
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5EAF0",
    marginVertical: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  totalLabel: {
    color: NAVY,
    fontSize: 20,
    fontWeight: "900",
  },
  total: {
    color: NAVY,
    fontSize: 22,
    fontWeight: "900",
  },
  method: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    padding: 15,
    borderWidth: 1,
    borderColor: "#DCE2E9",
    borderRadius: 11,
    marginBottom: 12,
  },
  methodSelected: {
    borderColor: GOLD,
    backgroundColor: "#FFFBF1",
    borderWidth: 2,
  },
  symbol: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: NAVY,
    alignItems: "center",
    justifyContent: "center",
  },
  symbolText: {
    color: "white",
    fontSize: 19,
    fontWeight: "900",
  },
  methodTitle: {
    color: NAVY,
    fontWeight: "900",
    fontSize: 16,
  },
  methodDescription: {
    color: "#718096",
    fontSize: 12,
    marginTop: 5,
    lineHeight: 18,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#AAB4C1",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: GOLD,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: GOLD,
  },
  info: {
    backgroundColor: "#EAF0F8",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoTitle: {
    color: NAVY,
    fontWeight: "900",
    marginBottom: 8,
  },
  infoText: {
    color: "#53667F",
    lineHeight: 21,
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
    textAlign: "center",
    fontSize: 16,
  },
});
