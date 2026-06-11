/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  SlidersHorizontal, 
  HelpCircle, 
  Clock, 
  Award, 
  Play, 
  ChevronRight,
  BookOpen,
  Cpu,
  Globe,
  Telescope,
  History,
  Film,
  FlameKindling,
  X
} from 'lucide-react';
import { Quiz, Difficulty } from '../types';

interface QuizSelectionProps {
  quizzes: Quiz[];
  onStartQuiz: (quizId: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function QuizSelection({
  quizzes,
  onStartQuiz,
  selectedCategory,
  onSelectCategory
}: QuizSelectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDifficulty, setActiveDifficulty] = useState<'all' | Difficulty>('all');

  const categories = [
    'All',
    'Technology',
    'Science',
    'Geography',
    'History',
    'Sports',
    'Entertainment',
    'General Knowledge'
  ];

  // Reset search and difficulty filters when category is set externally, if desired.
  // We'll let them play independently too.

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || 
                            quiz.category.toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesDifficulty = activeDifficulty === 'all' || 
                              quiz.difficulty === activeDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyStyles = (diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          dot: 'bg-emerald-400'
        };
      case 'medium':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          dot: 'bg-amber-400'
        };
      case 'hard':
        return {
          bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
          dot: 'bg-rose-400'
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technology': return Cpu;
      case 'science': return Telescope;
      case 'geography': return Globe;
      case 'history': return History;
      case 'sports': return FlameKindling;
      case 'entertainment': return Film;
      default: return Award;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Page Title & Search Bar */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Available Quiz Quests</h2>
          <p className="text-slate-400 text-sm">Select a specialized test to increase your scores and learn new insights.</p>
        </div>

        {/* Search Input Box */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search python, space science, world capitals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/45 focus:border-violet-500 transition-all text-sm"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-800 rounded-full text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Difficulty Toggles */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/60 border border-slate-800/80 overflow-x-auto self-start sm:self-auto shrink-0">
            {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setActiveDifficulty(diff)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  activeDifficulty === diff
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hidden">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                  : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz, index) => {
              const diffStyle = getDifficultyStyles(quiz.difficulty);
              const CatIcon = getCategoryIcon(quiz.category);
              
              return (
                <motion.div
                  key={quiz.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  className="rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/70 p-5 flex flex-col justify-between transition-all hover:border-violet-500/20 group hover:shadow-[0_4px_25px_rgba(139,92,246,0.04)]"
                >
                  <div className="space-y-3">
                    {/* Header Details */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-lg bg-slate-800 text-violet-400 group-hover:bg-violet-950/20 transition-colors">
                          <CatIcon className="w-4 h-4" />
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {quiz.category}
                        </span>
                      </div>
                      
                      {/* Difficulty Tag */}
                      <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${diffStyle.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${diffStyle.dot} animate-pulse`} />
                        {quiz.difficulty}
                      </span>
                    </div>

                    {/* Quiz Body */}
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-100 group-hover:text-violet-300 transition-colors tracking-tight text-lg">
                        {quiz.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {quiz.description || "Challenge yourself with interactive questions covering modern technology and knowledge."}
                      </p>
                    </div>
                  </div>

                  {/* Footer Meta Metrics */}
                  <div className="pt-4 mt-4 border-t border-slate-800/50 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-violet-400" />
                        {quiz.questions.length} Qs
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        {quiz.durationMinutes} Min
                      </span>
                      <span className="flex items-center gap-1 font-bold text-amber-500">
                        <Award className="w-3.5 h-3.5" />
                        +{quiz.points}
                      </span>
                    </div>

                    <button
                      onClick={() => onStartQuiz(quiz.id)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-violet-600 text-slate-200 hover:text-white font-bold text-xs transition-all flex items-center gap-1 group-hover:bg-violet-500 hover:shadow-lg cursor-pointer"
                    >
                      Start Quiz
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-16 text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full border border-dashed border-slate-700 mx-auto flex items-center justify-center text-slate-500">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-300 font-bold text-sm">No quizzes found matching filters</p>
                <p className="text-xs text-slate-500 mt-0.5">Try searching another topic or changing difficulty level settings.</p>
              </div>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setActiveDifficulty('all');
                  onSelectCategory('All');
                }}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
