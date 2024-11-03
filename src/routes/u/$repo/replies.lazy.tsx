import { createLazyFileRoute } from "@tanstack/react-router";
import { ProfilePosts } from "../../../components/Profile/ProfilePost";

export const Route = createLazyFileRoute("/u/$repo/replies")({
  component: () => <ProfileRepliesView />,
});

function ProfileRepliesView() {
  const { repo } = Route.useParams();

  return (
    <div>
      <div className="bg-[#1e1e1e] rounded-lg shadow-lg">
        <div className="px-4 py-2 border-b border-[#2d2d2d] font-mono">
          <span className="text-[#569cd6]">const</span>
          <span className="text-[#4ec9b0]"> tabs</span>
          <span className="text-[#d4d4d4]"> = [</span>
          <span className="text-[#ce9178]">'replies'</span>
          <span className="text-[#d4d4d4]">];</span>
        </div>
        <div>
          <ProfilePosts key="getUserReplies" did={repo} hideReplies={false} />
        </div>
      </div>
    </div>
  );
}
