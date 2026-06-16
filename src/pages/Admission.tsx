import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, User, FileText, MapPin, Award, 
  Upload, CheckCircle, ArrowRight, Loader2, AlertCircle 
} from 'lucide-react';
import { INSTITUTE_CONFIG } from '../config';
import { Course } from '../types';

export default function Admission() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Form Field State Parameters
  const [studentName, setStudentName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [mobile, setMobile] = useState('');
  const [altMobile, setAltMobile] = useState('');
  const [email, setEmail] = useState('');

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');

  const [qualification, setQualification] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [percentage, setPercentage] = useState('');

  const [course, setCourse] = useState('');

  // Upload representations (Base64 data strands)
  const [studentPhoto, setStudentPhoto] = useState<string>('');
  const [studentPhotoName, setStudentPhotoName] = useState('');
  const [idProof, setIdProof] = useState<string>('');
  const [idProofName, setIdProofName] = useState('');

  // Execution states
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [successResponse, setSuccessResponse] = useState<{
    success: boolean;
    applicationId: string;
    studentName: string;
    course: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoadingCourses(false);
        if (data.length > 0) {
          setCourse(data[0].title); // Set default choice
        }
      })
      .catch(err => {
        console.error('Error fetching courses list:', err);
        setLoadingCourses(false);
      });
  }, []);

  // Shared file to base64 parser
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setBase64: React.Dispatch<React.SetStateAction<string>>, 
    setName: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // limit individual base64 files to 2mb max
      alert('Selected file size exceeds 2MB limit. Please upload compact images.');
      return;
    }

    setName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setBase64(reader.result);
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file as stream: ', error);
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSubmitting(true);

    // Basic Validations
    if (!studentName || !fatherName || !motherName || !dob || !mobile || !email || !course) {
      setErrorText('Please ensure all required personal fields and target Course choice are filled.');
      setSubmitting(false);
      return;
    }

    const payload = {
      studentName,
      fatherName,
      motherName,
      dob,
      gender,
      mobile,
      altMobile,
      email,
      address,
      city,
      state,
      pinCode,
      qualification,
      collegeName,
      percentage,
      course,
      studentPhoto,
      idProof
    };

    try {
      const response = await fetch('/api/applications/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Admissions post failed');
      }

      setSuccessResponse({
        success: true,
        applicationId: data.applicationId,
        studentName: studentName,
        course: course
      });
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'An unexpected validation fault occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS LAYOUT PAGE
  if (successResponse) {
    return (
      <div className="bg-slate-50 text-slate-900 min-h-screen py-24 px-4 flex items-center justify-center">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-emerald-200 max-w-xl text-center space-y-6 shadow-md">
          <div className="bg-emerald-50 p-4 rounded-full w-fit mx-auto text-emerald-600">
            <CheckCircle size={48} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Application Lodged!</h1>
            <p className="text-slate-600 text-sm font-sans">
              Congratulations, <strong className="text-slate-900">{successResponse.studentName}</strong>, your request has been registered under the {INSTITUTE_CONFIG.shortName} admissions directory.
            </p>
          </div>

          {/* Unique Application Badge */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 font-mono space-y-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-semibold">Unique Application ID</span>
            <span className="text-2xl font-bold text-blue-600 block tracking-wider">{successResponse.applicationId}</span>
            <span className="text-[11px] text-emerald-600 font-semibold block">Course: {successResponse.course}</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
            Please make sure to write down or capture this Application ID safely. You can query this ID anytime inside our portal tracks to track your approval or status updates.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link 
              to="/status" 
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center space-x-1 text-white shadow-xs"
            >
              <span>Track Application status</span>
              <ArrowRight size={14} />
            </Link>
            <Link 
              to="/" 
              className="bg-white hover:bg-slate-50 px-6 py-2.5 rounded-lg text-sm font-semibold border border-slate-200 text-slate-605 text-slate-600"
            >
              Back to Home page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      {/* Title Header */}
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase block">FAST REGISTRATION</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Online Admission Portal</h1>
          <p className="text-slate-600 max-w-xl mx-auto text-sm">
            Complete the form elements below to file your student particulars under our active batch allocation algorithms.
          </p>
          <div className="h-1 w-20 bg-blue-600 rounded-full mx-auto" />
        </div>

        {/* Form panel container */}
        <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm" id="admission-application-form">
          {/* Header Panel */}
          <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-200 flex items-center space-x-3">
            <GraduationCap className="text-blue-600 shrink-0" size={24} />
            <div>
              <span className="block font-bold text-base sm:text-lg text-slate-900">Student Admission Request Form</span>
              <span className="block text-xs text-slate-500 font-medium">Fill out all areas. Marks * are absolutely mandatory.</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-10">
            {/* Error alerts */}
            {errorText && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs sm:text-sm text-rose-650 flex items-start space-x-2.5">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
                <span>{errorText}</span>
              </div>
            )}

            {/* SECTION 1: Personal Particulars */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center">
                <User size={16} className="text-blue-600 mr-2" />
                <span>1. Personal Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-sans">Full Name (As in Certificate) *</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                    placeholder="Enter full student name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-sans">Father's Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                    placeholder="Enter father's name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-sans">Mother's Full Name *</label>
                  <input
                    type="text"
                    required
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                    placeholder="Enter mother's name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-sans">Date Of Birth *</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-sans">Gender Group *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-700 font-medium"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-sans">Registered Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                    placeholder="username@domain.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-sans">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                    placeholder="e.g. +91 94909 51700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-sans">Alternate Mobile Number</label>
                  <input
                    type="tel"
                    value={altMobile}
                    onChange={(e) => setAltMobile(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                    placeholder="Alternate contact point"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Address */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center">
                <MapPin size={16} className="text-blue-600 mr-2" />
                <span>2. Address Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-12">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-sans">Full Physical Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                    placeholder="Flat/House No, Building name, Locality name"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-sans">City / Town</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-550 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                    placeholder="City"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-sans">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                    placeholder="State"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-sans">PIN Code</label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                    placeholder="6 Digits PIN Code"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Education */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center">
                <Award size={16} className="text-blue-600 mr-2" />
                <span>3. Academic Qualification</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-sans">Highest Qualification / Degree</label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                    placeholder="e.g. B.Tech CSE, MCA, Intermediate"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-sans">School / College / University Name</label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                    placeholder="Enter school/college name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-sans">Aggregated Percentage / CGPA</label>
                  <input
                    type="text"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                    placeholder="e.g. 78.4% or 8.2 CGPA"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: Targeted Course Assignment */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-805 border-b border-slate-100 pb-2 flex items-center">
                <GraduationCap size={16} className="text-blue-600 mr-2" />
                <span>4. Intended Course of Action</span>
              </h3>
              
              <div className="max-w-md">
                <label className="block text-xs font-semibold text-slate-600 mb-2 font-sans">Select Targeted Course Batch *</label>
                {loadingCourses ? (
                  <span className="text-xs text-slate-500 block font-mono">Fetching dynamic courses...</span>
                ) : (
                  <select
                    value={course}
                    required
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-blue-600 font-bold"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.title}>{c.title} ({c.duration})</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* SECTION 5: Upload Files */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center">
                <Upload size={16} className="text-blue-600 mr-2" />
                <span>5. Upload Required Documents (Max 2MB each)</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* File 1: Student Photo */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-150 space-y-4">
                  <span className="block text-xs font-bold text-slate-700 font-sans">Student passport photo</span>
                  <div className="relative border-2 border-dashed border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors flex flex-col items-center justify-center text-center bg-white">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setStudentPhoto, setStudentPhotoName)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload size={24} className="text-slate-400 mb-2" />
                    <span className="text-xs text-slate-500 block">Click or Drag Image here</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Accepts PNG, JPG (Max 2MB)</span>
                  </div>
                  {studentPhotoName && (
                    <div className="bg-blue-50 px-3 py-1.5 rounded text-xs text-blue-600 font-semibold flex items-center justify-between border border-blue-100">
                      <span className="truncate max-w-[200px]">{studentPhotoName}</span>
                      <strong className="text-[10px] text-emerald-600 shrink-0">✓ Locked</strong>
                    </div>
                  )}
                </div>

                {/* File 2: ID PROOF (Aadhaar, etc.) */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-150 space-y-4">
                  <span className="block text-xs font-bold text-slate-700 font-sans">Aadhaar Card / Government ID Proof</span>
                  <div className="relative border-2 border-dashed border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors flex flex-col items-center justify-center text-center bg-white">
                    <input 
                      type="file" 
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, setIdProof, setIdProofName)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload size={24} className="text-slate-400 mb-2" />
                    <span className="text-xs text-slate-500 block">Click or Drag ID File</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Accepts PDF or Image (Max 2MB)</span>
                  </div>
                  {idProofName && (
                    <div className="bg-blue-50 px-3 py-1.5 rounded text-xs text-blue-600 font-semibold flex items-center justify-between border border-blue-105">
                      <span className="truncate max-w-[200px]">{idProofName}</span>
                      <strong className="text-[10px] text-emerald-600 shrink-0">✓ Locked</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action button bar */}
          <div className="bg-slate-50/50 p-6 border-t border-slate-200 flex items-center justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-semibold tracking-wide uppercase transition-colors shadow-sm px-8 py-3 rounded-full flex items-center space-x-2 text-xs"
              id="admission-submit-btn"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span>Lodging Application...</span>
                </>
              ) : (
                <>
                  <span>File Official Application</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
