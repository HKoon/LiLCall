import { z } from "zod";

// 定义 Zod Schema
export const GameDataSchema = z.object({
  gameData: z.object({
    choices: z.array(z.string()).optional(),
    isTouch: z
      .object({
        state: z.boolean(),
        intensity: z.number(),
        duration: z.number(),
      })
      .optional(),
    inSex: z.boolean().optional(),
  }),
});

// 从 Schema 生成 TypeScript 类型
export type GameDataType = z.infer<typeof GameDataSchema>;
