"use client";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VoiceProvider } from "@humeai/voice-react";
import Input from "./Input";
import DemoCharMessages from "./DemoCharMessages";

const CHARACTER_NAME = "Rubi";
const GREETING = `|https://files.zotome.com/toy/scence/classroom2.webp|
[OOC]<>The physics lecture hall buzzed with the hum of fluorescent lights, but Professor Liang had dismissed the class twenty minutes ago. You lingered, scribbling last-minute notes on your tablet—until a hand clamped down on your shoulder.
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"Still here, Dr. Overachiever?"
[CHAR]Rubi stood in the doorway, his usual smirk in place. His blue-and-white track jacket was zipped up to the neck, the high collar emphasizing his sharp jawline. His piercing blue eyes glinted with mischief as they locked onto yours.
[USER]<>"Go away," you muttered, not looking up.
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"Aw, still sore about the quiz?" 
[OOC]He dropped into the seat beside you, his knee brushing yours. 
[CHAR]"Relax. I’ll let you borrow my notes."
[USER]<>"Like I’d trust your joke answers—"
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"You're missing the point." 
[OOC]He cut you off with a laugh, too loud for an empty classroom. 
[OOC]His fingers tapped your tablet screen, pulling up a file labeled "Neuro-Feedback Prototype v3.2." 
[CHAR]"This could help you… focus."
[OOC]Before you could ask, he yanked you to your feet and steered you toward the back corner, where a set of lab stations stood dark and unused. 
|https://files.zotome.com/toy/scence/classroom1.webp|
[USER]<>"Rubi, what—?"
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"Shh. Don’t be a prude."
[OOC]His lips crashed into yours, hard and sudden—a kiss that tasted of mint gum and rebellion. When he pulled back, his eyes were bright, dangerous. 
[CHAR]"You’ve been avoiding me. This ends now."
[OOC]He tossed a small black box onto the nearest desk. Inside glinted a silver cylinder, no bigger than a pen. 
[CHAR]"A neuro-stimulator. Calms the nerves. Helps with… concentration."
[USER]<>"I’m not your guinea pig—"
[OOC]He pressed a finger to your lips. 
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"Relax. It’s painless." 
[OOC]Before you could struggle, he guided your legs apart, his hands steady as he positioned the device between them.
[USER]<>"Rubi, stop—"
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"Shh...You’ll love it." 
[OOC]His thumb silenced you, warm against your cheek. 
[OOC]The first vibration was subtle—a low, rhythmic pulse that made your breath hitch. He reached for a remote control, its buttons glowing faintly. 
[CHAR]"See? Not so bad."
[USER]<>"B-bad isn’t the issue—"
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"Then why are you trembling?...Oh, right. You're blushing when I solve equations in my head. Pathetic."
[USER]<>"Y—you’re impossible—"
[OOC]He smirked, adjusting the remote’s settings. 
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"Impossibly hot, yeah.Now, either you apologize for ignoring me… or I turn this up to university level."
[OOC]You groaned, torn between humiliation and the strange thrill of his control. 
[USER]<>"Fine. You’re… annoying."
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"Annoying enough to kiss again?"
[USER]<>"Shut—!"
[OOC]<https://files.zotome.com/toy/character/rubi.webp>He laughed, silencing you with another kiss as the device hummed between you—a silent witness to your crumbling resolve.`;

type GreetingLine = {
  type: "background" | "ooc" | "char" | "user";
  content: string;
  image?: string | null; // null表示明确不显示前景图
};

export default function Demo({ accessToken }: { accessToken: string }) {
  const configId = process.env["NEXT_PUBLIC_HUME_CONFIG_ID"];
  const [showForeground, setShowForeground] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [foregroundImage, setForegroundImage] = useState<string | null>(null);
  const [greetingLines, setGreetingLines] = useState<GreetingLine[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

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
      const charMatch = line.match(/^\[CHAR\](<([^>]*)>)?(.*)/);
      if (charMatch) {
        const image = charMatch[2] === undefined ? undefined : 
                     charMatch[2] === "" ? null : charMatch[2];
        parsedLines.push({
          type: "char",
          content: charMatch[3] || "",
          image
        });
        continue;
      }

      // 处理用户对话
      const userMatch = line.match(/^\[USER\](<([^>]*)>)?(.*)/);
      if (userMatch) {
        const image = userMatch[2] === undefined ? undefined : 
                     userMatch[2] === "" ? null : userMatch[2];
        parsedLines.push({
          type: "user",
          content: userMatch[3] || "",
          image
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

  const handleLineChange = async (index: number, lines: GreetingLine[] = greetingLines) => {
    if (index >= lines.length || isAnimating) return;
    
    setIsAnimating(true);
    const line = lines[index];
    
    // 处理背景图 - 自动切换到下一行
    if (line.type === "background" && line.image) {
      setBackgroundImage(line.image);
      await new Promise(resolve => setTimeout(resolve, 800)); // 等待动画完成
      handleLineChange(index + 1, lines);
      setIsAnimating(false);
      return;
    }
    
    // 处理前景图
    if (line.type === "char" || line.type === "user") {
      if (line.image !== undefined) { // 只有明确指定时才更新前景图
        if (line.image === null) {
          // 明确不显示前景图
          setShowForeground(false);
        } else {
          setForegroundImage(line.image);
          setShowForeground(true);
        }
      }
    } else if (line.type === "ooc") {
      // OOC时不改变前景图状态
    }

    setCurrentLineIndex(index);
    setIsAnimating(false);
  };

  const handleNextLine = () => {
    if (!isAnimating) {
      handleLineChange(currentLineIndex + 1);
    }
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
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${backgroundImage}`}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
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
        <AnimatePresence>
          {showForeground && foregroundImage && (
            <motion.div
              key={`fg-${foregroundImage}`}
              className="absolute inset-0 h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="relative w-full h-full">
                <motion.img
                  src={foregroundImage}
                  alt="Foreground character"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  loading="eager"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dialogue Display */}
        <div className="absolute inset-0 flex flex-col justify-end overflow-y-hidden w-full">
          <div className="h-1/2">
            <AnimatePresence mode="wait">
              {currentLine && (
                <motion.div
                  key={`line-${currentLineIndex}`}
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
