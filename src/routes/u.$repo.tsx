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
  component: () => {
    const data = Route.useLoaderData();
    return (
      <AppLayout mainSize="max-w-5xl">
        <div className="flex">
          <div className="flex-1">
            {/* Profile Section */}
            <div className="max-w-5xl mx-auto px-4  relative z-10">
              <div className="bg-[#252526] border border-[#2d2d2d] rounded-lg overflow-hidden">
                <ProfileHeader data={data} />
                {/* <ProfileHeader typedBio={typedBio} />
                <ProfileTabs
                  activeTab={activeTab}
                  onTabChange={(tab) => setActiveTab(tab as Tab)}
                /> */}
              </div>

              {/* Content */}
              <div className="mt-6 space-y-6">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  },
});
