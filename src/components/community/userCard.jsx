import React from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";

export default function UserCard({ profile, matchPercentage }) {
  const sharedInterests = matchPercentage ? Math.round(matchPercentage) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-stone-200/60 p-5 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7C9A92] to-[#A8C5BC] flex items-center justify-center text-white font-semibold">
            {profile.display_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-semibold text-[#2D2D2D] text-sm">{profile.display_name}</h4>
            {sharedInterests > 0 && (
              <span className="text-[10px] text-[#7C9A92] font-medium">
                {sharedInterests}% match
              </span>
            )}
          </div>
        </div>
      </div>

      {profile.bio && (
        <p className="text-xs text-[#8A8A8A] leading-relaxed line-clamp-2 mb-3">
          {profile.bio}
        </p>
      )}

      {profile.interests?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {profile.interests.slice(0, 4).map((interest) => (
            <span
              key={interest}
              className="px-2 py-0.5 rounded-full bg-[#7C9A92]/10 text-[#7C9A92] text-[10px] font-medium"
            >
              {interest}
            </span>
          ))}
          {profile.interests.length > 4 && (
            <span className="px-2 py-0.5 text-[10px] text-[#8A8A8A]">
              +{profile.interests.length - 4} more
            </span>
          )}
        </div>
      )}

      {profile.support_preferences?.length > 0 && (
        <div className="pt-3 border-t border-stone-100">
          <p className="text-[10px] text-[#8A8A8A] mb-1">Looking for:</p>
          <p className="text-xs text-[#2D2D2D] line-clamp-1">
            {profile.support_preferences.join(", ")}
          </p>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-[#7C9A92] text-white text-xs font-medium hover:bg-[#6B8A82] transition-colors">
          <MessageCircle className="w-3.5 h-3.5" />
          Connect
        </button>
        <button className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors">
          <Heart className="w-4 h-4 text-stone-400" />
        </button>
      </div>
    </motion.div>
  );
}