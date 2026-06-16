import React, { useState } from 'react';
import { Search, Info, CheckCircle2, XCircle, AlertCircle, Calendar, GraduationCap } from 'lucide-react';

interface ApplicationStatus {
  applicationId: string;
  studentName: string;
  course: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export default function Status() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [results, setResults] = useState<ApplicationStatus[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setResults([]);
    
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      setErrorText('Please specify your unique Application ID (NCC-2026-XXXX) or registered Mobile Number.');
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(`/api/applications/status?query=${encodeURIComponent(cleanQuery)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Admissions lookup failed');
      }

      setResults(data);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'Verification search failed. No record has been located under specifying criteria.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Title Header */}
        <div className="text-center space-y-4">
          <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase block">REAL-TIME TRACKING</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Track Application Status</h1>
          <p className="text-slate-600 max-w-xl mx-auto text-sm">
            Enter your original applicant reference ID or registered contact mobile number to inspect your status.
          </p>
          <div className="h-1 w-20 bg-blue-600 rounded-full mx-auto" />
        </div>

        {/* Search Input Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSearch} className="space-y-4" id="tracking-search-form">
            <label className="block text-xs font-semibold text-slate-700">
              Enter Application ID or Registered Mobile Number
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="e.g. NCC-2026-6101 or 9890123456"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500/20"
                  id="tracking-query-input"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-sm font-semibold transition-colors shrink-0 disabled:bg-slate-100 text-white shadow-xs"
              >
                {loading ? 'Searching...' : 'Track Status'}
              </button>
            </div>
            <div className="text-slate-500 text-xs flex items-center pt-1 font-sans">
              <Info size={12} className="mr-1.5 text-blue-600" />
              <span>Format: NCC-2026-XXXX or standard ten digits mobile.</span>
            </div>
          </form>
        </div>

        {/* Search Results / Status Displays */}
        <div className="space-y-6">
          {errorText && (
            <div className="bg-rose-50 border border-rose-200 p-5 rounded-xl text-rose-600 text-xs sm:text-sm font-sans flex items-start space-x-3 shadow-sm" id="tracker-not-found-msg">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-600" />
              <div>
                <strong className="block font-bold mb-1 col-span-1">Search Notification</strong>
                <span>{errorText}</span>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
              <p className="text-slate-500 text-xs mt-2 font-semibold">Loading progress state matrices...</p>
            </div>
          )}

          {searched && !loading && results.length > 0 && (
            <div className="space-y-4" id="tracker-success-results">
              <span className="text-xs uppercase font-semibold tracking-wider text-slate-500 block">
                Found {results.length} applicant record(s):
              </span>
              
              {results.map((app) => (
                <div 
                  key={app.applicationId} 
                  className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="text-blue-600" size={18} />
                      <span className="text-lg font-bold tracking-tight text-slate-900">{app.studentName}</span>
                    </div>
                    <div className="space-y-1 font-sans text-xs text-slate-500">
                      <div>Application Reference: <span className="text-blue-600 font-bold">{app.applicationId}</span></div>
                      <div>Target Program: <span className="text-slate-700 font-bold">{app.course}</span></div>
                      <div className="flex items-center mt-1">
                        <Calendar size={12} className="mr-1.5 text-slate-400" />
                        <span>Submitted on {new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="w-full sm:w-auto shrink-0 border-t border-slate-100 pt-4 sm:pt-0 sm:border-0 flex items-center justify-end font-sans font-semibold">
                    {app.status === 'Approved' ? (
                      <div className="bg-emerald-50 border border-emerald-200 px-5 py-2.5 rounded-full text-xs font-bold text-emerald-705 text-emerald-700 flex items-center space-x-2">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        <span>Application Approved</span>
                      </div>
                    ) : app.status === 'Rejected' ? (
                      <div className="bg-rose-50 border border-rose-200 px-5 py-2.5 rounded-full text-xs font-bold text-rose-700 flex items-center space-x-2">
                        <XCircle size={14} className="text-rose-600" />
                        <span>Application Rejected</span>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 px-5 py-2.5 rounded-full text-xs font-bold text-amber-700 flex items-center space-x-2 animate-pulse">
                        <AlertCircle size={14} className="text-amber-600" />
                        <span>Verification Pending</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
