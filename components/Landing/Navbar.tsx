"use client";

import logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-white/10 py-4"
            : "bg-transparent py-6"
          }`}
      >
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between relative">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="flex items-center rounded outline-none font-bold text-2xl focus:ring-yellow-400 focus:ring-offset-2"
              >
                <Image
                  src={logo}
                  alt="FitVibe logo"
                  width={50}
                  height={50}
                  className="mr-3"
                />
                <div className="flex text-white">
                  Fit<span className="text-yellow-400">Vibe</span>
                </div>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                type="button"
                className="text-white hover:text-yellow-400 transition-colors z-50 p-2"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-7 h-7" />
                ) : (
                  <Menu className="w-7 h-7" />
                )}
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:space-x-8">
              <a
                href="https://github.com/Aryainguz/fitvibe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Contribute
              </a>
              <Link
                href="/dashboard/challenges"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Challenges
              </Link>
              <Link
                href="/dashboard/rewards"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Rewards
              </Link>
              <Link
                href="/dashboard/leaderboard"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Leaderboard
              </Link>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex lg:items-center lg:space-x-4">
              <Link href="/login">
                <button className="text-gray-300 hover:text-white transition-colors font-medium px-4 py-2">
                  Login
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-yellow-400/25">
                  Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-xl transform transition-all duration-300 ${isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
          }`}
      >
        <div className="flex flex-col h-full pt-24 pb-8 px-6">
          <nav className="flex flex-col items-center justify-center flex-grow space-y-8">
            <Link
              href="/dashboard/challenges"
              className="text-3xl font-medium text-white hover:text-yellow-400 transition-colors"
              onClick={toggleMobileMenu}
            >
              Challenges
            </Link>
            <Link
              href="/dashboard/rewards"
              className="text-3xl font-medium text-white hover:text-yellow-400 transition-colors"
              onClick={toggleMobileMenu}
            >
              Rewards
            </Link>
            <Link
              href="/dashboard/leaderboard"
              className="text-3xl font-medium text-white hover:text-yellow-400 transition-colors"
              onClick={toggleMobileMenu}
            >
              Leaderboard
            </Link>
            <a
              href="https://github.com/Aryainguz/fitvibe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl font-medium text-white hover:text-yellow-400 transition-colors"
              onClick={toggleMobileMenu}
            >
              Contribute
            </a>

            <div className="pt-8 flex flex-col gap-4 w-full max-w-xs">
              <Link href="/login" onClick={toggleMobileMenu}>
                <button className="w-full text-white border border-white/30 hover:bg-white/10 font-bold px-8 py-4 rounded-full transition-all duration-200">
                  Login
                </button>
              </Link>
              <Link href="/dashboard" onClick={toggleMobileMenu}>
                <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-full transition-all duration-200">
                  Dashboard
                </button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};
