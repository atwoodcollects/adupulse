"use client";
import { useState, useEffect, useCallback } from "react";

// --- DATA ---
const MA_TOWNS = {
  "Boston": { avgRent: 2850, rentYoY: -0.8, medianHome: 785000, permitCount: 12, avgAduCost: 185000, propertyUplift: 0.18 },
  "Cambridge": { avgRent: 3100, rentYoY: -0.5, medianHome: 920000, permitCount: 8, avgAduCost: 195000, propertyUplift: 0.20 },
  "Somerville": { avgRent: 2700, rentYoY: -1.0, medianHome: 810000, permitCount: 6, avgAduCost: 175000, propertyUplift: 0.17 },
  "Newton": { avgRent: 2950, rentYoY: -0.3, medianHome: 1150000, permitCount: 15, avgAduCost: 210000, propertyUplift: 0.15 },
  "Brookline": { avgRent: 2800, rentYoY: -0.6, medianHome: 1050000, permitCount: 5, avgAduCost: 200000, propertyUplift: 0.16 },
  "Quincy": { avgRent: 2300, rentYoY: -1.2, medianHome: 580000, permitCount: 9, avgAduCost: 160000, propertyUplift: 0.19 },
  "Medford": { avgRent: 2400, rentYoY: -0.9, medianHome: 650000, permitCount: 4, avgAduCost: 165000, propertyUplift: 0.18 },
  "Arlington": { avgRent: 2650, rentYoY: -0.4, medianHome: 880000, permitCount: 11, avgAduCost: 185000, propertyUplift: 0.16 },
  "Waltham": { avgRent: 2500, rentYoY: -0.7, medianHome: 680000, permitCount: 7, avgAduCost: 170000, propertyUplift: 0.17 },
  "Plymouth": { avgRent: 2100, rentYoY: -1.1, medianHome: 520000, permitCount: 3, avgAduCost: 150000, propertyUplift: 0.20 },
  "Weymouth": { avgRent: 2200, rentYoY: -1.0, medianHome: 510000, permitCount: 4, avgAduCost: 155000, propertyUplift: 0.19 },
  "Braintree": { avgRent: 2350, rentYoY: -0.8, medianHome: 590000, permitCount: 6, avgAduCost: 160000, propertyUplift: 0.18 },
  "Framingham": { avgRent: 2250, rentYoY: -1.3, medianHome: 540000, permitCount: 5, avgAduCost: 155000, propertyUplift: 0.18 },
  "Worcester": { avgRent: 1800, rentYoY: -1.5, medianHome: 380000, permitCount: 10, avgAduCost: 135000, propertyUplift: 0.22 },
  "Lowell": { avgRent: 1750, rentYoY: -1.4, medianHome: 410000, permitCount: 7, avgAduCost: 130000, propertyUplift: 0.21 },
  "Springfield": { avgRent: 1450, rentYoY: -1.8, medianHome: 260000, permitCount: 3, avgAduCost: 120000, propertyUplift: 0.24 },
  "Salem": { avgRent: 2300, rentYoY: -0.7, medianHome: 530000, permitCount: 4, avgAduCost: 160000, propertyUplift: 0.19 },
  "Needham": { avgRent: 3000, rentYoY: -0.2, medianHome: 1250000, permitCount: 8, avgAduCost: 220000, propertyUplift: 0.14 },
  "Lexington": { avgRent: 3050, rentYoY: -0.3, medianHome: 1300000, permitCount: 10, avgAduCost: 225000, propertyUplift: 0.14 },
  "Hingham": { avgRent: 2700, rentYoY: -0.5, medianHome: 950000, permitCount: 6, avgAduCost: 195000, propertyUplift: 0.16 },
};

const NATIONAL_RENT_YOY = -1.4;
const NATIONAL_AVG_RENT = 1695;
const ASSISTED_LIVING_MONTHLY_MA = 6500;

const GOAL_DATA = {
  rental: { icon: "💰", label: "Rental Income", desc: "Generate monthly cash flow" },
  family: { icon: "👨‍👩‍👧", label: "Family Housing", desc: "House a family member" },
  aging: { icon: "🏡", label: "Age in Place", desc: "Stay home as you age" },
  value: { icon: "📈", label: "Property Value", desc: "Increase home equity" },
};

