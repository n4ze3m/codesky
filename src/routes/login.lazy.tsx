import { createLazyFileRoute } from "@tanstack/react-router";
import { Login } from "../components/Auth/Login";

export const Route = createLazyFileRoute("/login")({
  component: Login,
});
