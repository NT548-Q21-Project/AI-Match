import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FileText, ClipboardList, LogOut, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../utils";

interface LayoutProps {
  children: React.ReactNode;
  role: "candidate" | "recruiter";
}

const BaseLayout: React.FC<LayoutProps> = ({ children, role }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  const candidateLinks = [
    { name: "My CVs", path: "/candidate/cvs", icon: FileText },
    { name: "Applications", path: "/candidate/applications", icon: ClipboardList },
  ];

  const recruiterLinks: { name: string; path: string; icon: any }[] = [];

  const links = role === "candidate" ? candidateLinks : recruiterLinks;

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo and Desktop Nav */}
            <div className="flex items-center gap-8">
              <Link to={role === "candidate" ? "/candidate/jobs" : "/recruiter/jobs"} className="flex items-center gap-2">
                <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center transform rotate-3">
                  <span className="text-white font-black text-xl">A</span>
                </div>
                <span className="font-black text-2xl text-gray-900 tracking-tighter">AIMatch</span>
              </Link>

              {/* Desktop Menu */}
              <nav className="hidden md:flex items-center gap-2">
                {links.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2",
                        isActive
                          ? "text-emerald-600 bg-emerald-50"
                          : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
                      )}
                    >
                      <link.icon size={18} className={isActive ? "text-emerald-600" : "text-gray-400"} />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* User Profile & Actions */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex flex-col items-end mr-2">
                <span className="text-sm font-bold text-gray-900">{user?.full_name || "User"}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  {user?.role}
                </span>
              </div>
              <div className="relative group">
                <button className="w-10 h-10 rounded-full bg-gray-100 border-2 border-transparent group-hover:border-emerald-500 transition-all overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <User size={20} />
                  </div>
                </button>
                {/* Simple Dropdown on hover context or click */}
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white border border-gray-100 shadow-xl rounded-2xl w-48 overflow-hidden">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl text-gray-600 hover:bg-gray-100"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t border-gray-50 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold",
                      location.pathname === link.path
                        ? "text-emerald-600 bg-emerald-50"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <link.icon size={20} />
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-bold text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export const CandidateLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BaseLayout role="candidate">{children}</BaseLayout>
);

export const RecruiterLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BaseLayout role="recruiter">{children}</BaseLayout>
);

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4">
          <span className="text-white text-3xl font-bold">A</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AIMatch</h1>
        <p className="text-gray-500 mt-2">Intelligent Job Matching Platform</p>
      </div>
      {children}
    </div>
  </div>
);
