import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import agent from "../../lib/api";
import { PostRender } from "../Common/PostRender";
import { GitCloneLoading } from "../Common/Loading";
import { useEffect } from "react";

type Props = {
  did: string;
  key?: string;
  hideReplies?: boolean;
};

export const ProfilePosts = ({
  did,
  key = "getUserPosts",
  hideReplies,
}: Props) => {
  const { ref, inView } = useInView();
  const { data, status, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: [key, did],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    initialPageParam: "",
    queryFn: async ({ pageParam = "" }) => {
      const feeds = await agent.getAuthorFeed({
        cursor: pageParam,
        actor: did,
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
          <PostRender
            key={i}
            feeds={page.data.feed}
            hideReplies={hideReplies}
          />
        ))}
      </div>
      <div ref={ref} className="h-10" />
    </div>
  );
};
