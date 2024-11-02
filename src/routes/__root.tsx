import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { handleSession } from "../lib/api";

export const Route = createRootRoute({
  component: () => {

    return (
      <>
        <Outlet />
        <ScrollRestoration />
        <TanStackRouterDevtools />
      
      </>
    );
  },
  beforeLoad: () => {
    handleSession();
  },
});
