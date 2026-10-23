
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
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
  muted: '#64748B',
  text: '#334155',
  border: '#E2E8F0',
  green: '#16A34A',
  red: '#DC2626',
  amber: '#D97706',
  blue: '#2563EB',
};

type HotelId = 'ALL' | 'H12' | 'H23' | 'H31';

type HotelData = {
  id: HotelId;
  name: string;
  rating: number;
  negative: number;
  reviews?: number;
  negativeCount?: number;
  insight: string;
  actions: string[];
};

const hotels: HotelData[] = [
  {
    id: 'ALL',
    name: 'All Hotels',
    rating: 4.14,
    negative: 5.44,
    reviews: 100000,
    negativeCount: 5442,
    insight:
      'Portfolio-level guest experience is generally positive, but staffing challenges require investigation across the hotel network.',
    actions: [
      'Integrate attendance, payroll and shift scheduling across all hotels.',
      'Identify which hotels experience high employee turnover.',
      'Compare guest satisfaction with staffing and training records.',
      'Pilot workforce analytics before portfolio-wide rollout.',
    ],
  },
  {
    id: 'H12',
    name: 'Hotel H12',
    rating: 3.63,
    negative: 21.49,
    reviews: 2917,
    negativeCount: 627,
    insight:
      'H12 has a substantially higher negative-review rate than the portfolio average. Investigate service quality, staffing and training, without assuming employee performance is the cause.',
    actions: [
      'Review H12 complaints by topic and date.',
      'Investigate staffing levels during poorly rated stays.',
      'Assess training needs and service recovery procedures.',
      'Review shift coverage, absenteeism and overtime when HR records become available.',
    ],
  },
  {
    id: 'H23',
    name: 'Hotel H23',
    rating: 3.98,
    negative: 9.0,
    insight:
      'H23 has a negative-review rate above the portfolio average. Review guest feedback and assess whether operational factors contributed.',
    actions: [
      'Identify the most frequent negative-review topics.',
      'Check whether service issues cluster around busy periods.',
      'Compare staffing schedules with occupancy once integrated.',
      'Monitor whether corrective actions improve satisfaction.',
    ],
  },
  {
    id: 'H31',
    name: 'Hotel H31',
    rating: 4.47,
    negative: 1.29,
    insight:
      'H31 has stronger guest satisfaction indicators than the portfolio average. Investigate its operational practices as potential lessons for other hotels.',
    actions: [
      'Document successful guest-service practices.',
      'Review staff training and management processes.',
      'Assess whether practices can be replicated elsewhere.',
      'Continue monitoring satisfaction and workforce indicators.',
    ],
  },
];

const formatKES = (value: number) =>
  `KSh ${Math.round(value).toLocaleString('en-KE')}`;

function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View style={styles.card}>{children}</View>;
}

