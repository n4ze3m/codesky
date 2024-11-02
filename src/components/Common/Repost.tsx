import {
  FeedViewPost,
  PostView,
} from "@atproto/api/src/client/types/app/bsky/feed/defs";

import { GitForkIcon, GitCommitIcon, XCircle } from "lucide-react";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import agent from "../../lib/api";
import { useAtom } from "jotai";
import { atomEditor } from "../../store/editor";

type Props = {
  post: FeedViewPost | PostView;
};

export const Repost = (props: Props) => {
  const { post } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [_, setNewModal] = useAtom(atomEditor);

  const [hasReposted, setHasReposted] = useState(
    typeof (post.viewer as any)?.repost != "undefined"
  );
  const [repostCount, setRepostCount] = useState(post.repostCount as any);
  const [repostUri, setRepostUri] = useState(
    (post.viewer as any)?.repost || ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRepostCount(post.repostCount);
    setHasReposted((post.viewer as any)?.repost);
    setRepostUri((post.viewer as any)?.repost);
  }, [post.repostCount, (post.viewer as any)?.repost]);

  const handleRepost = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (loading) return;
      const currentReposted = hasReposted;
      const currentRepostCount = repostCount as number;
      setDropdownOpen(false);
      setLoading(true);
      setHasReposted((prev) => !prev);
      if (!currentReposted) {
        try {
          setRepostCount(currentRepostCount + 1);
          const result = await agent.repost(
            post.uri as string,
            post.cid as string
          );
          setLoading(false);
          setRepostUri(result.uri);
        } catch (error) {
          console.error(error);
          setRepostCount(currentRepostCount);
        }
      } else {
        try {
          setRepostCount(currentRepostCount - 1);
          await agent.deleteRepost(repostUri);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setRepostCount(currentRepostCount);
        }
      }
    },
    [hasReposted, repostCount, repostUri, loading]
  );

  return (
    <Popover.Root open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <Popover.Trigger asChild>
        <button className="hover:underline gap-1 inline-flex items-center">
          <GitForkIcon
            className={`inline w-4 h-4 sm:w-5 sm:h-5 ${hasReposted ? "text-green-500" : ""}`}
          />
          <span
            className={`syntax-function text-sm sm:text-base ${hasReposted ? "text-green-500" : ""}`}
          >
            reposts:
          </span>
          <span
            className={`syntax-number text-sm sm:text-base ${hasReposted ? "text-green-500" : ""}`}
          >
            {repostCount}
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="rounded-lg bg-[#1e1e1e] shadow-lg p-2 w-48 animate-slideUpAndFade border border-[#323232]"
          sideOffset={5}
        >
          <div className="flex flex-col gap-2">
            <button
              onClick={handleRepost}
              className={`flex items-center gap-2 p-2 hover:bg-[#2d2d2d] rounded-md text-[#cccccc] ${hasReposted ? "text-green-500" : ""}`}
            >
              <GitForkIcon className="w-4 h-4" />
              <span>{hasReposted ? "Reposted" : "Repost"}</span>
            </button>

            <button
              onClick={() => {
                setNewModal({
                  show: true,
                  quotePost: post as any,
                });
              }}
              className="flex items-center gap-2 p-2 hover:bg-[#2d2d2d] rounded-md text-[#cccccc]"
            >
              <GitCommitIcon className="w-4 h-4" />
              <span>Quote Post</span>
            </button>
          </div>

          <Popover.Close className="absolute top-1 right-1 rounded-full p-1 hover:bg-[#2d2d2d] text-[#cccccc]">
            <XCircle className="w-4 h-4" />
          </Popover.Close>

          <Popover.Arrow className="fill-[#1e1e1e]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
