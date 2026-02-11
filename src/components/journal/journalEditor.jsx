import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Save } from "lucide-react";
import { toast } from "sonner";

const moodOptions = [
  { value: "amazing", emoji: "🌟", label: "Amazing" },
  { value: "good", emoji: "😊", label: "Good" },
  { value: "okay", emoji: "😐", label: "Okay" },
  { value: "low", emoji: "😔", label: "Low" },
  { value: "rough", emoji: "😢", label: "Rough" },
];

const tagOptions = ["Reflection", "Gratitude", "Goals", "Anxiety", "Growth", "Memories", "Dreams", "Self-care"];

export default function JournalEditor({ entry, onClose, onSaved }) {
  const [title, setTitle] = useState(entry?.title || "");
  const [content, setContent] = useState(entry?.content || "");
  const [mood, setMood] = useState(entry?.mood || "");
  const [tags, setTags] = useState(entry?.tags || []);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in title and content");
      return;
    }
    setSaving(true);
    const data = {
      title,
      content,
      mood: mood || undefined,
      tags: tags.length > 0 ? tags : undefined,
    };
    if (entry) {
      await base44.entities.JournalEntry.update(entry.id, data);
    } else {
      await base44.entities.JournalEntry.create(data);
    }
    setSaving(false);
    toast.success(entry ? "Entry updated!" : "Entry saved!");
    onSaved();
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/60 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-[#2D2D2D]">
          {entry ? "Edit Entry" : "New Entry"}
        </h3>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-stone-100 transition-colors">
          <X className="w-4 h-4 text-[#8A8A8A]" />
        </button>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Give your entry a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-stone-200 rounded-xl focus-visible:ring-[#7C9A92] text-[#2D2D2D]"
        />

        <textarea
          placeholder="Write your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[200px] p-4 rounded-xl border border-stone-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#7C9A92]/30 focus:border-[#7C9A92] text-[#2D2D2D] leading-relaxed bg-stone-50/50"
        />

        <div>
          <p className="text-xs text-[#8A8A8A] mb-2">How are you feeling?</p>
          <div className="flex gap-2 flex-wrap">
            {moodOptions.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(mood === m.value ? "" : m.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  mood === m.value
                    ? "bg-[#7C9A92] text-white"
                    : "bg-stone-100 text-[#8A8A8A] hover:bg-stone-200"
                }`}
              >
                <span>{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-[#8A8A8A] mb-2">Tags</p>
          <div className="flex gap-2 flex-wrap">
            {tagOptions.map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  setTags((prev) =>
                    prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                  )
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  tags.includes(tag)
                    ? "bg-[#B8A9C9] text-white"
                    : "bg-stone-100 text-[#8A8A8A] hover:bg-stone-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#7C9A92] hover:bg-[#6B8A82] rounded-xl"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Entry"}
          </Button>
        </div>
      </div>
    </div>
  );
}