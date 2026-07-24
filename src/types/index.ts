export interface VideoItem {
  id: string;
  title: string;
  category: string;
  url?: string;
  embedUrl?: string;
  duration?: string;
  thumbnail?: string;
  desc?: string;
  description?: string;
  tags?: string[];
  views?: string | number;
  playCount?: number;
  createdAt?: number;
  color?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  relatedTopics?: string[];
  week?: number;
  microCourses?: { title: string; duration: string; url: string; type: string }[];
  reviewed?: boolean;
}

export interface QuizQuestion {
  id: string;
  type: 'single' | 'multiple' | 'judge' | 'fill';
  question: string;
  options?: string[];
  answer: number | number[];
  analysis?: string;
  explanation?: string;
  knowledgePoint: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizConfig {
  knowledgePoint: string | 'all';
  difficulty: 'easy' | 'medium' | 'hard' | 'all';
  count: number;
}

export interface DebugIssue {
  line: number;
  type: 'error' | 'warning';
  message: string;
  fix?: string;
}

export interface DebugResult {
  errors: DebugIssue[];
  warnings: DebugIssue[];
  suggestions: string[];
  fixedCode?: string;
}

export interface UserInfo {
  id: string;
  username: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
}

export interface PathNode {
  id: string;
  title: string;
  type: 'knowledge' | 'task' | 'milestone';
  status: 'completed' | 'current' | 'pending';
  progress?: number;
  children?: PathNode[];
}

export interface KnowledgeGraphNode {
  id: string;
  name: string;
  type: 'chapter' | 'section' | 'topic';
  x: number;
  y: number;
  children?: string[];
}

export interface LearningStats {
  totalQuestions: number;
  correctRate: number;
  learningDays: number;
  weeklyProgress: number[];
}

export interface SystemConfig {
  theme: 'light' | 'dark';
  voiceEnabled: boolean;
  autoPlay: boolean;
}