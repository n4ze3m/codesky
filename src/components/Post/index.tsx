import { useRef, useState, useEffect } from "react";
import agent from "../../lib/api";
import { useQuery } from "@tanstack/react-query";
import { GitCloneLoading } from "../Common/Loading";
import { CodePost } from "../Common/CodePost";
import { GitBranch, GitCommit, GitFork } from "lucide-react";
import { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";

type Props = {
  repo: string;
  cid: string;
};

export const Post = ({ repo, cid }: Props) => {
  const parentsInitRef = useRef<any>(false);
  const [parents, setParents] = useState<React.ReactNode[]>([]);
  const mainPostRef = useRef<HTMLDivElement>(null);

  const fetchPostInfo = async ({ uri }: { uri?: any }) => {
    if (repo?.startsWith("did")) {
      const data = await agent.getPostThread({
        uri: uri || `at://${repo}/app.bsky.feed.post/${cid}`,
      });
      return data;
    } else {
      const did = await agent.resolveHandle({
        handle: repo,
      });
      const data = await agent.getPostThread({
        uri: uri || `at://${did.data.did}/app.bsky.feed.post/${cid}`,
      });
      return data;
    }
  };

  const fetchPost = async () => {
    const mainPost = await fetchPostInfo({});

    const _generateParents = (p: any) => {
      const posts: any[] = [];
      if (p.parent) {
        posts.push(..._generateParents(p.parent));
      }
      posts.push(p.post);
      return posts;
    };

    let parentPosts: any = [];
    if (mainPost.data.thread.parent) {
      parentPosts = _generateParents(mainPost.data.thread.parent);
    }

    return { ...mainPost, parentPosts };
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["fetchPost", repo, cid],
    queryFn: () => fetchPost(),
  });

  useEffect(() => {
    if (mainPostRef.current) {
      mainPostRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [data]);

  if (isLoading) {
    return <GitCloneLoading />;
  }

  if (isError) {
    return (
      <div className="text-red-500 bg-[#282c34] p-4 rounded-md">
        <span className="mr-2">❌</span>Error fetching post
      </div>
    );
  }

  if (data?.data?.thread?.blocked) {
    return (
      <div className="text-yellow-500 bg-[#282c34] p-4 rounded-md">
        <span className="mr-2">⚠️</span>This post is blocked
      </div>
    );
  }

  return (
    <div className="bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-lg  overflow-y-auto">
      {/* Git commit-like structure */}
      <div className="border-l-2 border-[#464646] pl-4 mb-4">
        {data?.parentPosts.length > 0 && (
          <div className="opacity-90">
            <div className="text-[#569cd6] mb-2">
              <GitFork className="inline mr-2" size={16} />
              // parent commits
            </div>
            {data?.parentPosts.map((p) => (
              <CodePost
                post={{
                  post: p,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main commit (post) */}
      <div
        ref={mainPostRef}
        className="border-2 border-[#569cd6] p-4 rounded-md mb-4"
      >
        <div className="text-[#569cd6] mb-2">
          <GitCommit className="inline mr-2" size={16} />
          // main commit
        </div>
        <CodePost
          post={{
            post: data?.data?.thread?.post as any,
          }}
        />
      </div>

      {/* Replies as branches */}
      <div className="border-l-2 border-[#464646] pl-4">
        <div className="text-[#569cd6] mb-2">
          <GitBranch className="inline mr-2" size={16} />
          // branches
        </div>
        {data?.data?.thread?.replies
          //@ts-ignore
          ?.filter((p: any) => !p.blocked)
          .map((reply: any) => {
            return (
              <div key={reply?.post?.cid} className="mb-2">
                <CodePost
                  post={{
                    post: reply?.post,
                  }}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};
