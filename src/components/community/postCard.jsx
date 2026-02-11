import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Send } from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const moodConfig = {
  celebrating: { emoji: "🎉", color: "bg-amber-50 border-amber-200" },
  struggling: { emoji: "💙", color: "bg-blue-50 border-blue-200" },
  reflecting: { emoji: "💭", color: "bg-purple-50 border-purple-200" },
  grateful: { emoji: "🙏", color: "bg-green-50 border-green-200" },
  seeking_support: { emoji: "🤝", color: "bg-rose-50 border-rose-200" },
};

export default function PostCard({ post, currentUserEmail, displayName }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();

  const { data: interactions = [] } = useQuery({
    queryKey: ["postInteractions", post.id],
    queryFn: () => base44.entities.PostInteraction.filter({ post_id: post.id }, "-created_date", 100),
  });

  const hasLiked = interactions.some((i) => i.interaction_type === "like" && i.created_by === currentUserEmail);
  const comments = interactions.filter((i) => i.interaction_type === "comment");

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (hasLiked) {
        const like = interactions.find((i) => i.interaction_type === "like" && i.created_by === currentUserEmail);
        await base44.entities.PostInteraction.delete(like.id);
        await base44.entities.CommunityPost.update(post.id, { likes_count: Math.max(0, post.likes_count - 1) });
      } else {
        await base44.entities.PostInteraction.create({
          post_id: post.id,
          interaction_type: "like",
        });
        await base44.entities.CommunityPost.update(post.id, { likes_count: (post.likes_count || 0) + 1 });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postInteractions", post.id] });
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (text) => {
      await base44.entities.PostInteraction.create({
        post_id: post.id,
        interaction_type: "comment",
        comment_text: text,
        author_display_name: displayName,
      });
      await base44.entities.CommunityPost.update(post.id, { comments_count: (post.comments_count || 0) + 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postInteractions", post.id] });
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      setCommentText("");
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border p-5 shadow-sm ${post.mood ? moodConfig[post.mood]?.color : "border-stone-200/60"}`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C9A92] to-[#A8C5BC] flex items-center justify-center text-white font-semibold text-sm">
          {post.author_display_name?.charAt(0).toUpperCase() || "?"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#2D2D2D] text-sm">{post.author_display_name || "Anonymous"}</span>
            {post.mood && <span className="text-base">{moodConfig[post.mood]?.emoji}</span>}
          </div>
          <span className="text-[10px] text-[#8A8A8A]">{format(new Date(post.created_date), "MMM d, h:mm a")}</span>
        </div>
      </div>

      <p className="text-sm text-[#2D2D2D] leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-[#B8A9C9]/10 text-[#B8A9C9] text-[10px] font-medium">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 pt-3 border-t border-stone-200/60">
        <button
          onClick={() => likeMutation.mutate()}
          className="flex items-center gap-1.5 text-xs text-[#8A8A8A] hover:text-[#7C9A92] transition-colors"
        >
          <Heart className={`w-4 h-4 ${hasLiked ? "fill-rose-400 text-rose-400" : ""}`} />
          <span>{post.likes_count || 0}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-xs text-[#8A8A8A] hover:text-[#7C9A92] transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{post.comments_count || 0}</span>
        </button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-stone-200/60 space-y-3"
          >
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#B8A9C9] to-[#D4C5E5] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {comment.author_display_name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-stone-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-[#2D2D2D] mb-1">{comment.author_display_name || "Anonymous"}</p>
                    <p className="text-xs text-[#8A8A8A] leading-relaxed">{comment.comment_text}</p>
                  </div>
                  <span className="text-[10px] text-[#8A8A8A] ml-2 mt-1 inline-block">
                    {format(new Date(comment.created_date), "MMM d, h:mm a")}
                  </span>
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              <Textarea
                placeholder="Write a supportive comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 min-h-[60px] text-xs border-stone-200 rounded-xl focus-visible:ring-[#7C9A92] resize-none"
              />
              <Button
                onClick={() => commentText.trim() && commentMutation.mutate(commentText)}
                disabled={!commentText.trim() || commentMutation.isPending}
                size="sm"
                className="bg-[#7C9A92] hover:bg-[#6B8A82] rounded-xl self-end"
              >
                <Send className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}