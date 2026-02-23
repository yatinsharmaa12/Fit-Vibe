import { Footer } from "@/components/Landing/Footer";
import { Hero } from "@/components/Landing/Hero";
import { Navbar } from "@/components/Landing/Navbar";
import { Suspense } from "react";

// Loading fallback for Hero section
function HeroSkeleton() {
  return (
    <div className="min-h-screen bg-black animate-pulse">
      <div className="container mx-auto px-4 py-20">
        <div className="h-12 bg-gray-800 rounded w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-800 rounded w-1/2"></div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<HeroSkeleton />}>
        <Hero />
      </Suspense>
      <Footer/>
    </>
  );
}
