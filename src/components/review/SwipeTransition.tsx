import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function SwipeTransition({
  itemKey,
  direction,
  onSwipeLeft,
  onSwipeRight,
  children,
}: {
  itemKey: string;
  direction: 1 | -1;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  children: ReactNode;
}) {
  return (
    <AnimatePresence initial={false} mode="wait" custom={direction}>
      <motion.div
        key={itemKey}
        custom={direction}
        variants={{
          initial: (d: number) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
          animate: { x: 0, opacity: 1, transition: { duration: 0.3 } },
          exit: (d: number) => ({ x: d > 0 ? -48 : 48, opacity: 0, transition: { duration: 0.3 } }),
        }}
        initial="initial"
        animate="animate"
        exit="exit"
        drag={onSwipeLeft || onSwipeRight ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, info) => {
          if (!onSwipeLeft && !onSwipeRight) return;
          if (info.offset.x < -80) onSwipeLeft?.();
          if (info.offset.x > 80) onSwipeRight?.();
        }}
        className="flex-1 flex"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

