import { create } from 'zustand';
import type { QuizQuestion } from '@/data/mockData';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  relatedTopics?: string[];
  week?: number;
  microCourses?: { title: string; duration: string; url: string; type: string }[];
  reviewed?: boolean;
}

interface QuizConfig {
  knowledgePoint: string | 'all';
  difficulty: 'easy' | 'medium' | 'hard' | 'all';
  count: number;
}

interface DebugResult {
  errors: DebugIssue[];
  warnings: DebugIssue[];
  suggestions: string[];
  fixedCode?: string;
}

interface DebugIssue {
  line: number;
  type: 'error' | 'warning';
  message: string;
  fix?: string;
}

interface AppState {
  activeTab: string;
  setActiveTab: (tab: string) => void;

  messages: Message[];
  isTyping: boolean;
  addMessage: (message: Message) => void;
  setIsTyping: (typing: boolean) => void;
  clearMessages: () => void;

  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;

  quizQuestions: QuizQuestion[];
  quizIndex: number;
  userAnswers: Record<string, number | number[]>;
  quizSubmitted: boolean;
  bookmarkedQuestions: string[];
  quizConfig: QuizConfig;
  quizStarted: boolean;
  setQuizQuestions: (questions: QuizQuestion[]) => void;
  setQuizIndex: (index: number) => void;
  setUserAnswer: (questionId: string, answer: number | number[]) => void;
  setQuizSubmitted: (submitted: boolean) => void;
  toggleBookmark: (questionId: string) => void;
  setQuizConfig: (config: Partial<QuizConfig>) => void;
  setQuizStarted: (started: boolean) => void;
  resetQuiz: () => void;

  labCode: string;
  setLabCode: (code: string) => void;
  debugResult: DebugResult | null;
  setDebugResult: (result: DebugResult | null) => void;
  showCodeDiff: boolean;
  setShowCodeDiff: (show: boolean) => void;

  pendingTasks: { id: string; completed: boolean }[];
  toggleTask: (taskId: string) => void;

  reportGenerated: boolean;
  setReportGenerated: (generated: boolean) => void;
}

const initialMessages: Message[] = [
  {
    id: 'welcome',
    role: 'ai',
    content: `你好！我是**计组智学**助手，专注于《计算机组成原理》课程辅导。

我可以帮你：
- 解答课程知识点疑问（关联教学日历与微课资源）
- 探索知识图谱，建立系统认知
- 提供个性化学习建议与路径推荐
- 辅助实验代码调试
- 生成随堂测验练习（按知识点/难度抽题）

> 本智能体回答均经教学团队审核。你的学习数据本地化存储，不用于模型训练。

试试点击下方的快捷问题，或直接输入你的问题吧！`,
    timestamp: new Date(),
    reviewed: true,
  },
];

export const useStore = create<AppState>((set) => ({
  activeTab: 'qa',
  setActiveTab: (tab) => set({ activeTab: tab }),

  messages: initialMessages,
  isTyping: false,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setIsTyping: (typing) => set({ isTyping: typing }),
  clearMessages: () => set({ messages: initialMessages }),

  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  quizQuestions: [],
  quizIndex: 0,
  userAnswers: {},
  quizSubmitted: false,
  bookmarkedQuestions: [],
  quizConfig: { knowledgePoint: 'all', difficulty: 'all', count: 10 },
  quizStarted: false,
  setQuizQuestions: (questions) => set({ quizQuestions: questions }),
  setQuizIndex: (index) => set({ quizIndex: index }),
  setUserAnswer: (questionId, answer) =>
    set((state) => ({
      userAnswers: { ...state.userAnswers, [questionId]: answer },
    })),
  setQuizSubmitted: (submitted) => set({ quizSubmitted: submitted }),
  toggleBookmark: (questionId) =>
    set((state) => ({
      bookmarkedQuestions: state.bookmarkedQuestions.includes(questionId)
        ? state.bookmarkedQuestions.filter((id) => id !== questionId)
        : [...state.bookmarkedQuestions, questionId],
    })),
  setQuizConfig: (config) =>
    set((state) => ({ quizConfig: { ...state.quizConfig, ...config } })),
  setQuizStarted: (started) => set({ quizStarted: started }),
  resetQuiz: () =>
    set({
      quizIndex: 0,
      userAnswers: {},
      quizSubmitted: false,
      quizStarted: false,
    }),

  labCode: `; 实验3：分支与循环程序设计
; 计算 1+2+3+...+10 的和
; 结果存放在 AX 中

DSEG SEGMENT
    num DB 10
    result DW ?
DSEG ENDS

CSEG SEGMENT
    ASSUME CS:CSEG, DS:DSEG
START:
    MOV AX, DSEG
    MOV DS, AX
    
    MOV CX, num   ; 设置循环次数
    MOV AX, 0     ; 累加器清零
    MOV BX, 1     ; 从1开始
    
LOOP1:
    ADD AX, BX    ; 累加
    INC BX        ; 下一个数
    LOOP LOOP1    ; 循环
    
    MOV result, AX ; 保存结果
    
    MOV AH, 4CH
    INT 21H
CSEG ENDS
END START`,
  setLabCode: (code) => set({ labCode: code }),
  debugResult: null,
  setDebugResult: (result) => set({ debugResult: result }),
  showCodeDiff: false,
  setShowCodeDiff: (show) => set({ showCodeDiff: show }),

  pendingTasks: [
    { id: 't1', completed: false },
    { id: 't2', completed: false },
    { id: 't3', completed: false },
    { id: 't4', completed: false },
    { id: 't5', completed: false },
    { id: 't6', completed: true },
  ],
  toggleTask: (taskId) =>
    set((state) => ({
      pendingTasks: state.pendingTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
    })),

  reportGenerated: false,
  setReportGenerated: (generated) => set({ reportGenerated: generated }),
}));