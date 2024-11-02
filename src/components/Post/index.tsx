import { useRef, useState } from "react";
import agent from "../../lib/api";
import { useQuery } from "@tanstack/react-query";
import { GitCloneLoading } from "../Common/Loading";
import { CodePost } from "../Common/CodePost";

type Props = {
  repo: string;
  cid: string;
};

export const Post = ({ repo, cid }: Props) => {
  const parentsInitRef = useRef<any>(false);
  const [parents, setParents] = useState<React.ReactNode[]>([]);

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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["fetchPost", repo, cid],
    queryFn: () => fetchPostInfo({}),
  });

  if (isLoading) {
    return <GitCloneLoading />;
  }

  if (isError) {
    return <div>Error fetching post</div>;
  }

  if (data?.data?.thread?.blocked) {
    return <div>This post is blocked</div>;
  }

  return (
    <>
      <CodePost
        post={{
          post: data?.data?.thread?.post as any,
        }}
      />
      {data?.data?.thread?.replies
        //@ts-ignore
        ?.filter((p: any) => !p.blocked)
        .map((reply: any) => {
          return (
            <CodePost
              key={reply?.post?.cid}
              post={{
                post: reply?.post,
              }}
            />
          );
        })}
    </>
  );
};
