import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertCircle, Heart, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export default function AIInsights({ entry }) {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const analyzeEntry = async () => {
    setLoading(true);
    setExpanded(true);

    try {
      // Create conversation
      const conversation = await base44.agents.createConversation({
        agent_name: "journal_analyzer",
        metadata: {
          name: `Analysis: ${entry.title}`,
          entry_id: entry.id,
        },
      });

      setConversationId(conversation.id);

      // Subscribe to updates
      const unsubscribe = base44.agents.subscribeToConversation(conversation.id, (data) => {
        setMessages(data.messages || []);
      });

      // Send analysis request
      await base44.agents.addMessage(conversation, {
        role: "user",
        content: `Please analyze this journal entry and provide supportive insights, coping suggestions, and let me know if professional help might be beneficial:

Title: ${entry.title}
Content: ${entry.content}
Mood: ${entry.mood || "Not specified"}
Date: ${new Date(entry.created_date).toLocaleDateString()}

Please provide:
1. Empathetic validation of my feelings
2. Key observations or patterns you notice
3. Practical coping strategies or self-care suggestions
4. Whether you recommend professional support and why
5. Any relevant resources or crisis contacts if needed`,
      });

      setLoading(false);

      // Cleanup function will be called when component unmounts
      return () => unsubscribe();
    } catch (error) {
      console.error("Analysis error:", error);
      setLoading(false);
      setMessages([
        {
          role: "assistant",
          content: "I'm having trouble connecting right now. Please try again in a moment. If you're in crisis, please reach out to 988 Suicide & Crisis Lifeline immediately.",
        },
      ]);
    }
  };

  const assistantMessages = messages.filter((m) => m.role === "assistant");
  const latestResponse = assistantMessages[assistantMessages.length - 1];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100 overflow-hidden">
      <button
        onClick={() => (expanded ? setExpanded(false) : !conversationId && analyzeEntry())}
        className="w-full p-4 flex items-center justify-between hover:bg-white/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-semibold text-[#2D2D2D]">AI Insights & Support</h4>
            <p className="text-xs text-[#8A8A8A]">
              {conversationId ? "View analysis" : "Get personalized insights and suggestions"}
            </p>
          </div>
        </div>
        {conversationId && (
          expanded ? <ChevronUp className="w-4 h-4 text-[#8A8A8A]" /> : <ChevronDown className="w-4 h-4 text-[#8A8A8A]" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-purple-100"
          >
            <div className="p-4 space-y-4">
              {loading && !latestResponse && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                  <span className="ml-3 text-sm text-[#8A8A8A]">Analyzing your entry...</span>
                </div>
              )}

              {latestResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Heart className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-2">
                        Your Personal Insights
                      </h5>
                      <div className="prose prose-sm prose-purple max-w-none">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => <h1 className="text-base font-semibold text-[#2D2D2D] mt-4 mb-2">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-sm font-semibold text-[#2D2D2D] mt-3 mb-2">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-sm font-semibold text-[#2D2D2D] mt-2 mb-1">{children}</h3>,
                            p: ({ children }) => <p className="text-sm text-[#2D2D2D] leading-relaxed my-2">{children}</p>,
                            ul: ({ children }) => <ul className="text-sm text-[#2D2D2D] my-2 ml-4 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="text-sm text-[#2D2D2D] my-2 ml-4 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold text-purple-700">{children}</strong>,
                            em: ({ children }) => <em className="italic text-purple-600">{children}</em>,
                          }}
                        >
                          {latestResponse.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>

                  {/* Crisis detection */}
                  {latestResponse.content.toLowerCase().includes("988") ||
                   latestResponse.content.toLowerCase().includes("crisis") && (
                    <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-red-800 mb-2">
                            Immediate Support Available
                          </p>
                          <div className="text-xs text-red-700 space-y-1">
                            <p><strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988</p>
                            <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                            <p><strong>NAMI Helpline:</strong> 1-800-950-NAMI (6264)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {conversationId && !loading && (
                <Button
                  onClick={analyzeEntry}
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl text-xs"
                >
                  <Sparkles className="w-3 h-3 mr-2" />
                  Get Fresh Insights
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}