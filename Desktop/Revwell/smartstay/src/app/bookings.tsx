
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
  blue: '#2563EB',
  green: '#16A34A',
  red: '#DC2626',
  gold: '#D4A643',
  bg: '#F4F6FA',
  white: '#FFFFFF',
  text: '#334155',
  muted: '#64748B',
  border: '#E2E8F0',
};

const deviceData = [
  { name: 'Mobile', abandonment: 85.47 },
  { name: 'Desktop', abandonment: 83.74 },
  { name: 'Tablet', abandonment: 83.81 },
];

function KpiCard({
  label,
  value,
  description,
  accent,
  width,
}: {
  label: string;
  value: string;
  description: string;
  accent: string;
  width: `${number}%`;
}) {
  return (
    <View style={[styles.kpiCard, { width }]}>
      <View
        style={[styles.accent, { backgroundColor: accent }]}
      />
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={[styles.kpiValue, { color: accent }]}>
        {value}
      </Text>
      <Text style={styles.kpiDescription}>
        {description}
      </Text>
    </View>
  );
}

function ProgressRow({
  label,
  value,
  color,
  detail,
}: {
  label: string;
  value: number;
  color: string;
  detail?: string;
}) {
  return (
    <View style={styles.progressGroup}>
      <View style={styles.progressHeading}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={styles.progressValue}>
          {value.toFixed(2)}%
        </Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.max(0, Math.min(100, value))}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
      {detail ? (
        <Text style={styles.smallNote}>{detail}</Text>
      ) : null}
    </View>
  );
}

