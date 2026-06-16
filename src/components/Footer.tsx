import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Code, Clock, Award, CheckCircle2 } from 'lucide-react';
import { INSTITUTE_CONFIG } from '../config';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 pt-16 pb-8" id="footer-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Info Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-slate-900">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Code size={18} />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 uppercase">{INSTITUTE_CONFIG.name}</span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            {INSTITUTE_CONFIG.tagline}
          </p>
          <div className="flex flex-col space-y-3 pt-2 text-xs font-mono">
            <span className="flex items-center text-slate-700">
              <Clock size={14} className="mr-2 text-blue-600" />
              Hours: Mon - Sat: 7:00 AM - 9:00 PM
            </span>
            <span className="flex items-center text-slate-700">
              <Award size={14} className="mr-2 text-emerald-600" />
              ISO 9001:2015 Certified Academy
            </span>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h3 className="text-slate-900 font-bold text-sm uppercase tracking-wider mb-6 flex items-center space-x-2">
            <span className="w-1.5 h-3 bg-blue-600 rounded-sm inline-block"></span>
            <span>Quick Navigation</span>
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
                <CheckCircle2 size={12} className="mr-2 text-slate-400" /> Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-600 transition-colors flex items-center">
                <CheckCircle2 size={12} className="mr-2 text-slate-400" /> About Institute
              </Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-blue-600 transition-colors flex items-center">
                <CheckCircle2 size={12} className="mr-2 text-slate-400" /> Courses Offered
              </Link>
            </li>
            <li>
              <Link to="/admission" className="hover:text-blue-600 transition-colors flex items-center">
                <CheckCircle2 size={12} className="mr-2 text-slate-400" /> Online Admission
              </Link>
            </li>
          </ul>
        </div>

        {/* Dynamic Verification Column */}
        <div>
          <h3 className="text-slate-900 font-bold text-sm uppercase tracking-wider mb-6 flex items-center space-x-2">
            <span className="w-1.5 h-3 bg-blue-600 rounded-sm inline-block"></span>
            <span>Student Utilities</span>
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/status" className="hover:text-blue-600 transition-colors flex items-center">
                <CheckCircle2 size={12} className="mr-2 text-slate-400" /> Track Application Status
              </Link>
            </li>
            <li>
              <Link to="/verify-certificate" className="hover:text-blue-600 transition-colors flex items-center">
                <CheckCircle2 size={12} className="mr-2 text-slate-400" /> Certificate Verification
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-600 transition-colors flex items-center">
                <CheckCircle2 size={12} className="mr-2 text-slate-400" /> Contact Support Desk
              </Link>
            </li>
            <li className="pt-2 border-t border-slate-200 text-xs italic text-slate-400">
              Are you an Admin? Access portal using your distinct router keyword key safely.
            </li>
          </ul>
        </div>

        {/* Contact info Column */}
        <div>
          <h3 className="text-slate-900 font-bold text-sm uppercase tracking-wider mb-6 flex items-center space-x-2">
            <span className="w-1.5 h-3 bg-blue-600 rounded-sm inline-block"></span>
            <span>Get In Touch</span>
          </h3>
          <ul className="space-y-3.5 text-sm">
            <li className="flex items-start">
              <MapPin size={16} className="mr-3 text-blue-600 shrink-0 mt-1" />
              <span className="leading-relaxed">{INSTITUTE_CONFIG.contact.address}</span>
            </li>
            <li className="flex items-center">
              <Phone size={16} className="mr-3 text-blue-600 shrink-0" />
              <span>{INSTITUTE_CONFIG.contact.mobile}</span>
            </li>
            <li className="flex items-center">
              <Mail size={16} className="mr-3 text-blue-600 shrink-0" />
              <span className="break-all">{INSTITUTE_CONFIG.contact.email}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-mono">
        <div>
          © {currentYear} {INSTITUTE_CONFIG.name}. All rights reserved.
        </div>
        <div className="mt-2 md:mt-0 flex space-x-4">
          <span>Licensed Educational Coaching Provider</span>
          <span>•</span>
          <span>ISO Certified Programmers Academy</span>
        </div>
      </div>
    </footer>
  );
}
