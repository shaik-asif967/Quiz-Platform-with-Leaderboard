/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Target, 
  Flame, 
  BookOpen, 
  Cpu, 
  Globe, 
  Telescope, 
  History, 
  Film, 
  Sparkles, 
  Award, 
  ChevronRight, 
  Tv,
  Star,
  Activity,
  FlameKindling
} from 'lucide-react';
import { UserProfile, Quiz } from '../types';

interface DashboardProps {
  profile: UserProfile;
  quizzes: Quiz[];
  onSelectCategory: (category: string) => void;
  onStartQuiz: (quizId: string) => void;
  setView: (view: 'home' | 'quizzes' | 'leaderboard' | 'profile') => void;
}

export default function Dashboard({ 
  profile, 
  quizzes, 
  onSelectCategory, 
  onStartQuiz,
  setView 
}: DashboardProps) {
  
  // Find featured quiz
  const featuredQuiz = quizzes.find(q => q.id === 'ultimate-tech') || quizzes[0];

  const categories = [
    { name: 'Technology', icon: Cpu, color: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/20' },
    { name: 'Science', icon: Telescope, color: 'text-purple-400 bg-purple-950/40 border-purple-500/20' },
    { name: 'Geography', icon: Globe, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/20' },
    { name: 'History', icon: History, color: 'text-amber-400 bg-amber-950/40 border-amber-500/20' },
    { name: 'Sports', icon: FlameKindling, color: 'text-pink-400 bg-pink-950/40 border-pink-500/20' },
    { name: 'Entertainment', icon: Film, color: 'text-rose-400 bg-rose-950/40 border-rose-500/20' },
    { name: 'General Knowledge', icon: Award, color: 'text-indigo-400 bg-indigo-950/40 border-indigo-500/20' }
  ];

  // Map quiz counts in categories
  const getCategoryCount = (categoryName: string) => {
    return quizzes.filter(q => q.category.toLowerCase() === categoryName.toLowerCase()).length;
  };

  const currentXpPercentage = Math.round((profile.xp / profile.xpToNextLevel) * 100);

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-700 to-slate-900 p-6 md:p-8 border border-violet-500/30 shadow-lg shadow-violet-950/20"
      >
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-40 h-40 rounded-full bg-violet-400/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-12 w-32 h-32 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-slate-950/40 border-2 border-violet-400 flex items-center justify-center overflow-hidden">
                {/* Custom glowing dynamic avatar */}
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-cyan-400 opacity-80" />
                <span className="relative text-2xl font-bold text-white uppercase">{profile.fullName.charAt(0)}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 border-2 border-slate-950 flex items-center justify-center text-[10px] font-extrabold text-slate-950 shadow">
                {profile.level}
              </div>
            </div>
            
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-950/50 text-violet-300 border border-violet-500/20 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                Level {profile.level} Challenger
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Welcome back, {profile.fullName}! 👋
              </h2>
              <p className="text-violet-200 text-sm font-medium mt-0.5">
                Ready to dominate today's educational arena?
              </p>
            </div>
          </div>

          <div className="bg-slate-950/50 backdrop-blur-md rounded-2xl p-4 border border-violet-500/20 min-w-[200px]">
            <div className="flex items-center justify-between text-xs text-violet-300 font-semibold mb-1">
              <span>XP Progressive Progress</span>
              <span>{profile.xp} / {profile.xpToNextLevel} XP</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-violet-900/30">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${currentXpPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 rounded-full"
              />
            </div>
            
            <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-violet-500/10">
              <div className="text-left">
                <p className="text-[10px] text-violet-400 uppercase tracking-wider font-bold">Global Rank</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-white">#15</span>
                  <span className="text-[10px] text-slate-400">of 1,520 players</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-violet-400 uppercase tracking-wider font-bold">Total Power Points</p>
                <span className="text-lg font-extrabold text-amber-400 flex items-center justify-end gap-1">
                  <Trophy className="w-4 h-4 text-amber-400 fill-amber-400/10" />
                  {profile.points.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid Statistics Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Quizzes Complete', 
            val: profile.completedQuizzes, 
            sub: '+2 this week', 
            icon: BookOpen, 
            color: 'text-violet-400',
            glow: 'shadow-violet-950/20',
            bg: 'bg-violet-950/20 border-violet-500/10'
          },
          { 
            label: 'Accuracy Rating', 
            val: `${profile.accuracy}%`, 
            sub: 'Top 10% global average', 
            icon: Target, 
            color: 'text-emerald-400',
            glow: 'shadow-emerald-950/20',
            bg: 'bg-emerald-950/20 border-emerald-500/10'
          },
          { 
            label: 'Achievements', 
            val: `${profile.unlockedBadges.length} Items`, 
            sub: '4 remaining awards', 
            icon: Trophy, 
            color: 'text-amber-400',
            glow: 'shadow-amber-950/20',
            bg: 'bg-amber-950/20 border-amber-500/10'
          },
          { 
            label: 'Day Fire Streak', 
            val: `${profile.streak} Days`, 
            sub: 'High score: 22 days', 
            icon: Flame, 
            color: 'text-orange-400 animate-pulse',
            glow: 'shadow-orange-950/20',
            bg: 'bg-orange-950/20 border-orange-500/10'
          }
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 + 0.1 }}
            className={`rounded-2xl p-4 border bg-slate-900/40 backdrop-blur-sm shadow ${stat.bg} ${stat.glow}`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-slate-400 font-medium tracking-tight truncate pr-1">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color} shrink-0`} />
            </div>
            <p className="text-2xl font-bold text-slate-100 tracking-tight">{stat.val}</p>
            <span className="text-[10px] text-slate-500 font-medium block mt-1">{stat.sub}</span>
          </motion.div>
        ))}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-violet-500" />
            Popular Knowledge Specialties
          </h3>
          <button 
            onClick={() => setView('quizzes')}
            className="text-xs text-violet-400 font-bold hover:text-violet-300 transition-colors flex items-center gap-0.5"
          >
            Review All Quizzes
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.map((cat, idx) => {
            const count = getCategoryCount(cat.name);
            return (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.03 + 0.15 }}
                onClick={() => onSelectCategory(cat.name)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center cursor-pointer transition-all hover:scale-105 hover:-translate-y-1 hover:bg-slate-800/80 hover:shadow-md ${cat.color}`}
              >
                <cat.icon className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold text-slate-200 block truncate w-full">{cat.name}</span>
                <span className="text-[10px] text-slate-400 mt-1">{count} Quiz{count !== 1 && 'zes'}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Featured Quiz Banner */}
      {featuredQuiz && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-amber-500" />
            Seasonal Hot Challenge
          </h3>
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-violet-950/80 to-slate-900 border border-violet-500/20 relative overflow-hidden group shadow-lg"
          >
            {/* Seamless aesthetic design graphic overlay */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none group-hover:scale-105 transition-transform duration-700">
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" 
                alt="Abstract Tech Asset" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="absolute top-0 right-1/4 -mt-12 w-44 h-44 rounded-full bg-violet-500/10 blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 uppercase">
                    <Activity className="w-3 h-3 text-amber-400 animate-pulse" />
                    Double XP Boost
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20">
                    Difficulty: Hard
                  </span>
                </div>
                
                <h4 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors">
                  {featuredQuiz.title}
                </h4>
                
                <p className="text-slate-300 text-sm leading-relaxed">
                  {featuredQuiz.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1 font-semibold">
                    <BookOpen className="w-4 h-4 text-violet-400 font-medium" />
                    {featuredQuiz.questions.length} Questions
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-500/10 font-medium" />
                    {featuredQuiz.points} Reward Points
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <Target className="w-4 h-4 text-cyan-400 font-medium" />
                    {featuredQuiz.durationMinutes} Minutes Max
                  </span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onStartQuiz(featuredQuiz.id)}
                className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-violet-500 hover:bg-violet-600 font-bold text-white shadow-lg shadow-violet-950/50 cursor-pointer active:translate-y-[1px] transition-all flex items-center justify-center gap-2 text-center"
              >
                Play Ultimate Arena
                <ChevronRight className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
