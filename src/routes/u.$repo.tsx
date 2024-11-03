import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppLayout } from "../components/Layouts/AppLayout";
import agent from "../lib/api";
import { ProfileHeader } from "../components/Profile/ProfileHeader";

export const Route = createFileRoute("/u/$repo")({
  async loader(ctx) {
    const repo = ctx.params.repo;

    const data = await agent.getProfile({
      actor: repo,
    });

    if (!data.success) {
      throw new Error("Not found ?");
    }

    return data.data;
  },
  shouldReload: true,
  component: () => {
    const data = Route.useLoaderData();
    return (
      <AppLayout mainSize="max-w-5xl">
        <div className="flex flex-col w-full">
          <div className="flex-1">
            {/* Profile Section */}
            <div className="max-w-5xl mx-auto px-2 sm:px-4 relative z-10">
              <div className="bg-[#252526] border border-[#2d2d2d] rounded-lg overflow-hidden">
                <ProfileHeader data={data} />
              </div>
              <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  },
  errorComponent: () => {
    return (
      <AppLayout mainSize="max-w-5xl">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
          <h1 className="text-2xl font-semibold mb-2">Profile Not Found</h1>
          <p className="text-gray-400">
            The profile you're looking for doesn't exist or you may not have
            access to it.
          </p>
        </div>
      </AppLayout>
    );
  },
});
