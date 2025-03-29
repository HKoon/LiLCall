"use client";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VoiceProvider, useVoice } from "@humeai/voice-react";
import Input from "./Input";
import DemoCharMessages from "./DemoCharMessages";

const CHARACTER_NAME = "Rubi";
const GREETING = `|https://files.zotome.com/toy/scence/classroom1.webp|
[OOC]The physics lecture hall buzzed with the hum of fluorescent lights, but Professor James had dismissed the class twenty minutes ago. You lingered, scribbling last-minute notes on my tablet—until a hand clamped down on my shoulder.
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"Still here, Dr. Overachiever?"
[OOC]Rubi loomed in the doorway, his usual smirk in place.
[USER]<>"Go away"
[OOC]You muttered, not looking up.`;

type GreetingLine = {
  type: "background" | "ooc" | "char" | "user";
  content: string;
  image?: string | null;
};

function DialogueContent({ 
  accessToken,
  configId,
  onGreetingComplete 
}: { 
  accessToken: string;
  configId?: string;
  onGreetingComplete: () => void;
}) {
  const [showForeground, setShowForeground] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [foregroundImage, setForegroundImage] = useState<string | null>(null);
  const [greetingLines, setGreetingLines] = useState<GreetingLine[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [greetingCompleted, setGreetingCompleted] = useState(false);
  const { status } = useVoice();

  // 解析GREETING文本
  useEffect(() => {
    if (!GREETING) return;

    const lines = GREETING.split("\n").filter(line => line.trim());
    const parsedLines: GreetingLine[] = [];

    for (const line of lines) {
      if (line.startsWith("|") && line.endsWith("|")) {
        const bgUrl = line.slice(1, -1);
        parsedLines.push({
          type: "background",
          content: "",
          image: bgUrl
        });
        continue;
      }

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

      const oocMatch = line.match(/^\[OOC\](.*)/);
      if (oocMatch) {
        parsedLines.push({
          type: "ooc",
          content: oocMatch[1] || ""
        });
        continue;
      }

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
    if (index >= lines.length || isAnimating) {
      if (index >= lines.length) {
        setGreetingCompleted(true);
        onGreetingComplete();
      }
      return;
    }
    
    setIsAnimating(true);
    const line = lines[index];
    
    if (line.type === "background" && line.image) {
      setBackgroundImage(line.image);
      await new Promise(resolve => setTimeout(resolve, 800));
      handleLineChange(index + 1, lines);
      setIsAnimating(false);
      return;
    }
    
    if (line.type === "char" || line.type === "user") {
      if (line.image !== undefined) {
        if (line.image === null) {
          setShowForeground(false);
        } else {
          setForegroundImage(line.image);
          setShowForeground(true);
        }
      }
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
    <div className="relative w-[100dvw] h-[100dvh]">
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
                {(currentLine.type === "ooc" || currentLine.type === "char") && (
                  <div className="max-w-2xl mx-auto bg-black/30 rounded-xl p-4 backdrop-blur-sm text-white">
                    {currentLine.type === "char" && (
                      <div className="text-sm font-medium mb-2">
                        {CHARACTER_NAME}
                      </div>
                    )}
                    {currentLine.content}
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
          
          {greetingCompleted && (
            <>
              <DemoCharMessages characterName={CHARACTER_NAME} />
              <div className="input-area">
                <Input />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Demo({ accessToken }: { accessToken: string }) {
  const configId = process.env["NEXT_PUBLIC_HUME_CONFIG_ID"];
  const [showVoiceControls, setShowVoiceControls] = useState(false);

  return (
    <VoiceProvider
      auth={{ type: "accessToken", value: accessToken }}
      configId={configId}
    >
      <DialogueContent 
        accessToken={accessToken}
        configId={configId}
        onGreetingComplete={() => setShowVoiceControls(true)}
      />
    </VoiceProvider>
  );
}
