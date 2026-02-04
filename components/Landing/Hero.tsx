"use client";

import Hero3DBackground from "./Hero3DBackground";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Trophy, Users, Target, Flame, Zap, Star, TrendingUp } from "lucide-react";

// --- Stats Section ---
const StatsSection = () => (
  <section className="relative py-20 bg-gradient-to-b from-black to-zinc-900">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { value: "50K+", label: "Active Users", icon: Users },
          { value: "1M+", label: "Workouts Done", icon: Activity },
          { value: "500K+", label: "Calories Burned", icon: Flame },
          { value: "10K+", label: "Challenges Won", icon: Trophy },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <stat.icon className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
            <div className="text-gray-400 text-lg">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

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
          Define, track, and achieve your fitness milestones. Whether it&apos;s burning calories, building muscle, or staying consistent, our platform helps you visualize and celebrate your progress.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <Link href="/dashboard">
            <Button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-12 py-5 text-2xl rounded-full shadow-lg transition-all duration-200">
              Get Started
            </Button>
          </Link>
        </motion.div>
      </motion.div>
      {/* Right: Glassmorphic Card with Progress */}
      <motion.div
        initial={{ opacity: 0, x: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02, boxShadow: '0 12px 48px 0 rgba(255,255,255,0.12)' }}
        className="flex-1 max-w-2xl w-full rounded-3xl bg-white/10 backdrop-blur-2xl shadow-2xl border border-white/20 p-10"
      >
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-bold text-2xl">Weekly Goal</span>
            <span className="text-yellow-400 font-semibold text-2xl">2,500 cal</span>
          </div>
          {/* Progress Chart */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0.8 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="w-full h-48 bg-gradient-to-tr from-yellow-400/30 via-purple-400/20 to-white/10 rounded-2xl mb-6 flex items-end"
          >
            <div className="w-full h-full flex items-end gap-2 px-4 pb-4">
              {/* Animated chart bars */}
              {[40, 65, 50, 85, 60, 95, 75].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.08, ease: 'easeOut' }}
                  viewport={{ once: true }}
                  className="flex-1 bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-t-xl origin-bottom"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </motion.div>
          <div className="flex justify-between text-lg text-gray-300 mb-4">
            <span>Mon - Sun</span>
            <span>357 cal/day avg</span>
          </div>
        </div>
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="mt-6"
        >
          <div className="font-semibold text-white mb-4 text-xl">Today&apos;s Activity</div>
          <ul className="text-lg text-gray-200 space-y-3">
            <li className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3">
              <span className="flex items-center gap-3"><Flame className="w-5 h-5 text-orange-400" /> Morning Run</span>
              <span className="text-green-400 font-semibold">+320 cal</span>
            </li>
            <li className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3">
              <span className="flex items-center gap-3"><Zap className="w-5 h-5 text-purple-400" /> HIIT Workout</span>
              <span className="text-green-400 font-semibold">+450 cal</span>
            </li>
            <li className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3">
              <span className="flex items-center gap-3"><Activity className="w-5 h-5 text-blue-400" /> Evening Walk</span>
              <span className="text-green-400 font-semibold">+150 cal</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// --- Main Features Section ---
const MainFeaturesSection = () => {
  const features = [
    { icon: Activity, title: "Smart Tracking", desc: "AI-powered pose detection tracks your workouts in real-time.", color: "from-blue-500 to-cyan-400" },
    { icon: Trophy, title: "Earn Rewards", desc: "Complete challenges and earn points for exclusive rewards.", color: "from-yellow-400 to-orange-500" },
    { icon: Users, title: "Community", desc: "Connect with fitness enthusiasts and compete on leaderboards.", color: "from-purple-500 to-pink-500" },
    { icon: Target, title: "Daily Challenges", desc: "New challenges every day to keep you motivated and engaged.", color: "from-green-400 to-emerald-500" },
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-zinc-900 via-black to-zinc-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.18 } }
          }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="text-yellow-400 font-semibold tracking-widest text-xl uppercase mb-4"
          >Main Features</motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
          >Everything You Need to Get Fit</motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >All the tools you need to stay motivated, track progress, and achieve your fitness goals.</motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center hover:bg-white/10 transition-all duration-300"
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-10 h-10 text-white" />
              </div>
              <div className="font-bold text-white text-2xl mb-3">{feature.title}</div>
              <div className="text-gray-400 text-lg">{feature.desc}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold px-14 py-6 text-2xl rounded-full shadow-2xl transition-all duration-200">
              Start Your Journey <ArrowRight className="ml-3 w-7 h-7" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// --- Testimonials Section ---
