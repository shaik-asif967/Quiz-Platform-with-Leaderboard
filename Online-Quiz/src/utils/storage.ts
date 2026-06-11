/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, LeaderboardEntry, QuizAttempt, Quiz } from '../types';
import { QUIZZES } from '../data/quizzes';

const ACTIVE_USER_KEY = 'quiz_arena_active_user';
const ALL_USERS_KEY = 'quiz_arena_all_users';
const CUSTOM_QUIZZES_KEY = 'quiz_arena_custom_quizzes';
const LEADERBOARD_KEY = 'quiz_arena_leaderboard';
const ATTEMPTS_KEY = 'quiz_arena_attempts';

// Default Student Profile - starts at 0 points, Level 0, all stats 0!
const DEFAULT_STUDENT: UserProfile = {
  username: 'asif_quiz',
  fullName: 'Asif Shaik',
  email: 'shaikasif2026@gmail.com',
  points: 0,
  accuracy: 0,
  streak: 0,
  completedQuizzes: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  level: 0, // level starts at 0 as requested
  xp: 0,
  xpToNextLevel: 1000,
  highestScore: 0,
  unlockedBadges: [],
  role: 'student'
};

// Initial base leaderboard where everyone is starting at 0 score
const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'l-1', username: 'alex_champ', fullName: 'Alex', points: 0, accuracy: 0 },
  { id: 'l-2', username: 'sameer', fullName: 'Sarah', points: 0, accuracy: 0 },
  { id: 'l-3', username: 'david_quiz', fullName: 'David', points: 0, accuracy: 0 },
  { id: 'l-4', username: 'michael_b', fullName: 'Michael', points: 0, accuracy: 0 },
  { id: 'l-5', username: 'emily_s', fullName: 'Emily', points: 0, accuracy: 0 },
  { id: 'asif_quiz', username: 'asif_quiz', fullName: 'You (Asif Shaik)', points: 0, accuracy: 0, isCurrentUser: true }
];

// Initialize users database with empty student and sample students if empty
export function initUsersDatabase(): UserProfile[] {
  const stored = localStorage.getItem(ALL_USERS_KEY);
  if (stored) return JSON.parse(stored);

  const initialUsers: UserProfile[] = [
    DEFAULT_STUDENT,
    {
      username: 'alex_champ',
      fullName: 'Alex',
      email: 'alex@academy.edu',
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
      role: 'student'
    },
    {
      username: 'sameer',
      fullName: 'Sameer',
      email: 'sarah@academy.edu',
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
      role: 'student'
    },
    {
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
    }
  ];
  
  localStorage.setItem(ALL_USERS_KEY, JSON.stringify(initialUsers));
  return initialUsers;
}

export function getAllUsers(): UserProfile[] {
  return initUsersDatabase();
}

export function saveAllUsers(users: UserProfile[]): void {
  localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
}

// Session active user management
export function getProfile(): UserProfile {
  const activeUser = localStorage.getItem(ACTIVE_USER_KEY);
  if (!activeUser) {
    // If no active user session, initialize user database and login default student
    initUsersDatabase();
    saveActiveUser(DEFAULT_STUDENT);
    return DEFAULT_STUDENT;
  }
  return JSON.parse(activeUser);
}

export function saveActiveUser(user: UserProfile | null): void {
  if (user) {
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
    // Update inside list of all registered users as well
    const users = getAllUsers();
    const index = users.findIndex(u => u.username === user.username);
    if (index !== -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    saveAllUsers(users);

    // Sync in leaderboard if they are custom student
    if (user.role === 'student') {
      const board = getLeaderboard();
      const userIndex = board.findIndex(entry => entry.username === user.username);
      if (userIndex !== -1) {
        board[userIndex].points = user.points;
        board[userIndex].accuracy = user.accuracy;
      } else {
        board.push({
          id: user.username,
          username: user.username,
          fullName: user.fullName,
          points: user.points,
          accuracy: user.accuracy,
          isCurrentUser: true
        });
      }
      saveLeaderboard(board);
    }
  } else {
    localStorage.removeItem(ACTIVE_USER_KEY);
  }
}

export function saveProfile(profile: UserProfile): void {
  saveActiveUser(profile);
}

// Leaderboard storage helpers
export function getLeaderboard(): LeaderboardEntry[] {
  const data = localStorage.getItem(LEADERBOARD_KEY);
  if (!data) {
    saveLeaderboard(INITIAL_LEADERBOARD);
    return INITIAL_LEADERBOARD;
  }
  
  // Re-sync each student score from user list to keep it perfectly integrated
  const parsedBoard: LeaderboardEntry[] = JSON.parse(data);
  const users = getAllUsers();
  const currentActive = getProfile();

  const syncedBoard = parsedBoard.map(entry => {
    const userMatched = users.find(u => u.username === entry.username);
    if (userMatched) {
      return {
        ...entry,
        points: userMatched.points,
        accuracy: userMatched.accuracy,
        fullName: userMatched.username === currentActive.username ? `You (${userMatched.fullName})` : userMatched.fullName,
        isCurrentUser: userMatched.username === currentActive.username
      };
    }
    return entry;
  });

  return syncedBoard;
}

export function saveLeaderboard(board: LeaderboardEntry[]): void {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board));
}

