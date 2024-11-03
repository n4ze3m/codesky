import { useRef, useState, useEffect } from "react";
import agent from "../../lib/api";
import { useQuery } from "@tanstack/react-query";
import { GitCloneLoading } from "../Common/Loading";
import { CodePost } from "../Common/CodePost";
import {
  GitBranch,
  GitCommit,
  GitFork,
  GitMerge,
  GitPullRequest,
  Code,
  ChevronLeftCircleIcon,
  Terminal,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  repo: string;
  cid: string;
};

export const Post = ({ repo, cid }: Props) => {
  const mainPostRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchPostInfo = async ({ uri }: { uri?: string }) => {
    if (repo?.startsWith("did")) {
      return await agent.getPostThread({
        uri: uri || `at://${repo}/app.bsky.feed.post/${cid}`,
      });
    }
    const did = await agent.resolveHandle({ handle: repo });
    return await agent.getPostThread({
      uri: uri || `at://${did.data.did}/app.bsky.feed.post/${cid}`,
    });
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

    const parentPosts = mainPost.data.thread.parent
      ? _generateParents(mainPost.data.thread.parent)
      : [];

    return { ...mainPost, parentPosts };
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["fetchPost", repo, cid],
    queryFn: fetchPost,
  });

  useEffect(() => {
    mainPostRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [data]);

  if (isLoading) {
    return <GitCloneLoading name="post" />;
  }

  if (isError) {
    return (
      <div className="bg-[#1e1e1e] border-l-4 border-red-500 p-4 rounded-md font-mono">
        <Code className="inline mr-2 text-red-500" size={16} />
        <span className="text-red-500">
          Error: Failed to fetch repository data
        </span>
      </div>
    );
  }

  if (data?.data?.thread?.blocked) {
    return (
      <div className="bg-[#1e1e1e] border-l-4 border-yellow-500 p-4 rounded-md font-mono">
        <GitPullRequest className="inline mr-2 text-yellow-500" size={16} />
        <span className="text-yellow-500">Repository access blocked</span>
      </div>
    );
  }

  return (
    <div className="bg-[#1e1e1e] text-[#d4d4d4] p-6 rounded-lg shadow-xl font-mono">
      <button
        onClick={() =>
          navigate({
            to: "/",
          })
        }
        className="mb-4 border-b flex items-center text-[#569cd6] hover:text-[#6bafef] transition-colors"
      >
        <Terminal className="mr-2" size={16} />
        <span className="text-sm text-white">cd ..</span>
      </button>

      {/* Parent thread history */}
      <div className="border-l-2 border-[#464646] pl-4 mb-6">
        {/* @ts-ignore */}
        {data?.parentPosts?.length > 0 && (
          <div className="opacity-90">
            <div className="text-[#569cd6] mb-3 flex items-center">
              <GitFork className="mr-2" size={16} />
              <span className="text-sm">// Parent thread history</span>
            </div>
            {data?.parentPosts.map((p, idx) => (
              <div key={idx} className="mb-3 relative">
                <div className="absolute -left-5 h-full w-px bg-[#464646]" />
                <CodePost post={{ post: p }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main post */}
      <div
        ref={mainPostRef}
        className="border-2 border-[#569cd6] p-4 rounded-md mb-6 bg-[#1a1a1a]"
      >
        <div className="text-[#569cd6] mb-3 flex items-center">
          <GitCommit className="mr-2" size={16} />
          <span className="text-sm">// Current commit</span>
        </div>
        <CodePost
          post={{
            post: data?.data?.thread?.post as any,
          }}
        />
      </div>

      {/* Replies */}
      <div className="border-l-2 border-[#464646] pl-4">
        <div className="text-[#569cd6] mb-3 flex items-center">
          <GitBranch className="mr-2" size={16} />
          <span className="text-sm">// Branch responses</span>
        </div>
        {/* @ts-ignore */}
        {data?.data?.thread?.replies?.filter((p: any) => !p.blocked).length >
        0 ? (
          data?.data?.thread?.replies
            //@ts-ignore
            ?.filter((p: any) => !p.blocked)
            .map((reply: any) => (
              <div key={reply?.post?.cid} className="mb-3 relative">
                <div className="absolute -left-5 h-full w-px bg-[#464646]" />
                <CodePost post={{ post: reply?.post }} />
              </div>
            ))
        ) : (
          <div className="text-[#6a9955] italic">
            <GitMerge className="inline mr-2" size={16} />
            // No branches yet. Be the first to fork this thread!
          </div>
        )}
      </div>
    </div>
  );
};
