import { useInfiniteQuery } from "@tanstack/react-query";
import agent from "../../lib/api";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { PostRender } from "../Common/PostRender";
import { GitCloneLoading } from "../Common/Loading";

export const Feeds = () => {
  const { ref, inView } = useInView();
  const [showLoading, setShowLoading] = useState(true);

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
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 1650);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === "pending" || showLoading) {
    return <GitCloneLoading />;
  }

  if (status === "error") {
    return <div>Error fetching feeds</div>;
  }

  return (
    <div className="p-2 mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-[#858585]">
          <span>feed</span>
          <span>/</span>
          <span className="text-[#d4d4d4]">following</span>
        </div>
      </div>

      <div className="!space-y-4">
        {data?.pages.map((page, i) => (
          <PostRender key={i} feeds={page.data.feed} />
        ))}
      </div>
      <div ref={ref} className="h-10" />
    </div>
  );
};
