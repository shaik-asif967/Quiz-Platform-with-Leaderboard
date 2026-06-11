/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home as HomeIcon, 
  BookOpen, 
  Trophy, 
  User, 
  HelpCircle,
  Brain,
  Sparkles,
  RefreshCw,
  Bell,
  Cpu,
  LogOut,
  Crown
} from 'lucide-react';

import { Quiz, UserProfile, LeaderboardEntry, QuizAttempt } from './types';
import { 
  getProfile, 
  saveProfile, 
  getLeaderboard, 
  recordAttempt, 
  resetStorage,
  getAllQuizzesCombined,
  saveActiveUser,
  initUsersDatabase
} from './utils/storage';

// Import Views
import Dashboard from './components/Dashboard';
import QuizSelection from './components/QuizSelection';
import QuizPlaying from './components/QuizPlaying';
import Leaderboard from './components/Leaderboard';
import ProfileSettings from './components/ProfileSettings';
import QuizResult from './components/QuizResult';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';

type NavView = 'home' | 'quizzes' | 'leaderboard' | 'profile';
type ActiveView = NavView | 'playing' | 'result';

export default function App() {
  const [currentView, setCurrentView] = useState<ActiveView>('home');
  // Initialize user profile from localStorage if one is active, otherwise hold null to show Login Screen
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Track active gameplay quiz state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);

  // Load state on startup
  useEffect(() => {
    // Populate backend base database
    initUsersDatabase();
    
    // Check if session remains active
    const active = localStorage.getItem('quiz_arena_active_user');
    if (active) {
      const parsedUser = JSON.parse(active);
      setProfile(parsedUser);
    }
    
    setQuizzes(getAllQuizzesCombined());
    setLeaderboard(getLeaderboard());
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setProfile(loggedInUser);
    setQuizzes(getAllQuizzesCombined());
    setLeaderboard(getLeaderboard());
    setCurrentView('home');
  };

  const handleLogout = () => {
    saveActiveUser(null);
    setProfile(null);
    setCurrentView('home');
    setSelectedCategory('All');
    setActiveQuiz(null);
    setLastAttempt(null);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    saveProfile(updatedProfile);
    setProfile(updatedProfile);
    setLeaderboard(getLeaderboard());
  };

  const handleResetStats = () => {
    resetStorage();
    handleLogout();
  };

  const handleSelectCategoryFromDashboard = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCurrentView('quizzes');
  };

  const handleStartQuiz = (quizId: string) => {
    const list = getAllQuizzesCombined();
    const targetQuiz = list.find(q => q.id === quizId);
    if (targetQuiz) {
      setActiveQuiz(targetQuiz);
      setCurrentView('playing');
    }
  };

  const handleSubmitAttempt = (attempt: QuizAttempt) => {
    if (!activeQuiz) return;
    
    // Save to storage which updates levels/stats/badges in real-time
    const updatedProfile = recordAttempt(attempt, activeQuiz);
    
    setProfile(updatedProfile);
    setLastAttempt(attempt);
    setLeaderboard(getLeaderboard());
    setCurrentView('result');
  };

  const handleExitQuiz = () => {
    setActiveQuiz(null);
    setCurrentView('quizzes');
  };

  const handleReplayActiveQuiz = () => {
    if (activeQuiz) {
      setLastAttempt(null);
      setCurrentView('playing');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-violet-500 animate-spin mx-auto" />
          <p className="text-sm font-bold">Booting Arena Databases...</p>
        </div>
      </div>
    );
  }

  // Render Login page if no user profile state is registered
  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased justify-center items-center py-12 px-4">
        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // Admin specific workflow
  if (profile.role === 'admin') {
    return (
      <div id="quiz-admin-applet" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-4 py-3.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-extrabold tracking-tight text-sm text-slate-100 flex items-center gap-1.5Col">
                QUIZ ARENA
                <span className="text-[9px] font-black uppercase text-indigo-400 bg-indigo-950/50 rounded-md border border-indigo-800/30 px-1 py-0.1 ml-1 tracking-widest leading-none">
                  ADMIN
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex px-3 py-1 bg-indigo-950 border border-indigo-800/40 text-[10px] font-bold uppercase text-indigo-300 rounded-lg">
                Main Instructor Mode
              </span>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-bold text-red-400 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 overflow-x-hidden">
          <AdminPanel 
            onLogout={handleLogout} 
            availableQuizzesCount={quizzes.length}
          />
        </main>
      </div>
    );
  }

  // Render correct panel based on activeView state
  const renderViewContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <Dashboard
            profile={profile}
            quizzes={quizzes}
            onSelectCategory={handleSelectCategoryFromDashboard}
            onStartQuiz={handleStartQuiz}
            setView={setCurrentView}
          />
        );
      case 'quizzes':
        return (
          <QuizSelection
            quizzes={quizzes}
            onStartQuiz={handleStartQuiz}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        );
      case 'playing':
        return activeQuiz ? (
          <QuizPlaying
            quiz={activeQuiz}
            onSubmitAttempt={handleSubmitAttempt}
            onExitQuiz={handleExitQuiz}
          />
        ) : (
          <p className="text-center text-slate-400 py-10 text-xs">No active quiz loading.</p>
        );
      case 'result':
        return activeQuiz && lastAttempt ? (
          <QuizResult
            quiz={activeQuiz}
            attempt={lastAttempt}
            onRestart={handleReplayActiveQuiz}
            onGoToLeaderboard={() => {
              setLastAttempt(null);
              setActiveQuiz(null);
              setCurrentView('leaderboard');
            }}
            onGoHome={() => {
              setLastAttempt(null);
              setActiveQuiz(null);
              setCurrentView('home');
            }}
          />
        ) : (
          <p className="text-center text-slate-400 py-10 text-xs">No recent score registered.</p>
        );
      case 'leaderboard':
        return (
          <Leaderboard
            profile={profile}
            leaderboardData={leaderboard}
          />
        );
      case 'profile':
        return (
          <ProfileSettings
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onResetStats={handleResetStats}
          />
        );
      default:
        return <p className="text-center py-10 text-xs text-slate-500">View out of bounds.</p>;
    }
  };

  const isPlayingMode = currentView === 'playing' || currentView === 'result';

  return (
    <div id="quiz-applet-shell" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased pb-24">
      {/* Top Application Ribbon Hub */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            onClick={() => {
              if (!isPlayingMode) setCurrentView('home');
            }}
            className={`flex items-center gap-2 cursor-pointer ${isPlayingMode ? 'pointer-events-none' : 'hover:opacity-90'}`}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-950/40">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold tracking-tight text-sm text-slate-100 flex items-center gap-1">
                QUIZ ARENA
                <span className="text-[9px] font-black uppercase text-violet-400 bg-violet-950/50 rounded-md border border-violet-800/30 px-1 py-0.1 ml-1 tracking-widest leading-none">
                  PRO
                </span>
              </h1>
            </div>
          </div>

          {/* Quick Actions & Stats indicators */}
          <div className="flex items-center gap-3">
            {!isPlayingMode && (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2"
              >
                <div 
                  onClick={() => setCurrentView('profile')}
                  className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 py-1.5 px-3 rounded-xl cursor-pointer hover:border-slate-700 transition-all text-xs"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-extrabold text-slate-200">{profile.points.toLocaleString()} XP</span>
                </div>
                
                <div 
                  onClick={() => setCurrentView('leaderboard')}
                  className="bg-slate-900 border border-slate-800 py-1.5 px-3 rounded-xl cursor-pointer hover:border-slate-700 transition-all flex items-center gap-1.5 text-xs text-slate-300 font-bold"
                >
                  <span className="text-violet-400">Level:</span>
                  <span className="text-slate-100">{profile.level}</span>
                </div>
              </motion.div>
            )}

            {!isPlayingMode && (
              <button
                onClick={handleLogout}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-slate-900/50 flex items-center gap-1 border border-transparent hover:border-slate-800"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Primary Scrollable Stage Area - Wider for whole window full desktop experience */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderViewContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Bottom Navigator bar (Hides during active playing session) */}
      {!isPlayingMode && (
        <nav className="fixed bottom-0 inset-x-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-900/90 py-2.5 px-4 z-40">
          <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
            {[
              { id: 'home', label: 'Home', icon: HomeIcon },
              { id: 'quizzes', label: 'Quizzes', icon: BookOpen },
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
              { id: 'profile', label: 'Profile', icon: User }
            ].map(tab => {
              const isActive = currentView === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    // Reset category back to 'All' when clicking quizzes tab directly 
                    if (tab.id === 'quizzes') setSelectedCategory('All');
                    setCurrentView(tab.id as ActiveView);
                  }}
                  className="flex flex-col items-center justify-center text-center cursor-pointer relative group py-1 rounded-xl transition-all"
                >
                  <div className={`p-1 rounded-lg transition-colors ${
                    isActive ? 'text-violet-400 font-bold' : 'text-slate-500 group-hover:text-slate-300'
                  }`}>
                    <tab.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold tracking-tight transition-all leading-tight ${
                    isActive ? 'text-violet-300 font-extrabold' : 'text-slate-500 group-hover:text-slate-400'
                  }`}>
                    {tab.label}
                  </span>

                  {/* Dynamic background highlight indicator */}
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav-dot"
                      className="absolute bottom-0 w-8 h-0.5 bg-violet-500 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
