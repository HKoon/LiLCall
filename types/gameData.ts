import { z } from "zod";

// 定义 Zod Schema
export const GameDataSchema = z.object({
  gameData: z.object({
    isTouch: z.boolean(),
    mode: z.number(),
    preset: z.number(),
    power: z.number(),
    duration: z.number(),
  }),
});

// 从 Schema 生成 TypeScript 类型
export type GameDataType = z.infer<typeof GameDataSchema>;
