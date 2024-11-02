import { FeedViewPost, PostView } from '@atproto/api/src/client/types/app/bsky/feed/defs';

import { StarIcon } from "lucide-react";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import agent from "../../lib/api";

type Props = {
  post: FeedViewPost | PostView;
};

export const Star = (props: Props) => {
  const { post } = props;
  const [liked, setLiked] = useState<boolean>(
    typeof (post.viewer as any)?.like != "undefined"
  );
  const [likeUri, setLikeUri] = useState<boolean | string>(
    (post.viewer as any)?.like || ""
  );
  const [likeCount, setLikeCount] = useState<number>(post.likeCount as number);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLikeCount(post.likeCount as number);
    setLiked((post.viewer as any)?.like);
    setLikeUri((post.viewer as any)?.like);
  }, [post.likeCount, (post.viewer as any)?.like]);

  const handleLike = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (loading) return;
      // @ts-ignore
      setLiked((prev) => !prev);
      setLoading(true);
      const currentLikeCount = likeCount;
      if (!liked) {
        setLikeCount(currentLikeCount + 1);
        try {
          const result = await agent.like(
            post.uri as string,
            post.cid as string
          );
          setLikeUri(result.uri);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLikeCount(currentLikeCount);
        }
      } else {
        setLikeCount((prev) => prev - 1);
        try {
          await agent.deleteLike(likeUri as string);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLikeCount(currentLikeCount);
        }
      }
    },
    [liked, likeCount, likeUri, loading]
  );
  return (
    <button
      onClick={handleLike}
      className="hover:underline gap-1 inline-flex items-center"
    >
      <StarIcon
        className={`inline w-4 h-4 sm:w-5 sm:h-5 ${liked ? "text-yellow-500 fill-yellow-500" : ""}`}
      />
      <span className="syntax-function text-sm sm:text-base">stars:</span>
      <span className="syntax-number text-sm sm:text-base">{likeCount}</span>
    </button>
  );
};
