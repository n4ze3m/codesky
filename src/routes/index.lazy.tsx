import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Feeds } from "../components/Feeds";
import { isAuthenticated } from "../utils/auth";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  if (!isAuthenticated()) {
    return navigate({ to: "/login" });
  }
  return <Feeds />;
}
