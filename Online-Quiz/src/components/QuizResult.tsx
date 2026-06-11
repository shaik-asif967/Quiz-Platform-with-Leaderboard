/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  RotateCcw, 
  Home, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Award, 
  Flame, 
  Crown, 
  Sparkles, 
  Share2, 
  ChevronDown, 
  ChevronUp,
  Twitter,
  MessageCircle,
  Facebook,
  Instagram
} from 'lucide-react';
import { Quiz, QuizAttempt } from '../types';

interface QuizResultProps {
  quiz: Quiz;
  attempt: QuizAttempt;
  onRestart: () => void;
  onGoToLeaderboard: () => void;
  onGoHome: () => void;
}

export default function QuizResult({
  quiz,
  attempt,
  onRestart,
  onGoToLeaderboard,
  onGoHome
}: QuizResultProps) {
  const [showReview, setShowReview] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getAccuracyColor = (rate: number) => {
    if (rate >= 85) return 'text-emerald-400 stroke-emerald-500';
    if (rate >= 50) return 'text-amber-400 stroke-amber-500';
    return 'text-rose-400 stroke-rose-500';
  };

  const toggleQuestionReview = (index: number) => {
    setExpandedQuestion(prev => (prev === index ? null : index));
  };

  const handleShare = (platform: string) => {
    const text = `🎉 I just scored ${attempt.pointsEarned} points with ${attempt.accuracyRate}% accuracy on the "${quiz.title}"! Can you beat my high score on this leaderboard? 🧠🏆`;
    setShareFeedback(`Link copied for ${platform}! "${text}"`);
    setTimeout(() => setShareFeedback(null), 3000);
  };

  // SVG Gauge calculations
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (attempt.accuracyRate / 100) * circumference;

  const totalBonusPoints = attempt.speedBonusPoints + attempt.perfectBonusPoints;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Celebration Header Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-2 py-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-violet-500/5 to-transparent pointer-events-none" />
        
        {attempt.accuracyRate >= 80 ? (
          <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto border-2 border-amber-500/20 animate-pulse">
            <Crown className="w-8 h-8 fill-amber-500/10" />
          </div>
        ) : (
          <div className="w-16 h-16 bg-violet-500/10 text-violet-400 rounded-full flex items-center justify-center mx-auto border-2 border-violet-500/20">
            <Trophy className="w-8 h-8 fill-violet-500/10" />
          </div>
        )}

        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {attempt.accuracyRate >= 85 ? 'Outstanding Performance!' : attempt.accuracyRate >= 50 ? 'Knowledgeable Effort!' : 'Keep Learning!'}
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You processed and finished the "{quiz.title}" challenge. Here is your educational breakdown:
          </p>
        </div>
      </motion.div>

      {/* Accuracy Gauge & Key Results block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Radial Chart Graph */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden h-full">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accuracy Rating</span>
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG circle track */}
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-slate-800"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <motion.circle
                cx="72"
                cy="72"
                r={radius}
                className={getAccuracyColor(attempt.accuracyRate)}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
            
            {/* Numeric center overlay */}
            <div className="absolute text-center">
              <span className="text-3xl font-black text-slate-100 tracking-tight">{attempt.accuracyRate}%</span>
              <p className="text-[9px] uppercase font-semibold text-slate-500 tracking-wider">success</p>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            <span>{attempt.correctCount} correct answers out of {quiz.questions.length}</span>
          </div>
        </div>

        {/* Scoring breakdowns */}
        <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/20 p-6 space-y-4 h-full flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Rewards Score Stack</span>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-900">
                <p className="text-[10px] text-slate-500 font-extrabold uppercase">Base Points</p>
                <span className="text-xl font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <Award className="w-5 h-5 text-violet-400" />
                  {attempt.correctCount * 10}
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">+10 points per corrected question</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-900">
                <p className="text-[10px] text-slate-500 font-extrabold uppercase">Power Bonuses</p>
                <span className="text-xl font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400/10" />
                  +{totalBonusPoints}
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">Speed: +{attempt.speedBonusPoints} | Perfect: +{attempt.perfectBonusPoints}</span>
              </div>
            </div>
          </div>

          {/* Large total sum row */}
          <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Combined Yield</p>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-slate-100">{attempt.pointsEarned} Points</span>
                <span className="px-2 py-0.5 rounded bg-violet-600/10 text-violet-400 text-[8px] font-black uppercase tracking-widest border border-violet-500/10 animate-pulse">
                  Double XP
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Duration</span>
              <span className="text-sm font-extrabold text-slate-200 flex items-center justify-end gap-1 mt-0.5">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                {formatTime(attempt.timeSpentSeconds)}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Achievements Unlocked in this run banner (conditional mock) */}
      {attempt.accuracyRate === 100 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 text-center sm:text-left flex-col sm:flex-row">
            <div className="p-3 bg-amber-500/10 border border-amber-400/30 text-amber-400 rounded-xl relative">
              <Crown className="w-6 h-6 animate-pulse" />
              <div className="absolute top-0 right-0 -mr-1 -mt-1 w-3 h-3 bg-red-400 rounded-full animate-ping" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-100 text-sm flex items-center gap-1.5 justify-center sm:justify-start">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Achievement Unlocked: Gold Champion
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Rewarded for achieving 100% accuracy on a medium or hard knowledge test. Added to your badge storage container!
              </p>
            </div>
          </div>

          <span className="px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shrink-0 cursor-default">
            +500 Bonus XP
          </span>
        </motion.div>
      )}

      {/* Review Questions Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
        <button
          onClick={() => setShowReview(!showReview)}
          className="w-full flex items-center justify-between font-bold text-slate-200 group cursor-pointer"
        >
          <span className="text-sm tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-violet-500" />
            Review Questions and Explanations ({quiz.questions.length})
          </span>
          <span className="text-xs text-slate-400 font-bold group-hover:text-slate-200 transition-colors flex items-center gap-1">
            {showReview ? 'Hide Key' : 'Reveal Answers'}
            {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </button>

        {showReview && (
          <div className="space-y-3.5 pt-2 divide-y divide-slate-800/85">
            {quiz.questions.map((q, idx) => {
              const selectedIdx = attempt.answers[q.id];
              const isCorrect = selectedIdx === q.correctIndex;
              const isExpanded = expandedQuestion === idx;

              return (
                <div key={q.id} className="pt-3.5 first:pt-0 space-y-2.5">
                  <div 
                    onClick={() => toggleQuestionReview(idx)}
                    className="flex justify-between items-start gap-4 cursor-pointer hover:bg-slate-900/40 p-2.5 rounded-xl transition-all"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-black">QUESTION {idx + 1}</span>
                      <h5 className="font-bold text-slate-200 text-sm leading-snug">
                        {q.text}
                      </h5>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      {isCorrect ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 text-[9px] font-bold uppercase flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          Correct
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/15 text-[9px] font-bold uppercase flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-rose-400" />
                          Incorrect
                        </span>
                      )}
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </div>
                  </div>

                  {/* Expandable answers reviewer */}
                  {isExpanded && (
                    <div className="pl-2 border-l border-slate-800 ml-2 space-y-3 bg-slate-950/20 p-3 rounded-xl">
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => {
                          const wasSelected = selectedIdx === oIdx;
                          const wasCorrectAnswer = q.correctIndex === oIdx;
                          
                          let optStyle = 'border-slate-850 bg-slate-900/20 text-slate-400';
                          if (wasCorrectAnswer) {
                            optStyle = 'border-emerald-500/35 bg-emerald-950/20 text-emerald-400';
                          } else if (wasSelected && !isCorrect) {
                            optStyle = 'border-rose-500/35 bg-rose-950/20 text-rose-400';
                          }

                          return (
                            <div 
                              key={oIdx}
                              className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between gap-2.5 ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {wasCorrectAnswer && <span className="text-[8px] font-black uppercase text-emerald-400">Correct Choice</span>}
                              {wasSelected && !isCorrect && <span className="text-[8px] font-black uppercase text-rose-400">Your Selection</span>}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation card */}
                      {q.explanation && (
                        <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/10 text-[11px] text-slate-300 leading-relaxed space-y-1.5">
                          <span className="font-extrabold text-violet-400 uppercase tracking-widest text-[9px] block">Educational Explanation</span>
                          <p>{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Social Media Score Sharing segment */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 pb-0.5">
          <Share2 className="w-4 h-4 text-violet-400 shrink-0" /> Share result with your friends
        </h4>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { name: 'WhatsApp', color: 'hover:bg-green-600 hover:text-white', icon: MessageCircle },
            { name: 'Twitter (X)', color: 'hover:bg-slate-300 hover:text-black', icon: Twitter },
            { name: 'Instagram', color: 'hover:bg-gradient-to-tr hover:from-orange-500 hover:to-pink-600 hover:text-white', icon: Instagram },
            { name: 'Facebook', color: 'hover:bg-blue-600 hover:text-white', icon: Facebook }
          ].map(platform => (
            <button
              key={platform.name}
              onClick={() => handleShare(platform.name)}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 transition-all font-bold text-xs cursor-pointer ${platform.color}`}
            >
              <platform.icon className="w-4 h-4 shrink-0" />
              {platform.name}
            </button>
          ))}
        </div>

        {shareFeedback && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2.5 bg-slate-950 text-amber-400 border border-amber-500/10 text-xs font-semibold rounded-lg text-center"
          >
            {shareFeedback}
          </motion.div>
        )}
      </div>

      {/* Action buttons (Retry, High Score, Go Back) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-900">
        <button
          onClick={onGoHome}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Home className="w-4 h-4" />
          Dashboard Home
        </button>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onRestart}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Repeat Challenge
          </button>
          
          <button
            onClick={onGoToLeaderboard}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-lg shadow-violet-950/20"
          >
            Show Leaderboard Ranks
            <ChevronRight className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
