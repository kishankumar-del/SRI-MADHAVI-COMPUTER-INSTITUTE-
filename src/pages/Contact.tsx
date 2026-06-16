import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { INSTITUTE_CONFIG } from '../config';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');

    if (!name || !email || !message) {
      setErrorText('Name, email, and message content are required.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Message submission failed');
      }

      setSuccessText(data.message || 'Thank you! Your message has been sent successfully.');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'An unexpected error occurred during dispatch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase block">GET IN TOUCH</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Contact Our Advisory Desk</h1>
          <p className="text-slate-600 max-w-xl mx-auto text-sm">
            Have questions about fees, syllabus structure, slot availability or batch configurations? Connect below.
          </p>
          <div className="h-1 w-20 bg-blue-600 rounded-full mx-auto" />
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Card left: Info Panel */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900">Desk Information</h3>
              <p className="text-xs sm:text-sm text-slate-605 text-slate-600 leading-relaxed">
                Our support team is active from morning to evening. Select an appropriate contact node or file your message directly.
              </p>

              <div className="space-y-4 font-sans text-xs sm:text-sm font-semibold">
                <div className="flex items-start">
                  <MapPin size={20} className="text-blue-600 mr-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-slate-700">{INSTITUTE_CONFIG.contact.address}</span>
                </div>
                <div className="flex items-center">
                  <Phone size={20} className="text-blue-600 mr-4 shrink-0" />
                  <span className="text-slate-700">{INSTITUTE_CONFIG.contact.mobile}</span>
                </div>
                {INSTITUTE_CONFIG.contact.alternateMobile && (
                  <div className="flex items-center">
                    <Phone size={20} className="text-blue-600 mr-4 shrink-0" />
                    <span className="text-slate-700">{INSTITUTE_CONFIG.contact.alternateMobile}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Mail size={20} className="text-blue-600 mr-4 shrink-0" />
                  <span className="text-slate-700 break-all">{INSTITUTE_CONFIG.contact.email}</span>
                </div>
              </div>

              {/* Direct WhatsApp Action Button */}
              <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Instant Dispatch Channels</span>
                <a 
                  href={`https://api.whatsapp.com/send?phone=${INSTITUTE_CONFIG.contact.whatsappNumber}&text=${encodeURIComponent(INSTITUTE_CONFIG.contact.whatsappMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl text-center text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-xs transition-colors"
                >
                  <MessageSquare size={16} />
                  <span>Interactive Chat On WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Google Map Framer */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden h-64 shadow-sm" id="google-maps-frame">
              <iframe
                src={INSTITUTE_CONFIG.contact.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                title={`${INSTITUTE_CONFIG.name} Hub location map`}
              />
            </div>
          </div>

          {/* Card Right: Form Console */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm" id="contact-inquiry-box">
            <h3 className="text-xl font-bold mb-2 text-slate-900">Write A Direct Message</h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">Fill out details below. Fields with * are mandatory.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form alerts */}
              {errorText && (
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs sm:text-sm text-rose-600 flex items-start space-x-2.5 shadow-xs">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
                  <span>{errorText}</span>
                </div>
              )}
              {successText && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs sm:text-sm text-emerald-650 flex items-start space-x-2.5 shadow-xs" id="contact-submit-success-alert">
                  <Sparkles size={16} className="shrink-0 mt-0.5 text-emerald-600" />
                  <span>{successText}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 font-sans">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 font-sans">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                    placeholder="username@domain.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 font-sans">Contact Mobile Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-900 font-medium"
                  placeholder="e.g. +91 XXXXX XXXXX"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 font-sans">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500 resize-none text-slate-900 font-medium"
                  placeholder="Describe your inquiry details..."
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 text-white font-semibold transition-colors flex items-center space-x-2 shadow-xs rounded-full px-8 py-3.5 text-xs sm:text-sm tracking-wide uppercase font-sans"
                  id="contact-send-btn"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin text-white" size={14} />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <Send size={14} className="text-white" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
