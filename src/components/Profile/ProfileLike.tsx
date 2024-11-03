import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import agent from "../../lib/api";
import { PostRender } from "../Common/PostRender";
import { GitCloneLoading } from "../Common/Loading";
import { useEffect } from "react";

type Props = {
  did: string;
};

export const ProfileLike = ({ did }: Props) => {
  const { ref, inView } = useInView();
  const { data, status, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["getUserProfileLike", did],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    initialPageParam: "",
    queryFn: async ({ pageParam = "" }) => {
      const feeds = await agent.com.atproto.repo.listRecords({
        collection: "app.bsky.feed.like",
        repo: did!,
        cursor: pageParam,
        limit: 25,
      });
      return feeds;
    },
    getNextPageParam: (lastPage: any) => {
      return lastPage.data.cursor ?? undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === "pending") {
    return <GitCloneLoading />;
  }

  if (status === "error") {
    return <div>Error fetching feeds</div>;
  }

  return (
    <div className="p-2 mx-auto">
      <div className="!space-y-4">
        {data?.pages.map((page, i) => (
          <PostRender key={i} feeds={page.data.feed} />
        ))}
      </div>
      <div ref={ref} className="h-10" />
    </div>
  );
};
