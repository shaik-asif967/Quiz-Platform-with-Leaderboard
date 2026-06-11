/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Brain, 
  ShieldAlert, 
  User, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle,
  PlusCircle,
  Mail,
  Users
} from 'lucide-react';
import { UserProfile } from '../types';
import { getAllUsers, saveActiveUser } from '../utils/storage';

interface LoginProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [role, setRole] = useState<'student' | 'admin'>('student');
  
  // Student Login Fields
  const [selectedStudentUsername, setSelectedStudentUsername] = useState<string>('asif_quiz');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>('');
  const [newFullName, setNewFullName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  
  // Admin Login Fields
  const [adminUsername, setAdminUsername] = useState<string>('admin');
  const [adminPassword, setAdminPassword] = useState<string>('admin');
  const [adminError, setAdminError] = useState<string>('');

  const users = getAllUsers();
  const studentsOnly = users.filter(u => u.role !== 'admin');

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      if (!newUsername.trim() || !newFullName.trim()) return;
      
      const cleanUsername = newUsername.trim().toLowerCase().replace(/\s+/g, '_');
      
      // Check if username already exists
      const existing = users.find(u => u.username === cleanUsername);
      if (existing) {
        alert('This username is already registered. Please choose another or select it from the list.');
        return;
      }

      const registeredProfile: UserProfile = {
        username: cleanUsername,
        fullName: newFullName.trim(),
        email: newEmail.trim() || `${cleanUsername}@academy.edu`,
        points: 0,
        accuracy: 0,
        streak: 0,
        completedQuizzes: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        level: 0, // start of levels is strictly zero
        xp: 0,
        xpToNextLevel: 1000,
        highestScore: 0,
        unlockedBadges: [],
        role: 'student'
      };

      // Add to registered accounts list and login
      saveActiveUser(registeredProfile);
      onLoginSuccess(registeredProfile);
    } else {
      const studentProfile = users.find(u => u.username === selectedStudentUsername);
      if (studentProfile) {
        saveActiveUser(studentProfile);
        onLoginSuccess(studentProfile);
      }
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate credentials
    if (adminUsername === 'admin' && adminPassword === 'admin') {
      const adminProfile = users.find(u => u.role === 'admin') || {
        username: 'admin',
        fullName: 'System Administrator',
        email: 'admin@quizarena.com',
        points: 0,
        accuracy: 0,
        streak: 0,
        completedQuizzes: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        level: 0,
        xp: 0,
        xpToNextLevel: 1000,
        highestScore: 0,
        unlockedBadges: [],
        role: 'admin'
      };
      
      saveActiveUser(adminProfile);
      onLoginSuccess(adminProfile);
    } else {
      setAdminError('Invalid administrator credentials. Try admin/admin.');
    }
  };

  return (
    <div id="login-screen-view" className="min-h-[85vh] flex items-center justify-center p-2">
      <div className="w-full max-w-5xl bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-12 gap-0 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-cyan-600/10 blur-3xl rounded-full pointer-events-none" />

        {/* Brand Sidepanel - 5 cols in large screens */}
        <div className="md:col-span-5 bg-gradient-to-br from-violet-600 via-indigo-700 to-slate-950 p-8 md:p-12 flex flex-col justify-between text-white relative overflow-hidden h-full">
          {/* High quality visual education image overlay with mix-blend-overlay */}
          <div className="absolute inset-0 z-0 opacity-15 mix-blend-overlay pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80" 
              alt="Education Graphic" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-500/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="space-y-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-slate-950/40 border border-white/20 flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-violet-300">Gamified learning</span>
              <h2 className="text-3xl font-extrabold tracking-tight mt-1">Quiz Arena</h2>
            </div>
            <p className="text-violet-100 text-sm leading-relaxed font-medium">
              Step into the main learning battleground. Claim achievements, solve elite quizzes, and monitor status updates on the dashboard.
            </p>
          </div>

          <div className="space-y-6 pt-12 relative z-10">
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-slate-950/40 border border-white/10 px-4 py-3 rounded-2xl">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-violet-100">Play Quizzes. Unlock Your Potential.</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-950/40 border border-white/10 px-4 py-3 rounded-2xl">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-violet-100">Knowledge Powers Every Victory Here.</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-950/40 border border-white/10 px-4 py-3 rounded-2xl">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-violet-100">Compete Today. Become Champion Tomorrow.</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 text-[10px] text-violet-300 font-bold tracking-tight">
              Developed By Shaik Asif
            </div>
          </div>
        </div>

        {/* Content Sidepanel - 7 cols */}
        <div className="md:col-span-7 p-8 md:p-12 bg-slate-950 flex flex-col justify-center">
          {/* Top Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl mb-8">
            <button
              onClick={() => { setRole('student'); setAdminError(''); }}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold tracking-tight flex items-center justify-center gap-2 transition-all cursor-pointer ${
                role === 'student'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              Student Portal
            </button>
            <button
              onClick={() => { setRole('admin'); setAdminError(''); }}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold tracking-tight flex items-center justify-center gap-2 transition-all cursor-pointer ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-4 h-4" />
              Admin Portal
            </button>
          </div>

          {role === 'student' ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Student Dashboard Access</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Ready to test your knowledge? Log in to your profile and review active quizzes.
                </p>
              </div>

              <form onSubmit={handleStudentSubmit} className="space-y-4">
                {isRegistering ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Desired Username</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">@</span>
                        <input
                          type="text"
                          required
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          placeholder="username"
                          className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input
                          type="text"
                          required
                          value={newFullName}
                          onChange={(e) => setNewFullName(e.target.value)}
                          placeholder="Full Name"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-sm focus:border-violet-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Email (Optional)</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="e.g. xxx@gmail.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-sm focus:border-violet-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Select Active Student Profile</label>
                    <div className="grid grid-cols-1 gap-2">
                      {studentsOnly.map(student => (
                        <div
                          key={student.username}
                          onClick={() => setSelectedStudentUsername(student.username)}
                          className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            selectedStudentUsername === student.username
                              ? 'bg-violet-950/20 border-violet-500 text-white'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs">
                              {student.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-bold">{student.fullName}</p>
                              <p className="text-[10px] text-slate-500">@{student.username}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-[10.5px] font-extrabold text-amber-400 block">{student.points} XP</span>
                            <span className="text-[9px] text-slate-400 font-bold block">Lvl {student.level}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 flex flex-col gap-3">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-violet-950/40"
                  >
                    {isRegistering ? 'Complete Registration' : 'Enter Quiz Arena'}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(!isRegistering);
                      setNewUsername('');
                      setNewFullName('');
                      setNewEmail('');
                    }}
                    className="w-full text-center text-xs font-bold text-violet-400 hover:text-violet-300 py-1"
                  >
                    {isRegistering ? '← Back to Existing Students List' : 'Enroll as a New Student'}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Teacher & Admin Portal</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Log in to monitor student metrics, read detailed diagnostic stats, and upload new questions.
                </p>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Admin Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="text"
                      required
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="Username"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-sm focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Admin Security Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-sm focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                </div>

                {adminError && (
                  <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{adminError}</span>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-violet-950/40"
                  >
                    Authenticate as Administrator
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
