import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Terminal, FileCode, Settings2 } from "lucide-react";
import { handleSession } from "../lib/api";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4] font-mono">
      <div className="flex flex-col md:flex-row">
        {/* Left sidebar - can be used for file tree or navigation */}
        <div className="hidden md:block w-48 bg-[#252526] border-r border-[#2d2d2d] min-h-screen">
          <div className="p-2">{/* Add sidebar content here */}</div>
        </div>

        <div className="flex-1">
          <header className="bg-[#323233] border-b border-[#2d2d2d] sticky top-0 z-10">
            <div className="px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FileCode className="w-5 h-5 text-[#569cd6]" />
                  <span className="text-sm truncate">
                    CodeSky
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <Terminal className="w-4 h-4 text-[#d4d4d4]" />
                  <Settings2 className="w-4 h-4 text-[#d4d4d4]" />
                </div>
              </div>
            </div>
          </header>

          <main className="p-4">
            <Outlet />
            <ScrollRestoration />
          </main>
        </div>

        {/* Right sidebar - can be used for additional tools or info */}
        <div className="hidden md:block w-48 bg-[#252526] border-l border-[#2d2d2d] min-h-screen">
          <div className="p-2">{/* Add sidebar content here */}</div>
        </div>
      </div>
      <TanStackRouterDevtools />
    </div>
  ),
  beforeLoad: () => {
    handleSession();
  },
});
