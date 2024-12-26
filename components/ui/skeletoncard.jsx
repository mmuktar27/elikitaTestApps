import { motion } from "motion/react";

export default function SkeletonCard() {
  return (
    <div className="relative flex size-full items-center justify-center">
      <motion.div
        className="size-full rounded-full border-t-4 border-[#75C05B]/10 "
        style={{
          maxWidth: "100px",
          maxHeight: "100px",
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
