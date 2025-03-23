import { useEffect, useRef } from "react";
import { useVoice } from "@humeai/voice-react";
import { useMutation } from "@tanstack/react-query";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

interface AssistantMessage {
  role: string;
  content: string;
}

interface ContentFilterResults {
  hate: { filtered: boolean };
  jailbreak: { detected: boolean; filtered: boolean };
  profanity: { detected: boolean; filtered: boolean };
  self_harm: { filtered: boolean };
  sexual: { filtered: boolean };
  violence: { filtered: boolean };
}

interface Choice {
  index: number;
  message: AssistantMessage;
  finish_reason: string;
  content_filter_results: ContentFilterResults;
}

interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface ApiResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;
}

interface RequestBody {
  model: string;
  messages: {
    role: string;
    content: string;
  }[];
  temperature: number;
  presencePenalty: number;
  min_p: number;
  repetition_penalty: number;
}

interface AssistantMessageTrackerOptions {
  apiPath?: string;
  onSuccess?: (data: ApiResponse, content: string) => void;
  onError?: (error: Error, content: string) => void;
}

// 发送请求的函数
const sendRequest = async (
  requestBody: RequestBody,
  apiPath: string
): Promise<ApiResponse> => {
  const fullUrl = `${API_BASE_URL}${apiPath}`;
  const token = process.env.NEXT_PUBLIC_API_TOKEN || "";

  const response = await fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }

  return response.json();
};

export function useAssistantMessageTracker(
  options: AssistantMessageTrackerOptions = {}
) {
  const {
    apiPath: apiPaht = "/v1/chat/completions",
    onSuccess,
    onError,
  } = options;
  const { messages } = useVoice();

  // 使用 React Query 的 useMutation，添加类型
  const mutation = useMutation<ApiResponse, Error, string>({
    mutationFn: (content: string) => {
      // 构建请求体
      const requestBody: RequestBody = {
        model: "lcData",
        messages: [
          {
            role: "system",
            content: "",
          },
          {
            role: "user",
            content,
          },
        ],
        temperature: 1,
        presencePenalty: 0.1,
        min_p: 0.075,
        repetition_penalty: 1.1,
      };

      return sendRequest(requestBody, apiPaht);
    },
    onSuccess: (data, content) => {
      console.log("API请求成功:", data);
      onSuccess?.(data, content);
    },
    onError: (error: Error, content) => {
      console.error("API请求失败:", error);
      onError?.(error, content);
    },
  });

  // 记录上一个 assistant_end 消息的索引
  const lastEndIndexRef = useRef(-1);

  // 监听 assistant_end 事件
  useEffect(() => {
    // 查找最新的 assistant_end 消息
    const endIndex = messages.findIndex(
      (msg, index) =>
        msg.type === "assistant_end" && index > lastEndIndexRef.current
    );

    // 如果找到了新的 assistant_end 消息
    if (endIndex !== -1) {
      // 收集上一个 end 之后到当前 end 之前的所有 assistant_message
      const startIndex = lastEndIndexRef.current + 1;
      const assistantMessages = messages
        .slice(startIndex, endIndex)
        .filter((msg) => msg.type === "assistant_message");

      // 合并所有消息内容
      const combinedContent = assistantMessages
        .map((msg) =>
          msg.type === "assistant_message" ? msg.message.content : ""
        )
        .join(" ");

      if (combinedContent) {
        console.log("助手完整消息:", combinedContent);

        // 使用 mutation 发送请求
        mutation.mutate(combinedContent);
      }

      // 更新上一个 end 消息的索引
      lastEndIndexRef.current = endIndex;
    }
  }, [messages, mutation, apiPaht]);

  return {
    messages,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
}