export default function BookingsScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 760;

  const [selectedDevice, setSelectedDevice] =
    useState('All Devices');

  const activeDevice = deviceData.find(
    (item) => item.name === selectedDevice
  );

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.replace('/')}
            style={styles.backButton}
          >
            <Text style={styles.backText}>
              ← Executive Dashboard
            </Text>
          </Pressable>

          <Text style={styles.eyebrow}>
            SMARTSTAY / ANALYTICS
          </Text>

          <Text style={styles.title}>
            Booking Intelligence
          </Text>

          <Text style={styles.subtitle}>
            Understand digital booking behaviour,
            conversion and revenue opportunities.
          </Text>

          <View style={styles.dataBadge}>
            <Text style={styles.dataBadgeText}>
              Historical dataset · 350,000 sessions
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.sectionTitle}>
            Performance Overview
          </Text>
          <Text style={styles.sectionDescription}>
            Key metrics from Levwell's digital activity
            analysis.
          </Text>

          <View style={styles.kpiGrid}>
            <KpiCard
              label="Digital Sessions"
              value="350,000"
              description="Sessions analysed"
              accent={C.blue}
              width={isWide ? '23.5%' : '48%'}
            />
            <KpiCard
              label="Converted Sessions"
              value="27,688"
              description="7.91% conversion"
              accent={C.green}
              width={isWide ? '23.5%' : '48%'}
            />
            <KpiCard
              label="Abandoned Sessions"
              value="296,984"
              description="84.85% abandonment"
              accent={C.red}
              width={isWide ? '23.5%' : '48%'}
            />
            <KpiCard
              label="Average Daily Rate"
              value="KSh 17,550"
              description="Portfolio ADR"
              accent={C.gold}
              width={isWide ? '23.5%' : '48%'}
            />
          </View>

          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>
                Booking Funnel
              </Text>
              <Text style={styles.panelTag}>
                Historical
              </Text>
            </View>

            <ProgressRow
              label="Total digital sessions"
              value={100}
              color={C.blue}
              detail="350,000 sessions"
            />

            <ProgressRow
              label="Converted sessions"
              value={7.91}
              color={C.green}
              detail="27,688 sessions"
            />

            <ProgressRow
              label="Abandoned sessions"
              value={84.85}
              color={C.red}
              detail="296,984 sessions"
            />

            <Text style={styles.smallNote}>
              The reported conversion and abandonment
              categories do not account for every session.
              Other outcomes are not shown in this chart.
            </Text>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>
              Device Performance
            </Text>
            <Text style={styles.sectionDescription}>
              Select a device to compare abandonment rates.
            </Text>

            <View style={styles.filterRow}>
              {[
                'All Devices',
                'Mobile',
                'Desktop',
                'Tablet',
              ].map((device) => (
                <Pressable
                  key={device}
                  onPress={() => setSelectedDevice(device)}
                  style={[
                    styles.filterButton,
                    selectedDevice === device &&
                      styles.activeFilter,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedDevice === device &&
                        styles.activeFilterText,
                    ]}
                  >
                    {device}
                  </Text>
                </Pressable>
              ))}
            </View>

            {(activeDevice
              ? [activeDevice]
              : deviceData
            ).map((device) => (
              <ProgressRow
                key={device.name}
                label={device.name}
                value={device.abandonment}
                color={
                  device.name === 'Mobile'
                    ? C.red
                    : C.blue
                }
              />
            ))}

            <View style={styles.insightBox}>
              <Text style={styles.insightTitle}>
                Device Insight
              </Text>
              <Text style={styles.insightText}>
                {activeDevice
                  ? `${activeDevice.name} has a reported abandonment rate of ${activeDevice.abandonment.toFixed(2)}%. Investigate friction in this device's booking journey.`
                  : 'Mobile has the highest reported abandonment rate at 85.47%. Prioritise mobile booking usability and checkout testing.'}
              </Text>
            </View>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>
              Customer Data Quality
            </Text>

            <View style={styles.dataQualityRow}>
              <View>
                <Text style={styles.dataQualityLabel}>
                  Sessions with missing Customer ID
                </Text>
                <Text style={styles.dataQualityValue}>
                  147,187
                </Text>
              </View>
              <Text style={styles.dataQualityPercent}>
                42.05%
              </Text>
            </View>

            <ProgressRow
              label="Missing Customer ID"
              value={42.05}
              color={C.gold}
            />

            <Text style={styles.smallNote}>
              Missing IDs in anonymous browsing can be
              normal. Confirm the missing-ID rate among
              completed bookings before classifying this
              as a data-quality failure.
            </Text>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>
              Revenue Performance
            </Text>

            <View style={styles.revenueRow}>
              <Text style={styles.revenueLabel}>
                Average Daily Rate
              </Text>
              <Text style={styles.revenueValue}>
                KSh 17,550
              </Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.revenueRow}>
              <Text style={styles.revenueLabel}>
                Occupancy
              </Text>
              <Text style={styles.revenueValue}>
                74%
              </Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.revenueRow}>
              <Text style={styles.revenueLabel}>
                RevPAR
              </Text>
              <Text style={styles.revenueValue}>
                KSh 12,987
              </Text>
            </View>

            <Text style={styles.smallNote}>
              RevPAR = ADR × Occupancy =
              17,550 × 0.74.
            </Text>
          </View>

          <View style={styles.recommendationPanel}>
            <Text style={styles.recommendationTitle}>
              SmartStay Recommendations
            </Text>

            {[
              'Simplify the mobile booking journey.',
              'Investigate where visitors abandon checkout.',
              'Test clearer pricing and booking information.',
              'Improve analytics for completed bookings.',
              'Monitor conversion rates after each improvement.',
            ].map((recommendation, index) => (
              <View
                key={index}
                style={styles.recommendationRow}
              >
                <View style={styles.numberCircle}>
                  <Text style={styles.numberText}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={styles.recommendationText}>
                  {recommendation}
                </Text>
              </View>
            ))}
          </View>

          <Pressable
            onPress={() => router.push('/financials')}
            style={styles.nextButton}
          >
            <Text style={styles.nextButtonText}>
              Explore Financial Performance →
            </Text>
          </Pressable>

          <Text style={styles.footer}>
            SmartStay · Golden Eagles · Round 2
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
  scrollContent: {
    paddingBottom: 35,
  },
  header: {
    backgroundColor: C.navy,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 25,
  },
  backText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
  },
  eyebrow: {
    color: C.gold,
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '700',
  },
  title: {
    color: C.white,
    fontSize: 29,
    fontWeight: '800',
    marginTop: 10,
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 21,
    marginTop: 10,
    maxWidth: 650,
  },
  dataBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#334155',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 17,
  },
  dataBadgeText: {
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
  sectionTitle: {
    color: C.navy,
    fontSize: 20,
    fontWeight: '800',
  },
  sectionDescription: {
    color: C.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 5,
    marginBottom: 16,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  kpiCard: {
    backgroundColor: C.white,
    borderRadius: 15,
    padding: 16,
    minHeight: 135,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  accent: {
    width: 30,
    height: 4,
    borderRadius: 3,
    marginBottom: 13,
  },
  kpiLabel: {
    color: C.muted,
    fontSize: 11,
    marginBottom: 10,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  kpiDescription: {
    color: C.muted,
    fontSize: 11,
    marginTop: 8,
  },
  panel: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 17,
    borderWidth: 1,
    borderColor: C.border,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  panelTitle: {
    color: C.navy,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  panelTag: {
    color: C.muted,
    fontSize: 11,
  },
  progressGroup: {
    marginBottom: 19,
  },
  progressHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 9,
    gap: 10,
  },
  progressLabel: {
    color: C.text,
    fontSize: 12,
    flex: 1,
  },
  progressValue: {
    color: C.navy,
    fontSize: 12,
    fontWeight: '700',
  },
  track: {
    backgroundColor: '#E9EEF5',
    height: 13,
    borderRadius: 8,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 8,
  },
  smallNote: {
    color: C.muted,
    fontSize: 11,
    lineHeight: 18,
    marginTop: 8,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 23,
  },
  filterButton: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
  },
  activeFilter: {
    backgroundColor: C.navy,
    borderColor: C.navy,
  },
  filterText: {
    color: C.text,
    fontSize: 11,
    fontWeight: '600',
  },
  activeFilterText: {
    color: C.white,
  },
  insightBox: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
  },
  insightTitle: {
    color: '#1E40AF',
    fontWeight: '800',
    fontSize: 13,
    marginBottom: 7,
  },
  insightText: {
    color: '#1E3A8A',
    fontSize: 12,
    lineHeight: 20,
  },
  dataQualityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  dataQualityLabel: {
    color: C.muted,
    fontSize: 12,
    marginBottom: 7,
  },
  dataQualityValue: {
    color: C.navy,
    fontSize: 26,
    fontWeight: '800',
  },
  dataQualityPercent: {
    color: C.gold,
    fontSize: 20,
    fontWeight: '800',
  },
  revenueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 12,
  },
  revenueLabel: {
    color: C.muted,
    fontSize: 13,
  },
  revenueValue: {
    color: C.navy,
    fontSize: 14,
    fontWeight: '800',
  },
  separator: {
    height: 1,
    backgroundColor: C.border,
  },
  recommendationPanel: {
    backgroundColor: '#F0FDF4',
    padding: 20,
    borderRadius: 16,
    marginBottom: 18,
  },
  recommendationTitle: {
    color: '#166534',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 18,
  },
  recommendationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  numberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: C.white,
    fontWeight: '800',
    fontSize: 12,
  },
  recommendationText: {
    color: '#166534',
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
  nextButton: {
    backgroundColor: C.navy,
    borderRadius: 12,
    padding: 17,
    alignItems: 'center',
  },
  nextButtonText: {
    color: C.white,
    fontWeight: '800',
    fontSize: 13,
  },
  footer: {
    textAlign: 'center',
    color: C.muted,
    fontSize: 11,
    marginTop: 24,
  },
});
