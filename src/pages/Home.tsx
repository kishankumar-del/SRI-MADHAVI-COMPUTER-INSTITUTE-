import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowRight, Shield, Award, Users, GraduationCap, 
  BookOpen, Star, Calendar, Quote, Send, Sparkles 
} from 'lucide-react';
import { INSTITUTE_CONFIG } from '../config';
import { Course } from '../types';

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Load announcements and statistics directly from config
  const stats = INSTITUTE_CONFIG.stats;
  const whyUs = INSTITUTE_CONFIG.whyChooseUs;
  const announcements = INSTITUTE_CONFIG.announcements;

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(coursesData => {
        setCourses(coursesData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dynamic landing configurations:', err);
        setLoading(false);
      });
  }, []);

  // Filter 3 representative courses for the Featured grid
  const featuredCourses = courses.slice(0, 3);
  if (featuredCourses.length === 0 && !loading) {
    // Fallback if db is somehow empty
    featuredCourses.push({
      id: 'mock-1',
      title: 'Full Stack Development',
      description: 'Go from frontend client configurations to secure backend database query structures.',
      duration: '16 Weeks',
      level: 'Advanced',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80',
      syllabus: '',
      learningOutcomes: '',
      prerequisites: ''
    });
  }

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-32 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
        {/* Background grids / shapes */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />
        
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full text-blue-600 text-xs font-semibold tracking-wide">
              <Sparkles size={12} className="text-blue-500" />
              <span>Admissions Open for New Batches</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
              Code Your Career At <br/>
              <span className="text-blue-600 underline underline-offset-8 decoration-slate-200">
                {INSTITUTE_CONFIG.name}
              </span>
            </h1>
            
            <p className="text-slate-600 text-lg sm:text-xl leading-relaxed max-w-2xl font-normal">
              {INSTITUTE_CONFIG.tagline}
            </p>

            {/* Micro details panel */}
            <div className="grid grid-cols-3 gap-4 py-2 border-y border-slate-200 max-w-lg text-center">
              <div className="p-2 bg-slate-50/50 rounded-lg border border-slate-100">
                <span className="block text-2xl font-bold text-slate-900">{stats.studentsTrained}</span>
                <span className="text-[10px] text-slate-550 uppercase tracking-widest font-semibold">Trained</span>
              </div>
              <div className="p-2 bg-slate-50/50 rounded-lg border border-slate-100">
                <span className="block text-2xl font-bold text-blue-600">{stats.coursesOffered}</span>
                <span className="text-[10px] text-slate-550 uppercase tracking-widest font-semibold">Courses</span>
              </div>
              <div className="p-2 bg-slate-50/50 rounded-lg border border-slate-100">
                <span className="block text-2xl font-bold text-slate-900">{stats.activeMentors}</span>
                <span className="text-[10px] text-slate-550 uppercase tracking-widest font-semibold">Expert Mentors</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/admission"
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3.5 rounded-full text-base font-semibold tracking-wide text-white shadow-sm transition-all flex items-center space-x-2"
              >
                <span>Enroll in Course</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/courses"
                className="bg-slate-100 hover:bg-slate-200 px-6 py-3.5 rounded-full text-base font-semibold text-slate-800 border border-slate-200 transition-colors"
              >
                Explore Syllabus
              </Link>
            </div>
          </div>

          {/* Hero visual mock terminal overlay */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="relative mx-auto max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Terminal Title Bar */}
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                </div>
                <div className="text-xs text-slate-500 font-mono tracking-wider">{INSTITUTE_CONFIG.shortName.toLowerCase()}.ts</div>
                <div className="w-6"></div>
              </div>
              {/* Terminal Code Body */}
              <div className="p-6 font-mono text-xs sm:text-sm leading-relaxed text-slate-600 space-y-4">
                <div>
                  <span className="text-blue-600 font-semibold">const</span> <span className="text-slate-800 font-semibold">institute</span> = &#123;
                  <div className="pl-4">
                    name: <span className="text-emerald-600">"{INSTITUTE_CONFIG.name}"</span>,
                    founded: <span className="text-rose-600">{INSTITUTE_CONFIG.foundedYear}</span>,
                    focus: [<span className="text-emerald-600">"DSA"</span>, <span className="text-emerald-600">"Practical Programming"</span>],
                    outcome: <span className="text-emerald-600">"100% Industry Ready"</span>
                  </div>
                  &#125;;
                </div>
                <div>
                  <span className="text-blue-600 font-semibold">function</span> <span className="text-slate-800 font-semibold">trainStudent</span>(student: Student) &#123;
                  <div className="pl-4">
                    student.<span className="text-blue-600">writeCodeLive(true)</span>; <br />
                    student.<span className="text-blue-600">buildProjects()</span>; <br />
                    student.<span className="text-blue-600">practiceDSA(350);</span> <br />
                    <span className="text-blue-600">return</span> student.<span className="text-emerald-600">getIndustryReadiness()</span>;
                  </div>
                  &#125;;
                </div>
                <div className="pt-2 border-t border-slate-200 text-slate-400">
                  // Execute build commands <br />
                  <span className="text-slate-800 font-semibold">$</span> npm run compile-mindset
                  <br />
                  <span className="text-blue-600 font-semibold">✓ Compilation successful.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5 space-y-4">
          <div className="text-blue-600 text-sm font-semibold tracking-wider uppercase">
            ABOUT OUR ACADEMY
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Nurturing Digital Creators Since {INSTITUTE_CONFIG.foundedYear}
          </h2>
          <div className="h-1 w-20 bg-blue-600 rounded-full" />
          <p className="text-slate-600 text-base leading-relaxed">
            {INSTITUTE_CONFIG.directorMessage}
          </p>
          <div className="pt-2">
            <Link 
              to="/about" 
              className="inline-flex items-center space-x-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              <span>Learn about director's vision & mission</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {whyUs.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white p-6 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="bg-blue-50 p-2.5 rounded-lg w-fit text-blue-600">
                  <Shield size={20} />
                </div>
                <h3 className="font-semibold text-lg text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DETAILED STATS COUNTER BAR */}
      <section className="bg-white border-y border-slate-200 py-12 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="py-2 md:py-0">
            <span className="block text-3xl sm:text-4xl font-extrabold text-slate-900">{stats.studentsTrained}</span>
            <span className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest mt-1 block font-semibold">Students Mentored</span>
          </div>
          <div className="py-2 md:py-0">
            <span className="block text-3xl sm:text-4xl font-extrabold text-slate-900">{stats.coursesOffered}</span>
            <span className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest mt-1 block font-semibold">Programming Syllabi</span>
          </div>
          <div className="py-2 md:py-0">
            <span className="block text-3xl sm:text-4xl font-extrabold text-blue-600">{stats.activeMentors} Master Coaches</span>
            <span className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest mt-1 block font-semibold">Experienced Mentorship</span>
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="text-blue-600 text-sm font-semibold tracking-wider uppercase">
            HIGHLY FOCUS SYLLABUS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Our Trending Programs</h2>
          <p className="text-slate-650 text-slate-650 max-w-xl mx-auto text-sm sm:text-base">
            These curriculums are actively loaded and taught dynamically based on modern industry software patterns.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-605 border-blue-600" />
            <p className="text-slate-505 mt-2 text-sm">Querying dynamic schemas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div 
                key={course.id} 
                className="bg-white rounded-xl overflow-hidden border border-slate-205 border-slate-200 hover:border-slate-300 transition-all flex flex-col shadow-sm"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-xs font-semibold text-white">
                    {course.level}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs text-slate-500 font-semibold tracking-wider block">{course.duration} Class Duration</span>
                    <h3 className="text-xl font-bold text-slate-905 text-slate-900 tracking-tight">{course.title}</h3>
                    <p className="text-sm text-slate-505 text-slate-500 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
                    <span className="text-slate-405 text-slate-400 font-semibold">100% Practical</span>
                    <Link
                      to="/courses"
                      className="text-blue-610 text-blue-600 hover:text-blue-700 flex items-center space-x-1 font-bold"
                    >
                      <span>Syllabus</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            to="/courses"
            className="inline-flex items-center space-x-2 bg-white hover:bg-slate-100 border border-slate-200 px-6 py-3 rounded-full text-sm font-semibold transition-colors shadow-sm text-slate-800"
          >
            <span>Preview All Offered {stats.coursesOffered} Courses</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ANNOUNCEMENTS & INFO SECTION */}
      <section className="bg-slate-50 border-t border-slate-200 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Announcements block */}
          <div className="space-y-8">
            <div className="flex items-center space-x-2 space-y-1">
              <Calendar size={18} className="text-blue-600" />
              <h3 className="text-2xl font-bold text-slate-905 text-slate-900 font-sans">Latest Academic Announcements</h3>
            </div>
            <div className="h-1 w-16 bg-blue-600 rounded-full" />
            <div className="space-y-6">
              {announcements.map((item, id) => (
                <div key={id} className="bg-white p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors shadow-sm">
                  <span className="text-xs text-blue-600 font-semibold block mb-2">{item.date}</span>
                  <h4 className="text-base font-bold text-slate-900 leading-tight mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-505 text-slate-500 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Contact & Admission block */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-4">
              <span className="text-emerald-600 text-xs tracking-wider uppercase block font-bold">ADMISSIONS PROCESS</span>
              <h3 className="text-2xl font-bold text-slate-910 text-slate-900 leading-tight border-b border-slate-200 pb-2">Secure Your Slot Today</h3>
              <p className="text-slate-605 text-slate-600 text-sm leading-relaxed">
                We maintain small, high-attention batches to ensure strict mentor accessibility. Submit an online application today, secure your ID, and clear the logical entrance track.
              </p>
              <div className="pt-4 space-y-3 text-xs sm:text-sm text-slate-610 text-slate-600">
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mr-3 shrink-0" />
                  <span>Selected batch allocation based on first-come timeline.</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mr-3 shrink-0" />
                  <span>No upfront fees required during registration form filing.</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mr-3 shrink-0" />
                  <span>Automatic verification and download of certified digital credentials.</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
              <Link 
                to="/admission" 
                className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full text-white text-sm font-semibold tracking-wide shadow-sm flex items-center justify-center space-x-2"
              >
                <GraduationCap size={16} />
                <span>Fill Admission Form</span>
              </Link>
              <a 
                href={`https://api.whatsapp.com/send?phone=${INSTITUTE_CONFIG.contact.whatsappNumber}&text=${encodeURIComponent(INSTITUTE_CONFIG.contact.whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto text-center bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-full text-white text-sm font-semibold tracking-wide flex items-center justify-center space-x-2 shadow-sm"
              >
                <Send size={14} />
                <span>Chat On WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
