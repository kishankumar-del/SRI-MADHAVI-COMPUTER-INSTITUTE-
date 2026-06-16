import { useState, useEffect } from 'react';
import { Search, BookOpen, Clock, BarChart3, GraduationCap, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { Course } from '../types';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  
  // Track which course syllabus/details are expanded
  const [expandedSyllabusId, setExpandedSyllabusId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch live courses from our backend
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching courses data:', err);
        setLoading(false);
      });
  }, []);

  // Filter logic
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.syllabus.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    
    return matchesSearch && matchesLevel;
  });

  const toggleSyllabus = (id: string) => {
    if (expandedSyllabusId === id) {
      setExpandedSyllabusId(null);
    } else {
      setExpandedSyllabusId(id);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Title Header */}
        <div className="text-center space-y-4">
          <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase block">DYNAMIC LEARNING</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Our High-Fidelity Syllabi</h1>
          <p className="text-slate-650 text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
            Explore industry-vetted coursework designed to optimize your logic core and developer credentials.
          </p>
          <div className="h-1 w-20 bg-blue-600 rounded-full mx-auto" />
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          {/* Search box */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search courses, database keys, or syllabus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-2.5 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              id="course-search-input"
            />
          </div>

          {/* Level Filter select options */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0" id="course-filter-bar">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                  selectedLevel === level
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {level === 'All' ? 'All Difficulty Levels' : `${level} Track`}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Listing Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
            <p className="text-slate-500 mt-3 text-sm font-semibold">Querying offered courses schema...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white text-center py-16 rounded-2xl border border-slate-200 max-w-md mx-auto space-y-4 shadow-sm">
            <AlertCircle size={40} className="text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No Match Found</h3>
            <p className="text-slate-500 text-xs px-6">
              There are no courses matching your query. Try resetting filters or testing other search strings.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedLevel('All'); }}
              className="text-xs font-bold text-blue-600 underline"
            >
              Reset Search Parameters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="courses-grid-canvas">
            {filteredCourses.map((course) => {
              const works = course.learningOutcomes ? course.learningOutcomes.split('\n') : [];
              const topics = course.syllabus ? course.syllabus.split('\n') : [];
              const isExpanded = expandedSyllabusId === course.id;

              return (
                <div 
                  key={course.id} 
                  className={`bg-white rounded-2xl border transition-all duration-250 flex flex-col justify-between overflow-hidden shadow-sm ${
                    isExpanded ? 'border-blue-500 shadow-md ring-1 ring-blue-500/10' : 'border-slate-200 hover:border-slate-300'
                  }`}
                  id={`course-card-${course.id}`}
                >
                  {/* Top image layout */}
                  <div>
                    <div className="h-44 overflow-hidden relative border-b border-slate-100">
                      <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                        <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-800 border border-slate-200/50 shadow-xs">
                          {course.level}
                        </span>
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-xs">
                          <Clock size={12} className="mr-1.5" />
                          {course.duration}
                        </span>
                      </div>
                    </div>

                    {/* Meta info body */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2">{course.title}</h2>
                        <p className="text-sm text-slate-650 text-slate-600 leading-relaxed font-normal">{course.description}</p>
                      </div>

                      {/* Expanded Section Accordion controls */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 pt-5 space-y-5">
                          {/* Syllabus bullet list */}
                          {topics.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center">
                                <BookOpen size={12} className="mr-2 text-blue-600" />
                                Interactive Syllabus Blocks
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                {topics.map((t, idx) => (
                                  <div key={idx} className="flex items-start text-xs text-slate-600">
                                    <span className="text-blue-600 font-bold mr-1.5">•</span>
                                    <span>{t}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Outcomes list */}
                          {works.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center">
                                <GraduationCap size={12} className="mr-2 text-emerald-600" />
                                Core Learning Outcomes
                              </h4>
                              <ul className="space-y-1.5 pl-4 list-decimal text-xs text-slate-600 leading-relaxed">
                                {works.map((w, idx) => (
                                  <li key={idx} className="marker:text-emerald-600 leading-relaxed">{w}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Prerequisites info */}
                          {course.prerequisites && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                              <span className="block font-bold text-slate-705 text-slate-700 mb-1">Target Prerequisites:</span>
                              <p className="text-slate-600 leading-relaxed">{course.prerequisites}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expand/Collapse Trigger footer inside card */}
                  <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 italic">Certificate Verified Track</span>
                    <button
                      onClick={() => toggleSyllabus(course.id)}
                      className={`text-xs px-4 py-2 rounded-lg font-bold flex items-center space-x-1.5 transition-colors ${
                        isExpanded 
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200' 
                          : 'bg-blue-50 hover:bg-blue-100/80 text-blue-600 border border-blue-100'
                      }`}
                    >
                      <span>{isExpanded ? 'Collapse Materials' : 'Examine Complete Syllabus'}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
