import React, { useState, useEffect } from 'react';
import { 
  BarChart3, BookOpen, GraduationCap, Award, Briefcase, 
  Mail, LogOut, CheckCircle, XCircle, Trash2, Edit, Plus, 
  Search, FileSpreadsheet, Eye, X, Loader2, Upload, AlertCircle, RefreshCw, FileText 
} from 'lucide-react';
import { Course, Application, Certificate, Inquiry, DashboardStats } from '../types';
import { INSTITUTE_CONFIG } from '../config';

export default function AdminPortal() {
  // Authentication parameters
  const [token, setToken] = useState<string>(() => localStorage.getItem('ncc_admin_token') || '');
  const [userEmail, setUserEmail] = useState<string>(() => localStorage.getItem('ncc_admin_email') || '');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active workspace panels: 'dashboard' | 'courses' | 'applications' | 'certificates' | 'inquiries'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'applications' | 'certificates' | 'inquiries'>('dashboard');

  // Stored state caches
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  
  // Loading & Action feedback systems
  const [globalLoading, setGlobalLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');

  // Search/Filters
  const [appSearch, setAppSearch] = useState('');
  const [appFilter, setAppFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  // Modal active variables
  const [activeCourseModal, setActiveCourseModal] = useState<{ mode: 'ADD' | 'EDIT'; id?: string } | null>(null);
  const [activeCertModal, setActiveCertModal] = useState<{ mode: 'ADD' | 'EDIT'; id?: string } | null>(null);
  const [selectedDocumentsApp, setSelectedDocumentsApp] = useState<Application | null>(null);

  // Field states for course creation/editing
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [courseLevel, setCourseLevel] = useState('Beginner');
  const [courseImage, setCourseImage] = useState('');
  const [courseSyllabus, setCourseSyllabus] = useState('');
  const [courseOutcomes, setCourseOutcomes] = useState('');
  const [coursePrereq, setCoursePrereq] = useState('');

  // Field states for certificate record management
  const [certRollNum, setCertRollNum] = useState('');
  const [certStudentName, setCertStudentName] = useState('');
  const [certCourse, setCertCourse] = useState('');
  const [certDob, setCertDob] = useState('');
  const [certCompletionDate, setCertCompletionDate] = useState('');

  // Reload cache elements from API
  const loadAllAdminData = () => {
    if (!token) return;
    setGlobalLoading(true);
    const headers = { 'Authorization': `Bearer ${token}` };

    Promise.all([
      fetch('/api/dashboard/stats', { headers }).then(res => res.json()),
      fetch('/api/courses').then(res => res.json()),
      fetch('/api/applications', { headers }).then(res => res.json()),
      fetch('/api/certificates', { headers }).then(res => res.json()),
      fetch('/api/inquiries', { headers }).then(res => res.json())
    ])
      .then(([statsData, coursesData, appsData, certsData, inqsData]) => {
        setStats(statsData);
        setCourses(coursesData);
        setApplications(appsData);
        setCertificates(certsData);
        setInquiries(inqsData);
        setGlobalLoading(false);
      })
      .catch(err => {
        console.error('Error loading admin databases:', err);
        setActionError('Failed to fetch admin backend states. Please check session login again.');
        setGlobalLoading(false);
      });
  };

  useEffect(() => {
    if (token) {
      loadAllAdminData();
    }
  }, [token]);

  // Handle Authentication Dispatch
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server authentication rejected');
      }

      localStorage.setItem('ncc_admin_token', data.token);
      localStorage.setItem('ncc_admin_email', data.user.email);
      setToken(data.token);
      setUserEmail(data.user.email);
    } catch (err: any) {
      console.error(err);
      setLoginError(err.message || 'Verification rejected. Please check email/password configuration.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ncc_admin_token');
    localStorage.removeItem('ncc_admin_email');
    setToken('');
    setUserEmail('');
  };

  // ----------------------------------------------------
  // ACTION DISPATCHERS
  // ----------------------------------------------------

  // Application approving / rejecting
  const handleUpdateApplicationStatus = async (appId: string, status: 'Approved' | 'Rejected') => {
    try {
      const response = await fetch(`/api/applications/${appId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Status rewrite declined');
      
      setActionMessage(`Application ${appId} successfully marked ${status}!`);
      loadAllAdminData();
    } catch (err: any) {
      setActionError(err.message || 'Error updating status');
    }
  };

  // Application deleting
  const handleDeleteApplication = async (appId: string) => {
    if (!confirm(`Are you absolutely sure you want to completely erase student application ${appId} from records?`)) return;
    try {
      const response = await fetch(`/api/applications/${appId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Deletion rejected');
      setActionMessage('Application cleared from records database.');
      loadAllAdminData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  // Inquiry message resolution
  const handleResolveInquiry = async (inqId: string) => {
    try {
      const response = await fetch(`/api/inquiries/${inqId}/resolve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Resolution failed');
      setActionMessage('Inquiry successfully marked Resolved.');
      loadAllAdminData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  // Inquiry deleting
  const handleDeleteInquiry = async (inqId: string) => {
    if (!confirm('Proceed to remove inquiry from panel history?')) return;
    try {
      const response = await fetch(`/api/inquiries/${inqId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Deletion failed');
      setActionMessage('Inquiry message removed.');
      loadAllAdminData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  // Courses operations
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionMessage('');

    const payload = {
      title: courseTitle,
      description: courseDesc,
      duration: courseDuration,
      level: courseLevel,
      image: courseImage,
      syllabus: courseSyllabus,
      learningOutcomes: courseOutcomes,
      prerequisites: coursePrereq
    };

    try {
      let url = '/api/courses';
      let method = 'POST';

      if (activeCourseModal?.mode === 'EDIT') {
        url = `/api/courses/${activeCourseModal.id}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Action rejected by backend servers');

      setActionMessage(activeCourseModal?.mode === 'ADD' ? 'Fresh course added successfully!' : 'Course parameters updated!');
      setActiveCourseModal(null);
      loadAllAdminData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const openCourseEdit = (c: Course) => {
    setCourseTitle(c.title);
    setCourseDesc(c.description);
    setCourseDuration(c.duration);
    setCourseLevel(c.level);
    setCourseImage(c.image);
    setCourseSyllabus(c.syllabus || '');
    setCourseOutcomes(c.learningOutcomes || '');
    setCoursePrereq(c.prerequisites || '');
    setActiveCourseModal({ mode: 'EDIT', id: c.id });
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm(`Are you absolutely sure you want to permanently delete course "${courseId}"?`)) return;
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Deletion request rejected');
      setActionMessage('Course deleted from syllabus library.');
      loadAllAdminData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  // Certificates operations
  const handleCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionMessage('');

    const payload = {
      rollNumber: certRollNum,
      studentName: certStudentName,
      course: certCourse,
      dob: certDob,
      completionDate: certCompletionDate
    };

    try {
      let url = '/api/certificates';
      let method = 'POST';

      if (activeCertModal?.mode === 'EDIT') {
        url = `/api/certificates/${activeCertModal.id}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Error processing certificates payload');

      setActionMessage('Certificate status ledger processed.');
      setActiveCertModal(null);
      loadAllAdminData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const openCertEdit = (cer: Certificate) => {
    setCertRollNum(cer.rollNumber);
    setCertStudentName(cer.studentName);
    setCertCourse(cer.course);
    setCertDob(cer.dob);
    setCertCompletionDate(cer.completionDate);
    setActiveCertModal({ mode: 'EDIT', id: cer.certificateId });
  };

  const handleDeleteCert = async (certId: string) => {
    if (!confirm('Erase student verification records?')) return;
    try {
      const response = await fetch(`/api/certificates/${certId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Deletion rejected');
      setActionMessage('Certificate registration index erased.');
      loadAllAdminData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  // CSV Export utility for applications list
  const handleExportApplicationsCSV = () => {
    if (applications.length === 0) {
      alert('Applications state is empty. No structures to export.');
      return;
    }

    const headers = ['Application ID', 'Student Name', 'Father Name', 'Email', 'Mobile', 'Course Selected', 'Status', 'CreatedAt'];
    const rows = applications.map(app => [
      app.applicationId,
      `"${app.studentName.replace(/"/g, '""')}"`,
      `"${app.fatherName.replace(/"/g, '""')}"`,
      app.email,
      app.mobile,
      `"${app.course}"`,
      app.status,
      app.createdAt
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Admissions_Applications_NCC_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  // File to base64 converter for admin modals
  const handleAdminBase64Upload = (e: React.ChangeEvent<HTMLInputElement>, setter: (s: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setter(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Filters for Applications tab
  const filteredApps = applications.filter(app => {
    const matchesSearch = app.studentName.toLowerCase().includes(appSearch.toLowerCase()) ||
                          app.applicationId.toLowerCase().includes(appSearch.toLowerCase()) ||
                          app.mobile.includes(appSearch);
    
    const matchesFilter = appFilter === 'All' || app.status === appFilter;
    return matchesSearch && matchesFilter;
  });

  // ----------------------------------------------------
  // RENDER LOGIN SCREEN IF LACKS TOKEN
  // ----------------------------------------------------
  if (!token) {
    return (
      <div className="bg-[#0b1329] text-white min-h-screen py-24 px-4 flex items-center justify-center">
        <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 shadow-2xl max-w-md w-full relative space-y-6">
          <div className="text-center space-y-2">
            <div className="bg-blue-600/10 p-3 rounded-xl w-fit mx-auto text-blue-500 border border-blue-500/20">
              <GraduationCap size={28} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight">Admin Portal Access Gate</h1>
            <p className="text-xs text-slate-400">Validate security credentials to command administrative databases.</p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg text-xs leading-relaxed text-blue-300 font-mono">
            <strong>Default Demonstration Keys:</strong>
            <div className="mt-1">Email: <span className="text-white font-bold">admin@srimadhavi.com</span></div>
            <div>Password: <span className="text-white font-bold">admin123</span></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4" id="admin-login-form">
            {loginError && (
              <div className="bg-rose-500/10 p-3 rounded border border-rose-500/30 text-rose-450 text-rose-400 text-xs font-mono">
                {loginError}
              </div>
            )}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">SuperAdmin Email Address</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-850 px-4 py-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-300 font-mono"
                placeholder="admin@srimadhavi.com"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Account Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-850 px-4 py-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-300 font-mono"
                placeholder="********"
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 hover:scale-101 py-2.5 rounded-lg text-xs sm:text-sm font-semibold tracking-wider transition-colors flex items-center justify-center space-x-1.5"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="animate-spin text-white" size={14} />
                  <span>Checking...</span>
                </>
              ) : (
                <span>Authenticate Security Key</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b1329] text-white min-h-screen flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION COLUMN */}
      <aside className="w-full md:w-64 bg-slate-950 border-b md:border-b-0 md:border-r border-slate-850/80 flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div>
            <span className="block font-bold text-lg text-white font-sans tracking-wide">NCC Admin Terminal</span>
            <span className="block text-[10px] text-slate-400 font-mono tracking-widest">{userEmail}</span>
          </div>

          <nav className="flex flex-col gap-1.5 font-mono text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2.5 rounded-lg text-left font-medium flex items-center space-x-3 transition-colors ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-450 text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <BarChart3 size={16} />
              <span>Metrics & Metrics</span>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2.5 rounded-lg text-left font-medium flex items-center space-x-3 transition-colors ${
                activeTab === 'courses' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-450 text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <BookOpen size={16} />
              <span>Syllabus (Courses)</span>
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2.5 rounded-lg text-left font-medium flex items-center space-x-3 transition-colors ${
                activeTab === 'applications' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-450 text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <GraduationCap size={16} />
              <span>Applications ({applications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-4 py-2.5 rounded-lg text-left font-medium flex items-center space-x-3 transition-colors ${
                activeTab === 'certificates' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-450 text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Award size={16} />
              <span>Certificate Vault</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2.5 rounded-lg text-left font-medium flex items-center space-x-3 transition-colors ${
                activeTab === 'inquiries' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-450 text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Mail size={16} />
              <span>Inquiry Desk ({inquiries.filter(i => i.status === 'Unread').length})</span>
            </button>
          </nav>
        </div>

        {/* LOGOUT BUTTON ROW */}
        <div className="pt-6 border-t border-slate-905 mt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 text-rose-400 hover:text-rose-300 font-mono text-xs px-4 py-2 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut size={14} />
            <span>Terminate Admin Session</span>
          </button>
        </div>
      </aside>

      {/* CORE CONTENT SEGMENT */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto max-w-7xl">
        
        {/* Banner Alert Displays */}
        {actionMessage && (
          <div className="bg-emerald-505/10 bg-emerald-500/15 border border-emerald-504/30 border-emerald-500/30 p-4 rounded-xl text-xs sm:text-sm text-emerald-400 flex items-center justify-between" id="admin-success-alert">
            <span>✓ {actionMessage}</span>
            <button onClick={() => setActionMessage('')}><X size={14} /></button>
          </div>
        )}
        {actionError && (
          <div className="bg-rose-505/10 bg-rose-500/15 border border-rose-504/30 border-rose-500/30 p-4 rounded-xl text-xs sm:text-sm text-rose-400 flex items-center justify-between">
            <span>✕ Error: {actionError}</span>
            <button onClick={() => setActionError('')}><X size={14} /></button>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 1: OVERVIEW DASHBOARD METRICS
            ---------------------------------------------------- */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Metrics Dashboard Console</h2>
              <p className="text-xs text-slate-400">Aggregated database status logs for {INSTITUTE_CONFIG.name}.</p>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center space-x-4">
                <BookOpen size={20} className="text-blue-500" />
                <div>
                  <span className="block text-slate-500 text-[10px] font-mono leading-none tracking-wider font-bold">COURSES</span>
                  <span className="block text-lg font-bold">{stats.totalCourses}</span>
                </div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center space-x-4">
                <GraduationCap size={20} className="text-emerald-500" />
                <div>
                  <span className="block text-slate-500 text-[10px] font-mono leading-none tracking-wider font-bold">ADMISSIONS</span>
                  <span className="block text-lg font-bold">{stats.totalApplications}</span>
                </div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center space-x-4">
                <Award size={20} className="text-amber-500" />
                <div>
                  <span className="block text-slate-500 text-[10px] font-mono leading-none tracking-wider font-bold">CERTIFICATES</span>
                  <span className="block text-lg font-bold">{stats.totalCertificates}</span>
                </div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center space-x-4">
                <Mail size={20} className="text-rose-400" />
                <div>
                  <span className="block text-slate-500 text-[10px] font-mono leading-none tracking-wider font-bold">INQUIRIES</span>
                  <span className="block text-lg font-bold">{stats.totalInquiries}</span>
                </div>
              </div>
            </div>

            {/* Recent activities stack */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 space-y-4">
              <h3 className="font-semibold text-sm uppercase font-mono tracking-widest text-slate-400 flex items-center">
                <RefreshCw size={14} className="mr-2 text-blue-500" />
                <span>Recent Activity Logs</span>
              </h3>
              <div className="divide-y divide-slate-900">
                {stats.recentActivities.length === 0 ? (
                  <p className="text-slate-550 text-xs py-4 text-center">No structural admissions logged today.</p>
                ) : (
                  stats.recentActivities.map((act, index) => (
                    <div key={index} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                      <div className="space-y-1">
                        <strong className="text-white block font-semibold leading-none">{act.title}</strong>
                        <span className="text-[10px] font-mono text-slate-500 block">{act.type} • {new Date(act.time).toLocaleString()}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        act.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                        act.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {act.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 2: COURSE MANAGEMENT CRUD
            ---------------------------------------------------- */}
        {activeTab === 'courses' && (
          <div className="space-y-8 animate-fadeIn" id="admin-courses-panel">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">Manage Courses Syllabus</h2>
                <p className="text-xs text-slate-400">Review, edit, add programming tracks instantly loaded into client grids.</p>
              </div>
              <button
                onClick={() => {
                  setCourseTitle('');
                  setCourseDesc('');
                  setCourseDuration('');
                  setCourseLevel('Beginner');
                  setCourseImage('');
                  setCourseSyllabus('');
                  setCourseOutcomes('');
                  setCoursePrereq('');
                  setActiveCourseModal({ mode: 'ADD' });
                }}
                className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 shrink-0"
              >
                <Plus size={16} />
                <span>Add Offered Course</span>
              </button>
            </div>

            {/* Courses grid rows */}
            <div className="bg-slate-950 rounded-2xl border border-slate-850 overflow-hidden divide-y divide-slate-900">
              {courses.map((course) => (
                <div key={course.id} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-12 h-12 rounded object-cover border border-slate-800" 
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <strong className="block text-sm sm:text-base text-white">{course.title}</strong>
                      <span className="text-xs text-slate-500 font-mono">{course.duration} • {course.level} Level</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0 justify-end">
                    <button
                      onClick={() => openCourseEdit(course)}
                      className="bg-slate-900 hover:bg-slate-800 p-2 rounded text-blue-400 hover:text-blue-300 border border-slate-800"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="bg-slate-900 hover:bg-rose-500/10 p-2 rounded text-rose-400 border border-slate-800"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ADD/EDIT COURSE MODAL DRAWER */}
            {activeCourseModal && (
              <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
                <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg sm:text-xl font-bold">{activeCourseModal.mode === 'ADD' ? 'Add Offered Course' : 'Edit Course Parameters'}</h3>
                    <button onClick={() => setActiveCourseModal(null)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                  </div>

                  <form onSubmit={handleCourseSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-slate-300 text-xs sm:text-sm">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">Course Title *</label>
                      <input
                        type="text"
                        required
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="e.g. C Programming"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">Class Duration *</label>
                      <input
                        type="text"
                        required
                        value={courseDuration}
                        onChange={(e) => setCourseDuration(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="e.g. 8 Weeks"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">Target Skill Level *</label>
                      <select
                        value={courseLevel}
                        onChange={(e) => setCourseLevel(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 text-slate-300"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">Banner Image URL</label>
                      <input
                        type="text"
                        value={courseImage}
                        onChange={(e) => setCourseImage(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Image URL"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">Course Description *</label>
                      <textarea
                        required
                        rows={2}
                        value={courseDesc}
                        onChange={(e) => setCourseDesc(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                        placeholder="Detailed brief description..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">Syllabus Topics (One item per line)*</label>
                      <textarea
                        required
                        rows={3}
                        value={courseSyllabus}
                        onChange={(e) => setCourseSyllabus(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-550 focus:border-blue-500 resize-none font-mono"
                        placeholder="Variables&#10;Structures&#10;File Handles"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">Learning Outcomes (One item per line)</label>
                      <textarea
                        rows={3}
                        value={courseOutcomes}
                        onChange={(e) => setCourseOutcomes(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 resize-none font-mono"
                        placeholder="Write dynamic standalone programs&#10;Understand memory stack constructs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">Prerequisites Required</label>
                      <textarea
                        rows={3}
                        value={coursePrereq}
                        onChange={(e) => setCoursePrereq(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                        placeholder="No specific pre-qualifications needed."
                      />
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setActiveCourseModal(null)}
                        className="bg-slate-800 hover:bg-slate-755 text-slate-300 px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm"
                      >
                        Save Course Configuration
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 3: APPLICATION ADMISSIONS MANAGEMENT
            ---------------------------------------------------- */}
        {activeTab === 'applications' && (
          <div className="space-y-8 animate-fadeIn" id="admin-admissions-workspace">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">Manage Student Admissions</h2>
                <p className="text-xs text-slate-400">Search student uploads, audit qualifications, approve tracks or trigger spreadsheet output.</p>
              </div>
              <button
                onClick={handleExportApplicationsCSV}
                className="bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 shrink-0"
              >
                <FileSpreadsheet size={16} />
                <span>Export Applications CSV</span>
              </button>
            </div>

            {/* Filter and query controls bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="Query student name, Mobile Number or ID..."
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 pl-11 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div className="flex gap-1.5">
                {['All', 'Pending', 'Approved', 'Rejected'].map(fltr => (
                  <button
                    key={fltr}
                    onClick={() => setAppFilter(fltr as any)}
                    className={`px-3 py-1 bg-slate-950 text-[10px] sm:text-xs font-bold rounded-lg border leading-none shrink-0 ${
                      appFilter === fltr ? 'bg-blue-600 text-white border-blue-500' : 'text-slate-450 text-slate-400 border-slate-850'
                    }`}
                  >
                    {fltr}
                  </button>
                ))}
              </div>
            </div>

            {/* Applications listing rows */}
            <div className="bg-slate-950 rounded-2xl border border-slate-850 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-900/40 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    <th className="p-4">ID</th>
                    <th className="p-4">Student Info</th>
                    <th className="p-4">Course Intent</th>
                    <th className="p-4">Credentials Detail</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-905 divide-slate-900 text-xs text-slate-300">
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-slate-500 font-mono">
                        No admissions applications meet query criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => (
                      <tr key={app.applicationId} className="hover:bg-slate-900/30">
                        <td className="p-4 font-mono font-bold text-blue-400 select-all">{app.applicationId}</td>
                        <td className="p-4 space-y-1">
                          <strong className="text-white block">{app.studentName}</strong>
                          <span className="text-[10px] font-mono text-slate-500">Age DOB: {app.dob} • Gender: {app.gender}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">{app.email} • {app.mobile}</span>
                        </td>
                        <td className="p-4 font-semibold text-white">{app.course}</td>
                        <td className="p-4">
                          <span className="block text-[11px] font-mono text-slate-400 font-bold">{app.qualification}</span>
                          <span className="block text-[10px] text-slate-500 font-normal leading-relaxed">{app.collegeName} ({app.percentage})</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                            app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                            app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                          {/* Proof viewers */}
                          <button
                            onClick={() => setSelectedDocumentsApp(app)}
                            className="bg-slate-900 text-blue-400 p-1.5 rounded hover:bg-slate-800 border border-slate-850"
                            title="View Student Photo & Aadhaar ID"
                          >
                            <Eye size={12} />
                          </button>
                          
                          {app.status !== 'Approved' && (
                            <button
                              onClick={() => handleUpdateApplicationStatus(app.applicationId, 'Approved')}
                              className="bg-slate-900 text-emerald-400 p-1.5 rounded hover:bg-slate-800 border border-slate-850"
                              title="Approve student"
                            >
                              <CheckCircle size={12} />
                            </button>
                          )}
                          {app.status !== 'Rejected' && (
                            <button
                              onClick={() => handleUpdateApplicationStatus(app.applicationId, 'Rejected')}
                              className="bg-slate-900 text-amber-500 p-1.5 rounded hover:bg-slate-800' border border-slate-850"
                              title="Reject student"
                            >
                              <XCircle size={12} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteApplication(app.applicationId)}
                            className="bg-slate-900 text-rose-400 p-1.5 rounded hover:bg-rose-500/10 border border-slate-850"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PHOTO & AADHAAR ID DETAIL DRAWER MODAL */}
            {selectedDocumentsApp && (
              <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
                <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto text-slate-300">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold">Uploaded ID Credentials</h3>
                      <span className="text-xs text-slate-500 font-mono">App ID: {selectedDocumentsApp.applicationId} • Student: {selectedDocumentsApp.studentName}</span>
                    </div>
                    <button onClick={() => setSelectedDocumentsApp(null)} className="text-slate-400 hover:text-white hover:scale-110"><X size={20} /></button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {/* Passport Photo */}
                    <div className="space-y-2">
                      <span className="block text-xs font-mono font-bold text-slate-400 uppercase">Passport Photography</span>
                      {selectedDocumentsApp.studentPhoto ? (
                        <div className="border border-slate-800 rounded-xl overflow-hidden max-h-64 flex justify-center bg-slate-950 p-2">
                          <img 
                            src={selectedDocumentsApp.studentPhoto} 
                            alt={`${selectedDocumentsApp.studentName} photo`} 
                            className="max-h-60 object-contain rounded"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <div className="h-48 border border-slate-800 border-dashed rounded-xl flex items-center justify-center text-center text-slate-500 py-6 text-xs italic">
                          No photo upload cached.
                        </div>
                      )}
                    </div>

                    {/* Aadhaar ID proof representation */}
                    <div className="space-y-2">
                      <span className="block text-xs font-mono font-bold text-slate-400 uppercase">Aadhaar / ID Card Proof</span>
                      {selectedDocumentsApp.idProof ? (
                        selectedDocumentsApp.idProof.startsWith('data:application/pdf') ? (
                          <div className="border border-slate-800 rounded-xl p-6 bg-slate-950 h-48 flex flex-col justify-center items-center text-center space-y-2">
                            <FileText size={32} className="text-blue-400" />
                            <span className="text-xs font-mono text-slate-300">Aadhaar PDF Document</span>
                            <a 
                              href={selectedDocumentsApp.idProof} 
                              download={`${selectedDocumentsApp.studentName}_Aadhaar_ID_Proof`}
                              className="text-xs bg-blue-600 px-3 py-1 rounded hover:bg-blue-500 font-bold"
                            >
                              Download PDF
                            </a>
                          </div>
                        ) : (
                          <div className="border border-slate-800 rounded-xl overflow-hidden max-h-64 flex justify-center bg-slate-950 p-2">
                            <img 
                              src={selectedDocumentsApp.idProof} 
                              alt={`${selectedDocumentsApp.studentName} ID Proof`} 
                              className="max-h-60 object-contain rounded"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )
                      ) : (
                        <div className="h-48 border border-slate-800 border-dashed rounded-xl flex items-center justify-center text-center text-slate-550 italic py-6 text-xs">
                          No ID proof uploaded.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-800">
                    <button 
                      onClick={() => setSelectedDocumentsApp(null)}
                      className="bg-slate-800 hover:bg-slate-700 text-xs font-bold px-6 py-2.5 rounded-lg"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 4: CERTIFICATE VAULT MANAGEMENT
            ---------------------------------------------------- */}
        {activeTab === 'certificates' && (
          <div className="space-y-8 animate-fadeIn" id="admin-certificates-panel">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">Manage Certificate Vault</h2>
                <p className="text-xs text-slate-400">Add student roll validation markers enabling rapid digital lookup verification.</p>
              </div>
              <button
                onClick={() => {
                  setCertRollNum('');
                  setCertStudentName('');
                  setCertCourse(courses.length > 0 ? courses[0].title : '');
                  setCertDob('');
                  setCertCompletionDate('');
                  setActiveCertModal({ mode: 'ADD' });
                }}
                className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 shrink-0"
              >
                <Plus size={16} />
                <span>Upload Student Record</span>
              </button>
            </div>

            {/* Certificates table */}
            <div className="bg-slate-950 rounded-2xl border border-slate-850 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-900/40 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    <th className="p-4">Certificate ID</th>
                    <th className="p-4">Roll ID</th>
                    <th className="p-4">Student Name</th>
                    <th className="p-4">Program</th>
                    <th className="p-4">DOB</th>
                    <th className="p-4">Completion Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-xs text-slate-305">
                  {certificates.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-slate-500 font-mono">No certificate indices found in system.</td>
                    </tr>
                  ) : (
                    certificates.map((c) => (
                      <tr key={c.certificateId} className="hover:bg-slate-900/30">
                        <td className="p-4 font-mono text-blue-400 select-all font-bold">{c.certificateId}</td>
                        <td className="p-4 font-mono uppercase text-white font-bold select-all">{c.rollNumber}</td>
                        <td className="p-4 text-white font-semibold">{c.studentName}</td>
                        <td className="p-4">{c.course}</td>
                        <td className="p-4 font-mono">{c.dob}</td>
                        <td className="p-4 font-mono">{c.completionDate}</td>
                        <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => openCertEdit(c)}
                            className="bg-slate-900 text-blue-405 text-blue-400 p-1.5 rounded hover:bg-slate-800 border border-slate-850"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteCert(c.certificateId)}
                            className="bg-slate-900 text-rose-404 text-rose-450 text-rose-400 p-1.5 rounded hover:bg-rose-500/10 border border-slate-855 border-slate-850"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ADD/EDIT CERTIFICATE MODAL */}
            {activeCertModal && (
              <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn animate-duration-200">
                <div className="bg-slate-900 rounded-2xl border border-slate-804 border-slate-800 max-w-md w-full p-6 sm:p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">{activeCertModal.mode === 'ADD' ? 'Add Certification Record' : 'Edit Certificate Indices'}</h3>
                    <button onClick={() => setActiveCertModal(null)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                  </div>

                  <form onSubmit={handleCertSubmit} className="space-y-4 text-slate-300 text-xs sm:text-sm">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">Student Roll ID *</label>
                      <input
                        type="text"
                        required
                        value={certRollNum}
                        onChange={(e) => setCertRollNum(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-white font-mono uppercase"
                        placeholder="ROLL-26101"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">Student Full Name *</label>
                      <input
                        type="text"
                        required
                        value={certStudentName}
                        onChange={(e) => setCertStudentName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-white"
                        placeholder="e.g. Priyak Patel"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">Select Certified Course *</label>
                      <select
                        value={certCourse}
                        required
                        onChange={(e) => setCertCourse(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg text-blue-400 font-bold"
                      >
                        {courses.map((c) => (
                          <option key={c.id} value={c.title}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">Student DOB *</label>
                      <input
                        type="date"
                        required
                        value={certDob}
                        onChange={(e) => setCertDob(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">Completion Date *</label>
                      <input
                        type="date"
                        required
                        value={certCompletionDate}
                        onChange={(e) => setCertCompletionDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-slate-300"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setActiveCertModal(null)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2 rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-xs font-bold"
                      >
                        Update Cache Record
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 6: INQUIRY MANAGEMENT DESK
            ---------------------------------------------------- */}
        {activeTab === 'inquiries' && (
          <div className="space-y-8 animate-fadeIn" id="admin-inquiries-desk">
            <div>
              <h2 className="text-2xl font-bold">Inquiry Desk Messages</h2>
              <p className="text-xs text-slate-400 font-mono">Verify and resolve direct course queries typed in contact portal grids.</p>
            </div>

            <div className="bg-slate-950 rounded-2xl border border-slate-850 overflow-hidden divide-y divide-slate-900">
              {inquiries.length === 0 ? (
                <p className="text-center py-10 font-mono text-xs text-slate-500">Inquiry queue is currently empty.</p>
              ) : (
                inquiries.map((inq) => (
                  <div key={inq.id} className="p-6 space-y-4 hover:bg-slate-900/10">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <span className="block font-bold text-sm sm:text-base text-white">{inq.name}</span>
                        <span className="block text-[10px] text-slate-500 font-mono">Email: {inq.email} • Phone: {inq.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {inq.status === 'Unread' ? (
                          <button
                            onClick={() => handleResolveInquiry(inq.id)}
                            className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded text-[10px] font-bold tracking-wider font-mono uppercase"
                          >
                            Mark Resolved
                          </button>
                        ) : (
                          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded text-[10px] font-mono leading-none font-bold">
                            Resolved
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="bg-slate-900 text-rose-450 text-rose-400 p-2.5 rounded hover:bg-rose-500/10 border border-slate-850"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    {/* Message contents */}
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 text-xs sm:text-sm leading-relaxed text-slate-350 select-all font-normal">
                      {inq.message}
                    </div>
                    <span className="block text-[9px] font-mono text-slate-600">Dispatched Timestamp: {new Date(inq.createdAt).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
