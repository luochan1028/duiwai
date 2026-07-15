import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send, Sparkles, BookOpen, Cpu, Database, Lightbulb,
  ShieldCheck, Video, FileText, Edit3, Calendar, ArrowUpRight,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { qaDatabase, teachingCalendar } from '@/data/mockData';

const quickQuestions = [
  { icon: Cpu, text: '什么是DMA方式？', tag: '基础' },
  { icon: Database, text: '为什么浮点数运算会有精度损失？', tag: '难点' },
  { icon: Sparkles, text: '微程序控制与硬布线控制的区别', tag: '重点' },
  { icon: BookOpen, text: 'Cache有哪几种映射方式？', tag: '常考' },
  { icon: Lightbulb, text: '指令周期包含哪些阶段？', tag: '基础' },
];

// 微课类型 → 图标 / 标签 / 颜色
const microCourseMeta: Record<string, { icon: typeof Video; label: string; color: string }> = {
  video: { icon: Video, label: '视频', color: 'text-accent-cyan' },
  doc: { icon: FileText, label: '文档', color: 'text-accent-green' },
  exercise: { icon: Edit3, label: '练习', color: 'text-accent-purple' },
};

type MicroCourseLike = { title: string; duration: string; url: string; type: string };

export default function QAPage() {
  const { messages, isTyping, addMessage, setIsTyping } = useStore();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 打字机效果状态
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [typingProgress, setTypingProgress] = useState(0);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, typingProgress]);

  // 卸载时清理定时器
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  // 启动打字机：逐字显示 AI 回复
  const startTypewriter = (messageId: string, fullContent: string) => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    setTypingMessageId(messageId);
    setTypingProgress(0);
    typingIntervalRef.current = setInterval(() => {
      setTypingProgress((prev) => {
        const next = prev + 3;
        if (next >= fullContent.length) {
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }
          setTypingMessageId(null);
          return fullContent.length;
        }
        return next;
      });
    }, 20);
  };

  // 教学日历关联：优先用 QA 自带 week，否则按关键词模糊匹配
  const findWeekForQuestion = (question: string, qaWeek?: number): number | undefined => {
    if (qaWeek !== undefined) return qaWeek;
    const matched = teachingCalendar.find(
      (c) =>
        question.includes(c.topic) ||
        c.topic.includes(question.slice(0, 3)) ||
        question.includes(c.chapter),
    );
    return matched?.week;
  };

  const simulateAIResponse = (question: string) => {
    setIsTyping(true);

    setTimeout(() => {
      const matchedQA = qaDatabase.find(
        (qa) =>
          question.includes(qa.keyword) ||
          qa.question.includes(question) ||
          question.includes(qa.question.slice(0, 5)),
      );

      const answer = matchedQA
        ? matchedQA.answer
        : `这是一个很好的问题！关于"${question}"，让我为你详细解答：

## 知识点概述

这个问题涉及计算机组成原理的核心概念。在《计算机组成原理》课程中，这是一个重要的知识点。

## 核心要点

1. **基本概念**：首先需要理解相关的基本定义和原理
2. **工作原理**：掌握其内部的工作机制和流程
3. **应用场景**：了解在实际系统中的应用

## 相关知识点

- 建议结合教材相关章节进行学习
- 可以通过知识图谱查看关联概念
- 尝试做几道相关练习题巩固理解

> 💡 **学习建议**：如果还有疑问，可以尝试换一种方式提问，或者前往知识图谱模块探索相关知识点之间的关系。`;

      const week = findWeekForQuestion(question, matchedQA?.week);

      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'ai' as const,
        content: answer,
        timestamp: new Date(),
        relatedTopics: matchedQA?.relatedTopics,
        week,
        microCourses: matchedQA?.microCourses,
        reviewed: matchedQA?.reviewed,
      };

      setIsTyping(false);
      addMessage(aiMessage);
      startTypewriter(aiMessage.id, answer);
    }, 1200 + Math.random() * 800);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      content: inputValue,
      timestamp: new Date(),
    };
    addMessage(userMessage);
    setInputValue('');
    simulateAIResponse(inputValue);
  };

  const handleQuickQuestion = (text: string) => {
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      content: text,
      timestamp: new Date(),
    };
    addMessage(userMessage);
    setInputValue('');
    simulateAIResponse(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 知识点标签点击 → 跳转知识图谱
  const handleTopicClick = (topic: string) => {
    navigate('/graph', { state: { focusNode: topic } });
  };

  // 取打字机当前应显示的子串
  const getDisplayContent = (msgId: string, fullContent: string) => {
    if (msgId === typingMessageId) return fullContent.slice(0, typingProgress);
    return fullContent;
  };

  const renderMessageContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return (
          <h3 key={i} className="text-lg font-bold text-accent-cyan mt-4 mb-2 first:mt-0">
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h4 key={i} className="text-base font-semibold text-accent-purple mt-3 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <p key={i} className="ml-4 text-text-primary/90">
            <span className="text-accent-cyan mr-2">•</span>
            {line.replace('- ', '')}
          </p>
        );
      }
      // 表格 / 代码块行暂不渲染（保持原行为）
      if (line.startsWith('|') || line.startsWith('```')) {
        return null;
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote
            key={i}
            className="mt-2 p-3 bg-accent-cyan/10 border-l-2 border-accent-cyan rounded-r-lg text-text-primary/80"
          >
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      if (line.trim() === '') {
        return <div key={i} className="h-2" />;
      }
      // 处理 **加粗**
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className="text-text-primary/90 leading-relaxed">
          {parts.map((part, j) =>
            j % 2 === 1 ? (
              <strong key={j} className="text-accent-cyan font-semibold">
                {part}
              </strong>
            ) : (
              <span key={j}>{part}</span>
            ),
          )}
        </p>
      );
    });
  };

  // 微课资源展示
  const renderMicroCourses = (courses: MicroCourseLike[]) => (
    <div className="mt-3 pt-3 border-t border-white/10">
      <p className="text-xs text-text-secondary mb-2 flex items-center gap-1.5">
        <BookOpen className="w-3 h-3 text-accent-cyan" />
        关联微课资源
      </p>
      <div className="flex flex-wrap gap-2">
        {courses.map((course, i) => {
          const meta = microCourseMeta[course.type] || microCourseMeta.doc;
          const Icon = meta.icon;
          return (
            <a
              key={i}
              href={course.url}
              className="group flex items-center gap-2 px-3 py-1.5 bg-bg-primary/40 border border-accent-cyan/20 rounded-lg hover:border-accent-cyan/50 hover:shadow-glow-cyan transition-all duration-300 hover:-translate-y-0.5"
            >
              <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
              <span className="text-xs text-text-primary">{course.title}</span>
              <span className="text-xs text-text-secondary">{course.duration}</span>
            </a>
          );
        })}
      </div>
    </div>
  );

  // 教学日历关联条目
  const renderCalendarLink = (week: number) => {
    const calItem = teachingCalendar.find((c) => c.week === week);
    if (!calItem) return null;
    return (
      <div className="mt-3 pt-3 border-t border-white/10">
        <button
          onClick={() => navigate('/path')}
          className="group flex items-center gap-2 text-xs px-3 py-1.5 bg-accent-purple/10 text-accent-purple rounded-lg hover:bg-accent-purple/20 transition-colors"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>
            教学日历：第{week}周 - {calItem.topic}
          </span>
          <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col animate-fade-in-up opacity-0">
      {/* 页面标题 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2 font-tech">
          <span className="glow-text">智能问答</span>
        </h2>
        <p className="text-text-secondary">有问题随时问，AI助教7x24小时在线</p>
      </div>

      {/* 快捷提问 */}
      <div className="mb-6">
        <p className="text-sm text-text-secondary mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-cyan" />
          热门问题
        </p>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleQuickQuestion(q.text)}
              className="group flex items-center gap-2 px-4 py-2 bg-bg-card border border-accent-cyan/20 rounded-lg hover:border-accent-cyan/50 hover:shadow-glow-cyan transition-all duration-300 hover:-translate-y-0.5"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <q.icon className="w-4 h-4 text-accent-cyan group-hover:scale-110 transition-transform" />
              <span className="text-sm text-text-primary">{q.text}</span>
              <span className="text-xs px-2 py-0.5 bg-accent-purple/20 text-accent-purple rounded-full">
                {q.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 对话区域 */}
      <div className="flex-1 glass-card overflow-hidden flex flex-col min-h-[400px] max-h-[calc(100vh-380px)]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => {
            const isTypingThis = msg.id === typingMessageId;
            const displayContent = getDisplayContent(msg.id, msg.content);
            // 打字进行中时隐藏附加信息，结束后才显示
            const showExtras = !isTypingThis;
            return (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up opacity-0`}
              >
                <div className="flex gap-3 max-w-[80%]">
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center flex-shrink-0 shadow-glow-purple">
                      <Sparkles className="w-4 h-4 text-bg-primary" />
                    </div>
                  )}
                  <div className={`p-4 ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                    <div className="text-sm">
                      {renderMessageContent(displayContent)}
                      {isTypingThis && (
                        <span className="inline-block w-2 h-4 bg-accent-cyan ml-0.5 align-middle animate-pulse" />
                      )}
                    </div>

                    {/* 教学日历关联 */}
                    {msg.role === 'ai' && showExtras && msg.week && renderCalendarLink(msg.week)}

                    {/* 微课资源 */}
                    {msg.role === 'ai' &&
                      showExtras &&
                      msg.microCourses &&
                      msg.microCourses.length > 0 &&
                      renderMicroCourses(msg.microCourses)}

                    {/* 相关知识点（可点击跳转知识图谱） */}
                    {msg.role === 'ai' &&
                      showExtras &&
                      msg.relatedTopics &&
                      msg.relatedTopics.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <p className="text-xs text-text-secondary mb-2">
                            相关知识点（点击跳转知识图谱）：
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.relatedTopics.map((topic, i) => (
                              <button
                                key={i}
                                onClick={() => handleTopicClick(topic)}
                                className="group flex items-center gap-1 text-xs px-2 py-1 bg-accent-cyan/10 text-accent-cyan rounded-md hover:bg-accent-cyan/20 transition-colors"
                              >
                                <span>#{topic}</span>
                                <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* 教学团队已审核标识 */}
                    {msg.role === 'ai' && showExtras && msg.reviewed && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-accent-green/15 text-accent-green rounded-full">
                          <ShieldCheck className="w-3 h-3" />
                          教学团队已审核
                        </span>
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-cyan to-accent-green flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-bg-primary">我</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center flex-shrink-0 shadow-glow-purple animate-pulse">
                  <Sparkles className="w-4 h-4 text-bg-primary" />
                </div>
                <div className="chat-bubble-ai p-4">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 隐私提示 + 输入区域 */}
        <div className="p-4 border-t border-accent-cyan/10 bg-bg-primary/30">
          <p className="text-xs text-text-secondary mb-2 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-accent-green" />
            学习数据本地化存储，不用于模型训练
          </p>
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入你的问题，按Enter发送..."
                className="w-full px-4 py-3 pr-12 bg-bg-primary/70 border border-accent-cyan/20 rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-cyan/50 focus:shadow-glow-cyan transition-all resize-none min-h-[52px] max-h-32"
                rows={1}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="p-3 bg-gradient-to-r from-accent-cyan to-accent-purple text-bg-primary rounded-xl hover:shadow-glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
