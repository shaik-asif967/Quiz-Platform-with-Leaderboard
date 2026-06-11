/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Flame, 
  AlertTriangle,
  HelpCircle,
  X,
  Play
} from 'lucide-react';
import { Quiz, Question, QuizAttempt } from '../types';

interface QuizPlayingProps {
  quiz: Quiz;
  onSubmitAttempt: (attempt: QuizAttempt) => void;
  onExitQuiz: () => void;
}

export default function QuizPlaying({
  quiz,
  onSubmitAttempt,
  onExitQuiz
}: QuizPlayingProps) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<{ [qId: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(quiz.durationMinutes * 60);
  const [isConfirmingExit, setIsConfirmingExit] = useState(false);
  
  // Track timestamps per question to award speed bonuses
  // Maps question ID -> epoch timestamp when user viewed it
  const questionViewTimes = useRef<{ [qId: string]: number }>({});
  // Stores speed bonus triggers, e.g., standard quick answers (< 8 seconds)
  const [speedyQuestionIds, setSpeedyQuestionIds] = useState<string[]>([]);

  const questions = quiz.questions;
  const currentQuestion = questions[currentQuestionIdx];

  // Set initial view time for the first question
  useEffect(() => {
    questionViewTimes.current[currentQuestion.id] = Date.now();
  }, [currentQuestionIdx, currentQuestion.id]);

  // Main countdown timer interval
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalSubmission(true); // timed out auto submit
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle choice selection
  const handleSelectOption = (questionId: string, optionIdx: number) => {
    // Save answer
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));

    // Calculate time elapsed since they viewed this question
    const startTime = questionViewTimes.current[questionId];
    if (startTime) {
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      if (elapsedSeconds <= 8) {
        // Answered in under 8 seconds!
        if (!speedyQuestionIds.includes(questionId)) {
          setSpeedyQuestionIds(prev => [...prev, questionId]);
        }
      }
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
    }
  };

  // Perform scoring logic and submit
  const handleFinalSubmission = (isTimeExpired = false) => {
    let correctCount = 0;
    
    // Check points
    questions.forEach(q => {
      const userAns = answers[q.id];
      if (userAns === q.correctIndex) {
        correctCount += 1;
      }
    });

    const basePoints = correctCount * 10;
    
    // Count exact speed bonuses (for correct answers only)
    let speedBonusCount = 0;
    speedyQuestionIds.forEach(qId => {
      const correspondingQuestion = questions.find(q => q.id === qId);
      if (correspondingQuestion && answers[qId] === correspondingQuestion.correctIndex) {
        speedBonusCount += 1;
      }
    });

    const speedBonusPoints = speedBonusCount * 5;
    const isPerfect = correctCount === questions.length;
    const perfectBonusPoints = isPerfect ? 50 : 0;
    
    const totalPointsClaimed = basePoints + speedBonusPoints + perfectBonusPoints;
    const accuracyRate = Math.round((correctCount / questions.length) * 100);
    const timeSpentSeconds = (quiz.durationMinutes * 60) - timeLeft;

    const attempt: QuizAttempt = {
      quizId: quiz.id,
      answers,
      timeSpentSeconds: timeSpentSeconds > 0 ? timeSpentSeconds : 1,
      pointsEarned: totalPointsClaimed,
      correctCount,
      speedBonusPoints,
      perfectBonusPoints,
      accuracyRate
    };

    onSubmitAttempt(attempt);
  };

  // Human readable timer string formatter (e.g. 12:30)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Letter mapping helpers for standard option selections
  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round(((currentQuestionIdx + 1) / questions.length) * 100);

  // Colors for critical timer thresholds
  const getTimerColorClass = () => {
    if (timeLeft < 20) return 'text-rose-500 bg-rose-950/40 border-rose-500/40 animate-pulse';
    if (timeLeft < 60) return 'text-amber-500 bg-amber-950/40 border-amber-500/40';
    return 'text-cyan-400 bg-slate-900 border-slate-800';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 relative">
      {/* Quiz Playing Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsConfirmingExit(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-100 transition-all cursor-pointer shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div>
            <h3 className="font-bold text-white text-base leading-tight">{quiz.title}</h3>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider bg-slate-900 px-2 py-0.5 rounded border border-slate-800/80 mt-1 inline-block">
              {quiz.category}
            </span>
          </div>
        </div>

        {/* Dynamic Timer Display */}
        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-mono font-bold text-sm select-none transition-colors ${getTimerColorClass()}`}>
          <Clock className="w-4 h-4 animate-spin-slow" />
          <span>TIME LEFT: {formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Metric details */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/60 space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-400">Progress Tracker</span>
          <span className="text-violet-400">Question {currentQuestionIdx + 1} of {questions.length}</span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-500">
          <span>Answered: {answeredCount} / {questions.length}</span>
          <span className="text-emerald-400 font-bold flex items-center gap-0.5">
            <Sparkles className="w-3 h-3" />
            +10 Points / Correct Answer
          </span>
        </div>
      </div>

      {/* Primary Focused Question Card */}
      <motion.div
        key={currentQuestionIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        
        {/* Question text */}
        <div className="space-y-2">
          <span className="text-xs text-violet-400 font-extrabold tracking-widest uppercase">Question {currentQuestionIdx + 1}</span>
          <h4 className="text-lg md:text-xl font-bold text-slate-100 leading-snug tracking-tight">
            {currentQuestion.text}
          </h4>
        </div>

        {/* Options lists */}
        <div className="grid grid-cols-1 gap-3.5">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = answers[currentQuestion.id] === idx;
            
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(currentQuestion.id, idx)}
                className={`w-full p-4 rounded-xl border text-left flex items-center gap-3.5 cursor-pointer active:translate-y-[1px] transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-r from-violet-900/40 to-slate-900 border-violet-500 shadow-md shadow-violet-950/20'
                    : 'bg-slate-900/30 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                }`}
              >
                {/* Letter Indicator badge */}
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                  isSelected
                    ? 'bg-violet-500 text-white shadow shadow-violet-400/20'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}>
                  {optionLetters[idx]}
                </span>

                <span className={`text-sm font-semibold transition-colors ${
                  isSelected ? 'text-violet-200' : 'text-slate-300'
                }`}>
                  {option}
                </span>
                
                {isSelected && (
                  <div className="ml-auto flex items-center gap-1 shrink-0">
                    {speedyQuestionIds.includes(currentQuestion.id) && (
                      <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5 animate-bounce">
                        <Flame className="w-3 h-3" />
                        Speed Bonus!
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Playing Control Navigational Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIdx === 0}
          className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer font-bold text-xs flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Question
        </button>

        {currentQuestionIdx < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer font-bold text-xs flex items-center gap-1.5"
          >
            Next Question
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => handleFinalSubmission(false)}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-950/40 text-black font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            Submit Quiz Quest
            <Sparkles className="w-4 h-4 fill-current" />
          </button>
        )}
      </div>

      {/* Confirmation Exit Modal Overlay */}
      {isConfirmingExit && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl"
          >
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1">
              <h4 className="font-bold text-slate-100 text-base">Abandon Active Quiz?</h4>
              <p className="text-xs text-slate-400">
                Are you sure you want to exit? You will lose all current progress, answers, and power bonus multipliers.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsConfirmingExit(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-slate-300 text-xs transition-colors cursor-pointer"
              >
                No, Keep Playing
              </button>
              <button
                onClick={() => {
                  setIsConfirmingExit(false);
                  onExitQuiz();
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 font-bold text-white text-xs transition-colors cursor-pointer"
              >
                Yes, Abandon
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
