
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
  blue: '#2563EB',
  green: '#16A34A',
  red: '#DC2626',
  bg: '#F4F6FA',
  white: '#FFFFFF',
  text: '#334155',
  muted: '#64748B',
  border: '#E2E8F0',
};

const benchmarks = [
  {
    name: 'EBITDA Margin',
    levwell: 8.1,
    peer: 10.3,
    max: 15,
    unit: '%',
  },
  {
    name: 'Average Daily Rate',
    levwell: 17550,
    peer: 19259,
    max: 22000,
    unit: 'KSh',
  },
  {
    name: 'Occupancy',
    levwell: 74,
    peer: 75.6,
    max: 100,
    unit: '%',
  },
  {
    name: 'RevPAR',
    levwell: 12987,
    peer: 14560,
    max: 18000,
    unit: 'KSh',
  },
];

const scorecard = [
  {
    area: 'Financial',
    objective: 'Improve profitability and room revenue',
    kpi: 'EBITDA margin, ADR, RevPAR',
  },
  {
    area: 'Customer',
    objective: 'Increase satisfaction and repeat bookings',
    kpi: 'Guest rating, loyalty, conversion',
  },
  {
    area: 'Internal Processes',
    objective: 'Improve service and operational efficiency',
    kpi: 'Cost control, booking abandonment',
  },
  {
    area: 'Learning & Growth',
    objective: 'Develop workforce capability',
    kpi: 'Turnover, training, engagement',
  },
];

const money = (n: number) =>
  `KSh ${Math.round(n).toLocaleString('en-KE')}`;

const millions = (n: number) =>
  `KSh ${n.toFixed(1)}M`;

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
        <Text style={s.headingSubtitle}>{subtitle}</Text>
      ) : null}
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
      <View
        style={[s.accent, { backgroundColor: color }]}
      />
      <Text style={s.kpiLabel}>{label}</Text>
      <Text
        style={[s.kpiValue, { color }]}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {value}
      </Text>
      <Text style={s.kpiDetail}>{detail}</Text>
    </View>
  );
}

function CompareBar({
  label,
  levwell,
  peer,
  max,
  unit,
}: {
  label: string;
  levwell: number;
  peer: number;
  max: number;
  unit: string;
}) {
  const display = (n: number) =>
    unit === 'KSh'
      ? money(n)
      : `${n}%`;

  return (
    <View style={s.compareItem}>
      <Text style={s.compareTitle}>{label}</Text>

      <View style={s.compareLabelRow}>
        <Text style={s.smallText}>Levwell</Text>
        <Text style={s.compareNumber}>
          {display(levwell)}
        </Text>
      </View>
      <View style={s.track}>
        <View
          style={[
            s.fill,
            {
              width: `${Math.min(
                100,
                (levwell / max) * 100
              )}%`,
              backgroundColor: C.blue,
            },
          ]}
        />
      </View>

      <View style={s.compareLabelRow}>
        <Text style={s.smallText}>Benchmark</Text>
        <Text style={s.compareNumber}>
          {display(peer)}
        </Text>
      </View>
      <View style={s.track}>
        <View
          style={[
            s.fill,
            {
              width: `${Math.min(
                100,
                (peer / max) * 100
              )}%`,
              backgroundColor: C.gold,
            },
          ]}
        />
      </View>
    </View>
  );
}

