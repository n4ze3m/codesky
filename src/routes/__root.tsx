import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { handleSession } from "../lib/api";

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <Outlet />
        <ScrollRestoration />
      </>
    );
  },
  beforeLoad: () => {
    handleSession();
  },
});
