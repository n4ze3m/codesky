import { Link, useLocation } from "@tanstack/react-router";
import { toCamelCase } from "../../utils/to-camelcase";
import { ProfileViewDetailed } from "@atproto/api/src/client/types/app/bsky/actor/defs";
import agent from "../../lib/api";
interface ProfileHeaderProps {
  data: ProfileViewDetailed;
}

const MetricsDetails = ({
  onClick,
  label,
  value,
}: {
  label: string;
  value: number | string;
  onClick: () => void;
}) => {
  return (
    <button className="hover:underline gap-1 inline-flex items-center">
      <span className="syntax-function text-xs sm:text-sm md:text-base">
        {label}:
      </span>
      <span className="syntax-number text-xs sm:text-sm md:text-base">
        {value}
      </span>
    </button>
  );
};

const NavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  const { pathname } = useLocation();
  return (
    <Link
      to={to}
      className={`px-2 sm:px-4 py-1 sm:py-2 hover:bg-[#2d2d2d] rounded-md transition-colors duration-200 font-mono text-xs sm:text-sm whitespace-nowrap ${pathname === to ? "bg-[#2d2d2d]" : ""}`}
    >
      {children}
    </Link>
  );
};

export function ProfileHeader({ data }: ProfileHeaderProps) {
  const {
    avatar,
    description: bio = "",
    displayName: name,
    handle,
    viewer,
    followersCount,
    followsCount,
    postsCount,
    did,
  } = data;

  const handleFollow = async () => {
    try {
      await agent.follow(did);
      window.location.reload();
    } catch (error) {
      console.error("Failed to follow:", error);
    }
  };

  const handleUnFollow = async () => {
    try {
      await agent.deleteFollow(viewer?.following || "");
      window.location.reload();
    } catch (error) {
      console.error("Failed to unfollow:", error);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-[#1e1e1e] rounded-lg">
      <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 md:gap-6">
          <div className="flex-shrink-0 relative">
            <img
              src={avatar}
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-lg border-4 border-[#569cd6] shadow-xl hover:border-[#4e8cc2] transition-all duration-300 transform hover:scale-105"
            />
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col items-center sm:items-start gap-2 sm:gap-3">
              <div className="text-center flex flex-col sm:flex-row sm:text-left w-full gap-2 sm:gap-0 sm:justify-between">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-1 sm:space-y-0 sm:space-x-2">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#569cd6] flex items-center gap-2 font-mono">
                    <span className="text-[#d4d4d4]">{`const `}</span>
                    {toCamelCase(name ?? "")}
                    <span className="text-[#d4d4d4]">{` = `}</span>
                  </h1>
                  <div className="text-[#4ec9b0] font-mono text-sm sm:text-base mt-0 sm:mt-1">
                    @{handle}
                  </div>
                </div>
                <div className="w-full sm:w-auto">
                  {viewer?.following ? (
                    <button
                      onClick={handleUnFollow}
                      className="w-full sm:w-auto bg-[#dc2626] text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-md hover:bg-[#b91c1c] transition-all duration-300 font-mono transform hover:scale-105 text-sm sm:text-base"
                    >
                      {`unfollow()`}
                    </button>
                  ) : (
                    <button
                      onClick={handleFollow}
                      className="w-full sm:w-auto bg-[#22c55e] text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-md hover:bg-[#16a34a] transition-all duration-300 font-mono transform hover:scale-105 text-sm sm:text-base"
                    >
                      {`follow()`}
                    </button>
                  )}
                </div>
              </div>

              <div className="w-full">
                <pre className="text-[#608B4E] whitespace-pre-line bg-[#2a2a2a] p-2 sm:p-3 rounded-md text-xs sm:text-sm md:text-base">
                  {`/**\n * ${bio}\n */`}
                  <span className="animate-pulse text-[#569cd6]">█</span>
                </pre>
              </div>

              <div className="p-2 border-t border-[#2d2d2d] w-full">
                <div className="text-[#608B4E] mb-2 text-xs sm:text-sm">
                  // User stats
                </div>
                <div className="gap-2 flex flex-wrap items-center text-xs sm:text-sm">
                  <span className="syntax-keyword">const</span>
                  <span className="text-[#d4d4d4]"> metrics </span>
                  <span className="syntax-operator">=</span>
                  <span className="text-[#d4d4d4]"> {`{ `}</span>
                  <MetricsDetails
                    label="followers"
                    value={followersCount || 0}
                    onClick={() => {}}
                  />
                  <span className="text-[#d4d4d4]">, </span>
                  <MetricsDetails
                    label="following"
                    value={followsCount || 0}
                    onClick={() => {}}
                  />
                  <span className="text-[#d4d4d4]">, </span>
                  <MetricsDetails
                    label="posts"
                    value={postsCount || 0}
                    onClick={() => {}}
                  />
                  <span className="text-[#d4d4d4]"> {`}`}</span>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 border-t border-[#2d2d2d] pt-3 sm:pt-4 w-full">
                <div className="flex gap-1 sm:gap-2 overflow-x-auto">
                  <NavLink to={`/u/${handle}`}>posts()</NavLink>
                  <NavLink to={`/u/${handle}/replies`}>replies()</NavLink>
                  {/* <NavLink to={`/u/${handle}/like`}>likes()</NavLink> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
