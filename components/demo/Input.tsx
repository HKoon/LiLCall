import { useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/utils";
import MicFFT from "../MicFFT";
import { Toggle } from "../ui/toggle";

export default function Input() {
  const { status, connect, disconnect, micFft, isMuted, mute, unmute } =
    useVoice();

  const isConnected = status.value === "connected";

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 w-full p-4 flex items-center justify-center",
        "bg-gradient-to-t from-card via-card/90 to-card/0"
      )}
    >
      <AnimatePresence>
        {!isConnected ? (
          // 未连接状态的绿色电话按钮
          <motion.div
            initial="initial"
            animate="enter"
            exit="exit"
            variants={{
              initial: { opacity: 0 },
              enter: { opacity: 1 },
              exit: { opacity: 0 },
            }}
            className="relative flex justify-center"
          >
            <motion.div
              variants={{
                initial: { scale: 0.5 },
                enter: { scale: 1 },
                exit: { scale: 0.5 },
              }}
            >
              <Button
                className={cn(
                  "z-50 flex items-center justify-center rounded-full w-14 h-14 mb-10",
                  "bg-green-500 hover:bg-green-600"
                )}
                onClick={() => {
                  connect()
                    .then(() => {})
                    .catch(() => {})
                    .finally(() => {});
                }}
              >
                <span>
                  <Phone className="size-6 text-white" strokeWidth={2} />
                </span>
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          // 已连接状态的红色电话按钮和波形
          <motion.div
            initial={{
              y: "100%",
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: "100%",
              opacity: 0,
            }}
            className="flex items-center justify-center mb-10 relative"
          >
            {/* 静音按钮放在左边 */}
            <div className="absolute left-[-60px]">
              <Toggle
                pressed={!isMuted}
                onPressedChange={() => {
                  if (isMuted) {
                    unmute();
                  } else {
                    mute();
                  }
                }}
                className="h-10 w-10 rounded-full"
              >
                {isMuted ? (
                  <MicOff className="size-4" />
                ) : (
                  <Mic className="size-4" />
                )}
              </Toggle>
            </div>

            {/* 中间的波形和结束通话按钮 */}
            <div className="flex flex-row items-center gap-4">
              {/* 左侧波形 */}
              <div className="h-14 w-14 rotate-180">
                <MicFFT fft={micFft} className="fill-red-500/70" />
              </div>

              {/* 结束通话按钮 */}
              <Button
                className="flex items-center justify-center rounded-full w-14 h-14 bg-red-500 hover:bg-red-600"
                onClick={() => {
                  disconnect();
                }}
              >
                <PhoneOff className="size-6 text-white" strokeWidth={2} />
              </Button>

              {/* 右侧波形 */}
              <div className="h-14 w-14">
                <MicFFT fft={micFft} className="fill-red-500/70" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
