import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { useCallback } from "react";
import { CodePost } from "./CodePost";

type Props = {
  feeds: any;
  isProfile?: boolean;
  hideReplies?: boolean;
  onlyReplies?: boolean;
};

export const PostRender = ({
  feeds,
  hideReplies,
  isProfile,
  onlyReplies,
}: Props) => {
  const _sortPosts: any | FeedViewPost = useCallback(() => {
    // @ts-ignore
    return feeds
      ?.reduce((p1: any, p2: FeedViewPost) => {
        const postExists = p1.find(
          (i: { post: { cid: string } }) => i.post.cid == p2.post.cid
        );
        if (p2.reply && !p2.randomness) {
          p2.randomness = Math.random();
        }

        if (
          postExists ||
          (!isProfile &&
            p2.reply &&
            p2.reply.parent?.cid == p2.reply.root?.cid &&
            //@ts-ignore
            p2.reply.parent?.author?.did == p2.reply.root?.author?.did) ||
          (hideReplies && p2.reply) ||
          (onlyReplies && !p2.reply)
        ) {
          return [...p1];
        }
        return [...p1, p2];
      }, [])
      .filter(
        (value: any, index: number, self: any[]) =>
          index ===
          self.findIndex(
            (p) =>
              p.post.cid == value.post.cid ||
              p.reply?.root.cid == value.post.cid ||
              p.reply?.parent.cid == value.post.cid ||
              (p.reply?.root.cid == value.reply?.root.cid &&
                p.reply?.parent.cid != value.reply?.parent.cid)
          )
      );
  }, [feeds]);

  return (
    <>
      {_sortPosts()
        .filter((post: any) => !post?.blocked)
        .map((post: FeedViewPost) => {
          return <CodePost key={post.post.cid} post={post} />;
        })}
    </>
  );
};
