import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProfileSetup from "../components/community/profileSetup";
import CreatePost from "../components/community/createPost";
import PostCard from "../components/community/postCard";

export default function Community() {
  const [showSetup, setShowSetup] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then((u) => setCurrentUser(u)).catch(() => {});
  }, []);

  const { data: allProfiles = [], refetch: refetchProfiles } = useQuery({
    queryKey: ["userProfiles"],
    queryFn: () => base44.entities.UserProfile.list("-created_date", 100),
  });

  const { data: posts = [], refetch: refetchPosts } = useQuery({
    queryKey: ["communityPosts"],
    queryFn: () => base44.entities.CommunityPost.list("-created_date", 100),
  });

  const myProfile = allProfiles.find((p) => p.created_by === currentUser?.email);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2D2D] tracking-tight">Community</h1>
            <p className="text-sm text-[#8A8A8A] mt-1">Share your journey and support others</p>
          </div>
          {myProfile && (
            <button
              onClick={() => setShowSetup(!showSetup)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Edit Profile</span>
            </button>
          )}
        </div>
      </motion.div>

      {showSetup && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <ProfileSetup
            profile={myProfile}
            onSaved={() => {
              refetchProfiles();
              setShowSetup(false);
            }}
          />
        </motion.div>
      )}

      {!myProfile && !showSetup ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl border border-purple-100 p-8 text-center"
        >
          <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#2D2D2D] mb-2">Join the Community</h3>
          <p className="text-sm text-[#8A8A8A] mb-4 max-w-md mx-auto">
            Create your profile to share your thoughts and connect with others on similar journeys.
          </p>
          <Button
            onClick={() => setShowSetup(true)}
            className="bg-[#7C9A92] hover:bg-[#6B8A82] rounded-xl"
          >
            Create Profile
          </Button>
        </motion.div>
      ) : (
        !showSetup && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              <CreatePost displayName={myProfile?.display_name} onPosted={refetchPosts} />

              {posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUserEmail={currentUser?.email}
                      displayName={myProfile?.display_name}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-stone-200/60 p-12 text-center">
                  <Users className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                  <p className="text-sm text-[#8A8A8A]">No posts yet. Be the first to share!</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-stone-200/60 p-5 shadow-sm">
                <h3 className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-3">Community Guidelines</h3>
                <ul className="text-xs text-[#2D2D2D] space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Be kind and supportive</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Respect others' experiences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>Share thoughtfully</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">✗</span>
                    <span>No judgment or negativity</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border border-red-100 p-5">
                <h3 className="text-xs text-red-600 uppercase tracking-widest mb-2 font-semibold">Crisis Support</h3>
                <p className="text-xs text-[#2D2D2D] mb-2">If you're in crisis, reach out immediately:</p>
                <div className="text-xs text-[#2D2D2D] space-y-1">
                  <p><strong>988 Lifeline:</strong> Call/text 988</p>
                  <p><strong>Crisis Text:</strong> HOME to 741741</p>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}