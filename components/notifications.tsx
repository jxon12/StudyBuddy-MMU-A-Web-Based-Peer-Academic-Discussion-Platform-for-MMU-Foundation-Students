import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Triangle, MessageCircle, Award, CheckCircle2, Trash2, Megaphone } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../src/services/supabaseClient';

export interface NotificationItem {
  id: string;
  type: 'upvote' | 'reply' | 'achievement' | 'announcement';
  title: string;
  content: string;
  timestamp: string;
  isUnread: boolean;
  avatar?: string;
}

interface NotificationsPanelProps {
  key?: string;
  onBack: () => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'upvote',
    title: 'Your answer was upvoted!',
    content: 'Lee Seng and 14 other peers upvoted your comment in CMT 1134 Mathematics III.',
    timestamp: '10m ago',
    isUnread: true,
  },
  {
    id: 'notif-2',
    type: 'reply',
    title: 'Sophia Lim replied to your thread',
    content: '"Thank you so much for the K-Map layout cheat sheet, this saved my homework workflow!"',
    timestamp: '1h ago',
    isUnread: true,
    avatar: 'https://i.pinimg.com/1200x/89/ee/ec/89eeec45982a6e3757d27082d68d03b8.jpg',
  },
  {
    id: 'notif-3',
    type: 'achievement',
    title: 'Rank Level Up! 🎉',
    content: 'Your helping contribution score hit 310 points! You have unlocked the "Silver Buddy" tier badge.',
    timestamp: '3h ago',
    isUnread: false,
  },
  {
    id: 'notif-4',
    type: 'announcement',
    title: 'New Class Announcement',
    content: 'Dr. Aminah pinned a new reference repository: "Agile Scrum Practices for CSP1123 Mini IT Project".',
    timestamp: '1d ago',
    isUnread: false,
  },
  {
    id: 'notif-5',
    type: 'reply',
    title: 'Instructor Contributor feedback',
    content: 'Prof. Zulkipli Ali marked your multi-dimensional program code reference as "Recommended Reader".',
    timestamp: '2d ago',
    isUnread: false,
  },
];

