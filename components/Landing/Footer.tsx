import Image from "next/image";
import logo from "@/public/logo.png";
import Link from "next/link";
import { Github, Twitter, Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <Image src={logo} alt="FitVibe logo" height={45} className="mr-3" />
              <span className="text-white font-bold text-2xl">
                Fit<span className="text-yellow-400">Vibe</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transform your fitness journey with AI-powered tracking, daily challenges, and a supportive community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/challenges" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Challenges
                </Link>
              </li>
              <li>
                <Link href="/dashboard/rewards" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Rewards
                </Link>
              </li>
              <li>
                <Link href="/dashboard/leaderboard" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com/Aryainguz/fitvibe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold mb-6">Connect</h4>
            <div className="flex gap-4 mb-6">
              <a
                href="https://github.com/Aryainguz/fitvibe"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:bg-yellow-400 hover:text-black transition-all duration-200"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:bg-yellow-400 hover:text-black transition-all duration-200"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:bg-yellow-400 hover:text-black transition-all duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:bg-yellow-400 hover:text-black transition-all duration-200"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Stay updated with our latest features and challenges.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} FitVibe. Made with ❤️ by Aryan and Ayush.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-gray-500 hover:text-yellow-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-500 hover:text-yellow-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
