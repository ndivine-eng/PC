
import React, { useMemo, useState } from 'react';
import {
  View, Text, ScrollView, Pressable,
  StyleSheet, useWindowDimensions,
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
  green: '#15803D',
  blue: '#2563EB',
  red: '#B91C1C',
};

type Status = 'Not started' | 'In progress' | 'Completed';

type Phase = {
  id: number;
  title: string;
  months: string;
  owner: string;
  deliverables: string[];
  gate: string;
};

const phases: Phase[] = [
  {
    id: 1,
    title: 'Discovery & Baseline',
    months: 'Months 1–2',
    owner: 'Programme Office / Finance / Data',
    deliverables: [
      'Confirm hotel-level baseline KPIs',
      'Audit booking, guest and workforce data quality',
      'Validate supplier costs and benefit assumptions',
    ],
    gate: 'Approved baseline and business case',
  },
  {
    id: 2,
    title: 'Solution Design & Pilot Setup',
    months: 'Months 3–4',
    owner: 'Technology / Operations',
    deliverables: [
      'Design SmartStay data integrations',
      'Agree security, privacy and access controls',
      'Choose pilot properties and define success criteria',
    ],
    gate: 'Pilot design and readiness sign-off',
  },
  {
    id: 3,
    title: 'Pilot & Measure',
    months: 'Months 5–7',
    owner: 'Hotel Managers / Digital / HR',
    deliverables: [
      'Test guest-service and booking interventions',
      'Pilot dashboards and workforce reporting',
      'Compare pilot results with baseline',
    ],
    gate: 'Evidence-based go / no-go decision',
  },
  {
    id: 4,
    title: 'Phased Rollout',
    months: 'Months 8–10',
    owner: 'Technology / Regional Operations',
    deliverables: [
      'Roll out validated features in waves',
      'Train staff and establish support channels',
      'Monitor adoption and service disruption',
    ],
    gate: 'Operational acceptance by rollout wave',
  },
  {
    id: 5,
    title: 'Stabilise & Review',
    months: 'Months 11–12',
    owner: 'Finance / PMO / Executive Team',
    deliverables: [
      'Verify realised financial and operating benefits',
      'Resolve remaining data-quality issues',
      'Approve the next-year optimisation plan',
    ],
    gate: 'Post-implementation review',
  },
];

const risks = [
  {
    name: 'Benefits below supplier forecast',
    response:
      'Model downside scenarios and release funding against measured results.',
    owner: 'Finance',
  },
  {
    name: 'Data quality and privacy gaps',
    response:
      'Validate source data, apply role-based access and define retention rules.',
    owner: 'Data / Security',
  },
  {
    name: 'Low staff adoption',
    response:
      'Train hotel champions and monitor use, feedback and support requests.',
    owner: 'HR / Operations',
  },
  {
    name: 'Implementation disruption',
    response:
      'Use pilots, phased deployment, rollback plans and service monitoring.',
    owner: 'Technology',
  },
];

const statuses: Status[] = [
  'Not started',
  'In progress',
  'Completed',
];

const statusColor = (status: Status) =>
  status === 'Completed'
    ? C.green
    : status === 'In progress'
    ? C.blue
    : C.muted;

function Heading({
  title,
  sub,
}: {
  title: string;
  sub?: string;
}) {
  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={s.sectionTitle}>{title}</Text>
      {sub ? <Text style={s.sub}>{sub}</Text> : null}
    </View>
  );
}

