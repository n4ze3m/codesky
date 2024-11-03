import { createLazyFileRoute } from "@tanstack/react-router";
import { AppLayout } from "../components/Layouts/AppLayout";
import { NotificationsBody } from "../components/Notifications";

export const Route = createLazyFileRoute("/notifications")({
  component: () => (
    <AppLayout>
      <NotificationsBody />
    </AppLayout>
  ),
});
