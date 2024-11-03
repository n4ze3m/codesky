import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Feeds } from "../components/Feeds";
import { isAuthenticated } from "../utils/auth";
import { AppLayout } from "../components/Layouts/AppLayout";
import { RightSidebar } from "../components/Feeds/RightSidebar";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  
  return (
    <AppLayout 
      rightSidebar={<RightSidebar />}
    >
      <Feeds />
    </AppLayout>
  );
}
