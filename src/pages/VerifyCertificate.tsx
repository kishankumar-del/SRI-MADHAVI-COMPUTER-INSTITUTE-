import React, { useState, useRef } from 'react';
import { Search, Award, Calendar, RefreshCw, User, Download, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';
import { INSTITUTE_CONFIG } from '../config';

interface CertificateData {
  certificateId: string;
  rollNumber: string;
  studentName: string;
  course: string;
  dob: string;
  completionDate: string;
}

export default function VerifyCertificate() {
  const [rollNumber, setRollNumber] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [cert, setCert] = useState<CertificateData | null>(null);
  const [searched, setSearched] = useState(false);

  // Reference to print area
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setCert(null);
    setSearched(true);

    if (!rollNumber || !dob) {
      setErrorText('Please state your registered Roll Number and Date Of Birth.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/certificates/verify?rollNumber=${encodeURIComponent(rollNumber.trim())}&dob=${encodeURIComponent(dob)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification query failed');
      }

      setCert(data);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'No matching certification record located under specified parameters.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = () => {
    // Beautiful local print trigger for HTML print rendering
    const printContents = printAreaRef.current?.innerHTML;
    if (!printContents) return;

    const originalTitle = document.title;
    document.title = `${cert?.studentName || 'Student'}_Certificate_${cert?.certificateId || 'ID'}`;

    // Create standard iframe or simple popup print stream
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked. Please enable pop-ups to print or download your verified certificate PDF.');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Verified Certificate - ${cert?.studentName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');
            body { 
              margin: 0; 
              padding: 0; 
              font-family: 'Inter', sans-serif; 
              background-color: #ffffff; 
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact; 
            }
            .cert-box { 
              width: 100%; 
              max-width: 1100px; 
              margin: 40px auto; 
              border: 18px double #1e3a8a; 
              padding: 50px 70px; 
              box-sizing: border-box; 
              position: relative; 
              background-color: #fffdf5; 
              text-align: center; 
              border-radius: 4px;
            }
            .cert-header { 
              color: #1e3a8a; 
              font-size: 44px; 
              font-family: 'Playfair Display', serif; 
              font-weight: 700; 
              margin: 0 0 10px 0; 
              letter-spacing: 1px;
            }
            .cert-sub { 
              font-size: 13px; 
              text-transform: uppercase; 
              letter-spacing: 3px; 
              color: #475569; 
              font-weight: 700; 
              margin-bottom: 30px; 
            }
            .cert-para { 
              font-size: 18px; 
              color: #334155; 
              line-height: 1.8; 
              margin: 25px 0; 
            }
            .highlight { 
              font-size: 28px; 
              font-weight: 700; 
              color: #0f172a; 
              border-bottom: 2px solid #0f172a; 
              display: inline-block; 
              padding-bottom: 2px; 
              margin: 0 5px; 
            }
            .course-highlight { 
              font-size: 24px; 
              font-family: 'Playfair Display', serif; 
              font-style: italic; 
              color: #2563eb; 
              font-weight: 700; 
            }
            .metadata-grid { 
              margin-top: 50px; 
              display: grid; 
              grid-template-cols: repeat(3, 1fr); 
              gap: 20px; 
              font-family: monospace; 
              font-size: 12px; 
              color: #64748b; 
              text-align: center;
            }
            .meta-val { 
              font-size: 14px; 
              font-weight: bold; 
              color: #0f172a; 
              display: block; 
              margin-bottom: 4px; 
            }
            .signature-box { 
              margin-top: 50px; 
              display: flex; 
              justify-content: space-between; 
              padding: 0 30px; 
            }
            .sig-line { 
              border-top: 1px dashed #94a3b8; 
              width: 180px; 
              padding-top: 8px; 
              font-size: 12px; 
              color: #475569; 
              text-align: center; 
            }
            .stamp { 
              border: 3px solid #1e3a8a; 
              color: #1e3a8a; 
              font-size: 10px; 
              font-weight: bold; 
              padding: 8px; 
              border-radius: 50%; 
              width: 70px; 
              height: 70px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              transform: rotate(-12deg); 
              margin: auto; 
            }
            @media print {
              body { margin: 0; }
              .cert-box { margin: 0; height: 100vh; max-height: 100%; border-width: 12px; }
            }
          </style>
        </head>
        <body>
          <div class="cert-box">
            <div class="cert-header">${INSTITUTE_CONFIG.name}</div>
            <div class="cert-sub">${INSTITUTE_CONFIG.slogan}</div>
            
            <div style="font-size: 16px; font-style: italic; color: #475569; margin-bottom: 10px;">This credentials validates that</div>
            
            <div class="cert-para">
              <span class="highlight">${cert?.studentName}</span>
              <br/>
              has successfully compiled the required technical coursework and completed standard evaluative examinations for the program
              <br/>
              <span class="course-highlight">"${cert?.course}"</span>
            </div>
 
            <div style="font-size: 15px; color: #475569; margin-top: 10px;">
              awarded on this day <strong style="color: #0f172a;">${cert ? new Date(cert.completionDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</strong>
            </div>

            <div class="metadata-grid">
              <div>
                <span class="meta-val">${cert?.certificateId}</span>
                CREDENTIAL RECORD ID
              </div>
              <div>
                <span class="meta-val">${cert?.rollNumber}</span>
                STUDENT ROLL ID
              </div>
              <div>
                <span class="meta-val">VERIFIED</span>
                COMPLIANCE STATUS
              </div>
            </div>

            <div class="signature-box">
              <div class="sig-line">
                <span style="font-family: 'Playfair Display', serif; font-style: italic; font-weight: bold;">Srinivasa Rao</span><br/>
                Lead DSA Facilitator
              </div>
              <div>
                <div class="stamp">ISO 9001<br/>CERTIFIED</div>
              </div>
              <div class="sig-line">
                <span style="font-family: 'Playfair Display', serif; font-style: italic; font-weight: bold;">Dr. K. Narayana Rao</span><br/>
                Director of Studies
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    document.title = originalTitle;
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Title */}
        <div className="text-center space-y-4">
          <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase block">VERIFICATION VAULT</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Certificate Verification & Download</h1>
          <p className="text-slate-600 max-w-xl mx-auto text-sm">
            Access secure digital credentials issued under {INSTITUTE_CONFIG.shortName}'s academic compliance guidelines.
          </p>
          <div className="h-1 w-20 bg-blue-600 rounded-full mx-auto" />
        </div>

        {/* Input Console card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <form onSubmit={handleVerify} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end" id="verification-forms">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Student Roll Number *</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
                placeholder="e.g. ROLL-26101"
                className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-semibold uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Student Date Of Birth *</label>
              <div className="flex gap-3">
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  className="flex-1 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-blue-500 font-medium"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center space-x-1.5 text-white shadow-xs"
                >
                  {loading ? <RefreshCw className="animate-spin" size={14} /> : <Search size={14} />}
                  <span>Verify</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Console Outputs */}
        <div className="space-y-8">
          {errorText && (
            <div className="bg-rose-50 border border-rose-200 p-5 rounded-xl text-rose-600 text-xs sm:text-sm font-sans flex items-start space-x-3 shadow-sm" id="verify-error-bar">
              <AlertTriangle size={18} className="shrink-0 mt-0.5 text-rose-600" />
              <div>
                <strong className="block font-bold mb-1">Verify Alert</strong>
                <span>{errorText}</span>
              </div>
            </div>
          )}

          {cert && (
            <div className="space-y-6 animate-fadeIn" id="certificate-verified-payload">
              <div className="bg-white p-6 rounded-xl border border-emerald-200 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-3.5">
                  <div className="bg-emerald-50 p-2.5 rounded-full text-emerald-600">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <span className="block font-bold text-sm sm:text-base text-slate-900">Record Verification Complete</span>
                    <span className="block text-xs text-slate-500 font-mono">Credential ID: {cert.certificateId} • Cryptographic Hash Stable</span>
                  </div>
                </div>
                
                <button
                  onClick={handleDownloadCertificate}
                  className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors text-white shadow-xs"
                  id="print-certificate-trigger"
                >
                  <Download size={14} />
                  <span>Download PDF Certificate</span>
                </button>
              </div>

              {/* On-Screen Beautiful Certificate Display (Not Printed, but mirrors print Window beautifully) */}
              <div 
                ref={printAreaRef}
                className="bg-white p-8 sm:p-12 rounded-2xl border-x-[12px] border-y-[8px] border-double border-blue-600/30 relative text-center space-y-6 shadow-sm"
              >
                <div className="absolute top-4 right-4 text-[10px] text-slate-400 border border-slate-200 px-2 py-0.5 font-medium rounded">
                  DIGITAL CREDENTIAL COPY
                </div>

                <div className="space-y-2">
                  <Award className="text-blue-600 mx-auto" size={48} />
                  <h2 className="text-2xl sm:text-3xl text-slate-900 font-extrabold">{INSTITUTE_CONFIG.name}</h2>
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-550 block font-semibold text-slate-500">{INSTITUTE_CONFIG.slogan}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  This certifies that candidate <strong className="text-slate-900 border-b border-slate-800 font-bold">{cert.studentName}</strong> has logged complete academic compliance and successfully completed standard practical examinations for the program
                </p>

                <h3 className="text-xl sm:text-2xl text-blue-650 font-serif text-blue-600 font-bold italic tracking-wide">
                  "{cert.course}"
                </h3>

                <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-550 text-slate-500 font-semibold">
                  <div className="text-center">
                    <span className="block text-slate-900 font-extrabold text-sm">{cert.rollNumber}</span>
                    <span className="text-[10px] text-slate-400">ROLL IDENTIFICATION</span>
                  </div>
                  <div className="text-center border-l sm:border-x border-slate-100">
                    <span className="block text-slate-900 font-extrabold text-sm">{new Date(cert.completionDate).toLocaleDateString()}</span>
                    <span className="text-[10px] text-slate-400">COMPLETION DATE</span>
                  </div>
                  <div className="text-center col-span-2 sm:col-span-1 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                    <span className="block text-emerald-600 font-extrabold text-sm">AUTHENTIC ONLINE</span>
                    <span className="text-[10px] text-slate-400">SECURE METRIC</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 font-semibold">
                  <span>Authorized Signature: Dr. K. Narayana Rao</span>
                  <span className="bg-slate-50 px-3 py-1 text-[10px] rounded border border-slate-200">ISO Certified Compliance</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
