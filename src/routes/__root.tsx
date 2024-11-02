import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { PlusSquare, FileCode, Settings2 } from "lucide-react";
import { handleSession } from "../lib/api";
import { Modal } from "../components/Common/Modal";
import { useAtom } from "jotai";
import { atomEditor } from "../store/editor";
import { CodeEditor } from "../components/Common/CodeEditor";

export const Route = createRootRoute({
  component: () => {
    const [newModal, setNewModal] = useAtom(atomEditor);

    return (
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
                    <span className="text-sm truncate">CodeSky</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button onClick={() => setNewModal({ show: true })}><PlusSquare className="w-4 h-4 text-[#d4d4d4]" /></button>
                    <button><Settings2 className="w-4 h-4 text-[#d4d4d4]" /></button>
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

        <Modal
          isOpen={newModal.show}
          onClose={() => {
            setNewModal({
              show: false,
            });
          }}
        >
          <CodeEditor 
             cid={newModal.cid}
             quotePost={newModal.quotePost}
             post={newModal.post}
          />
        </Modal>
      </div>
    );
  },
  beforeLoad: () => {
    handleSession();
  },
});