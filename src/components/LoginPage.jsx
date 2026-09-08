import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage({ role, onRoleChange, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-[100dvh] bg-[#0A0B0F] flex flex-col overflow-hidden">
      {/* Top Bar — Role Switcher */}
      <div className="w-full bg-white/[0.03] backdrop-blur-xl border-b border-white/[0.06] px-4 sm:px-6 py-2.5 flex items-center justify-between z-10">
        <span className="text-[10px] sm:text-[11px] text-gray-500 font-mono tracking-widest uppercase hidden sm:block">Inspection Portal</span>
        <span className="text-[10px] text-gray-500 font-mono sm:hidden">DHL</span>

        <div className="flex items-center gap-0.5 bg-white/[0.05] p-0.5 rounded-full border border-white/[0.08]">
          <button
            onClick={() => onRoleChange('reviewer')}
            className={`text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 rounded-full font-semibold transition-all duration-300 ${
              role === 'reviewer'
                ? 'bg-[#FFCC00] text-black shadow-lg shadow-[#FFCC00]/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Reviewer
          </button>
          <button
            onClick={() => onRoleChange('operator')}
            className={`text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 rounded-full font-semibold transition-all duration-300 ${
              role === 'operator'
                ? 'bg-[#FFCC00] text-black shadow-lg shadow-[#FFCC00]/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Operator
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* LEFT PANEL — DHL Branding (hidden on mobile, visible lg+) */}
        <div className="hidden lg:flex w-1/2 bg-[#FFCC00] relative flex-col justify-between p-10 xl:p-14 overflow-hidden">
          {/* Animated background shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -right-32 -top-32 w-96 h-96 bg-[#D40511]/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-[#D40511]/8 rounded-full blur-2xl"></div>
            <div className="absolute right-10 top-1/2 w-1 h-40 bg-[#D40511]/15 rotate-12"></div>
            <div className="absolute right-16 top-1/3 w-0.5 h-56 bg-[#D40511]/10 rotate-12"></div>
          </div>

          <div className="relative z-10">
            <div className="bg-[#D40511] text-[#FFCC00] inline-block font-black italic text-5xl tracking-tighter px-5 py-1.5 rounded-md shadow-xl shadow-[#D40511]/30">
              DHL
            </div>
            <p className="text-black/60 text-sm font-semibold mt-3 tracking-widest uppercase">Global Forwarding · UK Aviation</p>
          </div>

          <div className="max-w-md relative z-10">
            <h1 className="text-4xl xl:text-5xl font-extrabold text-black leading-[1.1] tracking-tight">
              Aircraft Engine<br />
              Tie-Down<br />
              Inspection
            </h1>
            <p className="text-black/60 text-base mt-5 leading-relaxed">
              Computer Vision powered safety compliance for GE Aerospace engine transport.
            </p>

            <div className="flex gap-8 mt-10">
              {[
                { val: '2,500+', label: 'Engines / Year' },
                { val: '5,000+', label: 'Inspections' },
                { val: '≤1%', label: 'False Positive', accent: true },
              ].map((s, i) => (
                <div key={i}>
                  <div className={`text-3xl font-black ${s.accent ? 'text-[#D40511]' : 'text-black'}`}>{s.val}</div>
                  <div className="text-[10px] text-black/50 font-semibold uppercase tracking-wider mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-black/40 font-mono relative z-10">
            &copy; 2026 DHL · GE Aerospace
          </div>
        </div>

        {/* RIGHT PANEL — Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative">
          {/* Subtle background glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FFCC00]/[0.03] rounded-full blur-[100px] pointer-events-none"></div>

          <div className="w-full max-w-sm relative z-10">
            {/* Mobile DHL logo */}
            <div className="lg:hidden mb-10 text-center">
              <div className="bg-[#D40511] text-[#FFCC00] inline-block font-black italic text-4xl tracking-tighter px-4 py-1 rounded-md shadow-xl shadow-[#D40511]/30">
                DHL
              </div>
              <p className="text-gray-500 text-xs font-medium mt-2.5 tracking-widest uppercase">Aircraft Engine Inspection</p>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Welcome back</h2>
            <p className="text-sm text-gray-400 mt-1.5">
              {role === 'reviewer'
                ? 'Sign in to the safety review dashboard.'
                : 'Sign in to submit your inspection photos.'}
            </p>

            {/* Role Pill */}
            <div className={`mt-5 inline-flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-full border backdrop-blur-sm ${
              role === 'reviewer'
                ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
            }`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${role === 'reviewer' ? 'bg-blue-400' : 'bg-amber-400'}`}></span>
              {role === 'reviewer' ? 'UK Safety Reviewer' : 'Field Operator'}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="text-xs font-medium text-gray-400 block mb-2">Email</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FFCC00] transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === 'reviewer' ? 'reviewer@dhl.com' : 'driver@dhl.com'}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFCC00]/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-[#FFCC00]/20 transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-400 block mb-2">Password</label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FFCC00] transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3.5 pl-11 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFCC00]/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-[#FFCC00]/20 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="rounded bg-white/5 border-white/10 text-[#FFCC00] focus:ring-[#FFCC00]/20 w-4 h-4" />
                  Remember me
                </label>
                <a href="#" className="text-[#FFCC00]/80 hover:text-[#FFCC00] font-medium transition-colors">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2.5 bg-[#FFCC00] hover:bg-[#FFD633] text-black font-extrabold text-sm py-3.5 rounded-xl shadow-xl shadow-[#FFCC00]/15 hover:shadow-[#FFCC00]/25 transition-all duration-300 active:scale-[0.97]"
              >
                <span>Sign In</span>
                <ArrowRight size={16} strokeWidth={3} />
              </button>
            </form>

            <p className="text-[11px] text-gray-500/60 text-center mt-10">
              For internal use only · Authorised personnel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
