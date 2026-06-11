/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  questions: Question[];
  points: number;
  durationMinutes: number;
  icon: string;
}

export interface UserProfile {
  username: string;
  fullName: string;
  email: string;
  points: number;
  accuracy: number; // percentage (e.g. 87)
  streak: number; // in days
  completedQuizzes: number;
  correctAnswers: number;
  totalAnswers: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  highestScore: number;
  unlockedBadges: string[]; // Badge IDs
  role?: 'student' | 'admin';
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  fullName: string;
  points: number;
  accuracy: number;
  isCurrentUser?: boolean;
}

export interface QuizAttempt {
  quizId: string;
  answers: { [questionId: string]: number }; // questionId -> selectedIndex
  timeSpentSeconds: number;
  pointsEarned: number;
  correctCount: number;
  speedBonusPoints: number;
  perfectBonusPoints: number;
  accuracyRate: number;
}
