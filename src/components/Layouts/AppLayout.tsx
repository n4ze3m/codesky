import { useAtom } from "jotai";
import { atomEditor } from "../../store/editor";
import {
  Bell,
  FileCode,
  Home,
  LogOut,
  Menu,
  PlusSquare,
  User,
} from "lucide-react";
import React from "react";
import { Modal } from "../Common/Modal";
import { CodeEditor } from "../Common/CodeEditor";
import { isAuthenticated } from "../../utils/auth";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
const ActivityBarItem = ({
  icon: Icon,
  label,
  isActive = false,
  href,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
  onClick?: () => void;
}) => (
  <div className="relative group">
    {onClick ? (
      <button
        onClick={onClick}
        className={`p-3 w-full flex justify-center ${isActive ? "border-l-2 border-[#569cd6] md:border-l-2" : "border-l-2 border-transparent"}`}
      >
        <Icon
          className={`w-6 h-6 ${isActive ? "text-[#569cd6]" : "text-[#858585] group-hover:text-[#d4d4d4]"}`}
        />
      </button>
    ) : (
      <Link
        to={href}
        className={`p-3 w-full flex justify-center ${isActive ? "border-l-2 border-[#569cd6] md:border-l-2" : "border-l-2 border-transparent"}`}
      >
        <Icon
          className={`w-6 h-6 ${isActive ? "text-[#569cd6]" : "text-[#858585] group-hover:text-[#d4d4d4]"}`}
        />
      </Link>
    )}
    <div className="hidden md:group-hover:block absolute left-16 top-1/2 -translate-y-1/2 z-50">
      <div className="bg-[#252526] text-[#d4d4d4] text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
        {label}
      </div>
    </div>
  </div>
);
const navLinks = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: PlusSquare, label: "New Post", href: "/new" },
  // { icon: LogOut, label: "Logout", href: "/logout", isActive: false }
];
export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [newModal, setNewModal] = useAtom(atomEditor);
  const [activeTab, setActiveTab] = React.useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  React.useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: "/login" });
    }
  }, [navigate]);
  return (
    <>
      <div className="flex h-screen bg-[#1e1e1e] text-[#d4d4d4] overflow-hidden">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 h-14 bg-[#333333] flex items-center justify-between px-4 md:hidden z-50">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            <Menu className="w-6 h-6 text-[#d4d4d4]" />
          </button>
          <div className="flex items-center space-x-2">
            <FileCode className="w-6 h-6 text-[#569cd6]" />
            <span className="font-semibold">CodeSky</span>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 text-sm text-[#858585]"
          >
            Feed
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity md:hidden ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <div
            className={`w-64 h-full bg-[#333333] transform transition-transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="p-4 space-y-4">
              {navLinks.map((n) => (
                <ActivityBarItem
                  href={n.href}
                  icon={n.icon}
                  isActive={pathname === n.href}
                  label={n.label}
                />
              ))}

              <ActivityBarItem
                icon={LogOut}
                href="logout"
                label="Logout"
                isActive={false}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
        </div>

        {/* Desktop Activity Bar */}
        <div className="hidden md:flex w-12 bg-[#333333] flex-col items-center">
          <div className="w-full py-3 flex justify-center relative group">
            <FileCode className="w-6 h-6 text-[#569cd6]" />
            <div className="hidden group-hover:block absolute left-16 top-1/2 -translate-y-1/2 z-50">
              <div className="bg-[#252526] text-[#d4d4d4] text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap font-semibold">
                CodeSky
              </div>
            </div>
          </div>

          <div className="flex-1 w-full pt-4 border-t border-[#252526]">
            {navLinks.map((n) => (
              <ActivityBarItem
                href={n.href}
                icon={n.icon}
                isActive={pathname === n.href}
                label={n.label}
              />
            ))}
          </div>
          <div className="mb-4">
            <ActivityBarItem
              href=""
              isActive={false}
              onClick={() => {}}
              icon={LogOut}
              label="Logout"
            />
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 no-scrollbar overflow-y-auto mt-14 md:mt-0">
          <div className="max-w-4xl mx-auto p-4 md:p-6">
            <div className="space-y-4">
              {children}
              {/* {isLoading ? (
                <GitCloneLoading />
              ) : (
                <>
                  <article className="bg-[#1e1e1e] border border-[#2d2d2d] rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <img
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
                        alt="User avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-[#569cd6] truncate">
                            Sarah Developer
                          </h3>
                          <span className="text-xs text-[#6b6b6b] truncate">
                            @sarahdev
                          </span>
                        </div>
                        <p className="mt-2 text-sm">
                          Just deployed my first React app! 🚀 The journey of a
                          thousand miles begins with a single commit. #coding
                          #webdev
                        </p>
                        <div className="mt-3 text-xs text-[#6b6b6b]">
                          2 hours ago
                        </div>
                      </div>
                    </div>
                  </article>

                  <article className="bg-[#1e1e1e] border border-[#2d2d2d] rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                        alt="User avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-[#569cd6] truncate">
                            John Coder
                          </h3>
                          <span className="text-xs text-[#6b6b6b] truncate">
                            @johncoder
                          </span>
                        </div>
                        <p className="mt-2 text-sm">
                          Here's a cool VS Code trick I learned today: Use `Ctrl
                          + K Z` for Zen Mode! 🧘‍♂️ #vscode #productivity
                        </p>
                        <div className="mt-3 text-xs text-[#6b6b6b]">
                          5 hours ago
                        </div>
                      </div>
                    </div>
                  </article>
                </>
              )} */}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Desktop always visible, Mobile slide-in */}
        {/* <div
          className={`fixed inset-y-0 right-0 w-64 bg-[#252526] border-l border-[#1e1e1e] transform transition-transform md:relative md:translate-x-0 ${
            isMobileSidebarOpen ? "translate-x-0" : "translate-x-full"
          } md:block z-30 ${isMobileSidebarOpen ? "mt-14" : ""} md:mt-0`}
        >
            xxx
        </div> */}
      </div>
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
    </>
  );
};