export default function ImplementationScreen() {
  const [progress, setProgress] =
    useState<Record<number, Status>>({});

  const [expanded, setExpanded] =
    useState<number | null>(1);

  const [showRisks, setShowRisks] =
    useState(true);

  const { width } = useWindowDimensions();

  const completed = useMemo(
    () =>
      phases.filter(
        p => (progress[p.id] ?? 'Not started') === 'Completed'
      ).length,
    [progress]
  );

  const underway = useMemo(
    () =>
      phases.filter(
        p => (progress[p.id] ?? 'Not started') === 'In progress'
      ).length,
    [progress]
  );

  const pct = Math.round(
    (completed / phases.length) * 100
  );

  const cardWidth: `${number}%` =
    width >= 760 ? '31.5%' : '48%';

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll}>
        {/* Header */}
        <View style={s.header}>
          <Pressable onPress={() => router.replace('/')}>
            <Text style={s.back}>
              ← Executive Dashboard
            </Text>
          </Pressable>

          <Text style={s.brand}>SmartStay</Text>

          <Text style={s.eyebrow}>
            LEVWELL HOTELS / TRANSFORMATION
          </Text>

          <Text style={s.title}>
            Implementation Tracking
          </Text>

          <Text style={s.headerSub}>
            Proposed 12-month delivery roadmap,
            stage gates, accountability and risk management
          </Text>

          <View style={s.pill}>
            <Text style={s.pillText}>
              Illustrative plan · Not a live project tracker
            </Text>
          </View>
        </View>

        <View style={s.body}>
          <Heading
            title="Programme Overview"
            sub="The supplier has indicated a 12-month implementation period. Phase dates below are a proposed allocation, not an approved schedule."
          />

          {/* KPIs */}
          <View style={s.kpiRow}>
            <View style={[s.kpi, { width: cardWidth }]}>
              <Text style={s.kpiLabel}>Planned phases</Text>
              <Text style={s.kpiValue}>5</Text>
            </View>

            <View style={[s.kpi, { width: cardWidth }]}>
              <Text style={s.kpiLabel}>Marked complete</Text>
              <Text
                style={[
                  s.kpiValue,
                  { color: C.green },
                ]}
              >
                {completed}
              </Text>
            </View>

            <View
              style={[
                s.kpi,
                {
                  width:
                    width >= 760 ? '31.5%' : '100%',
                },
              ]}
            >
              <Text style={s.kpiLabel}>
                Marked in progress
              </Text>
              <Text
                style={[
                  s.kpiValue,
                  { color: C.blue },
                ]}
              >
                {underway}
              </Text>
            </View>
          </View>

          {/* Progress tracker */}
          <View style={s.panel}>
            <View style={s.row}>
              <Text style={s.panelTitle}>
                Demo Completion Tracker
              </Text>
              <Text style={s.percent}>{pct}%</Text>
            </View>

            <View style={s.track}>
              <View
                style={[
                  s.fill,
                  { width: `${pct}%` },
                ]}
              />
            </View>

            <Text style={s.note}>
              Tap phase status buttons to simulate
              project updates. Changes are held only
              while this screen is open and are not
              saved or connected to real implementation records.
            </Text>

            <Pressable
              onPress={() => setProgress({})}
              style={s.reset}
            >
              <Text style={s.resetText}>
                Reset Demo Statuses
              </Text>
            </Pressable>
          </View>

          {/* Roadmap */}
          <Heading
            title="12-Month Implementation Roadmap"
            sub="Select a phase to view deliverables and its proposed approval gate."
          />

          {phases.map(phase => {
            const status =
              progress[phase.id] ?? 'Not started';

            return (
              <View key={phase.id} style={s.panel}>
                <Pressable
                  onPress={() =>
                    setExpanded(
                      expanded === phase.id
                        ? null
                        : phase.id
                    )
                  }
                >
                  <View style={s.phaseTop}>
                    <View style={s.phaseNum}>
                      <Text style={s.phaseNumText}>
                        {phase.id}
                      </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={s.phaseMonths}>
                        {phase.months}
                      </Text>
                      <Text style={s.phaseTitle}>
                        {phase.title}
                      </Text>
                    </View>

                    <Text
                      style={[
                        s.statusLabel,
                        { color: statusColor(status) },
                      ]}
                    >
                      {status}
                    </Text>
                  </View>

                  <Text style={s.expand}>
                    {expanded === phase.id
                      ? 'Hide details −'
                      : 'View details +'}
                  </Text>
                </Pressable>

                {expanded === phase.id && (
                  <View style={s.detail}>
                    <Text style={s.label}>
                      PROPOSED OWNER
                    </Text>
                    <Text style={s.detailText}>
                      {phase.owner}
                    </Text>

                    <Text style={s.label}>
                      KEY DELIVERABLES
                    </Text>

                    {phase.deliverables.map(item => (
                      <Text
                        key={item}
                        style={s.detailText}
                      >
                        • {item}
                      </Text>
                    ))}

                    <Text style={s.label}>
                      STAGE GATE
                    </Text>
                    <Text style={s.detailText}>
                      {phase.gate}
                    </Text>

                    <Text style={s.label}>
                      DEMO STATUS
                    </Text>

                    <View style={s.statusButtons}>
                      {statuses.map(option => (
                        <Pressable
                          key={option}
                          onPress={() =>
                            setProgress(prev => ({
                              ...prev,
                              [phase.id]: option,
                            }))
                          }
                          style={[
                            s.statusButton,
                            status === option &&
                              s.statusButtonActive,
                          ]}
                        >
                          <Text
                            style={[
                              s.statusButtonText,
                              status === option &&
                                s.statusButtonTextActive,
                            ]}
                          >
                            {option}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            );
          })}

          {/* Risks */}
          <View style={s.panel}>
            <Pressable
              onPress={() => setShowRisks(!showRisks)}
            >
              <View style={s.row}>
                <Text style={s.panelTitle}>
                  Implementation Risks & Controls
                </Text>
                <Text style={s.expand}>
                  {showRisks ? 'Hide −' : 'Show +'}
                </Text>
              </View>
            </Pressable>

            {showRisks &&
              risks.map(risk => (
                <View key={risk.name} style={s.risk}>
                  <Text style={s.riskTitle}>
                    {risk.name}
                  </Text>
                  <Text style={s.detailText}>
                    {risk.response}
                  </Text>
                  <Text style={s.riskOwner}>
                    Suggested owner: {risk.owner}
                  </Text>
                </View>
              ))}
          </View>

          {/* Governance */}
          <View style={s.panel}>
            <Heading
              title="Financial & Governance Checkpoints"
            />

            {[
              'Indicative transformation budget: KSh 500M; this is a planning envelope, not an approved allocation.',
              'Preliminary technology proposal: KSh 260M upfront plus KSh 65M annual licence, subject to verification.',
              "Validate the supplier's claimed full-year incremental EBITDA of KSh 180M before relying on it.",
              'Reconcile the 12-month implementation plan with the proposed five-year supplier contract.',
              'Use a finance-owned, formula-driven five-year model and downside scenario for formal approval.',
            ].map(item => (
              <Text key={item} style={s.detailText}>
                • {item}
              </Text>
            ))}
          </View>

          {/* Navigation */}
          <Pressable
            style={s.next}
            onPress={() =>
              router.push('/recommendations')
            }
          >
            <Text style={s.nextText}>
              Review Smart Recommendations →
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
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    paddingBottom: 30,
  },
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
  pillText: {
    color: C.white,
    fontSize: 11,
  },
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
  kpiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  kpi: {
    backgroundColor: C.white,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  kpiLabel: {
    color: C.muted,
    fontSize: 12,
  },
  kpiValue: {
    color: C.navy,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 10,
  },
  panel: {
    backgroundColor: C.white,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  panelTitle: {
    color: C.navy,
    fontSize: 17,
    fontWeight: '800',
    flex: 1,
  },
  percent: {
    color: C.blue,
    fontWeight: '800',
    fontSize: 18,
  },
  track: {
    height: 13,
    backgroundColor: '#E9EEF5',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },
  fill: {
    height: '100%',
    backgroundColor: C.green,
    borderRadius: 10,
  },
  note: {
    color: C.muted,
    fontSize: 11,
    lineHeight: 19,
    marginTop: 13,
  },
  reset: {
    alignSelf: 'flex-start',
    marginTop: 14,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 9,
    padding: 11,
  },
  resetText: {
    color: C.navy,
    fontSize: 12,
    fontWeight: '700',
  },
  phaseTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  phaseNum: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.navy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseNumText: {
    color: C.white,
    fontWeight: '800',
  },
  phaseMonths: {
    color: C.blue,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 5,
  },
  phaseTitle: {
    color: C.navy,
    fontSize: 16,
    fontWeight: '800',
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '800',
    maxWidth: 75,
    textAlign: 'right',
  },
  expand: {
    color: C.blue,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 14,
  },
  detail: {
    backgroundColor: '#F8FAFC',
    borderRadius: 11,
    padding: 15,
    marginTop: 15,
  },
  label: {
    color: C.muted,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 13,
    marginBottom: 7,
  },
  detailText: {
    color: C.text,
    fontSize: 12,
    lineHeight: 21,
    marginBottom: 6,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  statusButton: {
    backgroundColor: C.white,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statusButtonActive: {
    backgroundColor: C.navy,
    borderColor: C.navy,
  },
  statusButtonText: {
    color: C.navy,
    fontSize: 11,
    fontWeight: '700',
  },
  statusButtonTextActive: {
    color: C.white,
  },
  risk: {
    borderTopWidth: 1,
    borderTopColor: C.border,
    marginTop: 15,
    paddingTop: 15,
  },
  riskTitle: {
    color: C.navy,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 7,
  },
  riskOwner: {
    color: C.blue,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 5,
  },
  next: {
    backgroundColor: C.navy,
    borderRadius: 12,
    padding: 17,
    alignItems: 'center',
  },
  nextText: {
    color: C.white,
    fontSize: 13,
    fontWeight: '800',
  },
  footer: {
    color: C.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 20,
  },
});
