import { LayoutDashboard, BarChart3, Users, Settings, TrendingUp, Menu, X, BookOpen } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'overview', label: 'Overview Board', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'management', label: 'Student Management', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-slate-100"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 transition-all duration-300 z-40 ${
          isOpen ? 'w-64' : 'w-20 lg:w-64'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-20 border-b border-slate-700">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <span className={`ml-3 font-bold text-slate-100 ${isOpen ? 'lg:block' : 'hidden lg:block'}`}>
            SPD
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className={`${isOpen ? 'lg:block' : 'hidden lg:block'} whitespace-nowrap`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700 p-4">
          <div className={`text-xs text-slate-400 ${isOpen ? 'lg:block' : 'hidden lg:block'}`}>
            <p className="font-semibold text-slate-300 mb-1">Version 1.0</p>
            <p>Student Performance Dashboard</p>
          </div>
        </div>
      </aside>
    </>
  );
}
