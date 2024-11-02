import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Feeds } from "../components/Feeds";
import { isAuthenticated } from "../utils/auth";
import { AppLayout } from "../components/Layouts/AppLayout";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  
  return (
    <AppLayout>
      <Feeds />
    </AppLayout>
  );
}
