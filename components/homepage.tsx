<<<<<<< HEAD
import { motion, AnimatePresence } from "framer-motion";
=======
import { motion, AnimatePresence } from 'motion/react';
>>>>>>> 331adfb541e95bad51a4d491b94bba295b70eae6
import { 
  BookOpen, 
  MessageCircle, 
  Search,
  CheckCircle2,
  MoreHorizontal,
  ArrowLeft,
  Triangle,
  Star,
  Share2,
  Plus,
  Bell,
  User
} from 'lucide-react';
<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react';
import './LiquidGlassCard.css';
import { CreatePostPage } from './createpost';
import { ProfilePage } from './profile';
import { NotificationsPanel } from './notifications';
=======
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './LiquidGlassCard.css';
import { ProfilePage } from './profile';
import { CreatePostPage } from './createpost';
>>>>>>> 331adfb541e95bad51a4d491b94bba295b70eae6

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- Types ---

interface Post {
  id: string;
  author: string;
  avatar: string;
  subject: string;
  chapter: string;
  content: string;
  likes: number;
  replies: number;
  timestamp: string;
  title?: string;
  image?: string;
}

// --- Mock Data ---


const SUBJECTS = [
  // English sub-subjects
  { id: 'lae1113', name: 'LAE1113 Academic English', categoryId: 'english', color: 'bg-[#AF52DE]', chapters: ['Writing Skills', 'Academic Reading', 'Presentation'], cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600' },
  { id: 'lee1113', name: 'LEE1113 Essential English', categoryId: 'english', color: 'bg-[#AF52DE]', chapters: ['Grammar', 'Vocabulary', 'Comprehension'], cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600' },
  { id: 'lce1113', name: 'LCE1113 Communicative English', categoryId: 'english', color: 'bg-[#AF52DE]', chapters: ['Speaking Skills', 'Listening', 'Public Speaking'], cover: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600' },

  // Math sub-subjects
  { id: 'cmt1114', name: 'CMT1114 Mathematics I', categoryId: 'math', color: 'bg-[#5856D6]', chapters: ['Algebra', 'Functions', 'Calculus I'], cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600' },
  { id: 'cmt1124', name: 'CMT1124 Mathematics II', categoryId: 'math', color: 'bg-[#5856D6]', chapters: ['Trigonometry', 'Calculus II', 'Matrices'], cover: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600' },
  { id: 'cmt1134', name: 'CMT 1134 Mathematics III', categoryId: 'math', color: 'bg-[#5856D6]', chapters: ['Calculus', 'Linear Algebra', 'Statistics'], cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600' },

  // Critical Thinking sub-subjects
  { id: 'lct1113', name: 'LCT1113 Critical Thinking', categoryId: 'critical', color: 'bg-[#3634A3]', chapters: ['Logic', 'Arguments', 'Fallacies'], cover: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600' },

  // Technical sub-subjects
  { id: 'cmf1114', name: 'CMF1114 Multimedia Fundamentals', categoryId: 'technical', color: 'bg-[#7D7AFF]', chapters: ['Graphics', 'Audio & Video', 'Animation'], cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600' },
  { id: 'cds1114', name: 'CDS1114 Intro to Digital System', categoryId: 'technical', color: 'bg-[#7D7AFF]', chapters: ['Binary Logic', 'Gates', 'Circuit Design'], cover: 'https://i.pinimg.com/1200x/51/83/7e/51837ef0af4628e182418b627f93268d.jpg' },
  { id: 'csp1123', name: 'CSP1123 Mini IT Project', categoryId: 'technical', color: 'bg-[#7D7AFF]', chapters: ['Project Planning', 'Development', 'Documentation'], cover: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600' },
  { id: 'cpp1113', name: 'CPP1113 Principles of Physics', categoryId: 'technical', color: 'bg-[#3634A3]', chapters: ['Mechanics', 'Thermodynamics', 'Electricity'], cover: 'https://i.pinimg.com/736x/36/9e/41/369e4128b77f1b098dd57abd412bf723.jpg' },
  { id: 'csp1114', name: 'CSP1114 Program Design', categoryId: 'technical', color: 'bg-[#3634A3]', chapters: ['Algorithms', 'Flowcharts', 'C++ Programming'], cover: 'https://i.pinimg.com/736x/e1/2f/93/e12f9308fd891cb970e280dbadff92d2.jpg' },
  { id: 'gnb1114', name: 'GNB1114 Intro to Business Management', categoryId: 'technical', color: 'bg-[#7D7AFF]', chapters: ['Management Basics', 'Global Business', 'Business Ethics'], cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600' },
  { id: 'cct1114', name: 'CCT1114 Introduction to Computing Tech', categoryId: 'technical', color: 'bg-[#7D7AFF]', chapters: ['Hardware Basics', 'Operating Systems', 'Networking'], cover: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600' }
];


const CATEGORIES = [
  {
    id: 'english',
    name: 'English',
    color: 'bg-[#AF52DE]',
    cover: 'https://i.pinimg.com/736x/91/d4/91/91d491485a1126a79219f01c444d53db.jpg',
    description: 'Academic English, Essential English, Communicative English'
  },
  {
    id: 'math',
    name: 'Mathematics',
    color: 'bg-[#5856D6]',
    cover: 'https://i.pinimg.com/736x/82/66/1e/82661e73c6b7c7f45e316531d4bc895d.jpg',
    description: 'Mathematics 1, Mathematics 2, Mathematics III'
  },
  {
    id: 'critical',
    name: 'Critical Thinking',
    color: 'bg-[#3634A3]',
    cover: 'https://i.pinimg.com/736x/57/88/4e/57884e4c23ddfebea7c9e3690c499925.jpg',
    description: 'LCT1113 Critical Thinking course'
  },
  {
    id: 'technical',
    name: 'Technical & IT Studies',
    color: 'bg-[#7D7AFF]',
    cover: 'https://i.pinimg.com/1200x/51/83/7e/51837ef0af4628e182418b627f93268d.jpg',
    description: 'Multimedia Fundamentals, Intro to Digital system, Mini IT Project, Physics, Programming Design, Intro to Business Management, Introduction to Computing Tech'
  }
];

const MOCK_POSTS: Post[] = [
  // New sub-subject posts
  {
    id: 'new_cct1',
    author: 'Lee Jun Ho',
    avatar: 'https://i.pinimg.com/736x/e7/ec/2c/e7ec2c8eb907e5d1569103503d5bd5ec.jpg',
    subject: 'CCT1114 Introduction to Computing Tech',
    chapter: 'Operating Systems',
    content: 'Just finished drawing a diagram explaining how operating systems schedule processes and handle memory paging. Let me know if anyone needs a copy!',
    likes: 21,
    replies: 5,
    timestamp: '5m ago',
  },
  {
    id: 'new_gnb1',
    author: 'Nurul Huda',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    subject: 'GNB1114 Intro to Business Management',
    chapter: 'Management Basics',
    content: 'Discussing the difference between centralized and decentralized corporate structures. Delegation seems key to scaling a business!',
    likes: 18,
    replies: 3,
    timestamp: '10m ago',
  },
  {
    id: 'new_math1',
    author: 'Goh Jing Yi',
    avatar: 'https://i.pinimg.com/736x/db/61/57/db6157a5818e0252f41a810d0a11e194.jpg',
    subject: 'CMT1114 Mathematics 1',
    chapter: 'Algebra',
    content: 'Brushing up on complex numbers and polynomial functions for Chapter 1. Does anyone have a guide for synthetic division?',
    likes: 34,
    replies: 8,
    timestamp: '15m ago',
  },
  {
    id: 'new_math2',
    author: 'Aiman Hilmi',
    avatar: 'https://i.pinimg.com/736x/40/3b/0f/403b0f6ffd13dc2c84c4e5b5ecb5c8d2.jpg',
    subject: 'CMT1124 Mathematics 2',
    chapter: 'Trigonometry',
    content: 'Working on Pythagorean identities and double-angle formulas. Happy to study together or explain matrices!',
    likes: 41,
    replies: 12,
    timestamp: '30m ago',
  },
  {
    id: 'new_eng1',
    author: 'Sofia Lim',
    avatar: 'https://i.pinimg.com/1200x/89/ee/ec/89eeec45982a6e3757d27082d68d03b8.jpg',
    subject: 'LEE1113 Essential English',
    chapter: 'Grammar',
    content: 'Struggling with subject-verb agreement and conditional clauses. Anyone down for quick vocabulary quizzes before class?',
    likes: 19,
    replies: 4,
    timestamp: '45m ago',
  },
  {
    id: 'new_eng2',
    author: 'Darren Lau',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    subject: 'LCE1113 Communicative English',
    chapter: 'Public Speaking',
    content: 'Practicing eye-contact and posture. Does anyone want to practice presenting theircommunicative speech drafts together?',
    likes: 27,
    replies: 15,
    timestamp: '1h ago',
  },
  {
    id: 'new_tech1',
    author: 'Nisha Pillai',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
    subject: 'CMF1114 Multimedia Fundamentals',
    chapter: 'Animation',
    content: 'Exploring vector graphics and motion lines. Designing standard UI keys for the multimedia course assignment is awesome!',
    likes: 54,
    replies: 23,
    timestamp: '1h ago',
  },
  {
    id: 'new_tech2',
    author: 'Teoh Wei Kang',
    avatar: 'https://i.pinimg.com/736x/90/35/b8/9035b8c8df24d4f533abef7bb10ed0f0.jpg',
    subject: 'CSP1114 Program Design',
    chapter: 'C++ Programming',
    content: 'Just solved nested loop exercises for flowcharts and pseudocode syntax! Hit me up if you want C++ program design cheat sheets.',
    likes: 62,
    replies: 19,
    timestamp: '2h ago',
  },
  // Shuffled for a more natural feed feel
  {
    id: 'mi1',
    author: 'Brendan Tan',
    avatar: 'https://i.pinimg.com/736x/44/26/04/44260448c1d15234d8341b0a4f869a6b.jpg',
    subject: 'CSP1123 Mini IT Project',
    chapter: 'Development',
    content: 'Successfully integrated our database with the frontend! Hardest part of the project so far. Anyone else using Firebase?',
    likes: 78,
    replies: 30,
    timestamp: '2h ago',
  },
  {
    id: 'e1',
    author: 'Ling Yi Qi',
    avatar: 'https://i.pinimg.com/1200x/89/ee/ec/89eeec45982a6e3757d27082d68d03b8.jpg',
    subject: 'LAE1113 Academic English',
    chapter: 'Academic Reading',
    content: 'Struggling with scanning techniques for academic journals. Does anyone have tips for quickly identifying thesis statements in dense articles?',
    likes: 12,
    replies: 5,
    timestamp: '1h ago',
  },
  {
    id: 'm1',
    author: 'Lim Wei Ming',
    avatar: 'https://i.pinimg.com/736x/db/61/57/db6157a5818e0252f41a810d0a11e194.jpg',
    subject: 'CMT 1134 Mathematics III',
    chapter: 'Calculus',
    content: 'Solving the triple integrals in spherical coordinates. The Jacobian factor is always tricky—don\'t forget it!',
    likes: 45,
    replies: 7,
    timestamp: '2h ago',
  },
  {
    id: 'd1',
    author: 'Ahmad Faiz',
    avatar: 'https://i.pinimg.com/736x/40/3b/0f/403b0f6ffd13dc2c84c4e5b5ecb5c8d2.jpg',
    subject: 'CDS1114 Intro to Digital System',
    chapter: 'Gates',
    content: 'Can someone explain the universal property of NAND gates? Trying to implement a XOR using only NAND gates for the lab.',
    likes: 28,
    replies: 12,
    timestamp: '3h ago',
  },
  {
    id: 'p1',
    author: 'Michael Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    subject: 'CPP1113 Principles of Physics',
    chapter: 'Mechanics',
    content: 'Need help understanding Newton\'s Third Law in circular motion. How does centripetal force factor in?',
    likes: 38,
    replies: 9,
    timestamp: '4h ago',
  },
  {
    id: 'c1',
    author: 'Priya Sharma',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    subject: 'LCT1113 Critical Thinking',
    chapter: 'Fallacies',
    content: 'Spotted a "Straw Man" argument in a recent news article. It\'s cool being able to identify these in the real world!',
    likes: 64,
    replies: 8,
    timestamp: '10h ago',
  },
  {
    id: 'e2',
    author: 'Daniel Tan',
    avatar: 'https://i.pinimg.com/736x/e7/ec/2c/e7ec2c8eb907e5d1569103503d5bd5ec.jpg',
    subject: 'LAE1113 Academic English',
    chapter: 'Writing Skills',
    content: 'Just finished my draft for the persuasive essay. Would anyone like to peer-review each other\'s work before submission tomorrow?',
    likes: 8,
    replies: 14,
    timestamp: '4h ago'
  },
  {
    id: 'm2',
    author: 'Arun Kumar',
    avatar: 'https://i.pinimg.com/1200x/d1/11/ba/d111ba73542116f35f268de3cb136c07.jpg',
    subject: 'CMT 1134 Mathematics III',
    chapter: 'Statistics',
    content: 'Does anyone have a cheat sheet for probability distributions? Getting confused between Poisson and Binomial for the upcoming quiz.',
    likes: 32,
    replies: 18,
    timestamp: '5h ago'
  },
  {
    id: 'd2',
    author: 'Chloe Ng',
    avatar: 'https://i.pinimg.com/736x/2f/5c/cd/2f5ccdbd8cd5f72e36ca86dbbe50908e.jpg',
    subject: 'CDS1114 Intro to Digital System',
    chapter: 'Binary Logic',
    content: 'Binary subtraction using 2\'s complement is giving me a headache. Why do we ignore the final carry again?',
    likes: 19,
    replies: 22,
    timestamp: '7h ago'
  },
  {
    id: 'p2',
    author: 'Sarah Jenkins',
    avatar: 'https://i.pinimg.com/736x/9c/cb/45/9ccb45fdfcbf860cb6a8371db6be4a13.jpg',
    subject: 'CPP1113 Principles of Physics',
    chapter: 'Thermodynamics',
    content: 'Entropy concept is so abstract. How do we relate it to disorder in everyday life examples for our reflection paper?',
    likes: 22,
    replies: 15,
    timestamp: '9h ago'
  },
  {
    id: 'c2',
    author: 'Kevin Wong',
    avatar: 'https://i.pinimg.com/736x/d3/26/4e/d3264e87e065c4260b3478e37d5e18e3.jpg',
    subject: 'LCT1113 Critical Thinking',
    chapter: 'Arguments',
    content: 'What is the main difference between inductive and deductive reasoning again? My lecture notes seem to overlap them.',
    likes: 31,
    replies: 13,
    timestamp: '12h ago'
  },
  {
    id: 'mi2',
    author: 'Zulkipli Ali',
    avatar: 'https://i.pinimg.com/736x/90/35/b8/9035b8c8df24d4f533abef7bb10ed0f0.jpg',
    subject: 'CSP1123 Mini IT Project',
    chapter: 'Documentation',
    content: 'The Gantt chart for our project plan is ready. Highly suggest using Trello or Notion for team coordination!',
    likes: 29,
    replies: 11,
    timestamp: '6h ago'
  },
  {
    id: 'e3',
    author: 'Siti Aminah',
    avatar: 'https://i.pinimg.com/1200x/11/e9/cf/11e9cfa768202b002b2f646f2838b3bb.jpg',
    subject: 'LAE1113 Academic English',
    chapter: 'Presentation',
    content: 'Tips for reducing anxiety during the oral presentation? This is my first time presenting in a large hall at MMU!',
    likes: 25,
    replies: 10,
    timestamp: '6h ago'
  },
  {
    id: 'm3',
    author: 'Jason Low',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jason',
    subject: 'CMT 1134 Mathematics III',
    chapter: 'Linear Algebra',
    content: 'Finally understood Eigenvalues! It clicked when I visualized them as scaling factors. Happy to help if someone is struggling.',
    likes: 56,
    replies: 4,
    timestamp: '8h ago'
  },
  {
    id: 'd3',
    author: 'Ravi Teja',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi',
    subject: 'CDS1114 Intro to Digital System',
    chapter: 'Circuit Design',
    content: 'Look at my Karnaugh map simplification for Exercise 4. Did I miss any groupings? The 4x4 grid is huge!',
    likes: 14,
    replies: 6,
    timestamp: '1d ago'
  },
  {
    id: 'p3',
    author: 'Tan Mei Ling',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mei',
    subject: 'CPP1113 Principles of Physics',
    chapter: 'Electricity',
    content: 'Confusion with Kirchhoff\'s Voltage Law when multiple power sources are present. Anyone can check my loop equations?',
    likes: 17,
    replies: 21,
    timestamp: '2d ago'
  },
  {
    id: 'c3',
    author: 'Aisha Razak',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
    subject: 'LCT1113 Critical Thinking',
    chapter: 'Logic',
    content: 'Does anyone want to practice syllogisms? I found a website with cool practice sets for our upcoming test.',
    likes: 42,
    replies: 5,
    timestamp: '1d ago'
  },
  {
    id: 'mi3',
    author: 'Emily Watson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    subject: 'CSP1123 Mini IT Project',
    chapter: 'Project Planning',
    content: 'Struggling to define our project scope. We keep adding features! How are you guys managing "Feature Creep"?',
    likes: 45,
    replies: 25,
    timestamp: '1d ago'
  },
  {
    id: 'e4',
    author: 'James Tan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    subject: 'LAE1113 Academic English',
    chapter: 'Writing Skills',
    content: 'Tips for APA referencing? I always get the indentation and italics wrong for the bibliography section.',
    likes: 15,
    replies: 8,
    timestamp: '2d ago'
  },
  {
    id: 'e5',
    author: 'Liza Wong',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liza',
    subject: 'LAE1113 Academic English',
    chapter: 'Presentation',
    content: 'Anyone want to practice our final presentation together? I have a small classroom booked for tomorrow afternoon.',
    likes: 33,
    replies: 12,
    timestamp: '3d ago'
  },
  {
    id: 'm4',
    author: 'Rajesh G.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    subject: 'CMT 1134 Mathematics III',
    chapter: 'Statistics',
    content: 'Normal distribution table vs calculator—which one is faster for the exam? I find the table more reliable but slow.',
    likes: 21,
    replies: 15,
    timestamp: '15h ago'
  },
  {
    id: 'm5',
    author: 'Su Lin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sulin',
    subject: 'CMT 1134 Mathematics III',
    chapter: 'Linear Algebra',
    content: 'Vector space axioms are confusing. How many do we actually need to prove in a standard test environment?',
    likes: 19,
    replies: 6,
    timestamp: '1d ago'
  },
  {
    id: 'd4',
    author: 'Aiman Khalib',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taufiq',
    subject: 'CDS1114 Intro to Digital System',
    chapter: 'Circuit Design',
    content: 'Difference between Mealy and Moore machines? My state diagram keeps looking like a tangled mess. Help!',
    likes: 37,
    replies: 11,
    timestamp: '5h ago'
  },
  {
    id: 'd5',
    author: 'Moustafa',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ying',
    subject: 'CDS1114 Intro to Digital System',
    chapter: 'Binary Logic',
    content: 'Floating point representation (IEEE 754) is coming out for the quiz. Make sure you know the exponent bias!',
    likes: 24,
    replies: 9,
    timestamp: '2d ago'
  },
  {
    id: 'p4',
    author: 'Vikram S.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
    subject: 'CPP1113 Principles of Physics',
    chapter: 'Mechanics',
    content: 'Projectile motion at an angle. Is the vertical velocity always zero at the peak height? My calculations say yes.',
    likes: 29,
    replies: 4,
    timestamp: '10h ago'
  },
  {
    id: 'p5',
    author: 'Hana Z.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hana',
    subject: 'CPP1113 Principles of Physics',
    chapter: 'Thermodynamics',
    content: 'Heat engines and efficiency. Why is 100% efficiency impossible? Carnot cycle explained simply please.',
    likes: 41,
    replies: 18,
    timestamp: '1d ago'
  },
  {
    id: 'c4',
    author: 'Ivan Wong',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
    subject: 'LCT1113 Critical Thinking',
    chapter: 'Logic',
    content: 'Truth tables with 3 variables (p, q, r). 8 rows is a lot of manual work. Any shortcuts for the final exam?',
    likes: 18,
    replies: 22,
    timestamp: '14h ago'
  },
  {
    id: 'c5',
    author: 'Vinayagam',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
    subject: 'LCT1113 Critical Thinking',
    chapter: 'Arguments',
    content: 'Recognizing implicit premises. This is the hardest part of argument mapping for me. Any good examples?',
    likes: 26,
    replies: 5,
    timestamp: '2d ago'
  },
  {
    id: 'mi4',
    author: 'Wah Teck Hao',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
    subject: 'CSP1123 Mini IT Project',
    chapter: 'Documentation',
    content: 'How detailed should the User Manual be? Do we need screenshots for every single button or just main flows?',
    likes: 31,
    replies: 9,
    timestamp: '1d ago'
  },
  {
    id: 'mi5',
    author: 'Mittyram',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    subject: 'CSP1123 Mini IT Project',
    chapter: 'Development',
    content: 'GitHub merge conflicts are the worst during final submission week. Team, please pull before you push!',
    likes: 85,
    replies: 14,
    timestamp: '2d ago',
  },
];

// --- Components ---

<<<<<<< HEAD
const TopNavigationBar = ({ onSubjectsClick, onComposeClick, onProfileClick, onNotificationsClick, hasUnread }: { onSubjectsClick: () => void; onComposeClick: () => void; onProfileClick: () => void; onNotificationsClick: () => void; hasUnread: boolean }) => {
=======
interface TopNavigationBarProps {
  onSubjectsClick: () => void;
  onProfileClick: () => void;
  onFeedClick: () => void;
  onCreatePostClick: () => void;
  currentView: 'feed' | 'subjects' | 'profile' | 'create';
}

const TopNavigationBar = ({ onSubjectsClick, onProfileClick, onFeedClick, onCreatePostClick, currentView }: TopNavigationBarProps) => {
>>>>>>> 331adfb541e95bad51a4d491b94bba295b70eae6
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b border-white/10">
      <div className="flex items-center justify-between px-8 py-4 h-20">
        {/* Left: Logo */}
        <div 
          onClick={onFeedClick}
          className="text-xl font-bold text-white tracking-tight font-retropix cursor-pointer hover:opacity-80 transition-opacity"
        >
          StudyBuddy
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 mx-12 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
            <input
              type="text"
              placeholder="Search questions or chapters..."
              className="w-full h-11 pl-12 pr-4 bg-white/5 backdrop-blur-xl border border-white/20 rounded-full text-sm text-white placeholder:text-white outline-none focus:border-white/40 focus:bg-white/10 transition-all"
            />
          </div>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-4">
          {/* Subjects Icon */}
          <button 
            onClick={onSubjectsClick}
            className={`p-2.5 rounded-full hover:bg-white/10 transition-colors group ${
              currentView === 'subjects' ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white'
            }`}
            title="Subjects"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          {/* Plus Icon */}
          <button 
<<<<<<< HEAD
            onClick={onComposeClick}
            className="p-2.5 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white group"
=======
            onClick={onCreatePostClick}
            className={`p-2.5 rounded-full hover:bg-white/10 transition-colors group ${
              currentView === 'create' ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white'
            }`}
>>>>>>> 331adfb541e95bad51a4d491b94bba295b70eae6
            title="Create post"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Bell Icon */}
          <button 
            onClick={onNotificationsClick}
            className="p-2.5 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white group relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
<<<<<<< HEAD
            {hasUnread && (
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
=======
>>>>>>> 331adfb541e95bad51a4d491b94bba295b70eae6
          </button>

          {/* Profile Icon */}
          <button 
            onClick={onProfileClick}
<<<<<<< HEAD
            className="p-2.5 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white group"
=======
            className={`p-2.5 rounded-full hover:bg-white/10 transition-colors group ${
              currentView === 'profile' ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white'
            }`}
>>>>>>> 331adfb541e95bad51a4d491b94bba295b70eae6
            title="Profile"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

const getSubjectTagStyles = (subjectName: string) => {
  const name = subjectName.toLowerCase();
  
  if (name.includes('lae1113') || name.includes('lee1113') || name.includes('lce1113') || name.includes('lcc1113') || name.includes('english')) {
    return "text-purple-400 bg-purple-400/10 border border-purple-400/20";
  }
  if (name.includes('cmt') || name.includes('math')) {
    return "text-blue-400 bg-blue-400/10 border border-blue-400/20";
  }
  if (name.includes('cds1114') || name.includes('digital')) {
    return "text-indigo-400 bg-indigo-400/10 border border-indigo-400/20";
  }
  if (name.includes('cpp1113') || name.includes('physics')) {
    return "text-violet-400 bg-violet-400/10 border border-violet-400/20";
  }
  if (name.includes('lct1113') || name.includes('critical')) {
    return "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20";
  }
  if (name.includes('csp1123') || name.includes('mini it') || name.includes('cmf1114') || name.includes('multimedia') || name.includes('csp1114') || name.includes('gnb1114') || name.includes('cct1114') || name.includes('management') || name.includes('computing')) {
    return "text-rose-400 bg-rose-400/10 border border-rose-400/20";
  }
  
  return "text-zinc-500 bg-white/5 border border-white/10";
};

interface PostCardProps {
  post: Post;
  key?: string;
}

const PostCard = ({ post }: PostCardProps) => {
  const [upvoted, setUpvoted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [showMenu, setShowMenu] = useState(false);
  const [shared, setShared] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleUpvote = () => {
    if (upvoted) {
      setLikes(prev => prev - 1);
    } else {
      setLikes(prev => prev + 1);
    }
    setUpvoted(!upvoted);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShared(true);
    setTimeout(() => {
      setShared(false);
      setShowMenu(false);
    }, 2000);
  };

  const subjectTagStyles = getSubjectTagStyles(post.subject);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="liquid-glass-card p-8 mb-6 cursor-default group relative overflow-hidden"
    >
      <div className="relative z-10 flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full border border-white/10" referrerPolicy="no-referrer" />
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-[15px] font-bold text-white tracking-tight">{post.author}</h4>
            </div>
            <p className="text-[12px] text-white font-bold uppercase tracking-wider">{post.timestamp}</p>
          </div>
        </div>
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className={`p-2.5 rounded-full transition-colors ${showMenu ? 'bg-white/10' : 'hover:bg-white/5'}`}
          >
            <MoreHorizontal className="w-4 h-4 text-zinc-500" />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/[0.08] p-2 z-50 origin-top-right overflow-hidden"
              >
                <button 
                  onClick={handleShare}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-all text-left group/item"
                >
                  {shared ? (
                    <div className="flex items-center gap-2 text-green-400 w-full">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[13px] font-bold">Link Copied!</span>
                    </div>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-white group-hover/item:text-white transition-colors" />
                      <span className="text-[13px] font-bold text-white group-hover/item:text-white transition-colors">Share Post</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 mb-6">
        <div className="flex gap-2 mb-5">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full font-apple ${subjectTagStyles}`}>
            {post.subject.match(/^[A-Z]{2,4}\s?\d{4}/)?.[0] || post.subject}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-white/[0.05] px-3 py-1.5 rounded-full border border-white/[0.02]">
            Chapter {post.chapter}
          </span>
        </div>
        
        {post.title && (
          <h3 className="text-xl md:text-2xl font-extrabold text-white mb-3 text-left tracking-tight">
            {post.title}
          </h3>
        )}

        <p className="text-[15px] md:text-[16px] text-zinc-200 leading-relaxed text-left font-medium">
          {post.content}
        </p>

        {post.image && (
          <div className="mt-5 rounded-2xl overflow-hidden border border-white/10 max-h-[420px] bg-black/40">
            <img 
              src={post.image} 
              alt={post.title || "Shared attachment"} 
              className="w-full h-full object-cover max-h-[420px]"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>

      <div className="relative z-10 flex items-center gap-8 pt-6 border-t border-white/[0.05]">
        <button 
          onClick={toggleUpvote}
          className={`flex items-center gap-2 transition-colors group ${upvoted ? 'text-white' : 'text-white hover:text-white'}`}
        >
          <Triangle className={`w-4 h-4 transition-all ${upvoted ? 'text-white fill-white' : 'group-hover:scale-110'}`} />
          <span className="text-[14px] font-bold">{likes} Upvoted</span>
        </button>
        <button className="flex items-center gap-2 text-white hover:text-white transition-colors group">
          <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-[14px] font-bold">{post.replies} Replies</span>
        </button>
        <button 
          onClick={() => setSaved(!saved)}
          className={`flex items-center gap-2 transition-colors group ${saved ? 'text-yellow-500' : 'text-white hover:text-white'}`}
        >
          <Star className={`w-4 h-4 transition-all ${saved ? 'fill-yellow-500' : 'group-hover:scale-110'}`} />
          <span className="text-[14px] font-bold">{saved ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </motion.div>
  );
};

// --- New Subjects Page Component ---

interface SubjectsPageProps {
  onBack: () => void;
  onSelectSubject: (id: string) => void;
  key?: string;
}

const SubjectsPage = ({ onBack, onSelectSubject }: SubjectsPageProps) => {
  // Scroll container refs kept for state reference
  const categoryScrollRef = useRef<HTMLDivElement | null>(null);
  const subSubjectScrollRef = useRef<HTMLDivElement | null>(null);

  // Common highly responsive desktop drag-to-scroll & wheel handler binding
  const bindDragScroll = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      el.style.cursor = 'grabbing';
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      el.style.cursor = 'grab';
    };

    const onMouseUp = () => {
      isDown = false;
      el.style.cursor = 'grab';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walkX = (x - startX) * 1.8; // Scroll multiplier
      el.scrollLeft = scrollLeft - walkX;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY * 1.5;
    };

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('wheel', onWheel, { passive: false });

    // Attach cleanup function to element to make cleanup clean on rebinds or unmounts
    (el as any)._cleanupDragScroll = () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Cleanup map or standard node callbacks to guarantee binding upon component mounting
  const categoryRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (categoryScrollRef.current && (categoryScrollRef.current as any)._cleanupDragScroll) {
      (categoryScrollRef.current as any)._cleanupDragScroll();
    }
    categoryScrollRef.current = node;
    if (node) {
      bindDragScroll(node);
    }
  }, [bindDragScroll]);

  const subSubjectRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (subSubjectScrollRef.current && (subSubjectScrollRef.current as any)._cleanupDragScroll) {
      (subSubjectScrollRef.current as any)._cleanupDragScroll();
    }
    subSubjectScrollRef.current = node;
    if (node) {
      bindDragScroll(node);
    }
  }, [bindDragScroll]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Filter categories based on search query (if any matching name or description, or if they match sub-subject)
  const filteredCategories = CATEGORIES.filter(cat => {
    const mainMatch = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     cat.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (mainMatch) return true;
    
    // Also match if any of its sub subjects contain the query
    const relatedSubs = SUBJECTS.filter(s => s.categoryId === cat.id);
    return relatedSubs.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const handleCategoryClick = (catId: string) => {
    const subSubjects = SUBJECTS.filter(s => s.categoryId === catId);
    if (subSubjects.length === 1) {
      // Direct select if only 1 sub subject (e.g. Critical Thinking)
      onSelectSubject(subSubjects[0].id);
    } else {
      setSelectedCategoryId(catId);
    }
  };

  const activeCategory = CATEGORIES.find(c => c.id === selectedCategoryId);
  const subSubjectsInActiveCategory = SUBJECTS.filter(s => s.categoryId === selectedCategoryId);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden bg-zinc-950"
    >
      {/* Video Background - fallback if no video is mounted, using high contrast image or gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(24,24,27,0.7),rgba(9,9,11,1))]" />
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover opacity-50 select-none pointer-events-none"
      >
        <source src="/videos/subject_video.mp4" type="video/mp4" />
      </video>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 z-0 bg-black/40" />

      {/* Back button */}
      <button 
        onClick={selectedCategoryId ? () => setSelectedCategoryId(null) : onBack}
        className="absolute top-8 left-12 md:left-32 p-4 rounded-full shadow-2xl hover:shadow-white/5 transition-all active:scale-90 z-50 group backdrop-blur-2xl border bg-white/5 border-white/10 cursor-pointer"
        title={selectedCategoryId ? "Back to Categories" : "Back to Home"}
      >
        <ArrowLeft className="w-5 h-5 transition-colors text-zinc-400 group-hover:text-white" />
      </button>

      {/* Search Input (Only shown on Category Selection screen) */}
      {!selectedCategoryId && (
        <div className="absolute top-8 right-12 w-80 z-40 hidden md:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search subjects or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-12 pr-4 bg-white/5 backdrop-blur-2xl border border-white/20 rounded-full text-sm text-white placeholder:text-zinc-500 outline-none focus:border-white/40 focus:bg-white/10 transition-all"
            />
          </div>
        </div>
      )}

      {/* Dynamic Animated Content Container */}
      <AnimatePresence mode="wait">
        {!selectedCategoryId ? (
          /* CATEGORY LIST SCREEN - 4 Core Subjects with the same cover photos */
          <motion.div
            key="categories-list"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col items-center justify-center z-10"
          >
            <div className="text-center mb-8 md:mb-16 px-4">
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl md:text-3xl font-black text-white drop-shadow-lg tracking-wide uppercase font-retropix"
              >
                 Explore More About MMU Subjects
              </motion.p>
            </div>

            <div 
              ref={categoryRefCallback}
              className="w-full h-[480px] md:h-[560px] flex items-center gap-8 md:gap-14 overflow-x-auto no-scrollbar px-[10vw] cursor-grab select-none active:cursor-grabbing pb-16 relative z-10 justify-start xl:justify-center"
            >
              {filteredCategories.map((cat, index) => {
                const rotation = (index - (filteredCategories.length - 1) / 2) * 5;
                const isHovered = hoveredId === cat.id;

                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 50, rotate: rotation }}
                    animate={{ 
                      opacity: 1, 
                      y: isHovered ? -35 : 0, 
                      rotate: isHovered ? 0 : rotation,
                      scale: isHovered ? 1.12 : 1,
                      zIndex: isHovered ? 100 : index 
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    onMouseEnter={() => setHoveredId(cat.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="relative flex-shrink-0 w-[210px] md:w-[250px] h-[310px] md:h-[370px] transition-all duration-300 ease-out cursor-pointer"
                    style={{ perspective: '1200px' }}
                  >
                    {/* Shadow underneath */}
                    <div className="absolute inset-x-8 -bottom-10 h-8 rounded-full blur-2xl bg-black/60 opacity-80" />

                    {/* Book Spine Edge & Cover */}
                    <div 
                      className={`w-full h-full rounded-[28px] overflow-hidden shadow-2xl relative border-l-[10px] border-black/40 hover:border-black/20 ${cat.color}`}
                    >
                      <img 
                        src={cat.cover} 
                        alt={cat.name} 
                        className="w-full h-full object-cover mix-blend-overlay opacity-65 transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Premium Cover Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white text-left z-10">
                        <div>
                          <h3 className="text-2xl md:text-3xl font-black leading-tight tracking-tight font-apple drop-shadow-md">
                            {cat.name}
                          </h3>
                        </div>
                      </div>

                      {/* Aesthetic Detail Lines inside book */}
                      <div className="absolute inset-y-0 left-0 w-[2px] bg-white/15" />
                      <div className="absolute right-4 bottom-4 w-12 h-12 bg-white/10 rounded-full blur-2xl" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* SUB-SUBJECT SELECTION SCREEN - Beautiful Book-Style Horizontal Fanout View! */
          <motion.div
            key="sub-subjects-list"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col items-center justify-center z-10 animate-fade-in"
          >
            {/* Header Area */}
            <div className="text-center mb-6 md:mb-12 px-4">
              <span className={`text-[11px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-300 font-mono`}>
                {activeCategory?.name}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white mt-4 tracking-tight drop-shadow-md font-apple">
                 Explore More About MMU Subjects
              </h2>
            </div>

            {/* Book-Style Scroll Selector */}
            <div 
              ref={subSubjectRefCallback}
              className="w-full h-[480px] md:h-[560px] flex items-center gap-8 md:gap-14 overflow-x-auto no-scrollbar px-[10vw] cursor-grab select-none active:cursor-grabbing pb-16 relative z-10 justify-start xl:justify-center"
            >
              {subSubjectsInActiveCategory.map((sub, index) => {
                const rotation = (index - (subSubjectsInActiveCategory.length - 1) / 2) * 5;
                const isHovered = hoveredId === sub.id;
                
                // Keep the exact same book cover photo of parent category as requested: "pls remain the same photo of books"
                const bookCover = activeCategory?.cover;
                const bookColor = activeCategory?.color || 'bg-indigo-600';

                const codeMatch = sub.name.match(/^[A-Z]{2,4}\s?\d{4}/)?.[0] || sub.id.toUpperCase();
                const displayName = sub.name.replace(/^[A-Z]{2,4}\s?\d{4}\s?/, '');

                return (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 50, rotate: rotation }}
                    animate={{ 
                      opacity: 1, 
                      y: isHovered ? -35 : 0, 
                      rotate: isHovered ? 0 : rotation,
                      scale: isHovered ? 1.12 : 1,
                      zIndex: isHovered ? 100 : index 
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    onMouseEnter={() => setHoveredId(sub.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => onSelectSubject(sub.id)}
                    className="relative flex-shrink-0 w-[210px] md:w-[250px] h-[310px] md:h-[370px] transition-all duration-300 ease-out cursor-pointer"
                    style={{ perspective: '1200px' }}
                  >
                    {/* Shadow underneath */}
                    <div className="absolute inset-x-8 -bottom-10 h-8 rounded-full blur-2xl bg-black/60 opacity-80" />

                    {/* Book Spine Edge & Cover */}
                    <div 
                      className={`w-full h-full rounded-[28px] overflow-hidden shadow-2xl relative border-l-[10px] border-black/40 hover:border-black/20 ${bookColor}`}
                    >
                      <img 
                        src={bookCover} 
                        alt={sub.name} 
                        className="w-full h-full object-cover mix-blend-overlay opacity-65 transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Premium Cover Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white text-left z-10">
                        <div>
                          <p className="text-[10px] font-bold text-white/50 tracking-widest uppercase font-mono mb-1">
                            {codeMatch}
                          </p>
                          <h3 className="text-xl md:text-2xl font-black leading-tight tracking-tight font-apple drop-shadow-md">
                            {displayName}
                          </h3>
                        </div>
                      </div>

                      {/* Aesthetic Detail Lines inside book */}
                      <div className="absolute inset-y-0 left-0 w-[2px] bg-white/15" />
                      <div className="absolute right-4 bottom-4 w-12 h-12 bg-white/10 rounded-full blur-2xl font-mono" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Link to change categories */}
            <button
              onClick={() => setSelectedCategoryId(null)}
              className="text-white hover:text-white/80 transition-all uppercase font-black tracking-widest text-[11px] flex items-center gap-2 justify-center py-4 cursor-pointer self-center animate-pulse hover:scale-105 mt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Course Fields</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Graphic */}
      <h2 className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[15vw] font-black pointer-events-none whitespace-nowrap select-none text-white/[0.02]">
        SUBJECTS
      </h2>
    </motion.div>
  );
};

export default function App() {
  const [view, setView] = useState<'feed' | 'subjects' | 'profile' | 'create'>('feed');
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
<<<<<<< HEAD
  const [showCompose, setShowCompose] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
=======
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
>>>>>>> 331adfb541e95bad51a4d491b94bba295b70eae6
  const activeSubjectData = activeSubject ? SUBJECTS.find(s => s.id === activeSubject) : null;

  // Reactively track if there are any unread notifications
  useEffect(() => {
    const checkUnread = () => {
      const saved = localStorage.getItem('mmu_studybuddy_notifications_v1');
      if (saved) {
        try {
          const list = JSON.parse(saved);
          setHasUnread(list.some((n: any) => n.isUnread));
        } catch (e) {
          setHasUnread(true);
        }
      } else {
        setHasUnread(true);
      }
    };
    checkUnread();
  }, [showNotifications]);

  return (
    <div 
      className="min-h-screen font-sans selection:bg-blue-500/30 overflow-x-hidden text-zinc-100"
      style={{
        backgroundImage: 'url(/images/nature.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
<<<<<<< HEAD
      <TopNavigationBar 
        onSubjectsClick={() => setView('subjects')}
        onComposeClick={() => setShowCompose(true)}
        onProfileClick={() => setShowProfile(true)}
        onNotificationsClick={() => setShowNotifications(true)}
        hasUnread={hasUnread}
      />
=======
      {view !== 'create' && view !== 'profile' && (
        <TopNavigationBar 
          onSubjectsClick={() => setView('subjects')} 
          onProfileClick={() => setView('profile')}
          onFeedClick={() => {
            setActiveSubject(null);
            setView('feed');
          }}
          onCreatePostClick={() => setView('create')}
          currentView={view}
        />
      )}
>>>>>>> 331adfb541e95bad51a4d491b94bba295b70eae6

      {/* Background Mesh - Cinematic Luminous Glows */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] rounded-full bg-purple-600/15 blur-[100px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-indigo-600/10 blur-[80px]" />
      </div>

      <AnimatePresence mode="wait">
        {showCompose && (
          <CreatePostPage
            key="compose"
            onBack={() => setShowCompose(false)}
            onPublish={(postData) => {
              console.log('Post published:', postData);
              setShowCompose(false);
            }}
            subjects={SUBJECTS.map(s => ({
              id: s.id,
              name: s.name,
              chapters: s.chapters
            }))}
          />
        )}
        
        {showProfile && (
          <ProfilePage
            key="profile"
            onBack={() => setShowProfile(false)}
            onSignOut={() => {
              console.log('Signed out');
              setShowProfile(false);
            }}
          />
        )}

        {showNotifications && (
          <NotificationsPanel
            key="notifications"
            onBack={() => setShowNotifications(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'feed' ? (
          <motion.main 
            key="feed"
            initial={{ opacity: 0, x: -60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="pt-32 pb-48 px-4 md:px-8 max-w-5xl mx-auto relative z-10"
          >
            {/* Feed Heading - Simplified */}
            {activeSubjectData && (
              <div className="mb-8 text-left">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setActiveSubject(null)}
                    className="p-3 rounded-full transition-colors hover:bg-white/5 cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5 text-zinc-500 hover:text-white" />
                  </button>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white whitespace-pre-line">
                      {activeSubjectData.name}
                    </h2>
                    <p className="font-medium text-zinc-500 text-sm md:text-base">Recently shared chapters and discussions</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Discussion Feed */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {posts
                  .filter(p => {
                    if (!activeSubject) return true;
                    if (!activeSubjectData) return true;
                    
                    const pName = p.subject.toLowerCase();
                    const sName = activeSubjectData.name.toLowerCase();
                    
                    // Match course code if possible (e.g., CDS1114)
                    const pCode = pName.match(/[a-z]{2,4}\s?\d{4}/)?.[0];
                    const sCode = sName.match(/[a-z]{2,4}\s?\d{4}/)?.[0];
                    
                    if (pCode && sCode && pCode === sCode) return true;
                    
                    // Fallback to fuzzy substring match
                    const cleanP = pName.replace(/\s+/g, ' ').trim();
                    const cleanS = sName.replace(/\s+/g, ' ').trim();
                    return cleanP.includes(cleanS) || cleanS.includes(cleanP);
                  })
                  .map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </AnimatePresence>
            </div>
          </motion.main>
        ) : view === 'subjects' ? (
          <SubjectsPage 
            key="subjects"
            onBack={() => { 
              setActiveSubject(null);
              setView('feed');
            }} 
            onSelectSubject={(id) => {
              setActiveSubject(id);
              setView('feed');
            }}
          />
        ) : view === 'profile' ? (
          <ProfilePage
            key="profile"
            onBack={() => {
              setView('feed');
            }}
            onSignOut={() => {
              setView('feed');
            }}
          />
        ) : (
          <CreatePostPage
            key="create"
            subjects={SUBJECTS}
            onBack={() => {
              setView('feed');
            }}
            onPublish={(postData) => {
              const newPost: Post = {
                id: `post_${Date.now()}`,
                author: 'Jane Doe',
                avatar: 'https://i.pinimg.com/736xl/db/61/57/db6157a5818e0252f41a810d0a11e194.jpg',
                subject: postData.subject,
                chapter: postData.chapter,
                title: postData.title,
                content: postData.content,
                image: postData.image,
                likes: 0,
                replies: 0,
                timestamp: 'Just now',
              };
              setPosts(prev => [newPost, ...prev]);
              setView('feed');
            }}
          />
        )}
      </AnimatePresence>



      {/* Global CSS for hiding scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Ambient Background Elements - Secondary Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] -z-10 bg-[radial-gradient(circle_at_30%_0%,rgba(0,102,204,0.08)_0%,transparent_70%)]" />

    </div>
  );
}
