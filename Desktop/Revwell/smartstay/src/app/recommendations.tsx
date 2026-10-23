
import React, { useMemo, useState } from 'react';
import {
  View, Text, ScrollView, Pressable,
  StyleSheet, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const C = {
  navy: '#14213D', gold: '#D4A643',
  bg: '#F4F6FA', white: '#FFFFFF',
  text: '#334155', muted: '#64748B',
  border: '#E2E8F0', red: '#B91C1C',
  green: '#15803D', blue: '#2563EB',
};

type HotelId = 'ALL' | 'H12' | 'H23' | 'H31';
type Priority = 'High' | 'Medium';

type Recommendation = {
  id: string;
  area: string;
  title: string;
  evidence: string;
  action: string;
  kpi: string;
  priority: Priority;
  hotels: HotelId[];
  owner: string;
};

const recommendations: Recommendation[] = [
  {
    id: 'booking',
    area: 'Digital',
    title: 'Reduce booking friction',
    evidence:
      '296,984 of 350,000 sessions were marked abandoned (84.85%); 27,688 converted (7.91%).',
    action:
      'Audit the booking funnel, test mobile checkout, and measure step-level drop-off before attributing sessions to lost bookings.',
    kpi: 'Booking conversion; funnel abandonment',
    priority: 'High',
    hotels: ['ALL'],
    owner: 'Digital / Revenue',
  },
  {
    id: 'identity',
    area: 'Digital',
    title: 'Improve customer identity data quality',
    evidence:
      '147,187 digital sessions (42.05%) have missing Customer_ID values.',
    action:
      'Distinguish anonymous browsing from confirmed bookings; improve identification only where appropriate and consented.',
    kpi: 'Customer ID completeness for confirmed bookings',
    priority: 'Medium',
    hotels: ['ALL'],
    owner: 'Digital / Data',
  },
  {
    id: 'h12',
    area: 'Guest Experience',
    title: 'Prioritise service recovery at H12',
    evidence:
      'H12: 21.49% negative reviews (627/2,917) and 3.63/5 rating; portfolio negative share is 5.44%.',
    action:
      'Review H12 complaints by topic and date, assign corrective actions, and measure review trends after changes.',
    kpi: 'H12 negative-review rate; average rating',
    priority: 'High',
    hotels: ['ALL', 'H12'],
    owner: 'H12 General Manager',
  },
  {
    id: 'h23',
    area: 'Guest Experience',
    title: 'Investigate H23 guest feedback',
    evidence:
      'H23 negative-review rate is 9.00%, above the 5.44% portfolio rate; average rating is 3.98/5.',
    action:
      'Identify recurring issues using hotel-filtered reviews and test targeted service improvements.',
    kpi: 'H23 negative-review rate',
    priority: 'Medium',
    hotels: ['ALL', 'H23'],
    owner: 'H23 General Manager',
  },
  {
    id: 'h31',
    area: 'Guest Experience',
    title: 'Learn from H31 service practices',
    evidence:
      'H31: 1.29% negative reviews and 4.47/5 average rating.',
    action:
      'Document successful practices and assess whether they can be replicated elsewhere.',
    kpi: 'Guest ratings; process adoption',
    priority: 'Medium',
    hotels: ['ALL', 'H31'],
    owner: 'Guest Experience',
  },
  {
    id: 'workforce',
    area: 'Operations',
    title: 'Pilot workforce analytics',
    evidence:
      'Turnover reaches approximately 20% at some hotels; hotel-specific workforce figures are not verified.',
    action:
      'Pilot attendance, scheduling, turnover and training dashboards; collect validated hotel-level HR data before setting targets.',
    kpi: 'Turnover; overtime; attendance; training',
    priority: 'High',
    hotels: ['ALL'],
    owner: 'HR / Operations',
  },
  {
    id: 'pricing',
    area: 'Financials',
    title: 'Test revenue management improvements',
    evidence:
      'Levwell RevPAR is KSh 12,987 versus a planning benchmark of KSh 14,560.',
    action:
      'Pilot demand-based pricing and track occupancy, ADR and RevPAR against a control baseline.',
    kpi: 'RevPAR; ADR; occupancy',
    priority: 'High',
    hotels: ['ALL'],
    owner: 'Revenue / Finance',
  },
  {
    id: 'investment',
    area: 'Financials',
    title: 'Validate technology investment economics',
    evidence:
      'Indicative proposal: KSh 260M upfront, KSh 65M annual licence, and supplier-claimed KSh 180M full-year EBITDA benefit.',
    action:
      'Clarify whether benefit is net of licence; validate assumptions, run downside scenarios, and assess all five contract years.',
    kpi: 'NPV; net benefit; payback; adoption',
    priority: 'High',
    hotels: ['ALL'],
    owner: 'Finance / Technology',
  },
];

const hotelLabels: Record<HotelId, string> = {
  ALL: 'All Hotels',
  H12: 'H12',
  H23: 'H23',
  H31: 'H31',
};

function SectionTitle({
  title, sub,
}: {
  title: string;
  sub?: string;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={s.sectionTitle}>{title}</Text>
      {sub ? <Text style={s.sub}>{sub}</Text> : null}
    </View>
  );
}

export default function RecommendationsScreen() {
  const [hotel, setHotel] = useState<HotelId>('ALL');
  const [filter, setFilter] =
    useState<'All' | 'High' | 'Medium'>('All');
  const [expanded, setExpanded] =
    useState<string | null>('h12');

  const { width } = useWindowDimensions();

  const visible = useMemo(
    () => recommendations.filter(
      r =>
        r.hotels.includes(hotel) &&
        (filter === 'All' || r.priority === filter)
    ),
    [hotel, filter]
  );

  const high = visible.filter(
    r => r.priority === 'High'
  ).length;

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.header}>
          <Pressable onPress={() => router.replace('/')}>
            <Text style={s.back}>← Executive Dashboard</Text>
          </Pressable>

          <Text style={s.brand}>SmartStay</Text>
          <Text style={s.eyebrow}>
            LEVWELL HOTELS / DECISION SUPPORT
          </Text>
          <Text style={s.title}>Smart Recommendations</Text>
          <Text style={s.headerSub}>
            Evidence-led actions for guest experience,
            revenue, digital conversion and workforce performance
          </Text>
          <View style={s.pill}>
            <Text style={s.pillText}>
              Proposed actions · Not implemented
            </Text>
          </View>
        </View>

        <View style={s.body}>
          <SectionTitle
            title="Select Hotel"
            sub="Portfolio-wide initiatives appear under All Hotels. Hotel-specific actions update with your selection."
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 18 }}
          >
            {(Object.keys(hotelLabels) as HotelId[]).map(id => (
              <Pressable
                key={id}
                style={[
                  s.choice,
                  hotel === id && s.choiceActive,
                ]}
                onPress={() => {
                  setHotel(id);
                  setExpanded(null);
                }}
              >
                <Text
                  style={[
                    s.choiceText,
                    hotel === id && s.choiceTextActive,
                  ]}
                >
                  {hotelLabels[id]}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={s.kpiRow}>
            <View
              style={[
                s.kpi,
                { width: width >= 760 ? '32%' : '48%' },
              ]}
            >
              <Text style={s.kpiLabel}>Visible actions</Text>
              <Text style={s.kpiValue}>{visible.length}</Text>
            </View>

            <View
              style={[
                s.kpi,
                { width: width >= 760 ? '32%' : '48%' },
              ]}
            >
              <Text style={s.kpiLabel}>High priority</Text>
              <Text style={[s.kpiValue, { color: C.red }]}>
                {high}
              </Text>
            </View>

            <View
              style={[
                s.kpi,
                { width: width >= 760 ? '32%' : '100%' },
              ]}
            >
              <Text style={s.kpiLabel}>Selected scope</Text>
              <Text style={[s.kpiValue, { fontSize: 20 }]}>
                {hotelLabels[hotel]}
              </Text>
            </View>
          </View>

          <View style={s.panel}>
            <SectionTitle
              title="Priority Filter"
              sub="Tap a filter to focus the recommendations."
            />

            <View style={s.filterRow}>
              {(['All', 'High', 'Medium'] as const).map(p => (
                <Pressable
                  key={p}
                  style={[
                    s.filterButton,
                    filter === p && s.filterActive,
                  ]}
                  onPress={() => setFilter(p)}
                >
                  <Text
                    style={[
                      s.filterText,
                      filter === p && s.filterTextActive,
                    ]}
                  >
                    {p}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <SectionTitle
            title="Recommended Management Actions"
            sub="Tap any recommendation to expand its proposed intervention and success measure."
          />

          {visible.length === 0 ? (
            <View style={s.panel}>
              <Text style={s.sub}>
                No actions match this filter.
                Choose another priority.
              </Text>
            </View>
          ) : (
            visible.map((r, index) => (
              <View key={r.id} style={s.panel}>
                <Pressable
                  onPress={() =>
                    setExpanded(
                      expanded === r.id ? null : r.id
                    )
                  }
                >
                  <View style={s.cardTop}>
                    <Text style={s.area}>{r.area}</Text>
                    <Text
                      style={[
                        s.priority,
                        {
                          color:
                            r.priority === 'High'
                              ? C.red
                              : C.blue,
                        },
                      ]}
                    >
                      {r.priority.toUpperCase()} PRIORITY
                    </Text>
                  </View>

                  <Text style={s.cardTitle}>
                    {index + 1}. {r.title}
                  </Text>

                  <Text style={s.evidence}>
                    Evidence: {r.evidence}
                  </Text>

                  <Text style={s.expand}>
                    {expanded === r.id
                      ? 'Hide details −'
                      : 'View proposed action +'}
                  </Text>
                </Pressable>

                {expanded === r.id && (
                  <View style={s.details}>
                    <Text style={s.detailLabel}>
                      PROPOSED ACTION
                    </Text>
                    <Text style={s.detailText}>
                      {r.action}
                    </Text>

                    <Text style={s.detailLabel}>
                      SUCCESS MEASURE
                    </Text>
                    <Text style={s.detailText}>
                      {r.kpi}
                    </Text>

                    <Text style={s.detailLabel}>
                      SUGGESTED OWNER
                    </Text>
                    <Text style={s.detailText}>
                      {r.owner}
                    </Text>
                  </View>
                )}
              </View>
            ))
          )}

          <View style={s.panel}>
            <SectionTitle title="Decision Notes" />
            <Text style={s.note}>
              • Portfolio-wide actions are not automatically
              attributable to any one hotel.
            </Text>
            <Text style={s.note}>
              • Priority labels are management proposals,
              not approved project statuses.
            </Text>
            <Text style={s.note}>
              • Confirm owners, budgets, baselines and
              targets before implementation.
            </Text>
          </View>

          <Pressable
            style={s.next}
            onPress={() => router.push('/implementation')}
          >
            <Text style={s.nextText}>
              View Implementation Roadmap →
            </Text>
          </Pressable>

          <Text style={s.footer}>
            SmartStay · Golden Eagles · Round 2
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 30 },
  header: {
    backgroundColor: C.navy,
    padding: 24,
    paddingBottom: 32,
  },
  back: {
    color: '#CBD5E1',
    fontSize: 13,
    marginBottom: 22,
  },
  brand: {
    color: C.gold,
    fontSize: 27,
    fontWeight: '800',
    marginBottom: 12,
  },
  eyebrow: {
    color: C.gold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.3,
  },
  title: {
    color: C.white,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 10,
  },
  headerSub: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 21,
    marginTop: 9,
  },
  pill: {
    backgroundColor: '#334155',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 18,
  },
  pillText: { color: C.white, fontSize: 11 },
  body: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    padding: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    color: C.navy,
    fontSize: 19,
    fontWeight: '800',
  },
  sub: {
    color: C.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 6,
  },
  choice: {
    backgroundColor: C.white,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 17,
    paddingVertical: 11,
    marginRight: 9,
  },
  choiceActive: {
    backgroundColor: C.navy,
    borderColor: C.navy,
  },
  choiceText: {
    color: C.navy,
    fontWeight: '700',
    fontSize: 12,
  },
  choiceTextActive: { color: C.white },
  kpiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  kpi: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  kpiLabel: { color: C.muted, fontSize: 12 },
  kpiValue: {
    color: C.navy,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 10,
  },
  panel: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 9,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: C.bg,
  },
  filterActive: { backgroundColor: C.navy },
  filterText: {
    color: C.navy,
    fontWeight: '700',
    fontSize: 12,
  },
  filterTextActive: { color: C.white },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  area: {
    color: C.blue,
    fontSize: 11,
    fontWeight: '800',
  },
  priority: {
    fontSize: 10,
    fontWeight: '800',
  },
  cardTitle: {
    color: C.navy,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 10,
  },
  evidence: {
    color: C.text,
    fontSize: 12,
    lineHeight: 20,
  },
  expand: {
    color: C.blue,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 14,
  },
  details: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 15,
    marginTop: 16,
  },
  detailLabel: {
    color: C.muted,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 9,
    marginBottom: 6,
  },
  detailText: {
    color: C.text,
    fontSize: 12,
    lineHeight: 20,
  },
  note: {
    color: C.text,
    fontSize: 12,
    lineHeight: 21,
    marginBottom: 8,
  },
  next: {
    backgroundColor: C.navy,
    borderRadius: 12,
    padding: 17,
    alignItems: 'center',
    marginTop: 5,
  },
  nextText: {
    color: C.white,
    fontSize: 13,
    fontWeight: '800',
  },
  footer: {
    color: C.muted,
    textAlign: 'center',
    fontSize: 11,
    marginTop: 20,
  },
});
