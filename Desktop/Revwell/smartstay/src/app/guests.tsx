
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const C = {
  navy: '#14213D',
  gold: '#D4A643',
  bg: '#F4F6FA',
  white: '#FFFFFF',
  text: '#334155',
  muted: '#64748B',
  border: '#E2E8F0',
  green: '#16A34A',
  red: '#DC2626',
  amber: '#D97706',
  blue: '#2563EB',
};

type HotelId = 'ALL' | 'H12' | 'H23' | 'H31';

type Hotel = {
  id: HotelId;
  label: string;
  rating: number;
  negative: number;
  total?: number;
  negativeCount?: number;
  insight: string;
  actions: string[];
};

const hotels: Hotel[] = [
  {
    id: 'ALL',
    label: 'All Hotels',
    rating: 4.14,
    negative: 5.44,
    total: 100000,
    negativeCount: 5442,
    insight:
      'Portfolio feedback is largely positive or neutral. Investigate the leading complaint topics and strengthen loyalty engagement.',
    actions: [
      'Prioritise recurring service complaints using verified review topics.',
      'Track guest satisfaction and loyalty membership monthly.',
      'Link complaint resolution to hotel-level operational reporting.',
    ],
  },
  {
    id: 'H12',
    label: 'Hotel H12',
    rating: 3.63,
    negative: 21.49,
    total: 2917,
    negativeCount: 627,
    insight:
      'H12 has a markedly higher negative-review rate than the portfolio. Review individual complaints before deciding which operational changes to make.',
    actions: [
      'Audit H12 negative reviews and group them by topic.',
      'Investigate service recovery, cleanliness and room-comfort issues where supported by H12 reviews.',
      'Compare review trends before and after corrective actions.',
    ],
  },
  {
    id: 'H23',
    label: 'Hotel H23',
    rating: 3.98,
    negative: 9.0,
    insight:
      'H23 is above the portfolio negative-review benchmark. Identify which complaint types and time periods explain the difference.',
    actions: [
      'Filter H23 reviews by topic and stay date.',
      'Review service standards and recurring complaints.',
      'Monitor changes in the negative-review rate.',
    ],
  },
  {
    id: 'H31',
    label: 'Hotel H31',
    rating: 4.47,
    negative: 1.29,
    insight:
      'H31 has stronger guest-experience indicators than the portfolio average. Investigate practices that may be worth replicating.',
    actions: [
      'Document guest-service processes associated with strong feedback.',
      'Compare H31 practices with lower-rated properties.',
      'Maintain review monitoring to preserve service quality.',
    ],
  },
];

const sentiments = [
  { label: 'Positive', count: 51228, color: C.green },
  { label: 'Neutral', count: 43330, color: C.gold },
  { label: 'Negative', count: 5442, color: C.red },
];

const topics = [
  { label: 'Staff', count: 1084 },
  { label: 'Cleanliness', count: 902 },
  { label: 'Room Comfort', count: 822 },
  { label: 'Value', count: 661 },
  { label: 'Check-in', count: 587 },
  { label: 'Wi-Fi', count: 558 },
  { label: 'Breakfast', count: 492 },
  { label: 'Facilities', count: 336 },
];

