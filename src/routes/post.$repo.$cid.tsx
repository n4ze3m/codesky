import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "../components/Layouts/AppLayout";
import { Post } from "../components/Post";

export const Route = createFileRoute("/post/$repo/$cid")({
  component: () => {
    const { cid, repo } = Route.useParams();
    return (
      <AppLayout>
        <Post repo={repo} cid={cid} />
      </AppLayout>
    );
  },
});
