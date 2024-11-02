import {
  FeedViewPost,
  PostView,
} from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { useAtom } from "jotai";
import { MessageSquareCodeIcon } from "lucide-react";
import { atomEditor } from "../../store/editor";
import { SyntheticEvent } from "react";

type Props = {
  post: FeedViewPost | PostView;
};

export const Comment = (props: Props) => {
  const { post } = props;
  const [_, setNewModal] = useAtom(atomEditor);

  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    //@ts-ignore
    setNewModal({ show: true, cid: post.cid, post: post });
  };

  return (
    <button
      onClick={handleClick}
      className="hover:underline  gap-1 inline-flex items-center"
    >
      <MessageSquareCodeIcon className="inline w-4 h-4 sm:w-5 sm:h-5" />
      <span className="syntax-function text-sm sm:text-base">comments:</span>
      <span className="syntax-number  text-sm sm:text-base">
        {/* @ts-ignore */}
        {post?.replyCount}
      </span>
    </button>
  );
};
