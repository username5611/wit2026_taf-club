import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Heart, Trash2, Pencil, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import JournalEditor from "../components/journal/journalEditor";
import AIInsights from "../components/journal/aiInsights";

const moodEmojis = {
  amazing: "🌟", good: "😊", okay: "😐", low: "😔", rough: "😢",
};

export default function Journal() {
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntryForInsights, setSelectedEntryForInsights] = useState(null);
  const queryClient = useQueryClient();

  const { data: entries = [] } = useQuery({
    queryKey: ["journalEntries"],
    queryFn: () => base44.entities.JournalEntry.list("-created_date", 200),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.JournalEntry.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["journalEntries"] }),
  });

  const favoriteMutation = useMutation({
    mutationFn: ({ id, is_favorite }) => base44.entities.JournalEntry.update(id, { is_favorite }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["journalEntries"] }),
  });

  const filteredEntries = entries.filter(
    (e) =>
      e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setShowEditor(true);
  };

  const handleClose = () => {
    setShowEditor(false);
    setEditingEntry(null);
  };

  const handleSaved = () => {
    queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
    handleClose();
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2D2D] tracking-tight">Journal</h1>
            <p className="text-sm text-[#8A8A8A] mt-1">Your safe space to reflect</p>
          </div>
          <button
            onClick={() => { setEditingEntry(null); setShowEditor(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C9A92] text-white text-sm font-medium hover:bg-[#6B8A82] transition-colors shadow-md shadow-[#7C9A92]/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Entry</span>
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <JournalEditor
              entry={editingEntry}
              onClose={handleClose}
              onSaved={handleSaved}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
        <Input
          placeholder="Search your journal..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-stone-200 rounded-xl focus-visible:ring-[#7C9A92] bg-white"
        />
      </div>

      {/* AI Insights Panel */}
      <AnimatePresence>
        {selectedEntryForInsights && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AIInsights entry={selectedEntryForInsights} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredEntries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-2xl border border-stone-200/60 p-5 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {entry.mood && <span className="text-lg">{moodEmojis[entry.mood]}</span>}
                  <h3 className="font-semibold text-[#2D2D2D] text-sm">{entry.title}</h3>
                </div>
                <span className="text-[10px] text-[#8A8A8A]">
                  {format(new Date(entry.created_date), "MMM d")}
                </span>
              </div>

              <p className="text-xs text-[#8A8A8A] leading-relaxed line-clamp-4 mb-3">
                {entry.content}
              </p>

              {entry.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-[#B8A9C9]/10 text-[#B8A9C9] text-[10px] font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setSelectedEntryForInsights(entry)}
                  className="p-1.5 rounded-lg hover:bg-purple-50 transition-colors"
                  title="Get AI insights"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                </button>
                <button
                  onClick={() => favoriteMutation.mutate({ id: entry.id, is_favorite: !entry.is_favorite })}
                  className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <Heart className={`w-3.5 h-3.5 ${entry.is_favorite ? "fill-rose-400 text-rose-400" : "text-stone-400"}`} />
                </button>
                <button
                  onClick={() => handleEdit(entry)}
                  className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5 text-stone-400" />
                </button>
                <button
                  onClick={() => deleteMutation.mutate(entry.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-stone-400 hover:text-red-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredEntries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-5xl mb-4">📝</span>
          <h3 className="text-lg font-semibold text-[#2D2D2D] mb-1">No entries yet</h3>
          <p className="text-sm text-[#8A8A8A]">Start writing to explore your thoughts</p>
        </div>
      )}
    </div>
  );
}