function Row({
  label,
  value,
  color = C.navy,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <View style={s.dataRow}>
      <Text style={s.dataLabel}>{label}</Text>
      <Text style={[s.dataValue, { color }]}>
        {value}
      </Text>
    </View>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={s.field}>
      <Text style={s.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType="decimal-pad"
        style={s.input}
        selectTextOnFocus
      />
    </View>
  );
}

export default function FinancialsScreen() {
  const { width } = useWindowDimensions();
  const wide = width >= 760;

  const [initialCost, setInitialCost] =
    useState('260');

  const [annualLicence, setAnnualLicence] =
    useState('65');

  const [annualBenefit, setAnnualBenefit] =
    useState('180');

  const [downside, setDownside] =
    useState('25');

  const [benefitIncludesLicence, setBenefitIncludesLicence] =
    useState(false);

  const [selectedYear, setSelectedYear] =
    useState(3);

  const positive = (value: string) =>
    Math.max(0, Number(value) || 0);

  const investment = positive(initialCost);
  const licence = positive(annualLicence);
  const benefit = positive(annualBenefit);

  const downsideRate = Math.min(
    100,
    positive(downside)
  ) / 100;

  const realization = [0.3, 0.7, 1];

  const years = realization.map((rate, index) => {
    const grossBenefit = benefit * rate;

    const netBenefit = benefitIncludesLicence
      ? grossBenefit
      : grossBenefit - licence;

    const downsideBenefit =
      grossBenefit * (1 - downsideRate);

    const downsideNet = benefitIncludesLicence
      ? downsideBenefit
      : downsideBenefit - licence;

    return {
      year: index + 1,
      realization: rate,
      grossBenefit,
      netBenefit,
      downsideNet,
    };
  });

  const selected = years[selectedYear - 1];

  const totalGross = years.reduce(
    (sum, y) => sum + y.grossBenefit,
    0
  );

  const totalNet = years.reduce(
    (sum, y) => sum + y.netBenefit,
    0
  );

  const totalDownsideNet = years.reduce(
    (sum, y) => sum + y.downsideNet,
    0
  );

  const threeYearNet = totalNet - investment;
  const downsideNet =
    totalDownsideNet - investment;

  const cashOutlay = benefitIncludesLicence
    ? investment
    : investment + 3 * licence;

  const netColor =
    threeYearNet >= 0 ? C.green : C.red;

  const cardWidth: `${number}%` =
    wide ? '23.5%' : '48%';

  return (
    <SafeAreaView
      style={s.container}
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
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
            LEVWELL HOTELS / FINANCE
          </Text>
          <Text style={s.title}>
            Financial Intelligence
          </Text>
          <Text style={s.subtitle}>
            Performance benchmarking, investment
            appraisal and strategic decision support
          </Text>
          <View style={s.headerPill}>
            <Text style={s.headerPillText}>
              Round 2 · Planning Scenario
            </Text>
          </View>
        </View>

        <View style={s.body}>
          <Heading
            title="Executive Financial Overview"
            subtitle="Historical portfolio performance"
          />

          <View style={s.kpiGrid}>
            <Kpi
              label="EBITDA Margin"
              value="8.1%"
              detail="Levwell portfolio"
              width={cardWidth}
              color={C.blue}
            />
            <Kpi
              label="Average Daily Rate"
              value="KSh 17,550"
              detail="ADR"
              width={cardWidth}
              color={C.gold}
            />
            <Kpi
              label="Occupancy"
              value="74%"
              detail="Room occupancy"
              width={cardWidth}
              color={C.green}
            />
            <Kpi
              label="RevPAR"
              value="KSh 12,987"
              detail="ADR × Occupancy"
              width={cardWidth}
              color={C.navy}
            />
          </View>

          <Panel>
            <Heading
              title="Performance Benchmarking"
              subtitle="Levwell versus supplied peer planning benchmarks"
            />

            {benchmarks.map((item) => (
              <CompareBar
                key={item.name}
                {...item}
              />
            ))}

            <View style={s.infoBox}>
              <Text style={s.infoText}>
                The RevPAR benchmark gap is
                KSh 1,573 per available room
                per day. This is a comparison,
                not guaranteed additional revenue.
              </Text>
            </View>
          </Panel>

          <Panel>
            <Heading
              title="Balanced Scorecard"
              subtitle="Four perspectives for strategic performance management"
            />

            {scorecard.map((item) => (
              <View
                key={item.area}
                style={s.scorecardItem}
              >
                <Text style={s.scorecardArea}>
                  {item.area}
                </Text>
                <Text style={s.scorecardObjective}>
                  {item.objective}
                </Text>
                <Text style={s.scorecardKpi}>
                  KPIs: {item.kpi}
                </Text>
              </View>
            ))}
          </Panel>

          <Panel>
            <Heading
              title="Technology Investment Model"
              subtitle="Edit supplier assumptions to test financial viability"
            />

            <View style={s.notice}>
              <Text style={s.noticeText}>
                Supplier figures are preliminary and
                unverified. All financial inputs below
                are in millions of Kenyan shillings.
              </Text>
            </View>

            <NumberField
              label="Initial implementation cost (KSh M)"
              value={initialCost}
              onChange={setInitialCost}
            />

            <NumberField
              label="Annual licence cost (KSh M)"
              value={annualLicence}
              onChange={setAnnualLicence}
            />

            <NumberField
              label="Full-year incremental EBITDA claim (KSh M)"
              value={annualBenefit}
              onChange={setAnnualBenefit}
            />

            <Text style={s.fieldLabel}>
              Does the supplier's EBITDA claim
              already include licence costs?
            </Text>

            <View style={s.toggleRow}>
              <Pressable
                onPress={() =>
                  setBenefitIncludesLicence(false)
                }
                style={[
                  s.toggle,
                  !benefitIncludesLicence &&
                    s.toggleActive,
                ]}
              >
                <Text
                  style={[
                    s.toggleText,
                    !benefitIncludesLicence &&
                      s.toggleTextActive,
                  ]}
                >
                  No / exclude licence
                </Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  setBenefitIncludesLicence(true)
                }
                style={[
                  s.toggle,
                  benefitIncludesLicence &&
                    s.toggleActive,
                ]}
              >
                <Text
                  style={[
                    s.toggleText,
                    benefitIncludesLicence &&
                      s.toggleTextActive,
                  ]}
                >
                  Yes / already net
                </Text>
              </Pressable>
            </View>

            <Text style={s.note}>
              Choose "No" to deduct licence costs
              separately. Choose "Yes" only if
              the EBITDA benefit is confirmed
              to be net of those costs.
            </Text>

            <Heading
              title="Benefit Realisation"
              subtitle="30% in Year 1, 70% in Year 2 and 100% in Year 3"
            />

            <View style={s.yearButtons}>
              {years.map((year) => (
                <Pressable
                  key={year.year}
                  onPress={() =>
                    setSelectedYear(year.year)
                  }
                  style={[
                    s.yearButton,
                    selectedYear === year.year &&
                      s.yearButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      s.yearButtonText,
                      selectedYear === year.year &&
                        s.yearButtonTextActive,
                    ]}
                  >
                    Year {year.year}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={s.yearDetail}>
              <Text style={s.yearDetailTitle}>
                Year {selected.year} Projection
              </Text>

              <Row
                label="Benefit realisation"
                value={`${selected.realization * 100}%`}
              />

              <Row
                label="Incremental EBITDA claim"
                value={millions(
                  selected.grossBenefit
                )}
              />

              <Row
                label="Net annual benefit"
                value={millions(
                  selected.netBenefit
                )}
                color={
                  selected.netBenefit >= 0
                    ? C.green
                    : C.red
                }
              />
            </View>

            <Heading
              title="Three-Year Investment Summary"
            />

            <Row
              label="Total projected EBITDA benefit"
              value={millions(totalGross)}
            />

            <Row
              label="Initial investment"
              value={millions(investment)}
            />

            <Row
              label="Annual licence"
              value={millions(licence)}
            />

            <Row
              label={
                benefitIncludesLicence
                  ? 'Initial cash outlay (licence embedded in benefits)'
                  : 'Initial + 3-year licence costs'
              }
              value={millions(cashOutlay)}
            />

            <View style={s.resultBox}>
              <Text style={s.resultLabel}>
                Three-Year Net Financial Contribution
              </Text>
              <Text
                style={[
                  s.resultValue,
                  { color: netColor },
                ]}
              >
                {millions(threeYearNet)}
              </Text>
              <Text style={s.resultDescription}>
                Undiscounted benefit less initial
                investment and any separately
                deducted licence costs.
              </Text>
            </View>

            <Text style={s.note}>
              This is a simplified, undiscounted
              appraisal. It excludes taxes, financing,
              working capital, discounting and
              other implementation costs.
              The proposed supplier contract is
              five years, so a complete board
              appraisal should also cover Years 4–5.
            </Text>
          </Panel>

          <Panel>
            <Heading
              title="Downside Scenario"
              subtitle="Stress-test the supplier's projected benefit"
            />

            <NumberField
              label="Benefit shortfall (%)"
              value={downside}
              onChange={setDownside}
            />

            <Row
              label="Base three-year net"
              value={millions(threeYearNet)}
              color={netColor}
            />

            <Row
              label="Downside three-year net"
              value={millions(downsideNet)}
              color={
                downsideNet >= 0
                  ? C.green
                  : C.red
              }
            />

            <View style={s.infoBox}>
              <Text style={s.infoText}>
                A {downsideRate * 100}% shortfall
                reduces the modelled EBITDA
                benefit before any separate licence
                deduction. This is a sensitivity
                scenario, not a forecast.
              </Text>
            </View>
          </Panel>

          <Panel>
            <Heading
              title="Strategic Recommendations"
            />

            {[
              'Validate the supplier EBITDA assumptions before approval.',
              'Clarify whether annual licence costs are included in projected EBITDA.',
              'Prioritise revenue management and dynamic pricing pilots.',
              'Use the Balanced Scorecard to review KPIs monthly.',
              'Prepare a discounted five-year investment appraisal.',
            ].map((item, index) => (
              <View
                key={item}
                style={s.actionRow}
              >
                <View style={s.actionNumber}>
                  <Text style={s.actionNumberText}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={s.actionText}>
                  {item}
                </Text>
              </View>
            ))}
          </Panel>

          <Pressable
            style={s.homeButton}
            onPress={() => router.replace('/')}
          >
            <Text style={s.homeButtonText}>
              ← Return to Executive Dashboard
            </Text>
          </Pressable>

          <Text style={s.footer}>
            SmartStay | Golden Eagles | Round 2
          </Text>
          <Text style={s.footer}>
            Historical metrics and editable planning assumptions
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: C.navy,
    padding: 24,
    paddingBottom: 34,
  },
  back: {
    color: '#CBD5E1',
    fontSize: 13,
    marginBottom: 24,
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
    letterSpacing: 2,
    fontWeight: '700',
  },
  title: {
    color: C.white,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 10,
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 21,
    marginTop: 9,
  },
  headerPill: {
    backgroundColor: '#334155',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    alignSelf: 'flex-start',
    marginTop: 18,
  },
  headerPillText: {
    color: C.white,
    fontSize: 11,
  },
  body: {
    width: '100%',
    maxWidth: 1150,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 25,
  },
  heading: {
    marginBottom: 16,
  },
  headingTitle: {
    color: C.navy,
    fontSize: 19,
    fontWeight: '800',
  },
  headingSubtitle: {
    color: C.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 6,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  kpi: {
    backgroundColor: C.white,
    padding: 16,
    minHeight: 133,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 12,
  },
  accent: {
    width: 32,
    height: 4,
    borderRadius: 4,
    marginBottom: 14,
  },
  kpiLabel: {
    color: C.muted,
    fontSize: 12,
  },
  kpiValue: {
    fontSize: 21,
    fontWeight: '800',
    marginTop: 10,
  },
  kpiDetail: {
    color: C.muted,
    fontSize: 11,
    marginTop: 8,
  },
  panel: {
    backgroundColor: C.white,
    padding: 19,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 18,
  },
  compareItem: {
    marginBottom: 24,
  },
  compareTitle: {
    color: C.navy,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 13,
  },
  compareLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
    gap: 10,
  },
  smallText: {
    color: C.muted,
    fontSize: 12,
  },
  compareNumber: {
    color: C.navy,
    fontSize: 12,
    fontWeight: '700',
  },
  track: {
    height: 11,
    backgroundColor: '#E9EEF5',
    borderRadius: 7,
    overflow: 'hidden',
    marginBottom: 12,
  },
  fill: {
    height: '100%',
    borderRadius: 7,
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  infoText: {
    color: '#1E40AF',
    fontSize: 12,
    lineHeight: 20,
  },
  scorecardItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 11,
    borderLeftWidth: 4,
    borderLeftColor: C.gold,
  },
  scorecardArea: {
    color: C.navy,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 7,
  },
  scorecardObjective: {
    color: C.text,
    fontSize: 12,
    lineHeight: 19,
  },
  scorecardKpi: {
    color: C.blue,
    fontSize: 11,
    marginTop: 9,
    fontWeight: '600',
  },
  notice: {
    backgroundColor: '#FFFBEB',
    padding: 14,
    borderRadius: 11,
    marginBottom: 20,
  },
  noticeText: {
    color: '#92400E',
    fontSize: 12,
    lineHeight: 20,
  },
  field: {
    marginBottom: 17,
  },
  fieldLabel: {
    color: C.navy,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 9,
  },
  input: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 13,
    backgroundColor: '#F8FAFC',
    color: C.navy,
    fontSize: 15,
  },
  toggleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginBottom: 10,
  },
  toggle: {
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 12,
  },
  toggleActive: {
    backgroundColor: C.navy,
    borderColor: C.navy,
  },
  toggleText: {
    color: C.text,
    fontSize: 12,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: C.white,
  },
  note: {
    color: C.muted,
    fontSize: 11,
    lineHeight: 19,
    marginTop: 10,
    marginBottom: 20,
  },
  yearButtons: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 17,
  },
  yearButton: {
    flex: 1,
    backgroundColor: C.bg,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  yearButtonActive: {
    backgroundColor: C.navy,
  },
  yearButtonText: {
    color: C.navy,
    fontSize: 12,
    fontWeight: '700',
  },
  yearButtonTextActive: {
    color: C.white,
  },
  yearDetail: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  yearDetailTitle: {
    color: C.navy,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 12,
  },
  dataLabel: {
    color: C.muted,
    fontSize: 12,
    flex: 1,
  },
  dataValue: {
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'right',
    flexShrink: 1,
  },
  resultBox: {
    backgroundColor: '#F8FAFC',
    padding: 19,
    borderRadius: 13,
    marginTop: 22,
  },
  resultLabel: {
    color: C.navy,
    fontSize: 13,
    fontWeight: '700',
  },
  resultValue: {
    fontSize: 30,
    fontWeight: '800',
    marginTop: 11,
  },
  resultDescription: {
    color: C.muted,
    fontSize: 11,
    lineHeight: 18,
    marginTop: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 17,
  },
  actionNumber: {
    backgroundColor: C.navy,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionNumberText: {
    color: C.white,
    fontSize: 12,
    fontWeight: '800',
  },
  actionText: {
    flex: 1,
    color: C.text,
    fontSize: 13,
    lineHeight: 21,
  },
  homeButton: {
    backgroundColor: C.navy,
    borderRadius: 12,
    padding: 17,
    alignItems: 'center',
    marginBottom: 17,
  },
  homeButtonText: {
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