function Panel({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View style={s.panel}>{children}</View>;
}

function Heading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={s.heading}>
      <Text style={s.headingTitle}>{title}</Text>
      {subtitle ? (
        <Text style={s.sub}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

function Bar({
  label,
  value,
  max,
  color,
  right,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  right?: string;
}) {
  const percentage = Math.max(
    0,
    Math.min(100, (value / max) * 100)
  );

  return (
    <View style={s.barBlock}>
      <View style={s.row}>
        <Text style={s.barLabel}>{label}</Text>
        <Text style={s.barNumber}>
          {right ?? `${value.toFixed(2)}%`}
        </Text>
      </View>

      <View style={s.track}>
        <View
          style={[
            s.fill,
            {
              width: `${percentage}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

function Kpi({
  label,
  value,
  detail,
  width,
  color = C.navy,
}: {
  label: string;
  value: string;
  detail: string;
  width: `${number}%`;
  color?: string;
}) {
  return (
    <View style={[s.kpi, { width }]}>
      <Text style={s.kpiLabel}>{label}</Text>
      <Text
        style={[s.kpiValue, { color }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
      <Text style={s.kpiDetail}>{detail}</Text>
    </View>
  );
}

export default function GuestsScreen() {
  const [selectedId, setSelectedId] =
    useState<HotelId>('ALL');

  const [showAllTopics, setShowAllTopics] =
    useState(false);

  const { width } = useWindowDimensions();

  const hotel =
    hotels.find((h) => h.id === selectedId) ??
    hotels[0];

  const cardWidth: `${number}%` =
    width >= 780 ? '23.5%' : '48%';

  const difference = hotel.negative - 5.44;

  const concern =
    hotel.negative >= 15
      ? 'Priority review'
      : hotel.negative > 5.44
      ? 'Above benchmark'
      : hotel.negative < 5.44
      ? 'Below benchmark'
      : 'Portfolio baseline';

  const concernColor =
    hotel.negative >= 15
      ? C.red
      : hotel.negative > 5.44
      ? C.amber
      : C.green;

  return (
    <SafeAreaView
      style={s.screen}
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* Header */}
        <View style={s.header}>
          <Pressable
            onPress={() => router.replace('/')}
          >
            <Text style={s.back}>
              ← Executive Dashboard
            </Text>
          </Pressable>

          <Text style={s.brand}>SmartStay</Text>

          <Text style={s.eyebrow}>
            LEVWELL HOTELS / GUEST INTELLIGENCE
          </Text>

          <Text style={s.title}>
            Guest Experience & Loyalty
          </Text>

          <Text style={s.headerSub}>
            Hotel comparisons, review sentiment
            and service improvement priorities
          </Text>

          <View style={s.pill}>
            <Text style={s.pillText}>
              Historical review data · Not live
            </Text>
          </View>
        </View>

        <View style={s.body}>
          {/* Hotel selector */}
          <Heading
            title="Select a Hotel"
            subtitle="Hotel-specific insights update when you change the selection."
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={s.selector}
          >
            {hotels.map((h) => (
              <Pressable
                key={h.id}
                onPress={() => setSelectedId(h.id)}
                style={[
                  s.choice,
                  selectedId === h.id &&
                    s.choiceActive,
                ]}
              >
                <Text
                  style={[
                    s.choiceText,
                    selectedId === h.id &&
                      s.choiceTextActive,
                  ]}
                >
                  {h.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Selected hotel */}
          <View style={s.selectionBanner}>
            <View style={{ flex: 1 }}>
              <Text style={s.smallCaps}>
                CURRENT SELECTION
              </Text>
              <Text style={s.selectionTitle}>
                {hotel.label}
              </Text>
            </View>

            <View
              style={[
                s.riskPill,
                { borderColor: concernColor },
              ]}
            >
              <Text
                style={[
                  s.riskText,
                  { color: concernColor },
                ]}
              >
                {concern}
              </Text>
            </View>
          </View>

          {/* KPI widgets */}
          <Heading
            title="Guest Experience Overview"
            subtitle="Historical ratings and negative-review share"
          />

          <View style={s.grid}>
            <Kpi
              label="Average rating"
              value={`${hotel.rating.toFixed(2)} / 5`}
              detail="Guest reviews"
              width={cardWidth}
              color={C.gold}
            />

            <Kpi
              label="Negative reviews"
              value={`${hotel.negative.toFixed(2)}%`}
              detail="Share of reviews"
              width={cardWidth}
              color={concernColor}
            />

            <Kpi
              label="Difference vs portfolio"
              value={`${difference > 0 ? '+' : ''}${difference.toFixed(2)} pp`}
              detail="Percentage points"
              width={cardWidth}
              color={
                difference > 0 ? C.red : C.green
              }
            />

            <Kpi
              label="Review count"
              value={
                hotel.total?.toLocaleString('en-KE') ??
                'N/A'
              }
              detail="Available records"
              width={cardWidth}
            />
          </View>

          {/* Hotel comparison */}
          <Panel>
            <Heading
              title="Hotel vs Portfolio"
              subtitle="Negative-review rate (0–25% comparison scale)"
            />

            <Bar
              label={hotel.label}
              value={hotel.negative}
              max={25}
              color={concernColor}
            />

            {selectedId !== 'ALL' && (
              <Bar
                label="All Hotels"
                value={5.44}
                max={25}
                color={C.blue}
              />
            )}

            {hotel.negativeCount !== undefined &&
              hotel.total !== undefined && (
                <Text style={s.note}>
                  {hotel.negativeCount.toLocaleString()}
                  {' '}negative reviews out of{' '}
                  {hotel.total.toLocaleString()}
                  {' '}total reviews.
                </Text>
              )}

            <Text style={s.note}>
              Portfolio results include the selected
              hotel. All bars use the same scale.
            </Text>
          </Panel>

          {/* Management insight */}
          <Panel>
            <Heading
              title="Management Assessment"
              subtitle={`Analysis for ${hotel.label}`}
            />

            <View style={s.insight}>
              <Text style={s.insightText}>
                {hotel.insight}
              </Text>
            </View>

            <Text style={s.note}>
              Guest reviews indicate customer
              experience but do not establish
              the underlying cause of complaints.
            </Text>
          </Panel>

          {/* Portfolio sentiment */}
          <Panel>
            <Heading
              title="Portfolio Sentiment"
              subtitle="100,000 reviews across all hotels"
            />

            {sentiments.map((item) => (
              <Bar
                key={item.label}
                label={item.label}
                value={item.count}
                max={100000}
                color={item.color}
                right={`${item.count.toLocaleString()} · ${(item.count / 1000).toFixed(2)}%`}
              />
            ))}

            <Text style={s.note}>
              These are portfolio totals and do
              not change when a specific hotel
              is selected.
            </Text>
          </Panel>

          {/* Complaint topics */}
          <Panel>
            <Heading
              title="Leading Negative-Review Topics"
              subtitle="Portfolio-level complaint categories"
            />

            {(showAllTopics
              ? topics
              : topics.slice(0, 4)
            ).map((item) => (
              <Bar
                key={item.label}
                label={item.label}
                value={item.count}
                max={1084}
                color={C.blue}
                right={item.count.toLocaleString()}
              />
            ))}

            <Pressable
              style={s.outlineButton}
              onPress={() =>
                setShowAllTopics(!showAllTopics)
              }
            >
              <Text style={s.outlineText}>
                {showAllTopics
                  ? 'Show fewer topics'
                  : 'View all 8 topics'}
              </Text>
            </Pressable>

            <Text style={s.note}>
              Topic counts are for the entire
              portfolio. Hotel-specific topic
              counts are not available in this
              dashboard.
            </Text>
          </Panel>

          {/* Loyalty */}
          <Panel>
            <Heading
              title="Loyalty Programme"
              subtitle="Portfolio-level membership distribution"
            />

            <Bar
              label="Loyalty members"
              value={34}
              max={100}
              color={C.green}
              right="34%"
            />

            <Bar
              label="Non-members"
              value={66}
              max={100}
              color={C.gold}
              right="66%"
            />

            <View style={s.insight}>
              <Text style={s.insightText}>
                Explore member benefits and
                repeat-stay incentives, then
                measure whether they improve
                customer retention.
              </Text>
            </View>

            <Text style={s.note}>
              Hotel-specific loyalty membership
              rates are not available.
            </Text>
          </Panel>

          {/* Dynamic recommendations */}
          <Panel>
            <Heading
              title={`Recommended Actions — ${hotel.label}`}
            />

            {hotel.actions.map((action, index) => (
              <View
                key={`${hotel.id}-${index}`}
                style={s.action}
              >
                <View style={s.circle}>
                  <Text style={s.circleText}>
                    {index + 1}
                  </Text>
                </View>

                <Text style={s.actionText}>
                  {action}
                </Text>
              </View>
            ))}
          </Panel>

          {/* Navigation */}
          <Pressable
            style={s.next}
            onPress={() =>
              router.push('/operations')
            }
          >
            <Text style={s.nextText}>
              Explore Workforce & Operations →
            </Text>
          </Pressable>

          <Text style={s.footer}>
            SmartStay · Golden Eagles · Round 2
          </Text>

          <Text style={s.footer}>
            Historical data and proposed
            management actions
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    paddingBottom: 32,
  },
  header: {
    backgroundColor: C.navy,
    paddingHorizontal: 24,
    paddingTop: 24,
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
    letterSpacing: 1.5,
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
    marginTop: 10,
  },
  pill: {
    backgroundColor: '#334155',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginTop: 18,
  },
  pillText: {
    color: C.white,
    fontSize: 11,
  },
  body: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  heading: {
    marginBottom: 15,
  },
  headingTitle: {
    color: C.navy,
    fontSize: 19,
    fontWeight: '800',
  },
  sub: {
    color: C.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 5,
  },
  selector: {
    marginBottom: 16,
  },
  choice: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 17,
    marginRight: 9,
  },
  choiceActive: {
    backgroundColor: C.navy,
    borderColor: C.navy,
  },
  choiceText: {
    color: C.navy,
    fontSize: 12,
    fontWeight: '700',
  },
  choiceTextActive: {
    color: C.white,
  },
  selectionBanner: {
    backgroundColor: C.white,
    borderRadius: 15,
    padding: 18,
    marginBottom: 23,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  smallCaps: {
    color: C.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  selectionTitle: {
    color: C.navy,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 6,
  },
  riskPill: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 9,
    maxWidth: '55%',
  },
  riskText: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  kpi: {
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 15,
    minHeight: 125,
    marginBottom: 12,
  },
  kpiLabel: {
    color: C.muted,
    fontSize: 12,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 12,
  },
  kpiDetail: {
    color: C.muted,
    fontSize: 11,
    marginTop: 8,
  },
  panel: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 19,
    marginBottom: 17,
  },
  barBlock: {
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 8,
  },
  barLabel: {
    color: C.text,
    fontSize: 12,
    flex: 1,
  },
  barNumber: {
    color: C.navy,
    fontSize: 12,
    fontWeight: '700',
  },
  track: {
    height: 13,
    borderRadius: 8,
    backgroundColor: '#E9EEF5',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 8,
  },
  note: {
    color: C.muted,
    fontSize: 11,
    lineHeight: 18,
    marginTop: 8,
  },
  insight: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
  },
  insightText: {
    color: '#1E40AF',
    fontSize: 13,
    lineHeight: 21,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  outlineText: {
    color: C.navy,
    fontSize: 12,
    fontWeight: '700',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 17,
  },
  circle: {
    backgroundColor: C.navy,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: {
    color: C.white,
    fontSize: 12,
    fontWeight: '800',
  },
  actionText: {
    color: C.text,
    fontSize: 13,
    lineHeight: 21,
    flex: 1,
  },
  next: {
    backgroundColor: C.navy,
    borderRadius: 12,
    padding: 17,
    alignItems: 'center',
    marginBottom: 17,
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
    marginTop: 7,
  },
});
