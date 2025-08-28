import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-navy-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold font-dm-sans text-white mb-4">
            Welcome to RightOffer Dashboard
          </h1>
          <p className="text-white/70 font-dm-sans mb-8">
            Hello, {session.user.email}! Your dashboard is coming soon.
          </p>
          
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="btn-outline-primary px-6 py-3 rounded-lg font-dm-sans font-semibold"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
