"use client";

import Hero3DBackground from "./Hero3DBackground";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

// --- Feature/Goals Section ---
const FeatureGoalsSection = () => (
  <section className="relative py-32 bg-black flex justify-center items-center overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-purple-500/5 to-black pointer-events-none" />
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-20 z-10 relative">
      {/* Left: Text */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="flex-1 text-left"
      >
        <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-8 leading-tight">Set Your Fitness Goals</h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-2xl text-gray-300 mb-10 max-w-2xl"
        >
          Define, track, and achieve your fitness milestones. Whether it's burning calories, building muscle, or staying consistent, our platform helps you visualize and celebrate your progress.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <Button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-12 py-5 text-2xl rounded-full shadow-lg transition-all duration-200">
            Learn more
          </Button>
        </motion.div>
      </motion.div>
      {/* Right: Glassmorphic Card with Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, x: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.035, boxShadow: '0 12px 48px 0 rgba(255,255,255,0.12)' }}
        className="flex-1 max-w-2xl w-full rounded-4xl bg-white/10 backdrop-blur-2xl shadow-2xl border border-white/20 p-14"
      >
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-bold text-2xl">Edit your goal</span>
            <span className="text-yellow-400 font-semibold text-2xl">$56,000</span>
          </div>
          {/* Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0.8 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="w-full h-48 bg-gradient-to-tr from-yellow-400/30 via-purple-400/20 to-white/10 rounded-2xl mb-6 flex items-end"
          >
            <div className="w-full h-full flex items-end gap-2 px-4">
              {/* Fake chart bars */}
              {[30, 60, 40, 80, 50, 90, 70, 100, 60, 80, 40, 70].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.04, ease: 'easeOut' }}
                  viewport={{ once: true }}
                  className="bg-yellow-400/80 rounded-t-xl origin-bottom"
                  style={{ height: `${h}%`, width: '6%' }}
                />
              ))}
            </div>
          </motion.div>
          <div className="flex justify-between text-lg text-gray-300 mb-4">
            <span>21 months</span>
            <span>$2,891/mo</span>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <Button size="lg" className="bg-yellow-400 text-black font-bold px-8 py-4 text-xl rounded-full shadow hover:bg-yellow-300">
              Change goal
            </Button>
          </motion.div>
        </div>
        {/* Recent Transactions (Fitness themed) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <div className="font-semibold text-white mb-4 text-xl">Recent Activity</div>
          <ul className="text-lg text-gray-200 space-y-2">
            <li className="flex justify-between"><span>🏃‍♂️ 5km Run</span><span className="text-green-400">+500 cal</span></li>
            <li className="flex justify-between"><span>💪 Strength Training</span><span className="text-green-400">+300 cal</span></li>
            <li className="flex justify-between"><span>🚴‍♀️ Cycling</span><span className="text-green-400">+400 cal</span></li>
            <li className="flex justify-between"><span>🥗 Healthy Meal</span><span className="text-green-400">+150 cal</span></li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// --- Main Features Section ---
const MainFeaturesSection = () => (
  <section className="py-32 bg-gradient-to-b from-black via-zinc-900 to-black relative">
    <div className="container mx-auto px-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.18 } }
        }}
        className="text-center mb-24"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-yellow-400 font-semibold tracking-widest text-2xl uppercase mb-4"
        >Main Features</motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-extrabold text-white mb-6"
        >Made to Make Fitness Easy for Everyone</motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-2xl text-gray-300 max-w-3xl mx-auto"
        >All the tools you need to stay motivated, track progress, and connect with the fitness community.</motion.p>
      </motion.div>
      <div className="flex flex-wrap justify-center gap-16">
        {/* Feature Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.07, boxShadow: '0 12px 48px 0 rgba(255,255,255,0.12)' }}
          className="w-80 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 flex flex-col items-center shadow-2xl"
        >
          <Image src="/feature-track.png" alt="Track" width={80} height={80} className="mb-6" />
          <div className="font-bold text-white text-2xl mb-4">Smart Tracking</div>
          <div className="text-gray-300 text-lg text-center">Track workouts, calories, and progress with ease.</div>
        </motion.div>
        {/* Feature Card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.07, boxShadow: '0 12px 48px 0 rgba(255,255,255,0.12)' }}
          className="w-80 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 flex flex-col items-center shadow-2xl"
        >
          <Image src="/feature-reward.png" alt="Rewards" width={80} height={80} className="mb-6" />
          <div className="font-bold text-white text-2xl mb-4">Earn Rewards</div>
          <div className="text-gray-300 text-lg text-center">Get rewarded for consistency and achievements.</div>
        </motion.div>
        {/* Feature Card 3 */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.07, boxShadow: '0 12px 48px 0 rgba(255,255,255,0.12)' }}
          className="w-80 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 flex flex-col items-center shadow-2xl"
        >
          <Image src="/feature-community.png" alt="Community" width={80} height={80} className="mb-6" />
          <div className="font-bold text-white text-2xl mb-4">Community</div>
          <div className="text-gray-300 text-lg text-center">Connect, compete, and grow with others.</div>
        </motion.div>
        {/* Feature Card 4 */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.07, boxShadow: '0 12px 48px 0 rgba(255,255,255,0.12)' }}
          className="w-80 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 flex flex-col items-center shadow-2xl"
        >
          <Image src="/feature-challenge.png" alt="Challenges" width={80} height={80} className="mb-6" />
          <div className="font-bold text-white text-2xl mb-4">Daily Challenges</div>
          <div className="text-gray-300 text-lg text-center">Stay motivated with new challenges every day.</div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="text-center mt-20"
      >
        <Link href="/dashboard">
          <Button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-14 py-6 text-2xl rounded-full shadow-lg transition-all duration-200">
            Start your journey
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

