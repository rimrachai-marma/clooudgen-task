import { getProfile } from "@/lib/actions/users";

export default async function Home() {
  const user = await getProfile();
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <h1 className="font-bold text-5xl mt-12">User Profile</h1>
      <div>
        <h1 className="text-lg font font-semibold">{user?.name}</h1>
        <p>{user?.email}</p>
        <p>{user?.role}</p>
      </div>
    </div>
  );
}
