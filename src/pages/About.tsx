import { Award, BookOpen, Compass, ShieldAlert, GraduationCap, Building } from 'lucide-react';
import { INSTITUTE_CONFIG } from '../config';

export default function About() {
  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Page Title Header */}
        <div className="text-center space-y-4">
          <div className="text-blue-600 text-sm font-semibold tracking-wider uppercase font-mono">
            ESTABLISHED IN {INSTITUTE_CONFIG.foundedYear}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            About Our Institute
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
            Developing logical reasoning capacity and preparing next-generation systems engineers.
          </p>
          <div className="h-1 w-24 bg-blue-600 rounded-full mx-auto" />
        </div>

        {/* Overview Box */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-sm" id="overview-card">
          <div className="md:col-span-8 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">{INSTITUTE_CONFIG.name} Overview</h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We started with a tiny batch of 15 students in {INSTITUTE_CONFIG.foundedYear}. Over the past decade, {INSTITUTE_CONFIG.name} has grown into premier academy for full-stack programmers, data structures developers, and system designers. Our core instruction philosophy centers on writing clean compiler-ready code, running real test matrices, and logic building. 
            </p>
            <p className="text-slate-500 text-sm leading-relaxed">
              We stand apart because of our uncompromising focus on high-touch mentorship and lab assistance, ensuring that students of any background can master complex operations step-by-step.
            </p>
          </div>
          <div className="md:col-span-4 bg-slate-50 p-6 rounded-xl border border-slate-100 text-center space-y-2">
            <span className="block text-4xl font-extrabold text-blue-600">{INSTITUTE_CONFIG.stats.studentsTrained}</span>
            <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold font-mono">Students Mentored Successfully</span>
            <div className="border-t border-slate-200 pt-3 mt-2 text-xs text-slate-400 italic">
              ISO 9001:2015 High Level Quality Instruction Standards
            </div>
          </div>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 space-y-4 shadow-sm">
            <div className="bg-emerald-50 p-3 rounded-xl w-fit text-emerald-600">
              <Compass size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Clear Vision</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To be globally recognized as a premier sanctuary for software craftsmanship, where programming training is taught with high-fidelity lab exposure, extreme analytical clarity, and direct alignment with dynamic business environments. We envision bridging the divide between academic structures and enterprise system requirements fully.
            </p>
          </div>

          {/* Mission card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 space-y-4 shadow-sm">
            <div className="bg-blue-50 p-3 rounded-xl w-fit text-blue-600">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Educational Mission</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To deliver practical programming instruction through a modern, affordable, and dynamic environment. We are committed to fostering logic building and self-sustained debugging loops, which are critical for students to confidently master complex architectures and thrive within high-tier industrial ecosystems.
            </p>
          </div>
        </div>

        {/* Director Message Segment */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 space-y-6 shadow-sm" id="director-message">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <img 
              src={INSTITUTE_CONFIG.founderImage} 
              alt={INSTITUTE_CONFIG.founder} 
              className="w-24 h-24 rounded-full object-cover border-2 border-slate-200 shadow-sm shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 leading-tight">Director's Desk Address</h3>
              <p className="text-slate-650 text-slate-600 text-sm leading-relaxed italic">
                "{INSTITUTE_CONFIG.directorMessage}"
              </p>
              <div>
                <span className="block font-bold text-slate-900">{INSTITUTE_CONFIG.founder}</span>
                <span className="block text-xs text-slate-450 font-mono">Founder & Technical Director, {INSTITUTE_CONFIG.shortName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Teaching Methodology list */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-900 text-center">{INSTITUTE_CONFIG.shortName}'s Core Training Methodology</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-250 text-center space-y-3 shadow-sm">
              <div className="bg-blue-50 px-3 py-1 text-xs text-blue-600 font-bold font-mono rounded-full w-fit mx-auto">01</div>
              <h4 className="font-semibold text-slate-900">Live Compilation Lectures</h4>
              <p className="text-xs text-slate-500 leading-relaxed">No static slideshows. Mentors code from empty files directly, explaining each declaration and loop construct live.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-250 text-center space-y-3 shadow-sm">
              <div className="bg-emerald-50 px-3 py-1 text-xs text-emerald-600 font-bold font-mono rounded-full w-fit mx-auto">02</div>
              <h4 className="font-semibold text-slate-900">Daily Lab Submissions</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Submit code tasks live. Our assistant monitors correct compilation and logical boundaries of each algorithm construct.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-250 text-center space-y-3 shadow-sm">
              <div className="bg-blue-50 px-3 py-1 text-xs text-blue-600 font-bold font-mono rounded-full w-fit mx-auto">03</div>
              <h4 className="font-semibold text-slate-900">Mock Interview Tracks</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Practice board coding puzzles daily under live timelines to build high-level articulation skills.</p>
            </div>
          </div>
        </div>

        {/* Career Guidance Info block */}
        <div className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100 text-center space-y-4 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 font-sans">Complimentary Technical Career Mentorship</h3>
          <p className="text-slate-650 text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
            Every enrolled programmer receives free personalized advice from our directors. We inspect your structural goals, look at academic timelines, and draft custom guidance files designed to optimize your entry path into leading corporations.
          </p>
          <div className="pt-2">
            <span className="inline-block bg-white text-slate-500 font-mono text-xs px-4 py-1.5 rounded-full border border-slate-200">
              * Included under our standard Admissions package.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