// --- COMPONENTS ---

const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtPct = (n) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;

function TownCallout({ town, data }) {
  const diff = data.rentYoY - NATIONAL_RENT_YOY;
  const better = diff > 0;
  return (
    <div style={{
      background: "linear-gradient(135deg, #0a1628 0%, #132240 100%)",
      border: "1px solid rgba(99,179,237,0.25)",
      borderRadius: 16,
      padding: "24px 28px",
      marginBottom: 28,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 120, height: 120,
        background: better ? "radial-gradient(circle, rgba(72,187,120,0.15), transparent)" : "radial-gradient(circle, rgba(237,137,54,0.15), transparent)",
        borderRadius: "50%",
      }} />
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "#7fb3e0", marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>
        📍 National Headlines vs. Your Town
      </div>
      <div style={{ display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={{ color: "#8a9bbd", fontSize: 12, marginBottom: 4 }}>US Avg Rent YoY</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#e85d5d", fontFamily: "'Space Mono', monospace" }}>{fmtPct(NATIONAL_RENT_YOY)}</div>
          <div style={{ color: "#5a6b8a", fontSize: 12 }}>{fmt(NATIONAL_AVG_RENT)}/mo avg</div>
        </div>
        <div style={{ width: 1, height: 48, background: "rgba(99,179,237,0.2)" }} />
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={{ color: "#8a9bbd", fontSize: 12, marginBottom: 4 }}>{town} Rent YoY</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: better ? "#48bb78" : "#ed8936", fontFamily: "'Space Mono', monospace" }}>{fmtPct(data.rentYoY)}</div>
          <div style={{ color: "#5a6b8a", fontSize: 12 }}>{fmt(data.avgRent)}/mo avg</div>
        </div>
        <div style={{ width: 1, height: 48, background: "rgba(99,179,237,0.2)" }} />
        <div style={{ flex: 1.2, minWidth: 180 }}>
          <div style={{ color: "#8a9bbd", fontSize: 12, marginBottom: 4 }}>Local Context</div>
          <div style={{ fontSize: 13, color: "#c8d6e5", lineHeight: 1.5 }}>
            {better
              ? `${town} is outperforming the national average by ${diff.toFixed(1)}pp. Local demand remains stronger than headlines suggest.`
              : `${town} is tracking close to national trends. Focus on non-rental value drivers.`
            }
          </div>
          {data.permitCount > 0 && (
            <div style={{ marginTop: 8, fontSize: 12, color: "#7fb3e0" }}>
              🏗️ {data.permitCount} ADU permits filed recently
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GoalSelector({ selected, onSelect }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 28 }}>
      {Object.entries(GOAL_DATA).map(([key, { icon, label, desc }]) => {
        const active = selected === key;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            style={{
              background: active ? "linear-gradient(135deg, #1a365d, #2a4a7f)" : "rgba(15,25,50,0.6)",
              border: active ? "2px solid #63b3ed" : "1px solid rgba(99,179,237,0.15)",
              borderRadius: 12,
              padding: "16px 14px",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s ease",
              transform: active ? "scale(1.02)" : "scale(1)",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: active ? "#fff" : "#a0b4d0", fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
            <div style={{ fontSize: 11, color: "#5a6b8a", marginTop: 2 }}>{desc}</div>
          </button>
        );
      })}
    </div>
  );
}

function RentSlider({ value, onChange }) {
  const scenarios = [
    { val: -2, label: "Pessimistic", color: "#e85d5d" },
    { val: -1, label: "Slight decline", color: "#ed8936" },
    { val: 0, label: "Flat", color: "#a0b4d0" },
    { val: 1, label: "Slight growth", color: "#68d391" },
    { val: 2, label: "Optimistic", color: "#48bb78" },
  ];
  const current = scenarios.find(s => s.val === value) || scenarios[2];

  return (
    <div style={{
      background: "rgba(15,25,50,0.5)",
      border: "1px solid rgba(99,179,237,0.15)",
      borderRadius: 12,
      padding: "18px 22px",
      marginBottom: 24,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: "#7fb3e0", textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
          Rent Growth Scenario
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: current.color, fontFamily: "'Space Mono', monospace" }}>
          {value > 0 ? "+" : ""}{value}% YoY — {current.label}
        </span>
      </div>
      <input
        type="range"
        min={-2}
        max={2}
        step={1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          accentColor: current.color,
          height: 6,
          cursor: "pointer",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontSize: 10, color: "#5a6b8a" }}>-2%</span>
        <span style={{ fontSize: 10, color: "#5a6b8a" }}>0%</span>
        <span style={{ fontSize: 10, color: "#5a6b8a" }}>+2%</span>
      </div>
    </div>
  );
}

function ValueBreakdown({ goal, town, data, rentScenario, years }) {
  const aduCost = data.avgAduCost;
  const monthlyRent = data.avgRent * 0.85; // conservative: 85% of market for ADU

  // Compute cumulative rent over N years with scenario
  let cumulativeRent = 0;
  let currentRent = monthlyRent;
  for (let y = 0; y < years; y++) {
    cumulativeRent += currentRent * 12;
    currentRent *= (1 + rentScenario / 100);
  }

  const propertyUplift = data.medianHome * data.propertyUplift;
  const familySavings = monthlyRent * 12 * years;
  const agingSavings = ASSISTED_LIVING_MONTHLY_MA * 12 * Math.min(years, 5); // assume up to 5 years

  const lines = [];

  if (goal === "rental" || goal === "value") {
    lines.push({ label: `Rental income (${years}yr, ${rentScenario > 0 ? "+" : ""}${rentScenario}% scenario)`, value: cumulativeRent, color: "#63b3ed", show: true });
  }
  lines.push({ label: "Est. property value increase", value: propertyUplift, color: "#48bb78", show: true });

  if (goal === "family") {
    lines.push({ label: `Family housing savings (${years}yr)`, value: familySavings, color: "#d69e2e", show: true });
  }
  if (goal === "aging") {
    lines.push({ label: `Avoided assisted living costs (up to 5yr)`, value: agingSavings, color: "#9f7aea", show: true });
  }

  const totalValue = lines.reduce((s, l) => s + l.value, 0);
  const roi = ((totalValue - aduCost) / aduCost * 100);
  const paybackYears = goal === "rental" ? (aduCost / (monthlyRent * 12)) : null;

  return (
    <div style={{
      background: "linear-gradient(180deg, rgba(10,22,40,0.8), rgba(15,30,55,0.6))",
      border: "1px solid rgba(99,179,237,0.2)",
      borderRadius: 16,
      padding: "28px",
      marginBottom: 24,
    }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "#7fb3e0", marginBottom: 20, fontFamily: "'DM Sans', sans-serif" }}>
        {years}-Year Value Breakdown — {GOAL_DATA[goal]?.icon} {GOAL_DATA[goal]?.label}
      </div>

      {/* Cost */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(99,179,237,0.1)" }}>
        <span style={{ color: "#8a9bbd", fontSize: 14 }}>Est. ADU construction cost</span>
        <span style={{ color: "#e85d5d", fontSize: 16, fontWeight: 600, fontFamily: "'Space Mono', monospace" }}>-{fmt(aduCost)}</span>
      </div>

      {/* Value lines */}
      {lines.filter(l => l.show).map((line, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(99,179,237,0.06)" }}>
          <span style={{ color: "#a0b4d0", fontSize: 14 }}>{line.label}</span>
          <span style={{ color: line.color, fontSize: 16, fontWeight: 600, fontFamily: "'Space Mono', monospace" }}>+{fmt(line.value)}</span>
        </div>
      ))}

      {/* Bar visualization */}
      <div style={{ marginTop: 20, marginBottom: 16, height: 8, borderRadius: 4, background: "rgba(99,179,237,0.1)", overflow: "hidden", display: "flex" }}>
        {lines.filter(l => l.show).map((line, i) => (
          <div key={i} style={{
            width: `${(line.value / totalValue) * 100}%`,
            height: "100%",
            background: line.color,
            transition: "width 0.5s ease",
          }} />
        ))}
      </div>

      {/* Totals */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 0 0",
        borderTop: "2px solid rgba(99,179,237,0.2)",
        marginTop: 8,
      }}>
        <div>
          <div style={{ color: "#c8d6e5", fontSize: 13 }}>Total est. value created</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#fff", fontFamily: "'Space Mono', monospace" }}>
            {fmt(totalValue)}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontSize: 22, fontWeight: 700,
            color: roi > 0 ? "#48bb78" : "#e85d5d",
            fontFamily: "'Space Mono', monospace",
          }}>
            {roi > 0 ? "+" : ""}{roi.toFixed(0)}% ROI
          </div>
          {paybackYears && (
            <div style={{ fontSize: 12, color: "#8a9bbd", marginTop: 2 }}>
              ~{paybackYears.toFixed(1)} year payback
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DecisionTree({ onGoalSelect }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      q: "What's driving your interest in building an ADU?",
      key: "motivation",
      options: [
        { label: "I want extra income", value: "income", icon: "💰" },
        { label: "A family member needs housing", value: "family", icon: "👨‍👩‍👧" },
        { label: "I want to age in my home", value: "aging", icon: "🏡" },
        { label: "I want to boost my home's value", value: "value", icon: "📈" },
      ]
    },
    {
      q: "How do you feel about rent market fluctuations?",
      key: "risk",
      options: [
        { label: "I want stable, predictable returns", value: "conservative", icon: "🛡️" },
        { label: "I'm comfortable with some variability", value: "moderate", icon: "⚖️" },
        { label: "I'm fine riding the market", value: "aggressive", icon: "🎢" },
      ],
      showIf: () => answers.motivation === "income",
    },
    {
      q: "What's your timeline for needing this space?",
      key: "timeline",
      options: [
        { label: "Within 6 months", value: "urgent", icon: "⚡" },
        { label: "6–18 months", value: "planned", icon: "📋" },
        { label: "No rush — exploring options", value: "exploring", icon: "🔍" },
      ]
    },
    {
      q: "How important is keeping upfront costs low?",
      key: "budget",
      options: [
        { label: "Very — I need the cheapest path", value: "tight", icon: "💵" },
        { label: "Moderate — willing to invest for quality", value: "moderate", icon: "🏠" },
        { label: "Budget isn't the main constraint", value: "flexible", icon: "✨" },
      ]
    },
  ];

  const activeQuestions = questions.filter(q => !q.showIf || q.showIf());

  const handleAnswer = (key, value) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    if (step < activeQuestions.length - 1) {
      setTimeout(() => setStep(s => s + 1), 300);
    } else {
      // Map to goal
      const goalMap = { income: "rental", family: "family", aging: "aging", value: "value" };
      const goal = goalMap[newAnswers.motivation] || "rental";
      setTimeout(() => onGoalSelect(goal), 500);
    }
  };

  const currentQ = activeQuestions[step];
  if (!currentQ) return null;

  return (
    <div style={{
      background: "linear-gradient(135deg, #0a1628 0%, #132240 100%)",
      border: "1px solid rgba(99,179,237,0.2)",
      borderRadius: 16,
      padding: "28px",
      marginBottom: 28,
    }}>
      {/* Progress */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {activeQuestions.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= step ? "#63b3ed" : "rgba(99,179,237,0.15)",
            transition: "background 0.3s ease",
          }} />
        ))}
      </div>

      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "#5a6b8a", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>
        Question {step + 1} of {activeQuestions.length}
      </div>
      <div style={{ fontSize: 18, fontWeight: 600, color: "#e2e8f0", marginBottom: 20, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>
        {currentQ.q}
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {currentQ.options.map((opt) => {
          const selected = answers[currentQ.key] === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => handleAnswer(currentQ.key, opt.value)}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                background: selected ? "rgba(99,179,237,0.15)" : "rgba(15,25,50,0.5)",
                border: selected ? "1px solid #63b3ed" : "1px solid rgba(99,179,237,0.1)",
                borderRadius: 10,
                padding: "14px 18px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ fontSize: 22 }}>{opt.icon}</span>
              <span style={{ fontSize: 14, color: selected ? "#fff" : "#a0b4d0", fontWeight: selected ? 600 : 400, fontFamily: "'DM Sans', sans-serif" }}>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {step > 0 && (
        <button
          onClick={() => setStep(s => s - 1)}
          style={{
            marginTop: 16, background: "none", border: "none",
            color: "#5a6b8a", fontSize: 12, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          ← Back
        </button>
      )}
    </div>
  );
}

// --- MAIN APP ---
export default function ADUPulseTools() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [town, setTown] = useState("Plymouth");
  const [goal, setGoal] = useState("rental");
  const [rentScenario, setRentScenario] = useState(0);
  const [years, setYears] = useState(10);

  const townData = MA_TOWNS[town];

  const tabs = [
    { key: "calculator", label: "💰 Estimate Calculator" },
    { key: "decision", label: "🧭 Decision Tree" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060e1a",
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      color: "#e2e8f0",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        padding: "32px 32px 0",
        maxWidth: 820,
        margin: "0 auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>⚡</div>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>ADU Pulse</span>
        </div>
        <div style={{ fontSize: 12, color: "#5a6b8a", marginBottom: 28, marginLeft: 48 }}>
          Should you build? What's it really worth?
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: "rgba(15,25,50,0.6)", borderRadius: 10, padding: 4, marginBottom: 28 }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                background: activeTab === t.key ? "rgba(99,179,237,0.15)" : "transparent",
                color: activeTab === t.key ? "#fff" : "#5a6b8a",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s ease",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 32px 48px" }}>

        {activeTab === "calculator" && (
          <>
            {/* Town Selector */}
            <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap", alignItems: "end" }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "#5a6b8a", display: "block", marginBottom: 6 }}>Your Town</label>
                <select
                  value={town}
                  onChange={e => setTown(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px",
                    background: "rgba(15,25,50,0.8)",
                    border: "1px solid rgba(99,179,237,0.2)",
                    borderRadius: 8, color: "#fff",
                    fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer",
                  }}
                >
                  {Object.keys(MA_TOWNS).sort().map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div style={{ minWidth: 130 }}>
                <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "#5a6b8a", display: "block", marginBottom: 6 }}>Time Horizon</label>
                <select
                  value={years}
                  onChange={e => setYears(Number(e.target.value))}
                  style={{
                    width: "100%", padding: "10px 14px",
                    background: "rgba(15,25,50,0.8)",
                    border: "1px solid rgba(99,179,237,0.2)",
                    borderRadius: 8, color: "#fff",
                    fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer",
                  }}
                >
                  {[5, 10, 15, 20].map(y => (
                    <option key={y} value={y}>{y} years</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Town vs National Callout */}
            <TownCallout town={town} data={townData} />

            {/* Goal Selector */}
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "#5a6b8a", marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>
              What's your primary goal?
            </div>
            <GoalSelector selected={goal} onSelect={setGoal} />

            {/* Rent Slider */}
            <RentSlider value={rentScenario} onChange={setRentScenario} />

            {/* Value Breakdown */}
            <ValueBreakdown
              goal={goal}
              town={town}
              data={townData}
              rentScenario={rentScenario}
              years={years}
            />

            {/* Disclaimer */}
            <div style={{
              fontSize: 11, color: "#3d4f6f", lineHeight: 1.5,
              padding: "16px 20px",
              background: "rgba(10,22,40,0.4)",
              borderRadius: 10,
              border: "1px solid rgba(99,179,237,0.08)",
            }}>
              ⚠️ Estimates are illustrative and based on local market averages. Actual costs, rents, and property values vary. Assisted living cost based on MA state average. Consult a financial advisor before making investment decisions. Data sources include local permit records, Census ACS, and industry benchmarks.
            </div>
          </>
        )}

        {activeTab === "decision" && (
          <>
            <div style={{ fontSize: 15, color: "#8a9bbd", marginBottom: 24, lineHeight: 1.6 }}>
              Answer a few quick questions and we'll show you the strongest case for building an ADU based on your situation — not just the national headlines.
            </div>
            <DecisionTree onGoalSelect={(g) => {
              setGoal(g);
              setActiveTab("calculator");
            }} />
          </>
        )}
      </div>
    </div>
  );
}
