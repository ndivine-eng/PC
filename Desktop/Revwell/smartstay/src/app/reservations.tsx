
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";

import { formatKES } from "../features/data";
import {
  getBookings,
  type Booking,
} from "../features/store";

const NAVY = "#10233F";
const GOLD = "#C69C43";

export default function ReservationsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hotelFilter, setHotelFilter] = useState("ALL");

  useFocusEffect(
    useCallback(() => {
      setBookings(getBookings());
    }, [])
  );

  const filtered = bookings.filter(
    (b) => hotelFilter === "ALL" || b.hotelId === hotelFilter
  );

  const confirmed = filtered.filter(
    (b) => b.status === "Confirmed"
  );

  const pending = filtered.filter(
    (b) => b.status === "Pending Payment"
  );

  const confirmedValue = confirmed.reduce(
    (sum, b) => sum + b.total,
    0
  );

  const simulatedPaidValue = confirmed
    .filter((b) => b.paymentStatus === "Simulated Paid")
    .reduce((sum, b) => sum + b.total, 0);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.push("/")}>
          <Text style={styles.link}>← Executive Dashboard</Text>
        </Pressable>

        <Text style={styles.title}>Hotel Reservations</Text>
        <Text style={styles.subtitle}>
          SmartStay Manager Workspace — Demo Data
        </Text>

        <View style={styles.warning}>
          <Text style={styles.warningText}>
            All bookings and payment amounts on this page are
            demonstration records stored in this browser.
            They are not actual hotel revenue.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Select Hotel</Text>

        <View style={styles.filters}>
          {["ALL", "H12", "H23", "H31"].map((id) => (
            <Pressable
              key={id}
              onPress={() => setHotelFilter(id)}
              style={[
                styles.filter,
                hotelFilter === id && styles.activeFilter,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  hotelFilter === id && styles.activeFilterText,
                ]}
              >
                {id === "ALL" ? "All Hotels" : id}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.stats}>
          <Stat title="Total Bookings" value={String(filtered.length)} />
          <Stat title="Confirmed" value={String(confirmed.length)} />
          <Stat title="Pending Payment" value={String(pending.length)} />
          <Stat
            title="Confirmed Booking Value"
            value={formatKES(confirmedValue)}
          />
          <Stat
            title="Simulated Paid Value"
            value={formatKES(simulatedPaidValue)}
          />
        </View>

        <Text style={styles.sectionTitle}>Reservation Records</Text>

        {filtered.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.muted}>
              No demonstration reservations for this hotel.
            </Text>
          </View>
        ) : (
          filtered.map((booking) => (
            <View key={booking.id} style={styles.card}>
              <View style={styles.topRow}>
                <Text style={styles.reference}>{booking.id}</Text>
                <Text style={styles.status}>{booking.status}</Text>
              </View>

              <Text style={styles.hotel}>{booking.hotelName}</Text>
              <Text style={styles.muted}>{booking.roomName}</Text>

              <View style={styles.divider} />

              <Text style={styles.detail}>
                Guest: {booking.guestName}
              </Text>
              <Text style={styles.detail}>
                Email: {booking.email}
              </Text>
              <Text style={styles.detail}>
                Check-in: {booking.checkIn}
              </Text>
              <Text style={styles.detail}>
                Check-out: {booking.checkOut}
              </Text>
              <Text style={styles.detail}>
                Payment method: {booking.paymentMethod || "Not selected"}
              </Text>
              <Text style={styles.detail}>
                Payment status: {booking.paymentStatus}
              </Text>

              <Text style={styles.amount}>
                {formatKES(booking.total)}
              </Text>
            </View>
          ))
        )}

        <Pressable
          style={styles.button}
          onPress={() => router.push("/customer")}
        >
          <Text style={styles.buttonText}>
            Open Customer Booking Portal
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F6FA" },
  container: {
    maxWidth: 1100,
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
    marginBottom: 18,
  },
  warning: {
    backgroundColor: "#FFF3D8",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  warningText: {
    color: "#875A0B",
    lineHeight: 21,
  },
  sectionTitle: {
    color: NAVY,
    fontSize: 20,
    fontWeight: "900",
    marginVertical: 18,
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    marginBottom: 20,
  },
  filter: {
    backgroundColor: "white",
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#DCE2E9",
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  activeFilter: {
    backgroundColor: NAVY,
  },
  filterText: {
    color: NAVY,
    fontWeight: "800",
  },
  activeFilterText: {
    color: "white",
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  stat: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 13,
    flexGrow: 1,
    minWidth: 170,
  },
  statTitle: {
    color: "#718096",
    fontSize: 13,
  },
  statValue: {
    color: NAVY,
    fontWeight: "900",
    fontSize: 22,
    marginTop: 10,
  },
  card: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 14,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
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
    marginTop: 15,
  },
  muted: {
    color: "#718096",
    marginTop: 7,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5EAF0",
    marginVertical: 15,
  },
  detail: {
    color: "#53667F",
    marginTop: 9,
  },
  amount: {
    color: "#946D1E",
    fontWeight: "900",
    fontSize: 20,
    marginTop: 18,
  },
  button: {
    backgroundColor: GOLD,
    padding: 17,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: NAVY,
    fontWeight: "900",
  },
});
