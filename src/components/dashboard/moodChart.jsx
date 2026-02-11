import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";

const moodLabels = { 1: "Rough", 2: "Low", 3: "Okay", 4: "Good", 5: "Amazing" };
const moodEmojis = { 1: "😢", 2: "😔", 3: "😐", 4: "😊", 5: "🌟" };

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white rounded-xl shadow-lg border border-stone-200/60 px-4 py-3">
        <p className="text-xs text-[#8A8A8A] mb-1">{data.dateLabel}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg">{moodEmojis[data.mood_score]}</span>
          <span className="text-sm font-medium text-[#2D2D2D]">{moodLabels[data.mood_score]}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function MoodChart({ entries }) {
  const chartData = entries
    .sort((a, b) => new Date(a.entry_date) - new Date(b.entry_date))
    .slice(-14)
    .map((e) => ({
      ...e,
      dateLabel: format(parseISO(e.entry_date), "MMM d"),
      shortDate: format(parseISO(e.entry_date), "d"),
    }));

  if (chartData.length < 2) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200/60 p-6 shadow-sm">
        <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-4">Mood Trends</p>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <span className="text-4xl mb-3">📊</span>
          <p className="text-sm text-[#8A8A8A]">Log at least 2 days to see your mood trends</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200/60 p-6 shadow-sm">
      <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-4">Mood Trends</p>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C9A92" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7C9A92" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="shortDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#8A8A8A" }}
              dy={8}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#8A8A8A" }}
              tickFormatter={(v) => moodEmojis[v]}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="mood_score"
              stroke="#7C9A92"
              strokeWidth={2.5}
              fill="url(#moodGradient)"
              dot={{ r: 4, fill: "#7C9A92", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#7C9A92", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}