"use client";
import { cn } from "@/utils";
import { useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { useAssistantMessageTracker } from "@/hooks/request/useAssistantMessageTracker";
import { DebugPanel } from "./DebugPanel";

const DemoCharMessages = function Messages() {
  const { messages } = useVoice();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const filteredMessages = messages.filter(
    (msg) => msg.type === "assistant_message"
  );

  const { isLoading, isError, data } = useAssistantMessageTracker();
  const [parsedGameData, setParsedGameData] = useState<any>(null);

  // 当 data 变化时解析 gameData
  useEffect(() => {
    if (data && data.choices && data.choices.length > 0) {
      try {
        const content = data.choices[0].message.content;
        const gameData = JSON.parse(content);
        setParsedGameData(gameData);
        console.log("解析后的游戏数据:", gameData);
      } catch (error) {
        console.error("解析游戏数据失败:", error);
      }
    }
  }, [data]);

  // 当消息更新时自动滚动到底部
  useEffect(() => {
    if (scrollAreaRef.current && filteredMessages.length > 0) {
      // 使用 setTimeout 确保在 DOM 更新后滚动
      setTimeout(() => {
        if (scrollAreaRef.current) {
          const viewport = scrollAreaRef.current.querySelector(
            "[data-radix-scroll-area-viewport]"
          ) as HTMLElement;
          if (viewport) {
            // 使用平滑滚动效果
            viewport.scrollTo({
              top: viewport.scrollHeight,
              behavior: "smooth",
            });
          }
        }
      }, 100);
    }
  }, [filteredMessages.length]);

  return (
    <ScrollArea className="grow p-4 h-full" ref={scrollAreaRef}>
      <motion.div
        className={"max-w-2xl mx-auto w-full flex flex-col gap-5 pb-28"}
      >
        <AnimatePresence mode={"popLayout"}>
          {filteredMessages.map((msg, index) => (
            <motion.div
              key={msg.type + index}
              className={cn(
                "w-full",
                "bg-white/80 dark:bg-gray-800/90",
                "border border-gray-200/50 dark:border-gray-700/50",
                "rounded-lg shadow-sm hover:shadow-md transition-shadow",
                "backdrop-blur-sm"
              )}
              initial={{
                opacity: 0,
                y: 15,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              <div
                className={cn(
                  "flex items-center gap-2 border-b border-gray-100/50 dark:border-gray-700/50",
                  "pt-3 pb-2 px-4"
                )}
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {msg.message.role.toLowerCase() === "assistant"
                    ? "Nicky"
                    : msg.message.role.toLowerCase() === "user"
                    ? "You"
                    : msg.message.role}
                </div>
              </div>
              <div
                className={
                  "py-3 px-4 text-gray-700 dark:text-gray-200 leading-relaxed"
                }
              >
                {msg.message.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <DebugPanel
          isLoading={isLoading}
          isError={isError}
          data={parsedGameData}
          position="top-left"
          created={data?.created || 0}
        />
      </motion.div>
    </ScrollArea>
  );
};

export default DemoCharMessages;
