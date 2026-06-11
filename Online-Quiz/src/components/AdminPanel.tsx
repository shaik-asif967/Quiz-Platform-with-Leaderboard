/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  PlusCircle, 
  BookOpen, 
  Activity, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Trophy,
  Target,
  Crown,
  ChevronRight,
  LogOut,
  Brain,
  Timer,
  Tag,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { Quiz, UserProfile, Question } from '../types';
import { 
  getAllUsers, 
  getCustomQuizzes, 
  saveCustomQuiz, 
  getAttempts,
  resetStorage
} from '../utils/storage';

interface AdminPanelProps {
  onLogout: () => void;
  availableQuizzesCount: number;
}

export default function AdminPanel({ onLogout, availableQuizzesCount }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'students' | 'add-quiz'>('students');
  const [users, setUsers] = useState<UserProfile[]>(() => getAllUsers().filter(u => u.role !== 'admin'));
  const [customQuizzes, setCustomQuizzes] = useState<Quiz[]>(() => getCustomQuizzes());
  const [attempts, setAttempts] = useState(() => getAttempts());

  // Dynamic Quiz Creation State
  const [quizTitle, setQuizTitle] = useState<string>('');
  const [quizDesc, setQuizDesc] = useState<string>('');
  const [quizCategory, setQuizCategory] = useState<string>('Technology');
  const [quizDifficulty, setQuizDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [quizDuration, setQuizDuration] = useState<number>(3);
  const [quizPoints, setQuizPoints] = useState<number>(200);
  
  // Questions list builder state
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q-1',
      text: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: ''
    }
  ]);

  const handleAddQuestionField = () => {
    const newId = `q-${questions.length + 1}`;
    setQuestions([
      ...questions,
      {
        id: newId,
        text: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        explanation: ''
      }
    ]);
  };

  const handleRemoveQuestionField = (idx: number) => {
    if (questions.length <= 1) return;
    const copied = [...questions];
    copied.splice(idx, 1);
    setQuestions(copied);
  };

  const handleQuestionTextChange = (idx: number, text: string) => {
    const copied = [...questions];
    copied[idx].text = text;
    setQuestions(copied);
  };

  const handleOptionChange = (qIdx: number, oIdx: number, val: string) => {
    const copied = [...questions];
    copied[qIdx].options[oIdx] = val;
    setQuestions(copied);
  };

  const handleCorrectIndexChange = (qIdx: number, selectionVal: number) => {
    const copied = [...questions];
    copied[qIdx].correctIndex = selectionVal;
    setQuestions(copied);
  };

  const handleExplanationChange = (qIdx: number, val: string) => {
    const copied = [...questions];
    copied[qIdx].explanation = val;
    setQuestions(copied);
  };

  const handlePublishQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim() || !quizDesc.trim()) {
      alert('Please fill out the quiz title and descriptions.');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        alert(`Question #${i + 1} has empty text!`);
        return;
      }
      for (let o = 0; o < 4; o++) {
        if (!q.options[o].trim()) {
          alert(`Question #${i + 1} Option ${String.fromCharCode(65 + o)} is empty.`);
          return;
        }
      }
    }

    const uniqueQuizId = `custom-quiz-${Date.now()}`;
    const newQuiz: Quiz = {
      id: uniqueQuizId,
      title: quizTitle.trim(),
      description: quizDesc.trim(),
      category: quizCategory,
      difficulty: quizDifficulty,
      questions: questions.map((q, i) => ({
        ...q,
        id: `q-${uniqueQuizId}-${i}`
      })),
      points: Number(quizPoints) || 200,
      durationMinutes: Number(quizDuration) || 3,
      icon: 'BookOpen' // Fallback icon
    };

    saveCustomQuiz(newQuiz);
    setCustomQuizzes(getCustomQuizzes());
    
    // Reset inputs
    setQuizTitle('');
    setQuizDesc('');
    setQuizPoints(200);
    setQuizDuration(3);
    setQuestions([
      {
        id: 'q-1',
        text: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        explanation: ''
      }
    ]);
    
    alert('Congratulations! Quiz published successfully into the student arena.');
    setActiveTab('students');
  };

  // Helper stats computed summaries
  const totalStudents = users.length;
  const totalPublishedCustom = customQuizzes.length;
  const totalAttemptsCount = attempts.length;

  return (
    <div id="admin-panel-container" className="space-y-6 pb-24">
      {/* Header Admin Strip */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-xl rounded-full" />
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center">
            <Crown className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400">Authenticated Administrator</span>
            <h2 className="text-xl font-black text-slate-100 tracking-tight">Arena Teacher & Control Center</h2>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-red-400 hover:text-red-300 rounded-xl flex items-center gap-2 transition-all cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <LogOut className="w-4 h-4" />
          Disconnect Session
        </button>
      </div>

      {/* Top Level Quick Metrics Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-950/50 border border-violet-800/30 flex items-center justify-center text-violet-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Authorized Students</p>
            <p className="text-xl font-extrabold text-slate-100 tracking-tight">{totalStudents} Members</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-800/30 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Total Active Quizzes</p>
            <p className="text-xl font-extrabold text-slate-100 tracking-tight">{availableQuizzesCount} Quizzes</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-950/50 border border-amber-800/30 flex items-center justify-center text-amber-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Interactive Attempts</p>
            <p className="text-xl font-extrabold text-slate-100 tracking-tight">{totalAttemptsCount} Logs</p>
          </div>
        </div>
      </div>

      {/* Primary Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-900 pb-px">
        <button
          onClick={() => setActiveTab('students')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all relative cursor-pointer ${
            activeTab === 'students'
              ? 'border-violet-500 text-violet-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Students Academic Progress
          </span>
        </button>
        <button
          onClick={() => setActiveTab('add-quiz')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all relative cursor-pointer ${
            activeTab === 'add-quiz'
              ? 'border-violet-500 text-violet-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Establish New Quiz Challenge
          </span>
        </button>
      </div>

      {/* Main Admin Content Stage */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {activeTab === 'students' ? (
            <motion.div
              key="students-progress-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Student progress monitor view */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="p-5 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-100">Student Metrics Ledger</h3>
                    <p className="text-xs text-slate-400">All registered students start strictly at score zero and Level 0 on registration.</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] font-black uppercase text-slate-500 tracking-wider bg-slate-950/20">
                        <th className="p-4 pl-6">Student ID</th>
                        <th className="p-4">Academy Profile</th>
                        <th className="p-4 text-center">Active Level</th>
                        <th className="p-4 text-center">Completed Quizzes</th>
                        <th className="p-4 text-center">Aggregate Accuracy</th>
                        <th className="p-4 text-right pr-6">Accumulated XP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-xs text-slate-500">
                            No active student accounts registered yet.
                          </td>
                        </tr>
                      ) : (
                        users.map((student) => (
                          <tr key={student.username} className="hover:bg-slate-800/20 transition-colors">
                            <td className="p-4 pl-6 font-mono text-xs text-slate-400">@{student.username}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-800/40 font-bold text-xs text-indigo-300 flex items-center justify-center shrink-0">
                                  {student.fullName.charAt(0)}
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-slate-200">{student.fullName}</h4>
                                  <p className="text-[10px] text-slate-500">{student.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-950/40 border border-violet-800/30 text-violet-400">
                                Level {student.level}
                              </span>
                            </td>
                            <td className="p-4 text-center font-bold text-xs text-slate-300">{student.completedQuizzes} Quizzes</td>
                            <td className="p-4 text-center text-xs">
                              <div className="flex items-center justify-center gap-1.5">
                                <Target className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="font-extrabold text-slate-300">{student.accuracy}%</span>
                              </div>
                            </td>
                            <td className="p-4 text-right pr-6">
                              <span className="font-black text-amber-400 text-xs flex items-center justify-end gap-1">
                                <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" />
                                {student.points.toLocaleString()} XP
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dynamic Activities Logs */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-5 space-y-4">
                <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-indigo-500 rounded-full" />
                  Recent Practice Logs ({attempts.length})
                </h3>

                <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-2">
                  {attempts.length === 0 ? (
                    <p className="text-center py-6 text-slate-500 text-xs">No questions played yet by any students.</p>
                  ) : (
                    [...attempts].reverse().map((att, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center justify-between text-xs text-slate-300">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-200">
                            Attempt Session • Earned <span className="text-amber-400">+{att.pointsEarned} XP</span>
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Accuracy achieved: {att.accuracyRate}% • Duration: {att.timeSpentSeconds}s
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-900/20 text-emerald-400 border border-emerald-900/30 text-[10px] font-bold uppercase tracking-wider">
                          Played
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="quiz-generator-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6"
            >
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-violet-400" />
                  Create New Arena quiz challenge
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Define your custom multiple choice trivia deck below.</p>
              </div>

              <form onSubmit={handlePublishQuiz} className="space-y-4">
                {/* Meta Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Quiz Title</label>
                    <input
                      type="text"
                      required
                      value={quizTitle}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      placeholder="e.g. Modern Web Development Mastery"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-bold text-xs focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Brief Description</label>
                    <input
                      type="text"
                      required
                      value={quizDesc}
                      onChange={(e) => setQuizDesc(e.target.value)}
                      placeholder="e.g. Challenge your scope chain knowledge!"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-bold text-xs focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Params Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Category</label>
                    <select
                      value={quizCategory}
                      onChange={(e) => setQuizCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-bold text-xs focus:border-violet-500 focus:outline-none"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Science">Science</option>
                      <option value="Geography">Geography</option>
                      <option value="History">History</option>
                      <option value="Sports">Sports</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="General Knowledge">General Knowledge</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Difficulty</label>
                    <select
                      value={quizDifficulty}
                      onChange={(e) => setQuizDifficulty(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-bold text-xs focus:border-violet-500"
                    >
                      <option value="easy">Easy (150 XP)</option>
                      <option value="medium">Medium (250 XP)</option>
                      <option value="hard">Hard (500 XP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Duration (Min)</label>
                    <div className="relative">
                      <Timer className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="number"
                        min={1}
                        max={30}
                        required
                        value={quizDuration}
                        onChange={(e) => setQuizDuration(Number(e.target.value))}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-bold text-xs focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Point Rewards</label>
                    <div className="relative">
                      <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="number"
                        min={50}
                        max={1000}
                        required
                        value={quizPoints}
                        onChange={(e) => setQuizPoints(Number(e.target.value))}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-bold text-xs focus:border-violet-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Sub-form: Questions Deck Builder */}
                <div className="space-y-6 pt-4 border-t border-slate-800">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Added Questions Array ({questions.length})</h4>
                    <button
                      type="button"
                      onClick={handleAddQuestionField}
                      className="px-3 py-1 bg-violet-950/40 hover:bg-violet-900/50 border border-violet-800/30 text-xs font-bold text-violet-400 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Add Another Question
                    </button>
                  </div>

                  <div className="space-y-4">
                    {questions.map((q, qIndex) => (
                      <div key={q.id} className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3 relative">
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestionField(qIndex)}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                        <span className="text-[10px] font-black uppercase text-violet-400 bg-violet-950/40 border border-violet-800/30 rounded px-1.5 py-0.5 tracking-wider">
                          Question #{qIndex + 1}
                        </span>

                        <div>
                          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mb-1">Question Prompt Text</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Which keyword is block-scoped in JavaScript?"
                            value={q.text}
                            onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium focus:border-violet-500 focus:outline-none"
                          />
                        </div>

                        {/* Options Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.options.map((opt, oIndex) => (
                            <div key={oIndex}>
                              <label className="text-[10px] font-bold text-slate-500 block mb-1">Option {String.fromCharCode(65 + oIndex)}</label>
                              <input
                                type="text"
                                required
                                placeholder={`Option ${String.fromCharCode(65 + oIndex)} text`}
                                value={opt}
                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-violet-500 focus:outline-none"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                          {/* Correct option index select */}
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">Select Correct Answer Option</label>
                            <select
                              value={q.correctIndex}
                              onChange={(e) => handleCorrectIndexChange(qIndex, Number(e.target.value))}
                              className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold focus:border-violet-500"
                            >
                              <option value={0}>Option A is Correct Answer</option>
                              <option value={1}>Option B is Correct Answer</option>
                              <option value={2}>Option C is Correct Answer</option>
                              <option value={3}>Option D is Correct Answer</option>
                            </select>
                          </div>

                          {/* Explanation text */}
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">Diagnostic Explanation (Optional)</label>
                            <input
                              type="text"
                              placeholder="Why is this selected option correct? explanation text"
                              value={q.explanation || ''}
                              onChange={(e) => handleExplanationChange(qIndex, e.target.value)}
                              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-violet-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submission button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-sm rounded-xl cursor-pointer shadow-lg shadow-violet-950/40 flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5 text-white" />
                    Publish Quiz to Active Arena
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
