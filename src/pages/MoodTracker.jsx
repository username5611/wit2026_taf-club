import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import MoodChart from "../components/dashboard/moodChart";
import MoodCheckInCard from "../components/dashboard/moodCheckInCard";

const moodConfig = {
  amazing: { emoji: "🌟", color: "bg-amber-100 text-amber-700", label: "Amazing" },
  good: { emoji: "😊", color: "bg-green-100 text-green-700", label: "Good" },
  okay: { emoji: "😐", color: "bg-blue-100 text-blue-700", label: "Okay" },
  low: { emoji: "😔", color: "bg-purple-100 text-purple-700", label: "Low" },
  rough: { emoji: "😢", color: "bg-rose-100 text-rose-700", label: "Rough" },
};

export default function MoodTracker() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const queryClient = useQueryClient();

  const { data: entries = [], refetch } = useQuery({
    queryKey: ["moodEntries"],
    queryFn: () => base44.entities.MoodEntry.list("-entry_date", 500),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.MoodEntry.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["moodEntries"] }),
  });

  const today = format(new Date(), "yyyy-MM-dd");
  const todayMood = entries.find((e) => e.entry_date === today);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = monthStart.getDay();

  const getEntryForDate = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return entries.find((e) => e.entry_date === dateStr);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2D2D] tracking-tight">Mood Tracker</h1>
        <p className="text-sm text-[#8A8A8A] mt-1">Track your emotional journey</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-stone-200/60 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-2 rounded-xl hover:bg-stone-100 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h3 className="text-sm font-semibold text-[#2D2D2D]">{format(currentMonth, "MMMM yyyy")}</h3>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-2 rounded-xl hover:bg-stone-100 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="text-center text-[10px] text-[#8A8A8A] font-medium py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array(startPadding).fill(null).map((_, i) => (
                <div key={`pad-${i}`} />
              ))}
              {days.map((day) => {
                const entry = getEntryForDate(day);
                const isCurrentDay = isToday(day);
                return (
                  <div
                    key={day.toString()}
                    className={`aspect-square rounded-xl flex items-center justify-center relative text-xs transition-all ${
                      isCurrentDay ? "ring-2 ring-[#7C9A92] ring-offset-1" : ""
                    } ${entry ? moodConfig[entry.mood]?.color || "bg-stone-100" : "hover:bg-stone-50"}`}
                  >
                    {entry ? (
                      <span className="text-lg">{moodConfig[entry.mood]?.emoji}</span>
                    ) : (
                      <span className="text-[#8A8A8A]">{format(day, "d")}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          <MoodChart entries={entries} />
        </div>

        <div className="space-y-6">
          <MoodCheckInCard todayMood={todayMood} onComplete={refetch} />

          {/* Recent Entries */}
          <div className="bg-white rounded-3xl border border-stone-200/60 p-6 shadow-sm">
            <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-4">Recent Entries</p>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {entries.slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl bg-stone-50/80 group">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{moodConfig[entry.mood]?.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-[#2D2D2D]">{moodConfig[entry.mood]?.label}</p>
                      <p className="text-[10px] text-[#8A8A8A]">{format(parseISO(entry.entry_date), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(entry.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}