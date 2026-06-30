import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Image,
  Users,
  CheckSquare,
  UploadCloud,
  FolderHeart,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define links based on roles
  const getLinks = () => {
    if (user?.role === 'admin') {
      return [
        { label: 'Admin Stats', path: '/admin', icon: Home },
        { label: 'Pending Approvals', path: '/admin/approvals', icon: CheckSquare },
        { label: 'Student Directory', path: '/admin/students', icon: GraduationCap },
        { label: 'User Directory', path: '/admin/users', icon: Users },
      ];
    } else if (user?.role === 'teacher') {
      return [
        { label: 'Teacher Hub', path: '/teacher', icon: Home },
        { label: 'Upload Photos', path: '/teacher/upload', icon: UploadCloud },
        { label: 'Manage Albums', path: '/teacher/albums', icon: Image },
      ];
    } else if (user?.role === 'parent') {
      return [
        { label: 'Parent Hub', path: '/parent', icon: Home },
        { label: 'Event Gallery', path: '/parent/gallery', icon: Image },
        { label: 'My Child\'s Photos', path: '/parent/child-photos', icon: FolderHeart },
      ];
    }
    return [];
  };

  const links = getLinks();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-brand-pink text-white';
      case 'teacher':
        return 'bg-brand-orange text-white';
      case 'parent':
        return 'bg-brand-blue text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const isActive = (path) => location.pathname === path;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-brand-navy text-white">
      {/* Brand Logo Header */}
      <div className="flex items-center space-x-3 px-6 py-6 border-b border-indigo-900 bg-brand-navy">
        <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center text-brand-navy font-bold text-xl shadow-md">
          FC
        </div>
        <div>
          <h1 className="font-bold text-base leading-none text-white tracking-wide">FirstCry</h1>
          <span className="text-xs text-brand-yellow font-medium">Intellitots Gallery</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium ${
                isActive(link.path)
                  ? 'bg-brand-yellow text-brand-navy shadow-md font-semibold'
                  : 'text-indigo-200 hover:bg-indigo-900/50 hover:text-white'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive(link.path) ? 'text-brand-navy' : 'text-indigo-300 group-hover:text-white'
                }`}
              />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Session Details */}
      <div className="p-4 border-t border-indigo-900 bg-indigo-950/40">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-indigo-800 flex items-center justify-center font-bold text-brand-yellow text-sm border border-indigo-700">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-semibold truncate text-white">{user?.name}</h4>
            <span className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full mt-0.5 ${getRoleBadge(user?.role)}`}>
              {user?.role}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-indigo-800 text-indigo-200 hover:bg-brand-pink hover:text-white hover:border-brand-pink transition-all duration-200 text-xs font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-brand-lightBg">
      {/* Desktop Sidebar (Left side, permanent) */}
      <aside className="hidden md:block w-64 flex-shrink-0 border-r border-gray-200 shadow-xl fixed top-0 bottom-0 left-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Top Navbar (Header when on mobile screen) */}
      <header className="md:hidden w-full h-16 flex items-center justify-between px-6 bg-brand-navy text-white shadow-md z-30 sticky top-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-brand-yellow flex items-center justify-center text-brand-navy font-bold text-sm">
            FC
          </div>
          <span className="font-bold text-sm tracking-wide">Intellitots</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg bg-indigo-900/50 text-white hover:bg-indigo-900 focus:outline-none"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Sidebar overlay/drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          ></div>
          {/* Drawer content */}
          <div className="relative w-64 max-w-xs flex flex-col h-full bg-brand-navy shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 min-h-[calc(100vh-4rem)] md:min-h-screen flex flex-col justify-between">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-gray-500 border-t border-gray-200/50 pt-4 max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© {new Date().getFullYear()} FirstCry Intellitots Preschool. All rights reserved.</p>
          <div className="flex items-center space-x-1 text-brand-pink font-semibold">
            <Sparkles className="w-3.5 h-3.5 fill-brand-pink" />
            <span>Nurturing Creativity</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default DashboardLayout;
