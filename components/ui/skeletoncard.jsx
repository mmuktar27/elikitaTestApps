import { motion } from "motion/react";

export default function SkeletonCard() {
  return (
    <div className="flex min-h-screen items-center justify-center ">
      <div className="p-8">
        <div className="relative size-32">
          {/* Heart Icon */}
          <motion.svg
            className="size-full text-red-500"
            viewBox="0 0 24 24"
            fill="#007664"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </motion.svg>

          {/* EKG Lines */}
          <svg
            className="absolute left-0 top-0 size-full"
            viewBox="0 0 100 100"
          >
            <motion.path
              d="M0,50 Q25,50 25,30 T50,50 T75,30 T100,50"
              fill="none"
              stroke="#007664"
              strokeWidth="2"
              className="text-blue-500"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