// --- Footer ---
const Footer = () => (
  <footer className="py-8 bg-black border-t border-white/10 text-center text-gray-400 text-sm">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>&copy; {new Date().getFullYear()} FitVibe. All rights reserved.</div>
      <div className="flex gap-4 justify-center">
        <a href="#" className="hover:text-yellow-400 transition">Privacy Policy</a>
        <a href="#" className="hover:text-yellow-400 transition">Terms of Service</a>
        <a href="#" className="hover:text-yellow-400 transition">Contact</a>
      </div>
    </div>
  </footer>
);

// --- Main Page ---
export const Hero = () => {
  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      {/* 3D Animated Gym Background & Floating UI Elements */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Hero3DBackground />
        {/* Floating UI Elements */}
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-24 right-20 z-20"
        >
          <div className="bg-white/90 rounded-2xl shadow-2xl p-4">
            <Image src="/qr-placeholder.png" alt="QR Code" width={120} height={120} className="rounded" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -30, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="absolute bottom-36 left-20 z-20"
        >
          <div className="bg-white/80 rounded-full shadow-2xl p-2">
            <Image src="/avatar-placeholder.jpg" alt="User Avatar" width={72} height={72} className="rounded-full" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
          animate={{ opacity: 0.7, scale: 1.2, rotate: 0 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="absolute right-52 bottom-20 z-10"
        >
          <div className="w-36 h-36 bg-yellow-400 rounded-full blur-2xl opacity-70" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="absolute left-1/2 top-24 -translate-x-1/2 z-20"
        >
          <div className="bg-white/80 rounded-full shadow-2xl p-4">
            <Image src="/dumbbell-icon.png" alt="Dumbbell Icon" width={60} height={60} />
          </div>
        </motion.div>
        {/* Main Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 pt-48 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <div className="mb-8 text-yellow-400 font-semibold tracking-widest text-2xl md:text-3xl uppercase">
              Make your fitness journey easy
            </div>
            <h1 className="font-extrabold text-6xl md:text-8xl lg:text-9xl text-white mb-10 tracking-tight leading-tight drop-shadow-2xl">
              THE MODERN WAY<br />TO GET FIT
            </h1>
            <p className="text-3xl md:text-4xl text-gray-300 mb-14 max-w-4xl mx-auto">
              Track workouts, earn rewards, and stay motivated with a next-gen fitness platform.
            </p>
            <Link href="/dashboard">
              <Button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-16 py-7 text-3xl rounded-full shadow-2xl transition-all duration-200">
                Start now <ArrowRight className="ml-4 w-10 h-10" />
              </Button>
            </Link>
          </motion.div>
          {/* Floating Glassmorphic Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="mt-24 w-full max-w-4xl mx-auto rounded-4xl bg-white/10 backdrop-blur-2xl shadow-2xl border border-white/20 p-14 flex flex-col md:flex-row gap-16 items-center"
          >
            <div className="flex-1 min-w-[240px] text-left">
              <div className="text-4xl font-bold text-white mb-4">$34,809.89</div>
              <div className="text-gray-300 text-xl mb-8">Total Calories Burned</div>
              <div className="flex gap-4 items-center">
                <span className="inline-block w-6 h-6 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-xl text-yellow-200">Active</span>
              </div>
            </div>
            <div className="flex-1 min-w-[240px] text-left">
              <div className="text-2xl font-semibold text-white mb-2">Refer a friend and receive rewards</div>
              <div className="text-gray-400 text-lg mb-4">Motivate your friends and earn together!</div>
              <Button size="lg" className="bg-yellow-400 text-black font-bold px-8 py-4 text-xl rounded-full shadow hover:bg-yellow-300">
                Invite now
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Features/Goals Section */}
      <FeatureGoalsSection />
      {/* Main Features Section */}
      <MainFeaturesSection />
      {/* Footer */}
      <Footer />
    </div>
  );
};
