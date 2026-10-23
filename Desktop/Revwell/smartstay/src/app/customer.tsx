
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import {
  hotels,
  formatKES,
  type Hotel,
  type Room,
} from "../features/data";

const NAVY = "#10233F";
const GOLD = "#C69C43";
const BG = "#F4F6FA";

export default function CustomerBookingScreen() {
  const [search, setSearch] = useState("");
  const [selectedHotel, setSelectedHotel] = useState<string | null>(
    null
  );

  const { width } = useWindowDimensions();
  const wide = width >= 760;

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) =>
      `${hotel.name} ${hotel.location}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  function selectRoom(hotel: Hotel, room: Room) {
    router.push({
      pathname: "/checkout",
      params: {
        hotelId: hotel.id,
        roomId: room.id,
      },
    });
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>SMARTSTAY</Text>

          <Pressable onPress={() => router.push("/")}>
            <Text style={styles.headerLink}>Management Dashboard →</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>LEVWELL HOTELS</Text>

          <Text style={styles.heroTitle}>
            Find your next comfortable stay.
          </Text>

          <Text style={styles.heroDescription}>
            Explore hotels, compare rooms and make a reservation
            directly with SmartStay.
          </Text>

          <Text style={styles.demoNotice}>
            Demonstration only — room prices and availability
            are sample data.
          </Text>
        </View>

        <View style={styles.searchCard}>
          <Text style={styles.label}>Search destination or hotel</Text>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Try Nairobi, Mombasa or Kisumu"
            placeholderTextColor="#8994A4"
            style={styles.input}
          />
        </View>

        <Text style={styles.sectionTitle}>
          Available Hotels ({filteredHotels.length})
        </Text>

        <View style={styles.grid}>
          {filteredHotels.map((hotel) => {
            const expanded = selectedHotel === hotel.id;

            return (
              <View
                key={hotel.id}
                style={[
                  styles.hotelCard,
                  wide && styles.hotelCardWide,
                ]}
              >
                <View style={styles.hotelTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.hotelName}>{hotel.name}</Text>
                    <Text style={styles.location}>
                      {hotel.location} · {hotel.id}
                    </Text>
                  </View>

                  <View style={styles.rating}>
                    <Text style={styles.ratingText}>
                      ★ {hotel.rating.toFixed(2)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.hotelDescription}>
                  Comfortable rooms, convenient reservations and
                  quality hospitality.
                </Text>

                <Pressable
                  style={styles.primaryButton}
                  onPress={() =>
                    setSelectedHotel(expanded ? null : hotel.id)
                  }
                >
                  <Text style={styles.primaryButtonText}>
                    {expanded ? "Hide Rooms" : "View Available Rooms"}
                  </Text>
                </Pressable>

                {expanded && (
                  <View style={styles.roomsSection}>
                    {hotel.rooms.map((room) => (
                      <View key={room.id} style={styles.roomRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.roomName}>
                            {room.name}
                          </Text>

                          <Text style={styles.roomInfo}>
                            Up to {room.capacity} guests ·{" "}
                            {room.available} sample rooms
                          </Text>

                          <Text style={styles.price}>
                            {formatKES(room.price)} / night
                          </Text>
                        </View>

                        <Pressable
                          style={styles.bookButton}
                          onPress={() => selectRoom(hotel, room)}
                        >
                          <Text style={styles.bookButtonText}>
                            Book
                          </Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {filteredHotels.length === 0 && (
          <Text style={styles.empty}>
            No demonstration hotels match your search.
          </Text>
        )}

        <Text style={styles.footer}>
          SmartStay by Levwell Hotels · Golden Eagles Prototype
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  container: {
    padding: 22,
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
    paddingBottom: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
    flexWrap: "wrap",
    gap: 12,
  },
  logo: {
    fontSize: 21,
    fontWeight: "900",
    color: NAVY,
    letterSpacing: 2,
  },
  headerLink: {
    color: NAVY,
    fontWeight: "700",
  },
  hero: {
    backgroundColor: NAVY,
    padding: 30,
    borderRadius: 18,
    marginBottom: 22,
  },
  heroEyebrow: {
    color: GOLD,
    fontWeight: "800",
    letterSpacing: 2,
    fontSize: 12,
  },
  heroTitle: {
    color: "white",
    fontSize: 32,
    fontWeight: "900",
    marginTop: 12,
    maxWidth: 650,
  },
  heroDescription: {
    color: "#D6DFEA",
    marginTop: 12,
    lineHeight: 23,
    maxWidth: 650,
  },
  demoNotice: {
    color: "#F5D995",
    fontSize: 12,
    marginTop: 16,
  },
  searchCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
  },
  label: {
    color: NAVY,
    fontWeight: "700",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#F4F6F9",
    borderWidth: 1,
    borderColor: "#DCE2E9",
    borderRadius: 10,
    padding: 14,
    color: NAVY,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: NAVY,
    marginBottom: 15,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  hotelCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5EAF0",
  },
  hotelCardWide: {
    width: "48%",
  },
  hotelTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  hotelName: {
    fontSize: 20,
    fontWeight: "800",
    color: NAVY,
  },
  location: {
    color: "#66758A",
    marginTop: 5,
  },
  rating: {
    backgroundColor: "#FFF5D9",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  ratingText: {
    color: "#815C0E",
    fontWeight: "800",
  },
  hotelDescription: {
    color: "#6C7788",
    marginTop: 14,
    lineHeight: 21,
    marginBottom: 18,
  },
  primaryButton: {
    backgroundColor: NAVY,
    padding: 13,
    borderRadius: 9,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "800",
  },
  roomsSection: {
    borderTopWidth: 1,
    borderColor: "#E5EAF0",
    marginTop: 20,
    paddingTop: 10,
  },
  roomRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#EEF1F5",
    gap: 12,
  },
  roomName: {
    fontWeight: "800",
    color: NAVY,
  },
  roomInfo: {
    color: "#718096",
    fontSize: 12,
    marginTop: 5,
  },
  price: {
    color: "#996F20",
    fontWeight: "800",
    marginTop: 7,
  },
  bookButton: {
    backgroundColor: GOLD,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 9,
  },
  bookButtonText: {
    color: NAVY,
    fontWeight: "900",
  },
  empty: {
    textAlign: "center",
    padding: 30,
    color: "#718096",
  },
  footer: {
    textAlign: "center",
    color: "#718096",
    marginTop: 40,
    fontSize: 12,
  },
});
