import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Code, GraduationCap, FileCheck } from 'lucide-react';
import { INSTITUTE_CONFIG } from '../config';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Courses', path: '/courses' },
    { label: 'Online Admission', path: '/admission' },
    { label: 'Track Status', path: '/status' },
    { label: 'Verify Certificate', path: '/verify-certificate' },
    { label: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand Name */}
          <Link to="/" className="flex items-center space-x-3 group" id="header-brand-logo">
            <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-sm group-hover:bg-blue-700 transition-colors">
              <Code size={24} className="stroke-2" />
            </div>
            <div>
              <span className="block text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors uppercase">
                {INSTITUTE_CONFIG.name}
              </span>
              <span className="block text-xs text-slate-500 font-medium tracking-wide">
                {INSTITUTE_CONFIG.slogan}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1" id="header-desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action CTA or Admission Prompt */}
          <div className="hidden xl:flex items-center space-x-3">
            <Link
              to="/admission"
              className="bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-full text-white text-sm font-semibold tracking-wide shadow-sm transition-all flex items-center space-x-2"
            >
              <GraduationCap size={16} />
              <span>Apply Online</span>
            </Link>
          </div>

          {/* Mobile Hamburguer Control */}
          <div className="xl:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle Menu"
              id="header-mobile-toggle"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-fadeIn animate-duration-200">
          <div className="grid grid-cols-1 gap-1.5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-base font-semibold flex items-center justify-between ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {isActive(item.path) && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <Link
              to="/admission"
              onClick={() => setIsOpen(false)}
              className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white text-center font-semibold text-sm shadow-sm flex items-center justify-center space-x-2"
            >
              <GraduationCap size={18} />
              <span>Apply Online Admission</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