function Section({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? (
        <Text style={styles.sectionSubtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

function Metric({
  label,
  value,
  color = C.navy,
  width,
}: {
  label: string;
  value: string;
  color?: string;
  width: `${number}%`;
}) {
  return (
    <View style={[styles.metric, { width }]}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text
        style={[styles.metricValue, { color }]}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

function Bar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View style={styles.barGroup}>
      <View style={styles.between}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={styles.barValue}>
          {value.toFixed(2)}%
        </Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.max(
                0,
                Math.min(100, value)
              )}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

function DataRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.dataRow}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={styles.dataValue}>{value}</Text>
    </View>
  );
}

export default function OperationsScreen() {
  const { width } = useWindowDimensions();
  const wide = width >= 750;

  const [selectedId, setSelectedId] =
    useState<HotelId>('ALL');

  const [annualCost, setAnnualCost] =
    useState('2000000');

  const [reduction, setReduction] =
    useState('15');

  const [costIncrease, setCostIncrease] =
    useState('8');

  const hotel =
    hotels.find((h) => h.id === selectedId) ??
    hotels[0];

  const cost = Math.max(
    0,
    Number(annualCost) || 0
  );

  const reductionRate = Math.max(
    0,
    Math.min(100, Number(reduction) || 0)
  );

  const increaseRate = Math.max(
    0,
    Number(costIncrease) || 0
  );

  const savings = cost * reductionRate / 100;
  const increasedCost =
    cost * (1 + increaseRate / 100);
  const scenarioNetCost =
    increasedCost * (1 - reductionRate / 100);

  const risk =
    hotel.negative >= 15
      ? 'High guest-service concern'
      : hotel.negative > 5.44
      ? 'Above portfolio benchmark'
      : hotel.negative < 5.44
      ? 'Below portfolio benchmark'
      : 'Portfolio benchmark';

  const riskColor =
    hotel.negative >= 15
      ? C.red
      : hotel.negative > 5.44
      ? C.amber
      : C.green;

  const cardWidth: `${number}%` =
    wide ? '23.5%' : '48%';

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.replace('/')}
            style={styles.backButton}
          >
            <Text style={styles.backText}>
              ← Executive Dashboard
            </Text>
          </Pressable>

          <Text style={styles.brand}>
            SmartStay
          </Text>

          <Text style={styles.eyebrow}>
            LEVWELL HOTELS / OPERATIONS
          </Text>

          <Text style={styles.title}>
            HR & Workforce Intelligence
          </Text>

          <Text style={styles.subtitle}>
            Hotel performance, workforce monitoring
            and cost optimisation
          </Text>
        </View>

        <View style={styles.body}>
          {/* Hotel Selection */}
          <Section
            title="Select Hotel"
            subtitle="Change the selection to update the available hotel-specific insights."
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.hotelScroll}
          >
            {hotels.map((item) => (
              <Pressable
                key={item.id}
                onPress={() =>
                  setSelectedId(item.id)
                }
                style={[
                  styles.hotelButton,
                  selectedId === item.id &&
                    styles.hotelButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.hotelText,
                    selectedId === item.id &&
                      styles.hotelTextActive,
                  ]}
                >
                  {item.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.selectedBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.selectedLabel}>
                CURRENT SELECTION
              </Text>
              <Text style={styles.selectedName}>
                {hotel.name}
              </Text>
            </View>
            <View
              style={[
                styles.riskPill,
                { borderColor: riskColor },
              ]}
            >
              <Text
                style={[
                  styles.riskText,
                  { color: riskColor },
                ]}
              >
                {risk}
              </Text>
            </View>
          </View>

          {/* Dynamic KPIs */}
          <Section
            title="Performance Overview"
            subtitle="Guest-experience evidence available for the selected hotel."
          />

          <View style={styles.metricGrid}>
            <Metric
              label="Guest Rating"
              value={`${hotel.rating.toFixed(2)} / 5`}
              color={C.gold}
              width={cardWidth}
            />

            <Metric
              label="Negative Reviews"
              value={`${hotel.negative.toFixed(2)}%`}
              color={riskColor}
              width={cardWidth}
            />

            <Metric
              label="Employee Turnover"
              value="N/A"
              color={C.muted}
              width={cardWidth}
            />

            <Metric
              label="Attendance Rate"
              value="N/A"
              color={C.muted}
              width={cardWidth}
            />
          </View>

          <Text style={styles.note}>
            Guest ratings are historical observations.
            Employee turnover and attendance require
            hotel-specific HR records.
          </Text>

          {/* Comparison */}
          <Card>
            <Section
              title="Guest Satisfaction Comparison"
              subtitle="Negative-review rate versus portfolio average"
            />

            <Bar
              label={hotel.name}
              value={hotel.negative}
              color={riskColor}
            />

            {selectedId !== 'ALL' && (
              <Bar
                label="All Hotels"
                value={5.44}
                color={C.blue}
              />
            )}

            <DataRow
              label="Selected rating"
              value={`${hotel.rating.toFixed(2)} / 5`}
            />

            <DataRow
              label="Negative reviews"
              value={
                hotel.negativeCount !== undefined &&
                hotel.reviews !== undefined
                  ? `${hotel.negativeCount.toLocaleString()} of ${hotel.reviews.toLocaleString()}`
                  : 'Count not available'
              }
            />

            <Text style={styles.note}>
              Guest satisfaction is a service-quality
              indicator, not a direct measure of employee
              performance.
            </Text>
          </Card>

          {/* Workforce Data */}
          <Card>
            <Section
              title="Workforce Monitoring"
              subtitle={`HRMS indicators for ${hotel.name}`}
            />

            <DataRow
              label="Employee headcount"
              value="Awaiting HR data"
            />
            <DataRow
              label="Attendance"
              value="Awaiting HR data"
            />
            <DataRow
              label="Absenteeism"
              value="Awaiting HR data"
            />
            <DataRow
              label="Employee turnover"
              value="Awaiting HR data"
            />
            <DataRow
              label="Overtime spending"
              value="Awaiting payroll data"
            />
            <DataRow
              label="Labour cost / revenue"
              value="Awaiting finance data"
            />

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>
                Data integration required
              </Text>
              <Text style={styles.infoText}>
                Connect HRMS, payroll, attendance
                and scheduling records to display
                accurate workforce metrics for
                {` ${hotel.name}`}.
              </Text>
            </View>
          </Card>

          {/* Dynamic Insight */}
          <Card>
            <Section
              title="Management Assessment"
              subtitle={`Findings for ${hotel.name}`}
            />

            <View style={styles.assessment}>
              <Text style={styles.assessmentText}>
                {hotel.insight}
              </Text>
            </View>

            <Text style={styles.note}>
              Recommendations are based on guest-review
              evidence and the proposed workforce strategy.
              They do not establish a causal relationship
              between staffing and guest ratings.
            </Text>
          </Card>

          {/* Dynamic Recommendations */}
          <Card>
            <Section
              title="Recommended Actions"
              subtitle={`Priority investigations for ${hotel.name}`}
            />

            {hotel.actions.map((action, index) => (
              <View
                key={`${hotel.id}-${index}`}
                style={styles.actionRow}
              >
                <View style={styles.numberCircle}>
                  <Text style={styles.numberText}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={styles.actionText}>
                  {action}
                </Text>
              </View>
            ))}
          </Card>

          {/* Financial Scenario */}
          <Card>
            <Section
              title="Workforce Cost Scenario"
              subtitle="Editable assumptions for planning, not actual hotel expenditure."
            />

            <Text style={styles.inputLabel}>
              Annual recruitment and training cost (KSh)
            </Text>
            <TextInput
              value={annualCost}
              onChangeText={setAnnualCost}
              keyboardType="numeric"
              style={styles.input}
            />

            <Text style={styles.inputLabel}>
              Potential cost reduction (%)
            </Text>
            <TextInput
              value={reduction}
              onChangeText={setReduction}
              keyboardType="numeric"
              style={styles.input}
            />

            <Text style={styles.inputLabel}>
              Operating cost increase (%)
            </Text>
            <TextInput
              value={costIncrease}
              onChangeText={setCostIncrease}
              keyboardType="numeric"
              style={styles.input}
            />

            <View style={styles.savingsBox}>
              <Text style={styles.savingsLabel}>
                Potential savings before cost increase
              </Text>
              <Text style={styles.savingsValue}>
                {formatKES(savings)}
              </Text>
            </View>

            <DataRow
              label="Starting annual cost"
              value={formatKES(cost)}
            />

            <DataRow
              label="Cost after increase"
              value={formatKES(increasedCost)}
            />

            <DataRow
              label="Cost after increase and reduction"
              value={formatKES(scenarioNetCost)}
            />

            <Text style={styles.note}>
              The default KSh 2,000,000 cost,
              15% reduction and 8% cost increase
              are illustrative assumptions. They
              apply to the scenario entered here,
              not automatically to the selected hotel.
              The cost increase is applied before
              the reduction in the combined scenario.
            </Text>
          </Card>

          {/* HRMS Strategy */}
          <Card>
            <Section title="Proposed HRMS Capabilities" />

            {[
              'Employee attendance and shift scheduling',
              'Payroll and labour cost reporting',
              'Overtime and absenteeism monitoring',
              'Occupancy-based workforce planning',
              'Training and employee retention analytics',
            ].map((item) => (
              <Text
                key={item}
                style={styles.capability}
              >
                ✓ {item}
              </Text>
            ))}
          </Card>

          <Pressable
            style={styles.homeButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.homeButtonText}>
              ← Return to Executive Dashboard
            </Text>
          </Pressable>

          <Text style={styles.footer}>
            SmartStay | Golden Eagles | Round 2
          </Text>
          <Text style={styles.footerNote}>
            Historical guest data + proposed HRMS
            + illustrative cost scenarios
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    paddingBottom: 35,
  },
  header: {
    backgroundColor: C.navy,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  backButton: {
    marginBottom: 22,
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#CBD5E1',
    fontSize: 13,
  },
  brand: {
    color: C.gold,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 12,
  },
  eyebrow: {
    color: C.gold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  title: {
    color: C.white,
    fontSize: 27,
    fontWeight: '800',
    marginTop: 9,
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 21,
    marginTop: 9,
  },
  body: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: C.navy,
    fontSize: 18,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: C.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 5,
  },
  hotelScroll: {
    marginBottom: 17,
  },
  hotelButton: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 22,
    marginRight: 9,
  },
  hotelButtonActive: {
    backgroundColor: C.navy,
    borderColor: C.navy,
  },
  hotelText: {
    color: C.navy,
    fontWeight: '700',
    fontSize: 12,
  },
  hotelTextActive: {
    color: C.white,
  },
  selectedBanner: {
    backgroundColor: C.white,
    borderRadius: 15,
    padding: 18,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  selectedLabel: {
    color: C.muted,
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: '700',
  },
  selectedName: {
    color: C.navy,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 6,
  },
  riskPill: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    maxWidth: '55%',
  },
  riskText: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metric: {
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 16,
    minHeight: 112,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  metricLabel: {
    color: C.muted,
    fontSize: 12,
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 23,
    fontWeight: '800',
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 19,
    marginBottom: 17,
    borderWidth: 1,
    borderColor: C.border,
  },
  between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 9,
  },
  barGroup: {
    marginBottom: 20,
  },
  barLabel: {
    color: C.text,
    fontSize: 12,
  },
  barValue: {
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
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 14,
  },
  dataLabel: {
    color: C.muted,
    fontSize: 12,
    flex: 1,
  },
  dataValue: {
    color: C.navy,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
    flexShrink: 1,
  },
  note: {
    color: C.muted,
    fontSize: 11,
    lineHeight: 18,
    marginBottom: 18,
    marginTop: 8,
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 17,
  },
  infoTitle: {
    color: '#1E40AF',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 7,
  },
  infoText: {
    color: '#1E3A8A',
    fontSize: 12,
    lineHeight: 20,
  },
  assessment: {
    backgroundColor: '#F8FAFC',
    padding: 17,
    borderRadius: 12,
  },
  assessmentText: {
    color: C.text,
    fontSize: 13,
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 17,
  },
  numberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
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
  inputLabel: {
    color: C.navy,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 13,
    fontSize: 15,
    color: C.navy,
    marginBottom: 17,
  },
  savingsBox: {
    backgroundColor: '#F0FDF4',
    padding: 18,
    borderRadius: 13,
    marginBottom: 14,
  },
  savingsLabel: {
    color: '#166534',
    fontSize: 12,
  },
  savingsValue: {
    color: C.green,
    fontSize: 27,
    fontWeight: '800',
    marginTop: 9,
  },
  capability: {
    color: C.text,
    fontSize: 13,
    lineHeight: 23,
    marginBottom: 10,
  },
  homeButton: {
    backgroundColor: C.navy,
    padding: 17,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  homeButtonText: {
    color: C.white,
    fontSize: 13,
    fontWeight: '800',
  },
  footer: {
    textAlign: 'center',
    color: C.muted,
    fontSize: 11,
    marginTop: 10,
  },
  footerNote: {
    textAlign: 'center',
    color: C.muted,
    fontSize: 10,
    marginTop: 6,
  },
});
