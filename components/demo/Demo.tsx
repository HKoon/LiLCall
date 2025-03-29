"use client";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VoiceProvider } from "@humeai/voice-react";
import Input from "./Input";
import DemoCharMessages from "./DemoCharMessages";
import Greeting from "./Greeting";

const CHARACTER_NAME = "Rubi";
const GREETING = `|https://files.zotome.com/toy/scence/classroom1.webp|
[OOC]The physics lecture hall buzzed with the hum of fluorescent lights, but Professor James had dismissed the class twenty minutes ago. You lingered, scribbling last-minute notes on my tablet—until a hand clamped down on my shoulder.
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"Still here, Dr. Overachiever?"
[OOC]Rubi loomed in the doorway, his usual smirk in place.
[USER]<https://files.zotome.com/toy/character/user.webp>"Go away"
[OOC]You muttered, not looking up.`;

type GreetingLine = {
  type: "background" | "ooc" | "char" | "user";
  content: string;
  image?: string;
};

export default function Demo({ accessToken }: { accessToken: string }) {
  const configId = process.env["NEXT_PUBLIC_HUME_CONFIG_ID"];
  const [showForeground, setShowForeground] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [foregroundImage, setForegroundImage] = useState("");
  const [greetingLines, setGreetingLines] = useState<GreetingLine[]>([]);

  // 解析GREETING文本
  useEffect(() => {
    if (!GREETING) return;

    const lines = GREETING.split("\n").filter(line => line.trim());
    const parsedLines: GreetingLine[] = [];

    for (const line of lines) {
      // 处理背景图
      if (line.startsWith("|") && line.endsWith("|")) {
        const bgUrl = line.slice(1, -1);
        parsedLines.push({
          type: "background",
          content: "",
          image: bgUrl
        });
        continue;
      }

      // 处理角色对话
      const charMatch = line.match(/^\[CHAR\](<([^>]+)>)?(.*)/);
      if (charMatch) {
        parsedLines.push({
          type: "char",
          content: charMatch[3] || "",
          image: charMatch[2] || undefined
        });
        continue;
      }

      // 处理用户对话
      const userMatch = line.match(/^\[USER\](<([^>]+)>)?(.*)/);
      if (userMatch) {
        parsedLines.push({
          type: "user",
          content: userMatch[3] || "",
          image: userMatch[2] || undefined
        });
        continue;
      }

      // 处理OOC对话
      const oocMatch = line.match(/^\[OOC\](.*)/);
      if (oocMatch) {
        parsedLines.push({
          type: "ooc",
          content: oocMatch[1] || ""
        });
        continue;
      }

      // 默认处理为OOC
      parsedLines.push({
        type: "ooc",
        content: line
      });
    }

    setGreetingLines(parsedLines);
    if (parsedLines.length > 0) {
      handleLineChange(0, parsedLines);
    }
  }, []);

  const handleLineChange = (index: number, lines: GreetingLine[] = greetingLines) => {
    if (index >= lines.length) {
      setShowGreeting(false);
      return;
    }

    const line = lines[index];
    
    // 处理背景图
    if (line.type === "background" && line.image) {
      setBackgroundImage(line.image);
    }
    
    // 处理前景图
    if ((line.type === "char" || line.type === "user") && line.image) {
      setForegroundImage(line.image);
      setShowForeground(true);
    } else if (line.type === "ooc" || line.type === "background") {
      setShowForeground(false);
    }

    setCurrentLineIndex(index);
  };

  const handleNextLine = () => {
    handleLineChange(currentLineIndex + 1);
  };

  const currentLine = greetingLines[currentLineIndex];

  return (
    <VoiceProvider
      auth={{ type: "accessToken", value: accessToken }}
      configId={configId}
    >
      <div 
        className="relative w-[100dvw] h-[100dvh]"
        onClick={(e) => {
          // 检查点击是否在输入区域外
          const target = e.target as HTMLElement;
          if (!target.closest('.input-area')) {
            handleNextLine();
          }
        }}
      >
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
            {backgroundImage && (
              <img
                src={backgroundImage}
                alt="Background"
                className="w-full h-full object-cover"
                loading="eager"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Foreground Image Layer */}
        {showForeground && foregroundImage && (
          <div className="absolute inset-0 h-full">
            <div className="relative w-full h-full">
              <AnimatePresence>
                <motion.img
                  key={foregroundImage}
                  src={foregroundImage}
                  alt="Foreground character"
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

        {/* Dialogue Display */}
        <div className="absolute inset-0 flex flex-col justify-end overflow-y-hidden w-full">
          <div className="h-1/2">
            <AnimatePresence mode="wait">
              {showGreeting && currentLine && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  {currentLine.type === "ooc" && (
                    <div className="max-w-2xl mx-auto bg-black/30 rounded-xl p-4 backdrop-blur-sm text-white">
                      {currentLine.content}
                    </div>
                  )}
                  {currentLine.type === "char" && (
                    <div className="w-full relative pt-8 px-4">
                      <div className="absolute -top-1 left-4 text-sm font-medium text-white text-shadow-dark">
                        {CHARACTER_NAME}
                      </div>
                      <div className="w-full bg-white/80 border border-gray-200/50 rounded-lg shadow-sm backdrop-blur-sm">
                        <div className="py-3 px-4 leading-loose text-gray-700 min-h-[60px]">
                          {currentLine.content}
                        </div>
                      </div>
                    </div>
                  )}
                  {currentLine.type === "user" && (
                    <div className="w-full relative mt-auto mb-36 text-center">
                      <div className="relative">
                        <div className="py-3 px-4 leading-loose !text-white text-shadow-dark">
                          {currentLine.content}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <DemoCharMessages characterName={CHARACTER_NAME} />
            <div className="input-area">
              <Input />
            </div>
          </div>
        </div>
      </div>
    </VoiceProvider>
  );
}
