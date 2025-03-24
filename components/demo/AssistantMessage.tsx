import { motion } from "framer-motion";

export const AssistantMessage = ({
  content,
  characterName,
}: {
  content: string;
  characterName: string;
}) => {
  return (
    <div className="w-full relative pt-8 px-4">
      <div className="absolute -top-1 left-4 text-sm font-medium text-white dark:text-gray-300 text-shadow-dark">
        {characterName || "角色名称"}
      </div>
      <motion.div
        // key={content} // 添加 key 属性
        className="w-full bg-white/80 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 rounded-lg shadow-sm backdrop-blur-sm"
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
      >
        <motion.div
          key={`content-${content}`} // 添加唯一的 key
          className="py-3 px-4 leading-loose text-gray-700 dark:text-gray-200 min-h-[60px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {content.split("").map((char, index) => (
            <motion.span
              key={`${content}-${index}`} // 确保每个字符的 key 也是唯一的
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.2,
                delay: index * 0.02,
                ease: "easeOut",
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};
