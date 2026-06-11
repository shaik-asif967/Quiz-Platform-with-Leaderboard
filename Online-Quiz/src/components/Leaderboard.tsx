/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Crown, 
  Search, 
  Award, 
  Flame, 
  Zap, 
  ChevronUp, 
  ShieldCheck, 
  Star,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { LeaderboardEntry, UserProfile } from '../types';

interface LeaderboardProps {
  profile: UserProfile;
  leaderboardData: LeaderboardEntry[];
}

type Timeframe = 'daily' | 'weekly' | 'monthly' | 'all-time';

export default function Leaderboard({ profile, leaderboardData }: LeaderboardProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('weekly');

  // Compute realistic scores for different timeframes so they feel dynamic and fully interactive.
  const processedData = useMemo(() => {
    let scale = 1;
    let offsetFactor = 0;
    
    switch (timeframe) {
      case 'daily':
        scale = 0.03; // Daily points are a fraction
        offsetFactor = 40;
        break;
      case 'weekly':
        scale = 0.15; // Weekly points
        offsetFactor = 150;
        break;
      case 'monthly':
        scale = 0.45; // Monthly points
        offsetFactor = 450;
        break;
      case 'all-time':
      default:
        scale = 1.0; // Raw point tally
        offsetFactor = 0;
        break;
    }

    const modifiedEntries = leaderboardData.map(entry => {
      let finalPoints = Math.round(entry.points * scale + (entry.username.charCodeAt(0) % 5) * offsetFactor);
      
      // Keep currentUser aligned relative to actual profile points logic
      if (entry.isCurrentUser) {
        if (timeframe === 'all-time') {
          finalPoints = profile.points;
        } else if (timeframe === 'monthly') {
          finalPoints = Math.round(profile.points * 0.45);
        } else if (timeframe === 'weekly') {
          finalPoints = Math.round(profile.points * 0.18);
        } else {
          finalPoints = Math.round(profile.points * 0.04);
        }
      }

      return {
        ...entry,
        points: finalPoints
      };
    });

    // Re-sort descendently based on modified points
    const sorted = [...modifiedEntries].sort((a, b) => b.points - a.points);
    
    // Assign correct sequential ranks
    return sorted.map((entry, idx) => ({
      ...entry,
      rank: idx + 1
    }));
  }, [timeframe, leaderboardData, profile.points]);

  // Extract Podium contestants
  const rank1 = processedData.find(e => e.rank === 1);
  const rank2 = processedData.find(e => e.rank === 2);
  const rank3 = processedData.find(e => e.rank === 3);

  // Remaining contestants (rank 4 downwards)
  const listEntries = processedData.slice(3);

  // Retrieve user's rank status
  const currentUserEntry = processedData.find(e => e.isCurrentUser);
  const currentUserRank = currentUserEntry?.rank || 15;
  const currentUserPoints = currentUserEntry?.points || 2450;

  // Find player ahead of current user to compute dynamic gap
  const nextUpPlayer = useMemo(() => {
    if (!currentUserRank || currentUserRank <= 1) return null;
    return processedData.find(e => e.rank === currentUserRank - 1) || null;
  }, [currentUserRank, processedData]);

  const pointsToCatchUp = nextUpPlayer ? (nextUpPlayer.points - currentUserPoints) : 0;

  // Render a premium styled avatar circle based on full names
  const getAvatarBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-amber-400 border-amber-300 shadow-amber-500/35';
    if (rank === 2) return 'bg-slate-300 border-slate-200 shadow-slate-300/35';
    if (rank === 3) return 'bg-amber-650 border-amber-500/20 shadow-amber-600/35';
    return 'bg-slate-800 border-slate-700';
  };

  return (
    <div className="space-y-6 pb-24 relative">
      {/* Page Title & Filter Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Challengers Arena</h2>
          <p className="text-slate-400 text-sm">Compete in historical rankings to claim reward titles and unlock badges.</p>
        </div>

        {/* Dynamic filters list */}
        <div className="p-1 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center gap-1 overflow-x-auto self-start sm:self-auto max-w-full">
          {(['daily', 'weekly', 'monthly', 'all-time'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                timeframe === tf
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow shadow-indigo-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Podium Block (Custom Flex Absolute Column Heights) */}
      <div className="pt-10 pb-6 rounded-3xl bg-slate-900/30 border border-slate-900/60 shadow-inner overflow-hidden relative">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-md mx-auto grid grid-cols-3 items-end justify-center px-4 gap-2 relative">
          
          {/* Rank 2 (Sarah) - Left Column */}
          {rank2 && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex flex-col items-center text-center space-y-2 group"
            >
              <div className="relative">
                {/* Silver Metal Avatar Rim */}
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-slate-400 overflow-hidden relative shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center bg-slate-800">
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-600 to-slate-400 opacity-30" />
                  <span className="text-lg font-bold text-slate-100 uppercase">{rank2.fullName.charAt(0)}</span>
                </div>
                {/* Silver Medal Badge */}
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-400 border border-slate-300 text-[10px] font-extrabold text-slate-950 flex items-center justify-center shadow">
                  2
                </span>
              </div>
              
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-300 text-xs md:text-sm truncate w-24">
                  {rank2.fullName}
                </h4>
                <p className="text-[10px] text-slate-400 font-extrabold flex items-center justify-center gap-0.5">
                  <Star className="w-3 h-3 text-slate-400 fill-slate-400/15" />
                  {rank2.points.toLocaleString()}
                </p>
              </div>

              {/* Podium Block element */}
              <div className="w-full bg-slate-850 border border-slate-800/80 rounded-t-xl h-20 flex flex-col items-center justify-center shadow-md">
                <span className="text-xl md:text-2xl font-extrabold text-slate-400">🥈</span>
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Runner Up</span>
              </div>
            </motion.div>
          )}

          {/* Rank 1 (Alex) - Center Column (Tallest + Golden Highlight) */}
          {rank1 && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center space-y-2 group relative z-10"
            >
              {/* Crown indicator */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 animate-bounce">
                <Crown className="w-7 h-7 text-amber-400 fill-amber-400/20" />
              </div>

              <div className="relative">
                {/* Golden Master Avatar Rim */}
                <div className="w-18 h-18 md:w-20 md:h-20 rounded-full border-4 border-amber-400 p-0.5 overflow-hidden relative shadow-lg shadow-amber-950/20 group-hover:scale-105 transition-transform flex items-center justify-center bg-slate-800">
                  <div className="w-full h-full rounded-full overflow-hidden relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-yellow-300 opacity-30" />
                    <span className="text-xl font-extrabold text-white uppercase">{rank1.fullName.charAt(0)}</span>
                  </div>
                </div>
                {/* Gold Medal Badge */}
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border border-amber-300 text-[10px] font-extrabold text-slate-950 flex items-center justify-center shadow">
                  1
                </span>
              </div>
              
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-white text-sm md:text-base truncate w-24">
                  {rank1.fullName}
                </h4>
                <p className="text-xs text-amber-400 font-extrabold flex items-center justify-center gap-0.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/10" />
                  {rank1.points.toLocaleString()}
                </p>
              </div>

              {/* Podium Block element */}
              <div className="w-full bg-gradient-to-b from-amber-500/10 to-slate-800/10 border-x border-t border-amber-500/30 rounded-t-xl h-28 flex flex-col items-center justify-center shadow-lg shadow-amber-950/10">
                <span className="text-2xl md:text-3xl font-extrabold text-yellow-400">🥇</span>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-widest mt-1">Champion</span>
              </div>
            </motion.div>
          )}

          {/* Rank 3 (David) - Right Column */}
          {rank3 && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="flex flex-col items-center text-center space-y-2 group"
            >
              <div className="relative">
                {/* Bronze Metal Avatar Rim */}
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-amber-700 overflow-hidden relative shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center bg-slate-800">
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-800 to-amber-650 opacity-30" />
                  <span className="text-lg font-bold text-slate-200 uppercase">{rank3.fullName.charAt(0)}</span>
                </div>
                {/* Bronze Medal Badge */}
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 border border-amber-600 text-[10px] font-extrabold text-slate-100 flex items-center justify-center shadow">
                  3
                </span>
              </div>
              
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-300 text-xs md:text-sm truncate w-24">
                  {rank3.fullName}
                </h4>
                <p className="text-[10px] text-slate-400 font-extrabold flex items-center justify-center gap-0.5">
                  <Star className="w-3 h-3 text-slate-400" />
                  {rank3.points.toLocaleString()}
                </p>
              </div>

              {/* Podium Block element */}
              <div className="w-full bg-slate-850 border border-slate-800/80 rounded-t-xl h-16 flex flex-col items-center justify-center shadow-md">
                <span className="text-xl md:text-2xl font-extrabold text-amber-650">🥉</span>
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">3rd Place</span>
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* Leaderboard Competitor List */}
      <div className="space-y-2.5">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Active Rank Ladder</h3>
        
        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
          {listEntries.map((user, idx) => {
            const isUser = user.isCurrentUser;
            
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                  isUser
                    ? 'bg-gradient-to-r from-violet-900/30 to-indigo-950/30 border-violet-500/40 shadow shadow-violet-950/20'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank positioning indicator */}
                  <span className={`w-6 text-center text-xs font-black ${
                    isUser ? 'text-violet-400 font-extrabold' : 'text-slate-500'
                  }`}>
                    {user.rank}
                  </span>

                  {/* Competitor Avatar */}
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center overflow-hidden relative shrink-0">
                    {isUser ? (
                      <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-indigo-600 opacity-60" />
                    ) : (
                      <div className="absolute inset-0 bg-slate-700 opacity-20" />
                    )}
                    <span className="text-xs font-extrabold text-slate-200 uppercase relative">
                      {user.fullName.charAt(0)}
                    </span>
                  </div>

                  {/* Competitor Profile Details */}
                  <div>
                    <h5 className="text-sm font-bold text-slate-200 flex items-center gap-1.5 leading-tight">
                      {user.fullName}
                      {isUser && (
                        <span className="px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 text-[8px] font-bold uppercase tracking-wider">
                          YOU
                        </span>
                      )}
                    </h5>
                    <p className="text-[10px] text-slate-500 font-semibold tracking-tight uppercase">
                      @{user.username}
                    </p>
                  </div>
                </div>

                {/* Score and Stats */}
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-100 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" />
                    {user.points.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-tight">
                    {user.accuracy}% accuracy
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Persistent Bottom User Personal Rank Card */}
      {currentUserEntry && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-[76px] left-4 right-4 md:left-auto md:right-auto md:w-full md:max-w-3xl bg-slate-900 border border-violet-500/30 p-4 rounded-2xl shadow-xl shadow-slate-950/80 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-extrabold border border-violet-400/30">
              #{currentUserRank}
            </div>
            <div>
              <p className="text-[10px] text-violet-400 uppercase tracking-widest font-bold">Your Standings</p>
              <h4 className="font-extrabold text-slate-100 text-sm">
                Rank #{currentUserRank} • {profile.fullName}
              </h4>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            {/* Catch Up Info panel */}
            {nextUpPlayer ? (
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="text-slate-400 font-normal">Need</span>
                <span className="text-amber-400 font-bold flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {pointsToCatchUp.toLocaleString()} XP
                </span>
                <span className="text-slate-400 font-normal">to overtake</span>
                <span className="text-indigo-400 font-bold flex items-center gap-0.5">
                  {nextUpPlayer.fullName}
                  <span className="text-[9px] font-extrabold text-slate-500">(#{nextUpPlayer.rank})</span>
                </span>
              </div>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                <Crown className="w-4 h-4 text-amber-400" />
                You are currently leading in this tier !
              </span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
