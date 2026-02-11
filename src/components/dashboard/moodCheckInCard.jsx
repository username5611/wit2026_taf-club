import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const moods = [
  { value: "amazing", score: 5, emoji: "🌟", label: "Amazing", color: "from-amber-300 to-yellow-400" },
  { value: "good", score: 4, emoji: "😊", label: "Good", color: "from-green-300 to-emerald-400" },
  { value: "okay", score: 3, emoji: "😐", label: "Okay", color: "from-blue-300 to-cyan-400" },
  { value: "low", score: 2, emoji: "😔", label: "Low", color: "from-purple-300 to-violet-400" },
  { value: "rough", score: 1, emoji: "😢", label: "Rough", color: "from-rose-300 to-pink-400" },
];

const tags = ["Sleep", "Exercise", "Social", "Work", "Nature", "Creative", "Meditation", "Nutrition"];

export default function MoodCheckInCard({ onComplete, todayMood }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [note, setNote] = useState("");
  const [step, setStep] = useState(todayMood ? "done" : "mood");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedMood) return;
    setSaving(true);
    await base44.entities.MoodEntry.create({
      mood: selectedMood.value,
      mood_score: selectedMood.score,
      note: note || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      entry_date: format(new Date(), "yyyy-MM-dd"),
    });
    setSaving(false);
    setStep("done");
    toast.success("Mood logged!");
    onComplete?.();
  };

  if (step === "done") {
    const displayMood = todayMood || selectedMood;
    return (
      <div className="bg-white rounded-3xl border border-stone-200/60 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-1">Today's Check-in</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{displayMood?.emoji || moods.find(m => m.value === displayMood?.mood)?.emoji}</span>
              <div>
                <p className="font-semibold text-[#2D2D2D]">{displayMood?.label || displayMood?.mood}</p>
                <p className="text-xs text-[#8A8A8A]">{format(new Date(), "EEEE, MMM d")}</p>
              </div>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200/60 p-6 shadow-sm">
      <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-4">How are you feeling?</p>

      <AnimatePresence mode="wait">
        {step === "mood" && (
          <motion.div
            key="mood"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex justify-between gap-2 mb-4">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood)}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl transition-all duration-200 ${
                    selectedMood?.value === mood.value
                      ? "bg-gradient-to-b " + mood.color + " scale-105 shadow-lg"
                      : "hover:bg-stone-50 hover:scale-105"
                  }`}
                >
                  <span className="text-2xl sm:text-3xl">{mood.emoji}</span>
                  <span className={`text-[10px] sm:text-xs font-medium ${
                    selectedMood?.value === mood.value ? "text-white" : "text-[#8A8A8A]"
                  }`}>{mood.label}</span>
                </button>
              ))}
            </div>
            {selectedMood && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setStep("tags")}
                className="w-full py-3 rounded-xl bg-[#7C9A92] text-white text-sm font-medium hover:bg-[#6B8A82] transition-colors"
              >
                Continue
              </motion.button>
            )}
          </motion.div>
        )}

        {step === "tags" && (
          <motion.div
            key="tags"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p className="text-sm text-[#2D2D2D] mb-3">What influenced your mood?</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    setSelectedTags((prev) =>
                      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                    )
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? "bg-[#7C9A92] text-white"
                      : "bg-stone-100 text-[#8A8A8A] hover:bg-stone-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Add a note (optional)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-200 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-[#7C9A92]/30 focus:border-[#7C9A92] bg-stone-50"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setStep("mood")}
                className="px-4 py-3 rounded-xl border border-stone-200 text-sm text-[#8A8A8A] hover:bg-stone-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-[#7C9A92] text-white text-sm font-medium hover:bg-[#6B8A82] transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Log Mood"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}