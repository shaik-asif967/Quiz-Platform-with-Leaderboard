/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Settings, 
  Mail, 
  User, 
  HelpCircle, 
  RotateCcw, 
  Bell, 
  ShieldAlert, 
  Check, 
  Save, 
  Globe2, 
  Volume2, 
  PenTool, 
  Activity,
  Award,
  Crown,
  Zap,
  Flame,
  Shield,
  Trash2,
  Lock,
  Sparkles,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { UserProfile, Badge } from '../types';
import { BADGES } from '../data/quizzes';

interface ProfileSettingsProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetStats: () => void;
}

export default function ProfileSettings({
  profile,
  onUpdateProfile,
  onResetStats
}: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile.fullName);
  const [editedUsername, setEditedUsername] = useState(profile.username);
  const [editedEmail, setEditedEmail] = useState(profile.email);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Simulation settings toggles
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifsEnabled, setNotifsEnabled] = useState(true);
  const [language, setLanguage] = useState('English');
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  // Map Badge Icon string to React components
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy': return Trophy;
      case 'Shield': return Shield;
      case 'Crown': return Crown;
      case 'Zap': return Zap;
      case 'Flame': return Flame;
      case 'Award':
      default: return Award;
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedName.trim() || !editedUsername.trim() || !editedEmail.trim()) return;

    onUpdateProfile({
      ...profile,
      fullName: editedName,
      username: editedUsername,
      email: editedEmail
    });

    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Competitor Profile & Preferences</h2>
        <p className="text-slate-400 text-sm">Review your achievements, view learning statistics, and manage account preferences.</p>
      </div>

      {/* Main Profile Info Row */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            {/* Elegant avatar container */}
            <div className="relative">
              <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-black text-2xl text-white shadow-xl border border-violet-400/20">
                {profile.fullName.charAt(0)}
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black border-2 border-slate-950">
                LVL {profile.level}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                {profile.fullName}
                {saveSuccess && (
                  <span className="inline-flex items-center gap-0.5 text-xs text-emerald-400 font-bold bg-emerald-950/20 px-2 py-0.5 rounded-lg border border-emerald-500/10">
                    <Check className="w-3 h-3" /> Saved!
                  </span>
                )}
              </h3>
              <p className="text-sm text-slate-400 font-semibold">@{profile.username}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {profile.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setEditedName(profile.fullName);
              setEditedUsername(profile.username);
              setEditedEmail(profile.email);
              setIsEditing(!isEditing);
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Credentials'}
          </button>
        </div>

        {/* Dynamic Edit Panel overlay inline */}
        <AnimatePresence>
          {isEditing && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSaveProfile}
              className="mt-6 pt-6 border-t border-slate-800/80 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold">Display Full Name</label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-violet-500 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold">Username Handle</label>
                  <input
                    type="text"
                    value={editedUsername}
                    onChange={(e) => setEditedUsername(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-violet-500 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold">Email Address</label>
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-violet-500 transition-colors"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 hover:shadow-md text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Historical Stats bento-grid */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Performance Intelligence</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Quizzes Taken', value: profile.completedQuizzes, desc: 'All time submissions' },
            { label: 'Correct Answers', value: `${profile.correctAnswers} / ${profile.totalAnswers}`, desc: 'Total options selected' },
            { label: 'Average Key Accuracy', value: `${profile.accuracy}%`, desc: 'Target correctness rate' },
            { label: 'Highest Quiz Score', value: `${profile.highestScore} Pts`, desc: 'Max singular trial' }
          ].map((card, i) => (
            <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/20 p-4">
              <span className="text-[10px] uppercase font-bold text-slate-500">{card.label}</span>
              <p className="text-2xl font-bold text-white tracking-tight mt-1">{card.value}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Unlocked Achievements Medal Cases</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {BADGES.map((badge) => {
            const isUnlocked = profile.unlockedBadges.includes(badge.id);
            const BadgeIcon = getBadgeIcon(badge.icon);
            
            return (
              <div 
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isUnlocked
                    ? `bg-slate-900/60 border-violet-500/30 shadow-sm shadow-violet-950/10`
                    : 'bg-slate-900/10 border-slate-900 text-slate-400 opacity-60'
                }`}
              >
                <div className="space-y-3">
                  {/* Badge top status indicators */}
                  <div className="flex justify-between items-start">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${badge.color} ${isUnlocked ? 'text-white' : 'text-slate-500 bg-slate-800'}`}>
                      <BadgeIcon className="w-5 h-5 text-current" />
                    </div>
                    {isUnlocked ? (
                      <span className="px-2 py-0.5 text-[8px] font-extrabold text-violet-300 bg-violet-950/40 border border-violet-500/20 rounded-md uppercase tracking-wider flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                        unlocked
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px] font-bold flex items-center gap-1 bg-slate-900/40 rounded px-1.5 py-0.5">
                        <Lock className="w-3 h-3 text-slate-600" /> Locked
                      </span>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <h5 className={`font-bold text-sm ${isUnlocked ? 'text-slate-100 font-bold' : 'text-slate-500'}`}>
                      {badge.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/40 text-[9px] uppercase tracking-wider font-extrabold flex items-center justify-between">
                  <span className="text-slate-500">Criteria:</span>
                  <span className={isUnlocked ? 'text-violet-400' : 'text-slate-600'}>
                    {badge.requirement}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settings Section (Interactive switches) */}
      <div className="space-y-3 pt-4">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Engine Preferences</h4>
        
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 divide-y divide-slate-800/60">
          
          {/* Sounds switch */}
          <div className="py-3.5 flex items-center justify-between first:pt-0">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-slate-200 block">System Audio Micro-feedback</span>
              <span className="text-xs text-slate-400 block pb-1">Play success and failure notes during challenge playing.</span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                soundEnabled ? 'bg-violet-600' : 'bg-slate-800'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                soundEnabled ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Notifications switch */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-slate-200 block">Weekly Reminders & Streak Warnings</span>
              <span className="text-xs text-slate-400 block pb-1">Get custom notifications to protect your consecutive fire streak.</span>
            </div>
            <button
              onClick={() => setNotifsEnabled(!notifsEnabled)}
              className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                notifsEnabled ? 'bg-violet-600' : 'bg-slate-800'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                notifsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Lang Selector */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-slate-200 block">System Interface Language</span>
              <span className="text-xs text-slate-400 block pb-1">Current language active in educational content.</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="English">English (US)</option>
              <option value="Spanish">Español</option>
              <option value="Hindi">हिन्दी</option>
              <option value="Telugu">తెలుగు</option>
            </select>
          </div>

          {/* Dangerous Zone Settings Row */}
          <div className="py-4 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-rose-400 block flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                Database Reset Operations
              </span>
              <span className="text-xs text-slate-400 block">
                Permanently matches back initial state profile metrics, leaderboard contestants, and cleared tests.
              </span>
            </div>

            {isConfirmingClear ? (
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setIsConfirmingClear(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsConfirmingClear(false);
                    onResetStats();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-md shadow-rose-950/20"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Confirm Re-Seed
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsConfirmingClear(true)}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-600 hover:text-black border border-rose-500/20 text-rose-400 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Reset Scores Data
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
