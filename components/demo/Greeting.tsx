import { useVoice } from "@humeai/voice-react";
import React, { useRef, useState, useEffect } from "react";
import { RxTriangleDown } from "react-icons/rx";

export default function Greeting({ greeting }: { greeting: string }) {
  const { status } = useVoice();
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [showArrow, setShowArrow] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const [totalHeight, setTotalHeight] = useState(0);

  useEffect(() => {
    if (greeting && textRef.current) {
      // 先将全部文本放入容器中测量总高度
      textRef.current.style.transform = "translateY(0)";
      textRef.current.innerText = greeting;

      // 设置最大显示高度（两行文本的高度）
      const lineHeight =
        parseInt(getComputedStyle(textRef.current).lineHeight) || 24;
      const maxDisplayHeight = lineHeight * 2;
      setMaxHeight(maxDisplayHeight);

      // 获取文本总高度
      const textTotalHeight = textRef.current.scrollHeight;
      setTotalHeight(textTotalHeight);

      // 重置位置和箭头状态
      setCurrentPosition(0);
      setShowArrow(textTotalHeight > maxDisplayHeight);
    }
  }, [greeting]);

  const handleScroll = () => {
    if (textRef.current) {
      const lineHeight =
        parseInt(getComputedStyle(textRef.current).lineHeight) || 24;
      const scrollAmount = lineHeight * 2; // 每次滚动两行

      setCurrentPosition((prev) => {
        const nextPosition = prev + scrollAmount;

        // 检查是否到达底部
        if (nextPosition + maxHeight >= totalHeight) {
          setShowArrow(false);
          return Math.min(nextPosition, totalHeight - maxHeight);
        } else {
          setShowArrow(true);
          return nextPosition;
        }
      });
    }
  };

  if (status.value === "disconnected") {
    return (
      <div
        className="max-w-2xl mx-auto bg-black/30 rounded-xl p-4 backdrop-blur-sm text-white relative cursor-pointer"
        onClick={handleScroll}
        ref={contentRef}
      >
        <div className="overflow-hidden" style={{ height: `${maxHeight}px` }}>
          <div
            ref={textRef}
            className="transition-transform duration-300"
            style={{ transform: `translateY(-${currentPosition}px)` }}
          >
            {greeting}
          </div>
        </div>

        {showArrow && (
          <div className="absolute bottom-1 right-2 text-white animate-pulse">
            <RxTriangleDown size={16} />
          </div>
        )}
      </div>
    );
  }
  return null;
}
