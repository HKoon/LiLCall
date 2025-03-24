import { motion } from "framer-motion";

export const UserMessage = ({ content }: { content: string }) => {
  return (
    <div className="w-full relative mt-auto mb-36 text-center">
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <motion.div
          className="py-3 px-4 leading-loose !text-white text-shadow-dark"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.2,
            delay: 0.1,
            ease: [0, 0, 0.2, 1],
          }}
        >
          {content}
        </motion.div>
      </motion.div>
    </div>
  );
};
