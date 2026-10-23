
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getBookings, type Booking } from "../features/store";
import { formatKES } from "../features/data";

const C = {
  navy: "#10233F",
  dark: "#09182D",
  gold: "#C69C43",
  bg: "#F3F6FA",
  white: "#FFFFFF",
  muted: "#758397",
  border: "#E4EAF1",
  green: "#16805A",
  blue: "#356BC3",
};

const hotels = [
  { id: "ALL", name: "All Hotels" },
  { id: "H12", name: "Hotel H12" },
  { id: "H23", name: "Hotel H23" },
  { id: "H31", name: "Hotel H31" },
];

const hotelPerformance: Record<string, {
  rating: number;
  negative: number;
}> = {
  ALL: { rating: 4.14, negative: 5.44 },
  H12: { rating: 3.63, negative: 21.49 },
  H23: { rating: 3.98, negative: 9.00 },
  H31: { rating: 4.47, negative: 1.29 },
};

const navItems = [
  { icon: "▦", label: "Overview", path: "/" },
  { icon: "▤", label: "Reservations", path: "/reservations" },
  { icon: "◈", label: "Booking Analytics", path: "/bookings" },
  { icon: "⌂", label: "Operations", path: "/operations" },
  { icon: "♡", label: "Guest Experience", path: "/guests" },
  { icon: "◉", label: "Financials", path: "/financials" },
  { icon: "✦", label: "Recommendations", path: "/recommendations" },
  { icon: "☷", label: "Implementation", path: "/implementation" },
];

function navigate(path: string) {
  router.push(path as any);
}

function Metric({
  label,
  value,
  detail,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  accent?: string;
}) {
  return (
    <View style={s.metric}>
      <View
        style={[
          s.metricAccent,
          { backgroundColor: accent || C.gold },
        ]}
      />
      <Text style={s.metricLabel}>{label}</Text>
      <Text style={s.metricValue}>{value}</Text>
      <Text style={s.metricDetail}>{detail}</Text>
    </View>
  );
}

function PanelTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={s.panelTitle}>{title}</Text>
      {subtitle ? (
        <Text style={s.panelSubtitle}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

function Bar({
  label,
  value,
  max,
  color,
  suffix = "%",
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  suffix?: string;
}) {
  return (
    <View style={{ marginBottom: 18 }}>
      <View style={s.barHeading}>
        <Text style={s.barLabel}>{label}</Text>
        <Text style={s.barValue}>
          {value.toFixed(value % 1 === 0 ? 0 : 2)}
          {suffix}
        </Text>
      </View>
      <View style={s.track}>
        <View
          style={[
            s.barFill,
            {
              backgroundColor: color,
              width: `${Math.min(100, (value / max) * 100)}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

export default function ManagerDashboard() {
  const { width } = useWindowDimensions();
  const desktop = width >= 950;

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState("ALL");
  const [bookings, setBookings] = useState<Booking[]>([]);

  useFocusEffect(
    useCallback(() => {
      setBookings(getBookings());
    }, [])
  );

  const filtered = bookings.filter(
    (b) => selectedHotel === "ALL" || b.hotelId === selectedHotel
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

  const performance = hotelPerformance[selectedHotel];

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const arrivals = confirmed.filter(
    (b) => b.checkIn === todayString
  ).length;

  const departures = confirmed.filter(
    (b) => b.checkOut === todayString
  ).length;

  function Sidebar() {
    return (
      <View style={s.sidebar}>
        <View style={s.brand}>
          <View style={s.brandIcon}>
            <Text style={s.brandIconText}>S</Text>
          </View>
          <View>
            <Text style={s.brandName}>SMARTSTAY</Text>
            <Text style={s.brandSub}>LEVWELL HOTELS</Text>
          </View>
        </View>

        <Text style={s.navCaption}>MANAGEMENT</Text>

        {navItems.map((item) => (
          <Pressable
            key={item.path}
            style={[
              s.navItem,
              item.path === "/" && s.navActive,
            ]}
            onPress={() => {
              setMenuOpen(false);
              navigate(item.path);
            }}
          >
            <Text style={s.navIcon}>{item.icon}</Text>
            <Text
              style={[
                s.navText,
                item.path === "/" && s.navTextActive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}

        <View style={s.sidebarDivider} />

        <Text style={s.navCaption}>CUSTOMER EXPERIENCE</Text>

        <Pressable
          style={s.customerNav}
          onPress={() => navigate("/customer")}
        >
          <Text style={s.customerNavText}>
            ↗ View Customer Website
          </Text>
        </Pressable>

        <Pressable
          style={s.secondaryNav}
          onPress={() => navigate("/my-bookings")}
        >
          <Text style={s.secondaryNavText}>My Demo Bookings →</Text>
        </Pressable>

        <View style={s.sidebarBottom}>
          <Text style={s.sidebarBottomText}>
            Golden Eagles · Prototype
          </Text>
          <Text style={s.sidebarBottomSub}>
            Demonstration environment
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.shell}>
        {desktop && <Sidebar />}

        <View style={s.main}>
          <ScrollView contentContainerStyle={s.content}>
            <View style={s.topbar}>
              <View style={s.topLeft}>
                {!desktop && (
                  <Pressable
                    style={s.menuButton}
                    onPress={() => setMenuOpen(!menuOpen)}
                  >
                    <Text style={s.menuButtonText}>☰</Text>
                  </Pressable>
                )}

                <View>
                  <Text style={s.breadcrumb}>
                    SMARTSTAY / MANAGEMENT
                  </Text>
                  <Text style={s.heading}>
                    Executive Overview
                  </Text>
                  <Text style={s.subheading}>
                    Levwell Hotels · Portfolio intelligence
                  </Text>
                </View>
              </View>

              <Pressable
                style={s.topCustomerButton}
                onPress={() => navigate("/customer")}
              >
                <Text style={s.topCustomerText}>
                  ↗ Customer Website
                </Text>
              </Pressable>
            </View>

            {!desktop && menuOpen && <Sidebar />}

            <View style={s.welcome}>
              <View style={s.welcomeText}>
                <Text style={s.welcomeEyebrow}>
                  BUSINESS TRANSFORMATION PLATFORM
                </Text>
                <Text style={s.welcomeTitle}>
                  One platform. Better hospitality.
                </Text>
                <Text style={s.welcomeDescription}>
                  Monitor portfolio performance, manage demonstration
                  reservations and explore the SmartStay customer journey.
                </Text>
                <Pressable
                  style={s.welcomeButton}
                  onPress={() => navigate("/customer")}
                >
                  <Text style={s.welcomeButtonText}>
                    Explore Customer Experience →
                  </Text>
                </Pressable>
              </View>
              {desktop && (
                <View style={s.welcomeBadge}>
                  <Text style={s.welcomeBadgeNumber}>35</Text>
                  <Text style={s.welcomeBadgeLabel}>
                    LEVWELL HOTELS
                  </Text>
                  <Text style={s.welcomeBadgeNote}>
                    Case-study portfolio
                  </Text>
                </View>
              )}
            </View>

            <View style={s.sectionHeader}>
              <View>
                <Text style={s.sectionHeading}>
                  Performance Snapshot
                </Text>
                <Text style={s.sectionSub}>
                  Case-study benchmarks and guest sentiment
                </Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 20 }}
            >
              <View style={s.hotelFilters}>
                {hotels.map((h) => (
                  <Pressable
                    key={h.id}
                    style={[
                      s.hotelFilter,
                      selectedHotel === h.id && s.hotelFilterActive,
                    ]}
                    onPress={() => setSelectedHotel(h.id)}
                  >
                    <Text
                      style={[
                        s.hotelFilterText,
                        selectedHotel === h.id &&
                          s.hotelFilterTextActive,
                      ]}
                    >
                      {h.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            <View style={s.metricGrid}>
              <Metric
                label="Guest Rating"
                value={performance.rating.toFixed(2) + " / 5"}
                detail="Case-study review average"
                accent={C.gold}
              />
              <Metric
                label="Negative Reviews"
                value={performance.negative.toFixed(2) + "%"}
                detail="Share of reviews"
                accent="#D86B62"
              />
              <Metric
                label="Demo Reservations"
                value={String(filtered.length)}
                detail={`${confirmed.length} confirmed · ${pending.length} pending`}
                accent={C.blue}
              />
              <Metric
                label="Confirmed Demo Value"
                value={formatKES(confirmedValue)}
                detail="Not actual revenue"
                accent={C.green}
              />
            </View>

            <View style={s.twoColumns}>
              <View style={s.panel}>
                <PanelTitle
                  title="Portfolio Performance"
                  subtitle="Case-study portfolio metrics"
                />

                <Bar
                  label="Occupancy"
                  value={74}
                  max={100}
                  color={C.blue}
                />
                <Bar
                  label="Benchmark Occupancy"
                  value={75.6}
                  max={100}
                  color={C.gold}
                />
                <Bar
                  label="EBITDA Margin"
                  value={8.1}
                  max={15}
                  color={C.green}
                />
                <Bar
                  label="Benchmark EBITDA"
                  value={10.3}
                  max={15}
                  color="#8B94B3"
                />

                <View style={s.panelFoot}>
                  <Text style={s.panelFootText}>
                    Portfolio figures are fixed case-study inputs.
                  </Text>
                </View>
              </View>

              <View style={s.panel}>
                <PanelTitle
                  title="Reservation Operations"
                  subtitle="Bookings created in this browser"
                />

                <View style={s.operationRow}>
                  <View style={s.operationIcon}>
                    <Text style={s.operationIconText}>↘</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.operationTitle}>
                      Today's Arrivals
                    </Text>
                    <Text style={s.operationSub}>
                      Confirmed demonstration check-ins
                    </Text>
                  </View>
                  <Text style={s.operationNumber}>{arrivals}</Text>
                </View>

                <View style={s.operationRow}>
                  <View style={s.operationIcon}>
                    <Text style={s.operationIconText}>↗</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.operationTitle}>
                      Today's Departures
                    </Text>
                    <Text style={s.operationSub}>
                      Confirmed demonstration check-outs
                    </Text>
                  </View>
                  <Text style={s.operationNumber}>{departures}</Text>
                </View>

                <View style={s.operationRow}>
                  <View style={s.operationIcon}>
                    <Text style={s.operationIconText}>◷</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.operationTitle}>
                      Pending Payments
                    </Text>
                    <Text style={s.operationSub}>
                      Incomplete demo checkout journeys
                    </Text>
                  </View>
                  <Text style={s.operationNumber}>
                    {pending.length}
                  </Text>
                </View>

                <Pressable
                  style={s.panelButton}
                  onPress={() => navigate("/reservations")}
                >
                  <Text style={s.panelButtonText}>
                    Manage Reservations →
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={s.sectionHeader}>
              <Text style={s.sectionHeading}>Management Tools</Text>
            </View>

            <View style={s.quickGrid}>
              {[
                {
                  icon: "▤",
                  title: "Reservations",
                  description: "Booking records and payment statuses",
                  path: "/reservations",
                },
                {
                  icon: "⌂",
                  title: "Hotel Operations",
                  description: "Workforce and operational insights",
                  path: "/operations",
                },
                {
                  icon: "♡",
                  title: "Guest Experience",
                  description: "Sentiment, reviews and satisfaction",
                  path: "/guests",
                },
                {
                  icon: "◉",
                  title: "Financial Analytics",
                  description: "Investment and performance insights",
                  path: "/financials",
                },
                {
                  icon: "◈",
                  title: "Booking Funnel",
                  description: "Conversion and abandonment analytics",
                  path: "/bookings",
                },
                {
                  icon: "✦",
                  title: "Strategy & Roadmap",
                  description: "Recommendations and next steps",
                  path: "/recommendations",
                },
              ].map((item) => (
                <Pressable
                  key={item.path}
                  style={s.quickCard}
                  onPress={() => navigate(item.path)}
                >
                  <Text style={s.quickIcon}>{item.icon}</Text>
                  <Text style={s.quickTitle}>{item.title}</Text>
                  <Text style={s.quickDescription}>
                    {item.description}
                  </Text>
                  <Text style={s.quickLink}>Open Workspace →</Text>
                </Pressable>
              ))}
            </View>

            <View style={s.bottomNote}>
              <Text style={s.bottomNoteText}>
                SmartStay prototype · Illustrative analytics and
                browser-local booking records · No live payment processing
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  shell: { flex: 1, flexDirection: "row" },
  sidebar: {
    width: 252,
    backgroundColor: C.dark,
    paddingHorizontal: 17,
    paddingTop: 24,
    paddingBottom: 25,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 36,
    paddingHorizontal: 6,
  },
  brandIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: C.gold,
    justifyContent: "center",
    alignItems: "center",
  },
  brandIconText: {
    color: C.dark,
    fontWeight: "900",
    fontSize: 25,
  },
  brandName: {
    color: C.white,
    fontWeight: "900",
    fontSize: 18,
    letterSpacing: 1,
  },
  brandSub: {
    color: "#9CACBE",
    fontSize: 10,
    letterSpacing: 1.5,
    marginTop: 3,
  },
  navCaption: {
    color: "#758AA4",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginLeft: 12,
    marginBottom: 13,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    paddingVertical: 13,
    borderRadius: 10,
    marginBottom: 4,
    gap: 13,
  },
  navActive: { backgroundColor: "#203956" },
  navIcon: { color: "#AEBFD1", fontSize: 19, width: 23 },
  navText: { color: "#B7C5D5", fontSize: 13, fontWeight: "600" },
  navTextActive: { color: C.white, fontWeight: "900" },
  sidebarDivider: {
    height: 1,
    backgroundColor: "#233750",
    marginVertical: 22,
  },
  customerNav: {
    backgroundColor: C.gold,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  customerNavText: {
    color: C.dark,
    fontWeight: "900",
    fontSize: 13,
  },
  secondaryNav: {
    alignItems: "center",
    padding: 16,
  },
  secondaryNavText: {
    color: "#D8E1EC",
    fontWeight: "700",
    fontSize: 12,
  },
  sidebarBottom: { marginTop: 25, paddingHorizontal: 10 },
  sidebarBottomText: { color: "#AAB9CB", fontSize: 11 },
  sidebarBottomSub: {
    color: "#72849B",
    fontSize: 10,
    marginTop: 5,
  },
  main: { flex: 1, minWidth: 0 },
  content: {
    padding: 26,
    paddingBottom: 45,
    maxWidth: 1500,
    width: "100%",
    alignSelf: "center",
  },
  topbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 25,
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    flexShrink: 1,
  },
  breadcrumb: {
    color: C.muted,
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: "800",
    marginBottom: 8,
  },
  heading: { fontSize: 27, fontWeight: "900", color: C.navy },
  subheading: { color: C.muted, marginTop: 6, fontSize: 13 },
  menuButton: {
    backgroundColor: C.white,
    padding: 12,
    borderRadius: 9,
  },
  menuButtonText: { fontSize: 20, color: C.navy },
  topCustomerButton: {
    backgroundColor: C.white,
    paddingHorizontal: 17,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  topCustomerText: { color: C.navy, fontWeight: "900" },
  welcome: {
    backgroundColor: C.navy,
    borderRadius: 19,
    padding: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 29,
  },
  welcomeText: { flex: 1 },
  welcomeEyebrow: {
    color: C.gold,
    fontSize: 10,
    letterSpacing: 1.7,
    fontWeight: "900",
  },
  welcomeTitle: {
    color: C.white,
    fontSize: 29,
    fontWeight: "900",
    marginTop: 11,
    lineHeight: 36,
  },
  welcomeDescription: {
    color: "#C6D3E2",
    lineHeight: 22,
    marginTop: 10,
    maxWidth: 600,
  },
  welcomeButton: {
    backgroundColor: C.gold,
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 9,
    marginTop: 22,
  },
  welcomeButtonText: { color: C.dark, fontWeight: "900" },
  welcomeBadge: {
    width: 180,
    height: 160,
    borderWidth: 1,
    borderColor: "#39516D",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeBadgeNumber: {
    color: C.gold,
    fontSize: 53,
    fontWeight: "900",
  },
  welcomeBadgeLabel: {
    color: C.white,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  welcomeBadgeNote: {
    color: "#A6B7CC",
    fontSize: 10,
    marginTop: 8,
  },
  sectionHeader: { marginBottom: 18 },
  sectionHeading: {
    color: C.navy,
    fontSize: 21,
    fontWeight: "900",
  },
  sectionSub: { color: C.muted, marginTop: 5 },
  hotelFilters: { flexDirection: "row", gap: 9 },
  hotelFilter: {
    backgroundColor: C.white,
    paddingHorizontal: 17,
    paddingVertical: 11,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: C.border,
  },
  hotelFilterActive: { backgroundColor: C.navy },
  hotelFilterText: { color: C.navy, fontWeight: "800" },
  hotelFilterTextActive: { color: C.white },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 20,
  },
  metric: {
    flexGrow: 1,
    flexBasis: 205,
    backgroundColor: C.white,
    padding: 20,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
  },
  metricAccent: {
    width: 30,
    height: 4,
    borderRadius: 3,
    marginBottom: 16,
  },
  metricLabel: { color: C.muted, fontSize: 12, fontWeight: "700" },
  metricValue: {
    color: C.navy,
    fontSize: 25,
    fontWeight: "900",
    marginTop: 10,
  },
  metricDetail: { color: C.muted, fontSize: 11, marginTop: 8 },
  twoColumns: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 30,
  },
  panel: {
    flexGrow: 1,
    flexBasis: 300,
    backgroundColor: C.white,
    padding: 23,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: C.border,
  },
  panelTitle: { color: C.navy, fontSize: 18, fontWeight: "900" },
  panelSubtitle: { color: C.muted, fontSize: 12, marginTop: 5 },
  barHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
  },
  barLabel: { color: "#586A7F", fontWeight: "700", fontSize: 12 },
  barValue: { color: C.navy, fontWeight: "900" },
  track: {
    backgroundColor: "#EBEFF5",
    height: 9,
    borderRadius: 6,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 6 },
  panelFoot: {
    borderTopWidth: 1,
    borderColor: C.border,
    paddingTop: 15,
    marginTop: 8,
  },
  panelFootText: { color: C.muted, fontSize: 11 },
  operationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: C.border,
  },
  operationIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#EDF2F8",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  operationIconText: {
    color: C.blue,
    fontWeight: "900",
    fontSize: 21,
  },
  operationTitle: { color: C.navy, fontWeight: "900" },
  operationSub: { color: C.muted, fontSize: 11, marginTop: 5 },
  operationNumber: { color: C.navy, fontSize: 24, fontWeight: "900" },
  panelButton: {
    backgroundColor: "#EDF2F8",
    padding: 13,
    borderRadius: 9,
    alignItems: "center",
    marginTop: 20,
  },
  panelButtonText: { color: C.navy, fontWeight: "900" },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  quickCard: {
    flexBasis: 240,
    flexGrow: 1,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 13,
    padding: 21,
  },
  quickIcon: { color: C.gold, fontSize: 27, marginBottom: 14 },
  quickTitle: { color: C.navy, fontSize: 17, fontWeight: "900" },
  quickDescription: {
    color: C.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 9,
    minHeight: 38,
  },
  quickLink: {
    color: C.blue,
    fontWeight: "900",
    marginTop: 19,
    fontSize: 12,
  },
  bottomNote: { marginTop: 30, alignItems: "center" },
  bottomNoteText: {
    color: C.muted,
    textAlign: "center",
    fontSize: 11,
  },
});
