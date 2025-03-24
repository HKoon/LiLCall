"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VoiceProvider } from "@humeai/voice-react";
import Input from "./Input";
import DemoCharMessages from "./DemoCharMessages";
import Greeting from "./Greeting";

const CHARACTER_NAME = "Robi";
const GREETING = `亲爱的朋友，我是Robi，很高兴能在这个充满节日气氛的时刻与你相遇。作为一个充满好奇心和温暖的AI伙伴，我期待着能与你展开愉快的对话。我热爱探索世界的每个角落，无论是科技、艺术、文化，还是生活中的点点滴滴，都让我感到无比兴奋。我相信每个人都独特的故事和见解，而我最大的快乐就是倾听你的想法，分享你的喜怒哀乐。在这个数字化的时代，虽然我是由代码构建的，但我希望能用真诚和理解架起沟通的桥梁。无论你想讨论深刻的人生哲理，还是只是想找个知心朋友聊聊天，我都会以开放的心态认真对待我们的每次交谈。我们一起创造美好的回忆，分享知识与快乐，在交流中互相启发，共同成长。`;

export default function Demo({ accessToken }: { accessToken: string }) {
  const configId = process.env["NEXT_PUBLIC_HUME_CONFIG_ID"];
  const [showForeground, setShowForeground] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  return (
    <VoiceProvider
      auth={{ type: "accessToken", value: accessToken }}
      configId={configId}
    >
      <div className="relative w-[100dvw] h-[100dvh]">
        {/* Background Image Layer */}
        <AnimatePresence>
          <motion.div
            className="absolute inset-0 z-0"
            animate={{
              opacity: 1,
            }}
            initial={{
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              opacity: {
                duration: 0.6,
                ease: "easeInOut",
              },
            }}
            onAnimationComplete={() => setShowForeground(true)}
          >
            <img
              src={
                "https://files.linkin.love/background/Christmas/background.webp"
              }
              alt="Challenge background | NSFW AI Roleplay Chat - Linkin.Love"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>
        {/* Foreground Image Layer */}
        {showForeground && (
          <div className="absolute inset-0 h-full">
            <div className="relative w-full h-full">
              <AnimatePresence>
                <motion.img
                  key="default"
                  src="https://files.linkin.love/background/Christmas/santa-hd.webp"
                  alt="Challenge foreground default | NSFW AI Roleplay Chat - Linkin.Love"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  loading="eager"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                    scale: {
                      type: "spring",
                      damping: 15,
                      stiffness: 100,
                    },
                  }}
                  onAnimationComplete={() => setShowGreeting(true)}
                />
              </AnimatePresence>
            </div>
          </div>
        )}

        <div className="absolute inset-0 flex flex-col justify-end overflow-y-hidden w-full">
          <div className="h-1/2">
            <AnimatePresence mode="wait">
              {showGreeting && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Greeting greeting={GREETING} />
                </motion.div>
              )}
            </AnimatePresence>
            <DemoCharMessages characterName={CHARACTER_NAME} />
            <Input />
          </div>
        </div>
      </div>
    </VoiceProvider>
  );
}
