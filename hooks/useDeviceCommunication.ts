import { useCallback, useEffect } from "react";

type CommandMessage = {
  type: "command";
  data: string;
};

type ModelMessage = {
  type: "model";
  data: {
    model: number;
    intensity: number;
    duration: number;
  };
};

type DeviceMessage = CommandMessage | ModelMessage;

export const useDeviceCommunication = () => {
  // 发送消息到应用的通用函数
  const sendMessageToApp = useCallback((message: DeviceMessage): boolean => {
    // iOS设备
    if (
      window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers["com_svakom_game"]
    ) {
      window.webkit.messageHandlers["com_svakom_game"].postMessage(message);
      console.log("已向iOS应用发送消息:", message);
      return true;
    }
    // Android设备
    else if (window.Android && window.Android.sendMessageToApp) {
      window.Android.sendMessageToApp(message);
      console.log("已向Android应用发送消息:", message);
      return true;
    }
    // 模拟发送
    else {
      console.log("模拟向应用发送消息:", message);
      return false;
    }
  }, []);

  // 发送触摸命令
  const sendTouchCommand = useCallback((intensity: number, duration: number): boolean => {
    // 确保强度在有效范围内 (30-255)
    const safeIntensity = Math.max(30, Math.min(255, intensity));

    const message: CommandMessage = {
      type: "command",
      data: `V:1;M:r-0-${safeIntensity}-${duration}`,
    };

    return sendMessageToApp(message);
  }, [sendMessageToApp]);

  // 发送预设模式命令
  const sendPresetModelCommand = useCallback((
    model: number,
    intensity: number,
    duration: number
  ): boolean => {
    const message: ModelMessage = {
      type: "model",
      data: {
        model,
        intensity,
        duration,
      },
    };

    return sendMessageToApp(message);
  }, [sendMessageToApp]);

  // 设置消息接收处理函数
  useEffect(() => {
    // 定义消息接收函数
    window.messageFromApp = (data: any) => {
      try {
        // 如果data是JSON字符串，尝试解析
        const jsonData = typeof data === "string" ? JSON.parse(data) : data;
        console.log("收到来自应用的消息:", jsonData);
        // 这里可以添加对接收消息的处理逻辑
      } catch (error) {
        console.error("处理应用消息失败:", error);
      }
    };

    // 组件卸载时清理
    return () => {
      delete window.messageFromApp;
    };
  }, []);

  return {
    sendMessageToApp,
    sendTouchCommand,
    sendPresetModelCommand,
  };
};
