import PoseCreation from '@/components/dashboard/pose-creation';

export default function AddPosePage() {
  return (
    <main className="p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-4xl font-black text-transparent">
            Add New Pose
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-zinc-400">
            Upload an image to create a custom pose for your workouts.
          </p>
        </div>
        <div className="max-w-3xl">
          <PoseCreation />
        </div>
      </div>
    </main>
  );
}
