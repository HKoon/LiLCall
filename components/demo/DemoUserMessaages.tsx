import { useVoice } from "@humeai/voice-react";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils";

export default function DemoUserMessaages() {
  const { lastUserMessage } = useVoice();

  return (
    <AnimatePresence>
      {lastUserMessage && (
        <motion.div
          className="mt-auto mb-10 mx-auto container px-4 md:px-8 xl:px-10 flex overflow-hidden items-center gap-2"
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div
            className={cn(
              "bg-rpg-background/90 text-rpg-foreground",
              "rounded-lg shadow-sm hover:shadow-md transition-shadow",
              "backdrop-blur-sm border border-gray-200/20",
              "w-full overflow-hidden"
            )}
          >
            <div
              className={cn(
                "flex items-center gap-2 border-b border-gray-100/20",
                "pt-3 pb-2 px-4"
              )}
            >
              <div className="w-2 h-2 bg-white shrink-0 rounded-full"></div>
              <div className="text-xs font-medium">You</div>
            </div>
            <div className="py-3 px-4 leading-relaxed">
              <span>{lastUserMessage.message.content}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
