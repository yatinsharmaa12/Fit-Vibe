import UpdateProfileForm from '@/components/dashboard/profile-management';

export default function ProfilePage() {
  return (
    <main className="p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-4xl font-black text-transparent">
            Manage Profile
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-zinc-400">
            Update your profile details here.
          </p>
        </div>
        <UpdateProfileForm />
      </div>
    </main>
  );
}
