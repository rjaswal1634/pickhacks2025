"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Animated geometric background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 opacity-90">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-grid-white/10 bg-grid-8 [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
        </div>
      </div>

      {/* Floating shapes */}
      <div className="absolute w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute top-[20%] left-[15%] w-32 h-32 bg-purple-500 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="absolute bottom-[20%] right-[15%] w-32 h-32 bg-pink-500 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400">
              Toon Fit
            </span>
          </h1>

          <div className="space-y-6 text-xl md:text-2xl text-white/90">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Fun workouts with cartoons.
              
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-white/80"
            >
              Play with motion and gesture controls
              Perfect for kids to learn and go.
              Perfect for parents to track progress.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="pt-8"
          >
            <Link href="/login">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-white/90 text-lg px-8 py-6 rounded-full font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-purple-500/20"
              >
                Get Started
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-sm text-white/60 mt-8"
          >
            Join thousands of kids learning through interactive play
          </motion.p>
        </motion.div>
      </div>

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none"></div>
    </div>
  )
}

