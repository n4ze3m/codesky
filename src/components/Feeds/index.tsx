import { useInfiniteQuery } from "@tanstack/react-query";
import agent from "../../lib/api";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { PostRender } from "../Common/PostRender";

export const Feeds = () => {
  const { ref, inView } = useInView();
  const { data, status, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["userFeeds"],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    initialPageParam: "",
    queryFn: async ({ pageParam = "" }) => {
      const feeds = await agent.getTimeline({
        algorithm: "reverse-chronological",
        cursor: pageParam,
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
    return <div>Loading...</div>;
  }
  if (status === "error") {
    return <div>Error fetching feeds</div>;
  }

  return (
    <div className="p-2 mx-auto max-w-3xl">
      {data?.pages.map((page, i) => (
        <div className="space-y-3 mb-3" key={i}>
          <PostRender feeds={page.data.feed} />
        </div>
      ))}
      <div ref={ref} className="h-10" />
    </div>
  );
};
