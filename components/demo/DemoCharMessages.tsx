"use client";
import { useVoice } from "@humeai/voice-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAssistantMessageTracker } from "@/hooks/request/useAssistantMessageTracker";
import { DebugPanel } from "./DebugPanel";
import { GameDataSchema } from "@/types/gameData";
import { useDeviceCommunication } from "@/hooks/useDeviceCommunication";
import { AssistantMessage } from "./AssistantMessage";
import { UserMessage } from "./UserMessage";

// 为 window.webkit 添加类型声明
declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        [key: string]: {
          postMessage: (message: any) => void;
        };
      };
    };
    Android?: {
      sendMessageToApp: (message: any) => void;
    };
    messageFromApp?: (data: any) => void;
  }
}

const DemoCharMessages = function Messages({
  characterName,
}: {
  characterName: string;
}) {
  const { messages, status } = useVoice();

  // 只获取最后一条消息
  const currentMessage = messages
    .filter(
      (msg) => msg.type === "assistant_message" || msg.type === "user_message"
    )
    .slice(-1)[0];

  const { isLoading, isError, data } = useAssistantMessageTracker();
  const [parsedGameData, setParsedGameData] = useState<any>(null);

  const { sendTouchCommand, sendPresetModelCommand } = useDeviceCommunication();

  useEffect(() => {
    if (data && data.choices && data.choices.length > 0) {
      try {
        const content = data.choices[0].message.content;
        const jsonData = JSON.parse(content);

        // 使用 Zod 验证解析后的数据
        const validationResult = GameDataSchema.safeParse(jsonData);

        if (validationResult.success) {
          // 数据验证成功
          setParsedGameData(validationResult.data);
          console.log("解析后的游戏数据(已验证):", validationResult.data);

          const gameData = validationResult.data.gameData;

          // 处理触摸命令
          if (gameData?.isTouch) {
            if (gameData?.mode > 0) {
              const { preset, power, duration } = gameData;
              sendPresetModelCommand(preset, power, duration);
            } else {
              const { power, duration } = gameData;
              sendTouchCommand(power, duration);
            }
          }
        } else {
          // 数据验证失败
          console.error("游戏数据验证失败:", validationResult.error);
          // 可以选择设置一个默认值或者保持 parsedGameData 为 null
          setParsedGameData(jsonData); // 仍然设置原始数据用于调试
        }
      } catch (error) {
        console.error("解析游戏数据失败:", error);
      }
    }
  }, [data]);

  useEffect(() => {
    if (status.value === "disconnected") {
      // 断开连接时重置状态
      setParsedGameData(null);
    }
  }, [status.value]);

  return (
    <motion.div className="max-w-2xl mx-auto w-full flex flex-col h-full">
      {currentMessage && status.value === "connected" && (
        <>
          {currentMessage.message.role.toLowerCase() === "assistant" ? (
            <AssistantMessage
              content={currentMessage.message.content || ""}
              characterName={characterName}
            />
          ) : (
            <UserMessage content={currentMessage.message.content || ""} />
          )}
        </>
      )}
      <DebugPanel
        isLoading={isLoading}
        isError={isError}
        data={parsedGameData}
        position="top-left"
        created={data?.created || 0}
      />
    </motion.div>
  );
};

export default DemoCharMessages;