// Attempt logging
export function getAttempts(): QuizAttempt[] {
  const data = localStorage.getItem(ATTEMPTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function recordAttempt(attempt: QuizAttempt, quiz: Quiz): UserProfile {
  let attempts = getAttempts();
  attempts.push(attempt);
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));

  const profile = getProfile();
  
  // Update totals
  profile.completedQuizzes += 1;
  profile.correctAnswers += attempt.correctCount;
  
  const totalQuestionsInThisAttempt = quiz.questions.length;
  profile.totalAnswers += totalQuestionsInThisAttempt;
  
  // Calculate aggregate accuracy
  profile.accuracy = Math.round((profile.correctAnswers / profile.totalAnswers) * 100);
  
  // Calculate points gained
  const pointsIncrement = attempt.pointsEarned;
  profile.points += pointsIncrement;
  
  // Update highest score records
  if (pointsIncrement > profile.highestScore) {
    profile.highestScore = pointsIncrement;
  }

  // Handle XP increments and dynamic level-ups
  profile.xp += pointsIncrement;
  while (profile.xp >= profile.xpToNextLevel) {
    profile.xp -= profile.xpToNextLevel;
    // levels increment elegantly in integer steps starting from 0
    profile.level += 1;
    // Scale subsequent level targets
    profile.xpToNextLevel = 1000 + profile.level * 250;
  }

  // Handle active badges awards
  const badgesToAward: string[] = [...profile.unlockedBadges];
  
  if (!badgesToAward.includes('beginner') && profile.completedQuizzes >= 1) {
    badgesToAward.push('beginner');
  }
  if (!badgesToAward.includes('silver') && profile.points >= 1500) {
    badgesToAward.push('silver');
  }
  if ((quiz.difficulty === 'medium' || quiz.difficulty === 'hard') && attempt.accuracyRate === 100) {
    if (!badgesToAward.includes('gold')) {
      badgesToAward.push('gold');
    }
  }
  if (profile.completedQuizzes >= 5 && profile.accuracy >= 90) {
    if (!badgesToAward.includes('quiz_king')) {
      badgesToAward.push('quiz_king');
    }
  }
  
  const fullDurationSeconds = quiz.durationMinutes * 60;
  if (attempt.timeSpentSeconds <= (fullDurationSeconds / 2)) {
    if (!badgesToAward.includes('speed_demon')) {
      badgesToAward.push('speed_demon');
    }
  }

  profile.unlockedBadges = badgesToAward;
  saveProfile(profile);

  return profile;
}

// Custom Quizzes dynamically created by admin
export function getCustomQuizzes(): Quiz[] {
  const data = localStorage.getItem(CUSTOM_QUIZZES_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveCustomQuiz(quiz: Quiz): void {
  const list = getCustomQuizzes();
  list.push(quiz);
  localStorage.setItem(CUSTOM_QUIZZES_KEY, JSON.stringify(list));
}

// Merges basic embedded deck + custom administrator created quizzes
export function getAllQuizzesCombined(): Quiz[] {
  const custom = getCustomQuizzes();
  return [...QUIZZES, ...custom];
}

// Complete storage reset to clean slate
export function resetStorage(): void {
  localStorage.removeItem(ACTIVE_USER_KEY);
  localStorage.removeItem(ALL_USERS_KEY);
  localStorage.removeItem(CUSTOM_QUIZZES_KEY);
  localStorage.removeItem(LEADERBOARD_KEY);
  localStorage.removeItem(ATTEMPTS_KEY);
}
