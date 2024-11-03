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
import agent, { SESSION_LOCAL_STORAGE_KEY } from "../../lib/api";
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
  mainSize?: string;
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
  { icon: Home, type: "home", label: "Home", href: "/" },
  {
    icon: Bell,
    type: "notifications",
    label: "Notifications",
    href: "/notifications",
  },
  { icon: User, type: "profile", label: "Profile", href: "/profile" },
];
export const AppLayout = ({
  children,
  mainSize = "max-w-4xl",
}: {
  children: React.ReactNode;
  mainSize?: string;
}) => {
  const [newModal, setNewModal] = useAtom(atomEditor);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [logoutConfirmation, setLogoutConfirmation] = React.useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  React.useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: "/login" });
    }
  }, [navigate]);

  const handleLoutout = async () => {
    if (logoutConfirmation === "logout") {
      await agent.logout();
      setShowLogoutModal(false);
      localStorage.removeItem(SESSION_LOCAL_STORAGE_KEY);
      navigate({ to: "/login" });
    }
  };
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
                  key={n.label}
                  href={n.href}
                  icon={n.icon}
                  isActive={pathname === n.href}
                  label={n.label}
                />
              ))}

              <ActivityBarItem
                href="/new/compose"
                icon={PlusSquare}
                label="new_post.txt"
                onClick={() => {
                  setNewModal({
                    show: true,
                  });
                }}
                isActive={false}
              />

              <ActivityBarItem
                icon={LogOut}
                href="logout"
                label="Logout"
                isActive={false}
                onClick={() => {
                  setShowLogoutModal(true);
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
                key={n.label}
              />
            ))}
            <ActivityBarItem
              href="/new/compose"
              icon={PlusSquare}
              label="new_post.txt"
              onClick={() => {
                setNewModal({
                  show: true,
                });
              }}
              isActive={false}
            />
          </div>
          <div className="mb-4">
            <ActivityBarItem
              href=""
              isActive={false}
              onClick={() => setShowLogoutModal(true)}
              icon={LogOut}
              label="Logout"
            />
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 no-scrollbar overflow-y-auto mt-14 md:mt-0">
          <div className={`${mainSize} mx-auto p-4 md:p-6`}>
            <div className="space-y-4">{children}</div>
          </div>
        </main>
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
      <Modal
        isOpen={showLogoutModal}
        size="max-w-xl"
        onClose={() => setShowLogoutModal(false)}
        title="Are you sure you want to logout?"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#858585]">
            Please type{" "}
            <span className="font-semibold text-[#d4d4d4]">logout</span> to
            confirm.
          </p>
          <input
            type="text"
            value={logoutConfirmation}
            onChange={(e) => setLogoutConfirmation(e.target.value)}
            className="w-full bg-[#2d2d2d] border border-[#3d3d3d] rounded px-3 py-2 focus:outline-none focus:border-[#569cd6]"
            placeholder="Type 'logout' to confirm"
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="px-4 py-2 text-sm text-[#d4d4d4] hover:bg-[#2d2d2d] rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleLoutout}
              disabled={logoutConfirmation !== "logout"}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
