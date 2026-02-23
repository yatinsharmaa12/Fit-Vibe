import { LoginForm } from "@/components/auth/login/login-form";
import loginImage from "@/public/login-image.avif";
import logo from "@/public/logo.png";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FitVibe | Login",
  description: "FitVibe",
};



export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col px-6 py-8 sm:px-8 md:px-12 lg:px-16 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {/* Logo */}
        <div className="flex justify-center gap-2 md:justify-start mb-8">
          <Link
            href="/"
            className="flex items-center rounded-lg outline-none font-bold text-3xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all hover:scale-105"
          >
            <Image
              src={logo}
              alt="logo"
              width={50}
              height={50}
              className="mr-3"
            />
            <div className="flex items-center">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                FlexIt
              </span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Out
              </span>
              <span className="text-gray-900 dark:text-white">.</span>
            </div>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© 2026 FlexItOut. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="relative hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 lg:block overflow-hidden">
        <Image
          src={loginImage}
          alt="Login Image"
          className="absolute inset-0 h-full w-full object-cover opacity-90 dark:brightness-[0.7] mix-blend-overlay"
        />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-lg space-y-6 text-center">
            <h2 className="text-4xl font-bold leading-tight">
              Welcome Back to FlexItOut
            </h2>
            <p className="text-lg text-white/90">
              Track your fitness journey, challenge yourself, and achieve your goals with our innovative pose tracking technology.
            </p>
            <div className="flex justify-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-white/80">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-white/80">Workouts Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">100+</div>
                <div className="text-sm text-white/80">Challenges</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
