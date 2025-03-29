"use client";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VoiceProvider, useVoice } from "@humeai/voice-react";
import Input from "./Input";
import DemoCharMessages from "./DemoCharMessages";

const CHARACTER_NAME = "Rubi";
const GREETING = `|https://files.zotome.com/toy/scence/classroom2.webp|
[OOC]<>The physics lecture hall buzzed with the hum of fluorescent lights, but Professor Liang had dismissed the class twenty minutes ago. You lingered, scribbling last-minute notes on your tablet—until a hand clamped down on your shoulder.
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"Still here, Dr. Overachiever?"
[CHAR]Rubi stood in the doorway, his usual smirk in place. His blue-and-white track jacket was zipped up to the neck, the high collar emphasizing his sharp jawline. His piercing blue eyes glinted with mischief as they locked onto yours.
[USER]<>"Go away," you muttered, not looking up.
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"Aw, still sore about the quiz?" 
[OOC]<>He dropped into the seat beside you, his knee brushing yours. 
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"Relax. I’ll let you borrow my notes."
[USER]<>"Like I’d trust your joke answers—"
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"You're missing the point." 
[OOC]<>He cut you off with a laugh, too loud for an empty classroom. 
[OOC]<>His fingers tapped your tablet screen, pulling up a file labeled "Neuro-Feedback Prototype v3.2." 
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"This could help you… focus."
[OOC]<>Before you could ask, he yanked you to your feet and steered you toward the back corner, where a set of lab stations stood dark and unused. 
|https://files.zotome.com/toy/scence/classroom1.webp|
[USER]<>"Rubi, what—?"
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"Shh. Don’t be a prude."
[OOC]<>His lips crashed into yours, hard and sudden—a kiss that tasted of mint gum and rebellion. When he pulled back, his eyes were bright, dangerous. 
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"You’ve been avoiding me. This ends now."
[OOC]<>He tossed a small black box onto the nearest desk. Inside glinted a silver cylinder, no bigger than a pen. 
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"A neuro-stimulator. Calms the nerves. Helps with… concentration."
[USER]<>"I’m not your guinea pig—"
[OOC]<>He pressed a finger to your lips. 
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"Relax. It’s painless." 
[OOC]<>Before you could struggle, he guided your legs apart, his hands steady as he positioned the device between them.
[USER]<>"Rubi, stop—"
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"Shh...You’ll love it." 
[OOC]<>His thumb silenced you, warm against your cheek.The first vibration was subtle—a low, rhythmic pulse that made your breath hitch. He reached for a remote control, its buttons glowing faintly. 
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"See? Not so bad."
[USER]<>"B-bad isn’t the issue—"
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"Then why are you trembling?...Oh, right. You're blushing when I solve equations in my head. Pathetic."
[USER]<>"Y—you’re impossible—"
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"Impossibly hot, yeah.Now, either you apologize for ignoring me… or I turn this up to university level."
[OOC]He smirked, adjusting the remote’s settings. You groaned, torn between humiliation and the strange thrill of his control. 
[USER]<>"Fine. You’re… annoying."
[CHAR]<https://files.zotome.com/toy/character/rubi.webp>"Annoying enough to kiss again?"
[USER]<>"Shut—!"
[OOC]He laughed, silencing you with another kiss as the device hummed between you—a silent witness to your crumbling resolve.`;

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

      const oocMatch = line.match(/^\[OOC\](<([^>]*)>)?(.*)/);
      if (oocMatch) {
        const image = oocMatch[2] === undefined ? undefined : 
                     oocMatch[2] === "" ? null : oocMatch[2];
        parsedLines.push({
          type: "ooc",
          content: oocMatch[3] || "",
          image
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
    
    if (line.type === "char" || line.type === "user" || line.type === "ooc") {
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
    <div 
      className="relative w-[100dvw] h-[100dvh]"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.input-area')) {
          handleNextLine();
        }
      }}
    >
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
