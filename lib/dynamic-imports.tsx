// Dynamic imports for heavy components to reduce initial bundle size
import dynamic from 'next/dynamic';

// Lazy load Three.js and framer-motion heavy components
export const Hero3DBackground = dynamic(
  () => import('@/components/Landing/Hero3DBackground'),
  {
    ssr: false, // Disable SSR for 3D components
    loading: () => (
      <div className="absolute inset-0 bg-black animate-pulse" />
    ),
  }
);

// Lazy load pose detection (TensorFlow is heavy)
export const LiveTracking = dynamic(
  () => import('@/components/dashboard/live-tracking'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading camera...</p>
        </div>
      </div>
    ),
  }
);

// Lazy load exercise creator
export const ExerciseCreator = dynamic(
  () => import('@/components/dashboard/ExerciseCreator'),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
    ),
  }
);