export function NotificationsPanel({ onBack }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('mmu_studybuddy_notifications_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const loadNotificationsFromSupabase = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase
          .from('studybuddy_notifications')
          .select('*')
          .order('created_at', { ascending: false });
        if (data && data.length > 0) {
          const mapped = data.map((d: any) => ({
            id: d.id,
            type: d.type as any,
            title: d.title,
            content: d.content,
            timestamp: new Date(d.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            isUnread: d.is_unread,
            avatar: d.avatar || undefined
          }));
          setNotifications(mapped);
          localStorage.setItem('mmu_studybuddy_notifications_v1', JSON.stringify(mapped));
        }
      } catch (err) {
        console.warn('Failed to load notifications from Supabase:', err);
      }
    }
  };

  useEffect(() => {
    loadNotificationsFromSupabase();
  }, []);

  const saveNotifications = async (updated: NotificationItem[]) => {
    setNotifications(updated);
    localStorage.setItem('mmu_studybuddy_notifications_v1', JSON.stringify(updated));
  };

  // Sound effect
  const playCustomTap = (freq = 600, duration = 0.08) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq / 2, ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const handleMarkAllRead = async () => {
    playCustomTap(700, 0.1);
    const updated = notifications.map(n => ({ ...n, isUnread: false }));
    saveNotifications(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('studybuddy_notifications')
          .update({ is_unread: false })
          .eq('is_unread', true);
      } catch (err) {
        console.error('Failed to mark all read in Supabase:', err);
      }
    }
  };

  const handleClearAll = async () => {
    playCustomTap(400, 0.15);
    saveNotifications([]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('studybuddy_notifications')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      } catch (err) {
        console.error('Failed to clear notifications in Supabase:', err);
      }
    }
  };

  const toggleSingleRead = async (id: string) => {
    playCustomTap(580, 0.07);
    const target = notifications.find(n => n.id === id);
    const updatedStatus = target ? !target.isUnread : false;
    
    const updated = notifications.map(n => 
      n.id === id ? { ...n, isUnread: updatedStatus } : n
    );
    saveNotifications(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('studybuddy_notifications')
          .update({ is_unread: updatedStatus })
          .eq('id', id);
      } catch (err) {
        console.error('Failed to toggle read in Supabase:', err);
      }
    }
  };

  const deleteSingle = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playCustomTap(450, 0.08);
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('studybuddy_notifications')
          .delete()
          .eq('id', id);
      } catch (err) {
        console.error('Failed to delete notification in Supabase:', err);
      }
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'upvote':
        return <Triangle className="w-4 h-4 text-emerald-400 fill-emerald-100/15" />;
      case 'reply':
        return <MessageCircle className="w-4 h-4 text-blue-400" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-purple-400" />;
    }
  };

  const unreadCount = notifications.filter(n => n.isUnread).length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/60 backdrop-blur-sm">
      {/* Click outside to close */}
      <div 
        className="absolute inset-0 cursor-default" 
        onClick={() => {
          playCustomTap(450, 0.08);
          onBack();
        }}
      />

      {/* Sliding notifications tray */}
      <motion.div
        initial={{ x: '100%', opacity: 0.9 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0.9 }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="w-full max-w-md h-full bg-zinc-950/95 border-l border-white/10 p-6 flex flex-col justify-between relative z-[110] shadow-2xl backdrop-blur-2xl"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-zinc-350" />
              <div>
                <h3 className="text-sm font-black tracking-widest text-white uppercase">Notification Desk</h3>
                {unreadCount > 0 && (
                  <p className="text-[11px] font-bold text-amber-400 mt-0.5">{unreadCount} unread alert{unreadCount > 1 ? 's' : ''}</p>
                )}
              </div>
            </div>
            
            <button
              onClick={() => {
                playCustomTap(400, 0.08);
                onBack();
              }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions Actions */}
          {notifications.length > 0 && (
            <div className="flex justify-between items-center mb-4 text-[11px] font-bold text-zinc-400">
              <button 
                onClick={handleMarkAllRead}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md"
              >
                <CheckCircle2 className="w-3 h-3" />
                Mark all read
              </button>
              <button 
                onClick={handleClearAll}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 px-2.5 py-1 rounded-md"
              >
                <Trash2 className="w-3 h-3" />
                Clear all
              </button>
            </div>
          )}

          {/* List Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3.5 pr-1">
            <AnimatePresence mode="popLayout">
              {notifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => toggleSingleRead(notif.id)}
                  className={`p-4 rounded-2xl border transition-all relative overflow-hidden group cursor-pointer ${
                    notif.isUnread 
                      ? 'bg-gradient-to-r from-blue-500/10 to-transparent border-blue-500/30' 
                      : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1]'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Circle Icon Badge */}
                    {notif.avatar ? (
                      <img 
                        src={notif.avatar} 
                        alt="sender" 
                        className="w-8 h-8 rounded-full border border-white/10 mt-0.5 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                        {getIcon(notif.type)}
                      </div>
                    )}

                    {/* Text block details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-[13px] font-bold text-white truncate pr-4">{notif.title}</h4>
                        <span className="text-[9.5px] font-mono font-bold text-zinc-500 shrink-0">{notif.timestamp}</span>
                      </div>
                      
                      <p className="text-[12px] text-zinc-400 leading-relaxed font-medium">
                        {notif.content}
                      </p>
                    </div>
                  </div>

                  {/* Actions inside individual card on hover */}
                  <button
                    onClick={(e) => deleteSingle(notif.id, e)}
                    className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Dismiss Notification"
                  >
                    <X className="w-3 h-3 text-zinc-500 hover:text-red-400" />
                  </button>

                  {/* Unread Pill indicator */}
                  {notif.isUnread && (
                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {notifications.length === 0 && (
              <div className="h-4/5 flex flex-col items-center justify-center text-center p-8 space-y-4 text-zinc-500">
                <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-zinc-600">
                  <Bell className="w-6 h-6 stroke-1" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-zinc-400">All caught up!</h4>
                  <p className="text-xs leading-normal max-w-[200px] text-zinc-500">You don't have any notifications right now.</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/5 mt-auto text-center">
            <span className="text-[10px] text-zinc-650 font-semibold tracking-wider font-mono">STUDYBUDDY NOTIFICATION HUBS</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