const TestimonialsSection = () => {
  const testimonials = [
    { name: "Sarah K.", role: "Lost 20 lbs", text: "FitVibe completely transformed my fitness routine. The AI tracking is incredibly accurate!", avatar: "S" },
    { name: "Mike R.", role: "Marathon Runner", text: "Daily challenges keep me motivated. I've never been more consistent with my workouts.", avatar: "M" },
    { name: "Priya T.", role: "Yoga Enthusiast", text: "The community features are amazing. I love competing with friends on the leaderboard!", avatar: "P" },
  ];

  return (
    <section className="py-32 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="text-yellow-400 font-semibold tracking-widest text-xl uppercase mb-4">Testimonials</div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">Loved by Fitness Enthusiasts</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold text-xl">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white font-bold text-lg">{t.name}</div>
                  <div className="text-yellow-400 text-sm">{t.role}</div>
                </div>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">&quot;{t.text}&quot;</p>
              <div className="flex gap-1 mt-6">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- CTA Section ---
const CTASection = () => (
  <section className="py-24 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 relative overflow-hidden">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="container mx-auto px-4 text-center"
    >
      <h2 className="text-4xl md:text-6xl font-extrabold text-black mb-6">Ready to Transform Your Fitness?</h2>
      <p className="text-xl text-black/70 mb-10 max-w-2xl mx-auto">Join thousands of users who are already crushing their fitness goals with FitVibe.</p>
      <Link href="/login">
        <Button className="bg-black hover:bg-gray-900 text-white font-bold px-14 py-6 text-2xl rounded-full shadow-2xl transition-all duration-200">
          Get Started Free <ArrowRight className="ml-3 w-7 h-7" />
        </Button>
      </Link>
    </motion.div>
  </section>
);

// --- Main Hero Component ---
export const Hero = () => {
  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      {/* 3D Animated Gym Background & Floating Elements */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Hero3DBackground />

        {/* Decorative gradient orbs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-20 right-20 w-72 h-72 bg-yellow-400 rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-40 left-20 w-60 h-60 bg-purple-500 rounded-full blur-[100px] pointer-events-none"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full blur-[150px] pointer-events-none"
        />

        {/* Main Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 pt-32 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 inline-block px-6 py-2 bg-yellow-400/20 border border-yellow-400/30 rounded-full"
            >
              <span className="text-yellow-400 font-semibold tracking-wide text-lg">🔥 AI-Powered Fitness Platform</span>
            </motion.div>

            <h1 className="font-extrabold text-5xl md:text-7xl lg:text-8xl text-white mb-8 tracking-tight leading-tight">
              THE MODERN WAY<br />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent">TO GET FIT</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Track workouts with AI pose detection, earn rewards for consistency, and compete with a global community of fitness enthusiasts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-10 py-6 text-xl rounded-full shadow-2xl transition-all duration-200">
                  Start Free <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
              <Link href="/dashboard/challenges">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold px-10 py-6 text-xl rounded-full transition-all duration-200">
                  View Challenges
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: Activity, label: "AI Pose Detection" },
              { icon: Trophy, label: "Earn Rewards" },
              { icon: TrendingUp, label: "Track Progress" },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl"
              >
                <item.icon className="w-6 h-6 text-yellow-400" />
                <span className="text-white font-medium text-lg">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <StatsSection />

      {/* Features/Goals Section */}
      <FeatureGoalsSection />

      {/* Main Features Section */}
      <MainFeaturesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
};
