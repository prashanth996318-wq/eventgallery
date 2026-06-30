import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Camera,
  ShieldCheck,
  Tag,
  Download,
  ArrowRight,
  FolderHeart,
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const categories = [
    { name: 'Annual Day', desc: 'Stage plays, dance recitals, and musical events.', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400' },
    { name: 'Sports Day', desc: 'Fun races, athletic drills, and team celebrations.', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=400' },
    { name: 'Festival Celebrations', desc: 'Diwali, Christmas, Eid, and cultural gatherings.', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400' },
    { name: 'Art Day', desc: 'Watercolors, hand-painting, and clay moldings.', img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400' },
    { name: 'Classroom Activities', desc: 'Reading hours, puzzle solving, and learning circles.', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=400' },
    { name: 'Cultural Programs', desc: 'Traditional fashion showcases and group music.', img: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=400' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'teacher') return '/teacher';
    return '/parent';
  };

  return (
    <div className="min-h-screen bg-brand-lightBg">
      {/* Landing Navbar */}
      <header className="w-full h-20 glass-navbar fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center text-brand-navy font-bold text-xl shadow-md border-2 border-white">
            FC
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-brand-navy tracking-tight leading-none">FirstCry</h1>
            <span className="text-xs text-brand-orange font-bold">Intellitots Gallery</span>
          </div>
        </div>
        <div>
          {isAuthenticated ? (
            <Link
              to={getDashboardPath()}
              className="inline-flex items-center space-x-1 px-5 py-2.5 rounded-full bg-brand-navy text-white hover:bg-indigo-900 font-bold text-sm transition-all duration-200 shadow-md"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-full text-brand-navy hover:text-brand-orange font-bold text-sm transition-colors duration-150"
              >
                Sign In
              </Link>
              <Link
                to="/login?register=true"
                className="px-5 py-2.5 rounded-full bg-brand-orange hover:bg-orange-600 text-white font-bold text-sm transition-all duration-200 shadow-md shadow-orange-100 hover:shadow-lg"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-brand-orange text-xs font-bold uppercase tracking-wider animate-pulse">
            <Sparkles className="w-3.5 h-3.5 fill-brand-orange" />
            <span>Preschool Memories Protected</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-navy tracking-tight leading-none">
            Capturing the Joy of <br className="hidden sm:inline" />
            <span className="text-brand-pink">Early Learning</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Welcome to the secure, authorized Event Photo Gallery portal for FirstCry Intellitots. Teachers upload milestones, administrators review albums, and parents get direct private galleries of their kids.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 pt-2">
            <Link
              to={isAuthenticated ? getDashboardPath() : "/login"}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-full bg-brand-yellow text-brand-navy hover:bg-amber-400 font-extrabold text-base shadow-lg shadow-yellow-100 hover:shadow-xl hover:translate-y-[-2px] transition-all duration-200"
            >
              <span>Explore The Gallery</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login?register=true"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-full border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white font-bold text-base transition-all duration-200"
            >
              <span>Register as Parent</span>
            </Link>
          </div>
        </div>

        {/* Hero Collage */}
        <div className="flex-1 w-full relative max-w-md lg:max-w-none mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=400"
                alt="Kid Smiling"
                className="w-full h-48 sm:h-64 object-cover rounded-3xl shadow-premium border-4 border-white rotate-[-3deg]"
              />
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=400"
                alt="Classroom fun"
                className="w-full h-36 sm:h-48 object-cover rounded-3xl shadow-premium border-4 border-white rotate-[2deg]"
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400"
                alt="Painting art"
                className="w-full h-36 sm:h-48 object-cover rounded-3xl shadow-premium border-4 border-white rotate-[1deg]"
              />
              <img
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400"
                alt="Sports activities"
                className="w-full h-48 sm:h-64 object-cover rounded-3xl shadow-premium border-4 border-white rotate-[-2deg]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features summary section */}
      <section className="bg-brand-navy text-white py-16 px-6 sm:px-12 relative overflow-hidden">
        {/* Playful abstract geometric highlights */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-indigo-800/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-brand-pink/5 blur-3xl"></div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h3 className="text-3xl font-extrabold tracking-tight">How Intellitots Gallery Works</h3>
            <p className="text-indigo-200 text-sm font-medium">
              We provide a structured ecosystem that ensures ease of access while maintaining privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-indigo-950/50 border border-indigo-900/60 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-yellow text-brand-navy flex items-center justify-center mx-auto shadow-md">
                <Camera className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold">1. School Events</h4>
              <p className="text-indigo-200 text-xs leading-relaxed">
                Teachers coordinate events and snapshot learning playtimes, building memory albums.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-indigo-950/50 border border-indigo-900/60 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-pink text-white flex items-center justify-center mx-auto shadow-md">
                <Tag className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold">2. Student Tagging</h4>
              <p className="text-indigo-200 text-xs leading-relaxed">
                Teachers tag individual students in pictures during the media uploading workflow.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-indigo-950/50 border border-indigo-900/60 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-orange text-white flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold">3. Admin Approval</h4>
              <p className="text-indigo-200 text-xs leading-relaxed">
                Administrators audit uploads to verify compliance before publishing events live.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-indigo-950/50 border border-indigo-900/60 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-blue text-white flex items-center justify-center mx-auto shadow-md">
                <Download className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold">4. Parent Viewing</h4>
              <p className="text-indigo-200 text-xs leading-relaxed">
                Parents log in to view and download photos containing tags of their own child.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h3 className="text-3xl font-extrabold text-brand-navy tracking-tight">Browse Event Categories</h3>
          <p className="text-gray-500 text-sm font-medium">
            Take a look at the various preschool events and programs captured in our gallery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <div key={idx} className="group rounded-2xl border border-gray-200/80 bg-white overflow-hidden shadow-premium hover:shadow-xl transition-all duration-300">
              <div className="h-44 overflow-hidden relative">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <h4 className="absolute bottom-4 left-4 text-white font-extrabold text-lg tracking-wide">
                  {cat.name}
                </h4>
              </div>
              <div className="p-5">
                <p className="text-gray-500 text-xs leading-relaxed font-medium">
                  {cat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12 px-6 sm:px-12 border-t border-gray-255 text-center text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto rounded-t-3xl gap-4">
        <div>
          <p className="font-bold text-sm text-brand-navy leading-none">FirstCry Intellitots Preschool</p>
          <p className="mt-1">A secure digital album for childhood milestone events.</p>
        </div>
        <p>© {new Date().getFullYear()} FirstCry Intellitots. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
