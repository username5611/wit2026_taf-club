import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, X } from "lucide-react";
import { toast } from "sonner";

const moodOptions = [
  { value: "celebrating", emoji: "🎉", label: "Celebrating" },
  { value: "struggling", emoji: "💙", label: "Struggling" },
  { value: "reflecting", emoji: "💭", label: "Reflecting" },
  { value: "grateful", emoji: "🙏", label: "Grateful" },
  { value: "seeking_support", emoji: "🤝", label: "Seeking Support" },
];

const tagOptions = ["Anxiety", "Depression", "Progress", "Advice Needed", "Victory", "Gratitude", "Question"];

export default function CreatePost({ displayName, onPosted }) {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [tags, setTags] = useState([]);
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) {
      toast.error("Please write something");
      return;
    }
    setPosting(true);

      content,
      mood: mood || undefined,
      tags: tags.length > 0 ? tags : undefined,
      author_display_name: displayName,
      likes_count: 0,
      comments_count: 0,
    });
    setPosting(false);
    setContent("");
    setMood("");
    setTags([]);
    toast.success("Posted!");
    onPosted();
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/60 p-5 shadow-sm">
      <Textarea
        placeholder="Share your thoughts, progress, or ask for support..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border-stone-200 rounded-xl focus-visible:ring-[#7C9A92] min-h-[100px] resize-none mb-3"
      />

      <div className="flex flex-wrap gap-2 mb-3">
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

      <div className="flex flex-wrap gap-2 mb-4">
        {tagOptions.map((tag) => (
          <button
            key={tag}
            onClick={() =>
              setTags((prev) =>
                prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
              )
            }
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              tags.includes(tag)
                ? "bg-[#B8A9C9] text-white"
                : "bg-stone-100 text-[#8A8A8A] hover:bg-stone-200"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <Button
        onClick={handlePost}
        disabled={posting}
        className="w-full bg-[#7C9A92] hover:bg-[#6B8A82] rounded-xl"
      >
        <Send className="w-4 h-4 mr-2" />
        {posting ? "Posting..." : "Share with Community"}
      </Button>
    </div>
  );
}