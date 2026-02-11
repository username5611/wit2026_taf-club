import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { toast } from "sonner";

const interestOptions = [
  "Anxiety", "Depression", "Stress Management", "Self-Care", "Meditation",
  "Exercise", "Sleep", "Relationships", "Work-Life Balance", "Grief",
  "Trauma", "Personal Growth", "Mindfulness", "Creativity", "Spirituality"
];

const supportOptions = [
  "Share experiences", "Get advice", "Be an accountability partner",
  "Just listen", "Find encouragement", "Learn coping strategies"
];

export default function ProfileSetup({ profile, onSaved }) {
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [interests, setInterests] = useState(profile?.interests || []);
  const [supportPreferences, setSupportPreferences] = useState(profile?.support_preferences || []);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!displayName.trim()) {
      toast.error("Please enter a display name");
      return;
    }
    setSaving(true);
    const data = {
      display_name: displayName,
      bio: bio || undefined,
      interests: interests.length > 0 ? interests : undefined,
      support_preferences: supportPreferences.length > 0 ? supportPreferences : undefined,
      is_visible: true,
    };
    
    if (profile) {
      await base44.entities.UserProfile.update(profile.id, data);
    } else {
      await base44.entities.UserProfile.create(data);
    }
    setSaving(false);
    toast.success("Profile saved!");
    onSaved();
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/60 p-6 shadow-sm max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-[#2D2D2D] mb-4">
        {profile ? "Edit Your Profile" : "Create Your Community Profile"}
      </h3>

      <div className="space-y-5">
        <div>
          <label className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-2 block">
            Display Name
          </label>
          <Input
            placeholder="How should others see you?"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="border-stone-200 rounded-xl focus-visible:ring-[#7C9A92]"
          />
        </div>

        <div>
          <label className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-2 block">
            About You
          </label>
          <Textarea
            placeholder="Share a bit about yourself and your journey..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="border-stone-200 rounded-xl focus-visible:ring-[#7C9A92] min-h-[100px] resize-none"
          />
        </div>

        <div>
          <label className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-2 block">
            Your Interests & Challenges
          </label>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                onClick={() =>
                  setInterests((prev) =>
                    prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
                  )
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  interests.includes(interest)
                    ? "bg-[#7C9A92] text-white"
                    : "bg-stone-100 text-[#8A8A8A] hover:bg-stone-200"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-2 block">
            What You're Looking For
          </label>
          <div className="flex flex-wrap gap-2">
            {supportOptions.map((option) => (
              <button
                key={option}
                onClick={() =>
                  setSupportPreferences((prev) =>
                    prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
                  )
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  supportPreferences.includes(option)
                    ? "bg-[#B8A9C9] text-white"
                    : "bg-stone-100 text-[#8A8A8A] hover:bg-stone-200"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#7C9A92] hover:bg-[#6B8A82] rounded-xl"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}