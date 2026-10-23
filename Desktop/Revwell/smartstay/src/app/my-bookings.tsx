
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import {
  router,
  useFocusEffect,
} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { formatKES } from "../features/data";
import {
  getBookings,
  type Booking,
} from "../features/store";

const NAVY = "#10233F";
const GOLD = "#C69C43";

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useFocusEffect(
    useCallback(() => {
      setBookings(getBookings());
    }, [])
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.push("/customer")}>
          <Text style={styles.link}>← Customer Portal</Text>
        </Pressable>

        <Text style={styles.title}>My Bookings</Text>

        <Text style={styles.subtitle}>
          Reservations saved in this browser for the SmartStay demo.
        </Text>

        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Demo mode: these bookings are not connected to real
            hotel inventory or a customer account.
          </Text>
        </View>

        {bookings.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              You have no demonstration bookings yet.
            </Text>

            <Pressable
              style={styles.button}
              onPress={() => router.push("/customer")}
            >
              <Text style={styles.buttonText}>
                Explore Hotels
              </Text>
            </Pressable>
          </View>
        ) : (
          bookings.map((booking) => (
            <View key={booking.id} style={styles.card}>
              <View style={styles.topRow}>
                <Text style={styles.reference}>
                  {booking.id}
                </Text>

                <Text style={styles.status}>
                  {booking.status}
                </Text>
              </View>

              <Text style={styles.hotel}>
                {booking.hotelName}
              </Text>

              <Text style={styles.detail}>
                {booking.roomName}
              </Text>

              <Text style={styles.detail}>
                {booking.checkIn} → {booking.checkOut}
              </Text>

              <Text style={styles.detail}>
                {booking.nights} nights · {booking.guests} guests
              </Text>

              <Text style={styles.detail}>
                Payment: {booking.paymentStatus}
              </Text>

              <Text style={styles.price}>
                {formatKES(booking.total)}
              </Text>

              {booking.status === "Pending Payment" ? (
                <Pressable
                  style={styles.button}
                  onPress={() =>
                    router.push({
                      pathname: "/payment",
                      params: { bookingId: booking.id },
                    })
                  }
                >
                  <Text style={styles.buttonText}>
                    Continue Payment
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.outlineButton}
                  onPress={() =>
                    router.push({
                      pathname: "/booking-success",
                      params: { bookingId: booking.id },
                    })
                  }
                >
                  <Text style={styles.outlineText}>
                    View Booking Details
                  </Text>
                </Pressable>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F6FA" },
  container: {
    padding: 22,
    maxWidth: 850,
    width: "100%",
    alignSelf: "center",
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
    marginTop: 9,
    marginBottom: 20,
  },
  banner: {
    backgroundColor: "#FFF3D8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  bannerText: {
    color: "#875A0B",
    lineHeight: 21,
  },
  empty: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 14,
  },
  emptyTitle: {
    color: NAVY,
    fontWeight: "800",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5EAF0",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  },
  reference: {
    color: NAVY,
    fontWeight: "900",
  },
  status: {
    color: "#20734B",
    fontWeight: "900",
  },
  hotel: {
    color: NAVY,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 16,
  },
  detail: {
    color: "#718096",
    marginTop: 8,
  },
  price: {
    color: "#946D1E",
    fontSize: 21,
    fontWeight: "900",
    marginVertical: 20,
  },
  button: {
    backgroundColor: GOLD,
    padding: 15,
    borderRadius: 9,
    alignItems: "center",
  },
  buttonText: {
    color: NAVY,
    fontWeight: "900",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: NAVY,
    padding: 15,
    borderRadius: 9,
    alignItems: "center",
  },
  outlineText: {
    color: NAVY,
    fontWeight: "900",
  },
});
