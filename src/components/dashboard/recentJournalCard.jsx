import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { format } from "date-fns";
import { ArrowRight, BookOpen } from "lucide-react";

const moodEmojis = {
  amazing: "🌟",
  good: "😊",
  okay: "😐",
  low: "😔",
  rough: "😢",
};

export default function RecentJournalCard({ entries }) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200/60 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-[#8A8A8A] uppercase tracking-widest">Recent Journal</p>
        <Link
          to={createPageUrl("Journal")}
          className="text-xs text-[#7C9A92] font-medium flex items-center gap-1 hover:underline"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <BookOpen className="w-8 h-8 text-stone-300 mb-2" />
          <p className="text-sm text-[#8A8A8A]">Start journaling to see entries here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.slice(0, 3).map((entry) => (
            <div
              key={entry.id}
              className="p-3 rounded-xl bg-stone-50/80 hover:bg-stone-100/80 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {entry.mood && <span className="text-sm">{moodEmojis[entry.mood]}</span>}
                    <h4 className="text-sm font-medium text-[#2D2D2D] truncate">{entry.title}</h4>
                  </div>
                  <p className="text-xs text-[#8A8A8A] line-clamp-2">{entry.content}</p>
                </div>
                <span className="text-[10px] text-[#8A8A8A] ml-3 whitespace-nowrap">
                  {format(new Date(entry.created_date), "MMM d")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}