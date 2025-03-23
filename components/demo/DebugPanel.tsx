"use client";
import { cn } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, AlertCircle, X } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { GameData } from "@/hooks/request/useAssistantMessageTracker";

export type CornerPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

interface DebugPanelProps {
  isLoading?: boolean;
  isError?: boolean;
  data?: any;
  position?: CornerPosition;
  title?: string;
  buttonText?: string;
  created: number; // 添加 created 属性
}

export function DebugPanel({
  isLoading = false,
  isError = false,
  data = null,
  position = "top-right",
  title = "开发者调试面板",
  buttonText = "DEV",
  created,
}: DebugPanelProps) {
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const parsedGameData = data as { gameData: GameData };

  // 根据位置确定按钮和面板的位置类名
  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return {
          button: "top-4 left-4",
          panel: "top-16 left-4",
        };
      case "top-right":
        return {
          button: "top-4 right-4",
          panel: "top-16 right-4",
        };
      case "bottom-left":
        return {
          button: "bottom-4 left-4",
          panel: "bottom-16 left-4",
        };
      case "bottom-right":
      default:
        return {
          button: "bottom-4 right-4",
          panel: "bottom-16 right-4",
        };
    }
  };

  const positionClasses = getPositionClasses();

  return (
    <>
      {/* 调试悬浮按钮 */}
      <div className={`fixed ${positionClasses.button} z-50`}>
        <Button
          onClick={() => setShowDebugPanel(!showDebugPanel)}
          className={cn(
            "p-2 rounded-full shadow-lg hover:shadow-xl transition-all",
            isLoading
              ? "bg-blue-500 hover:bg-blue-600"
              : isError
              ? "bg-red-500 hover:bg-red-600"
              : "bg-purple-500 hover:bg-purple-600",
            "text-white"
          )}
          size="icon"
        >
          <span className="text-xs font-bold">{buttonText}</span>
        </Button>
      </div>

      {/* 调试弹窗 */}
      <AnimatePresence>
        {showDebugPanel && (
          <motion.div
            className={`fixed ${positionClasses.panel} z-50 w-96 bg-white/95 dark:bg-gray-800/95 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm`}
            initial={{
              opacity: 0,
              y: position.startsWith("top") ? -20 : 20,
              scale: 0.95,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: position.startsWith("top") ? -20 : 20,
              scale: 0.95,
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-t-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <h3 className="font-medium text-sm">{title}</h3>
              </div>
              <Button
                onClick={() => setShowDebugPanel(false)}
                variant="ghost"
                size="icon"
                className="h-6 w-6"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {isLoading && (
                <div className="flex items-center p-3 mb-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span className="text-sm font-medium">正在处理数据...</span>
                </div>
              )}

              {isError && (
                <div className="flex items-center p-3 mb-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">数据处理出错</span>
                </div>
              )}

              {parsedGameData && (
                <div className="space-y-4">
                  {/* 状态信息区域 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        触摸状态
                      </div>
                      <div className="font-medium flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            parsedGameData.gameData?.isTouch?.state
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        {parsedGameData.gameData?.isTouch?.state
                          ? "激活"
                          : "未激活"}
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        性行为状态
                      </div>
                      <div className="font-medium flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            parsedGameData.gameData?.inSex
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        {parsedGameData.gameData?.inSex ? "激活" : "未激活"}
                      </div>
                    </div>
                  </div>

                  {/* 触摸参数区域 */}
                  {parsedGameData.gameData?.isTouch?.state && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        触摸参数
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="text-xs mb-1">强度</div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  parsedGameData.gameData?.isTouch?.intensity *
                                    100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs mb-1">持续时间</div>
                          <div className="font-mono text-sm">
                            {parsedGameData.gameData?.isTouch?.duration.toFixed(
                              1
                            )}
                            s
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 可用选项区域 */}
                  {parsedGameData.gameData?.choices?.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        可用选项
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {parsedGameData.gameData.choices.map(
                          (choice: string, index: number) => (
                            <div
                              key={index}
                              className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs"
                            >
                              {choice}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* 所有游戏参数区域 */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex justify-between items-center">
                      <span>所有游戏参数</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 text-xs"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            JSON.stringify(parsedGameData.gameData, null, 2)
                          );
                        }}
                      >
                        复制
                      </Button>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                      <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {JSON.stringify(parsedGameData.gameData, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* 时间戳区域 */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    最后更新: {new Date(created * 1000).toLocaleString("zh-CN")}
                  </div>
                </div>
              )}

              {!isLoading && !parsedGameData && !isError && (
                <div className="flex flex-col items-center justify-center py-6 text-gray-500 dark:text-gray-400">
                  <div className="text-sm mb-2">暂无游戏数据</div>
                  <div className="text-xs">等待助手回复后将显示数据</div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
