"use client";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VoiceProvider } from "@humeai/voice-react";
import Input from "./Input";
import DemoCharMessages from "./DemoCharMessages";
import Controls from "../Controls";
import DemoUserMessaages from "./DemoUserMessaages";

export default function Demo({ accessToken }: { accessToken: string }) {
  const configId = process.env["NEXT_PUBLIC_HUME_CONFIG_ID"];
  const [showForeground, setShowForeground] = useState(false);

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
                />
              </AnimatePresence>
            </div>
          </div>
        )}

        <div className="absolute inset-0 flex flex-col justify-end overflow-y-hidden w-full">
          <DemoUserMessaages />
          <div className="bg-white/60 backdrop-blur-md h-1/2">
            <DemoCharMessages />
            <Input />
          </div>
        </div>
      </div>
    </VoiceProvider>
  );
}
