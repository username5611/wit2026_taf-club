import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "framer-motion";

import MoodCheckInCard from "../components/dashboard/moodCheckInCard";
import MoodChart from "../components/dashboard/moodChart";
import RecentJournalCard from "../components/dashboard/recentJournalCard";
import StreakCard from "../components/dashboard/streakCard";

export default function Dashboard() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    base44.auth.me().then((u) => setUserName(u?.full_name?.split(" ")[0] || "")).catch(() => {});
  }, []);

  const { data: moodEntries = [], refetch: refetchMoods } = useQuery({
    queryKey: ["moodEntries"],
    queryFn: () => base44.entities.MoodEntry.list("-entry_date", 100),
  });

  const { data: journalEntries = [] } = useQuery({
    queryKey: ["journalEntries"],
    queryFn: () => base44.entities.JournalEntry.list("-created_date", 5),
  });

  const today = format(new Date(), "yyyy-MM-dd");
  const todayMood = moodEntries.find((e) => e.entry_date === today);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2D2D] tracking-tight">
          {getGreeting()}{userName ? `, ${userName}` : ""} ✨
        </h1>
        <p className="text-sm text-[#8A8A8A] mt-1">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <MoodCheckInCard todayMood={todayMood} onComplete={refetchMoods} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <MoodChart entries={moodEntries} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <RecentJournalCard entries={journalEntries} />
          </motion.div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <StreakCard moodEntries={moodEntries} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}