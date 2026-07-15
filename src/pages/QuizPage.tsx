import { useState, useEffect } from 'react';
import {
  CheckCircle2, XCircle, ChevronLeft, ChevronRight, RotateCcw, Trophy,
  Target, Clock, Bookmark, BookmarkCheck, Settings2, Filter, Play,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { quizQuestions as allQuizQuestions, knowledgePoints } from '@/data/mockData';

const DIFFICULTY_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困难' },
] as const;

const COUNT_OPTIONS = [5, 10, 15, 20].map((c) => ({ value: c, label: `${c} 题` }));

const DIFFICULTY_LABEL: Record<string, string> = { easy: '简单', medium: '中等', hard: '困难' };
const DIFFICULTY_TAG_CLASS: Record<string, string> = {
  easy: 'bg-accent-green/20 text-accent-green',
  medium: 'bg-yellow-500/20 text-yellow-400',
  hard: 'bg-red-500/20 text-red-400',
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

function ButtonGroup<T extends string | number>({
  options, value, onChange, activeClass = 'bg-accent-cyan/30 text-accent-cyan border border-accent-cyan/50',
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  activeClass?: string;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 rounded-lg text-sm transition-all ${
            value === opt.value ? activeClass : 'bg-bg-primary/50 text-text-secondary border border-white/10 hover:border-accent-cyan/30'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function QuizPage() {
  const {
    quizQuestions, quizIndex, userAnswers, quizSubmitted, bookmarkedQuestions,
    quizConfig, quizStarted,
    setQuizIndex, setUserAnswer, setQuizSubmitted, toggleBookmark,
    setQuizConfig, setQuizQuestions, setQuizStarted, resetQuiz,
  } = useStore();

  const [showExplanation, setShowExplanation] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!quizStarted || quizSubmitted) return;
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [quizStarted, quizSubmitted, startTime]);

  const currentQuestion = quizQuestions[quizIndex];
  const totalQuestions = quizQuestions.length;

  const startQuiz = () => {
    const filtered = allQuizQuestions.filter((q) => {
      if (quizConfig.knowledgePoint !== 'all' && q.knowledgePoint !== quizConfig.knowledgePoint) return false;
      if (quizConfig.difficulty !== 'all' && q.difficulty !== quizConfig.difficulty) return false;
      return true;
    });
    setQuizQuestions(shuffle(filtered).slice(0, quizConfig.count));
    setQuizIndex(0);
    setQuizStarted(true);
    setStartTime(Date.now());
    setElapsed(0);
    setShowExplanation(false);
    setReviewMode(false);
  };

  const handleAnswer = (optionIndex: number) => {
    if (quizSubmitted || !currentQuestion) return;
    if (currentQuestion.type === 'multiple') {
      const current = (userAnswers[currentQuestion.id] as number[]) || [];
      const newAnswer = current.includes(optionIndex)
        ? current.filter((i) => i !== optionIndex)
        : [...current, optionIndex];
      setUserAnswer(currentQuestion.id, newAnswer);
    } else {
      setUserAnswer(currentQuestion.id, optionIndex);
    }
  };

  const isQuestionCorrect = (q: typeof currentQuestion) => {
    if (!q) return null;
    const userAnswer = userAnswers[q.id];
    if (userAnswer === undefined) return null;
    if (q.type === 'multiple') {
      const correct = q.answer as number[];
      const user = (userAnswer as number[]).slice().sort();
      return correct.length === user.length && correct.every((v, i) => v === user[i]);
    }
    return userAnswer === q.answer;
  };

  const getScore = () => quizQuestions.reduce((acc, q) => acc + (isQuestionCorrect(q) ? 1 : 0), 0);
  const handleSubmit = () => { setQuizSubmitted(true); setShowExplanation(true); };
  const handleRestart = () => { resetQuiz(); setShowExplanation(false); setReviewMode(false); };
  const goToIndex = (i: number) => { setQuizIndex(i); setShowExplanation(false); };

  const getOptionClass = (index: number) => {
    if (!currentQuestion) return '';
    const userAnswer = userAnswers[currentQuestion.id];
    const isSelected = currentQuestion.type === 'multiple'
      ? ((userAnswer as number[]) || []).includes(index)
      : userAnswer === index;
    const correctAns = currentQuestion.answer;
    const isCorrectOption = Array.isArray(correctAns) ? correctAns.includes(index) : correctAns === index;
    if (quizSubmitted) {
      if (isCorrectOption) return 'border-accent-green bg-accent-green/10';
      if (isSelected && !isCorrectOption) return 'border-red-500 bg-red-500/10';
      return 'border-white/10 bg-bg-primary/30';
    }
    if (isSelected) return 'border-accent-cyan bg-accent-cyan/20 shadow-glow-cyan';
    return 'border-white/10 hover:border-accent-cyan/30 hover:bg-accent-cyan/5';
  };

  const renderOption = (option: string, i: number) => {
    if (!currentQuestion) return null;
    const correctAns = currentQuestion.answer;
    const isCorrectOption = Array.isArray(correctAns) ? correctAns.includes(i) : correctAns === i;
    const userAnswer = userAnswers[currentQuestion.id];
    const isSelected = currentQuestion.type === 'multiple'
      ? ((userAnswer as number[]) || []).includes(i) : userAnswer === i;
    const showCorrect = quizSubmitted && isCorrectOption;
    const showWrong = quizSubmitted && isSelected && !isCorrectOption;
    return (
      <button key={i} onClick={() => handleAnswer(i)} disabled={quizSubmitted}
        className={`w-full text-left p-4 rounded-xl border transition-all ${getOptionClass(i)}`}>
        <div className="flex items-start gap-3">
          <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
            showCorrect ? 'bg-accent-green text-bg-primary' : showWrong ? 'bg-red-500 text-white' : 'bg-bg-primary/50 text-text-secondary'}`}>
            {String.fromCharCode(65 + i)}
          </span>
          <span className="text-text-primary pt-0.5">{option}</span>
          {showCorrect && <CheckCircle2 className="w-5 h-5 text-accent-green ml-auto flex-shrink-0" />}
          {showWrong && <XCircle className="w-5 h-5 text-red-400 ml-auto flex-shrink-0" />}
        </div>
      </button>
    );
  };

  const answeredCount = quizQuestions.filter((q) => userAnswers[q.id] !== undefined).length;
  const matchedCount = allQuizQuestions.filter((q) => {
    if (quizConfig.knowledgePoint !== 'all' && q.knowledgePoint !== quizConfig.knowledgePoint) return false;
    if (quizConfig.difficulty !== 'all' && q.difficulty !== quizConfig.difficulty) return false;
    return true;
  }).length;

  const renderHeader = () => (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-text-primary mb-2 font-tech">
        <span className="glow-text">自测系统</span>
      </h2>
      <p className="text-text-secondary">检验学习成果，即时反馈巩固知识</p>
    </div>
  );

  const kpBtnClass = (active: boolean) => active
    ? 'bg-accent-cyan text-bg-primary border border-accent-cyan'
    : 'bg-bg-primary/50 text-text-secondary border border-white/10 hover:border-accent-cyan/30';

  // ============= 抽题配置界面 =============
  if (!quizStarted) {
    return (
      <div className="h-full flex flex-col animate-fade-in-up opacity-0">
        {renderHeader()}
        <div className="flex-1 flex items-center justify-center">
          <div className="glass-card p-8 max-w-2xl w-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                <Settings2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary font-tech">抽题配置</h3>
                <p className="text-sm text-text-secondary">选择知识点、难度和题量</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
                <Filter className="w-4 h-4 text-accent-cyan" />知识点
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setQuizConfig({ knowledgePoint: 'all' })}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${kpBtnClass(quizConfig.knowledgePoint === 'all')}`}>全部</button>
                {knowledgePoints.map((kp) => (
                  <button key={kp} onClick={() => setQuizConfig({ knowledgePoint: kp })} title={kp}
                    className={`px-3 py-2 rounded-lg text-sm transition-all truncate ${kpBtnClass(quizConfig.knowledgePoint === kp)}`}>{kp}</button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-3">难度</label>
              <ButtonGroup options={DIFFICULTY_OPTIONS} value={quizConfig.difficulty}
                onChange={(v) => setQuizConfig({ difficulty: v })}
                activeClass="bg-accent-purple/30 text-accent-purple border border-accent-purple/50" />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-3">题目数量</label>
              <ButtonGroup options={COUNT_OPTIONS} value={quizConfig.count}
                onChange={(v) => setQuizConfig({ count: v })} />
            </div>

            <div className="mb-6 p-3 bg-bg-primary/40 rounded-lg border border-white/5 flex items-center justify-between text-sm">
              <span className="text-text-secondary">题库匹配</span>
              <span className="text-accent-cyan font-tech">
                共 {matchedCount} 题可用 / 抽取 {Math.min(quizConfig.count, matchedCount)} 题
              </span>
            </div>

            <button onClick={startQuiz} disabled={matchedCount === 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 btn-primary disabled:opacity-50">
              <Play className="w-4 h-4" />
              开始答题
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="h-full flex items-center justify-center text-text-secondary">
        暂无题目，请重新配置抽题
      </div>
    );
  }

  const isBookmarked = bookmarkedQuestions.includes(currentQuestion.id);
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 175.9 : 0;
  const kpStats = quizQuestions.reduce<Record<string, number>>((acc, q) => {
    acc[q.knowledgePoint] = (acc[q.knowledgePoint] || 0) + 1;
    return acc;
  }, {});

  // ============= 结果页面 =============
  if (quizSubmitted && !reviewMode) {
    const score = getScore();
    const wrongKps = Array.from(new Set(
      quizQuestions.filter((q) => isQuestionCorrect(q) === false).map((q) => q.knowledgePoint)
    ));
    return (
      <div className="h-full flex flex-col animate-fade-in-up opacity-0">
        {renderHeader()}
        <div className="flex-1 flex items-center justify-center">
          <div className="glass-card p-10 max-w-lg w-full text-center">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan to-accent-purple rounded-full animate-pulse-glow" />
              <div className="absolute inset-2 bg-bg-primary rounded-full flex items-center justify-center">
                <Trophy className="w-12 h-12 text-accent-cyan" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-2 font-tech">答题完成！</h3>
            <p className="text-text-secondary mb-8">
              {score === totalQuestions ? '完美通关，知识掌握扎实！' : score >= totalQuestions / 2 ? '表现不错，继续加油！' : '仍有提升空间，回顾解析再战！'}
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { val: `${score}/${totalQuestions}`, color: 'text-accent-cyan', label: '正确题数' },
                { val: `${totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%`, color: 'text-accent-green', label: '正确率' },
                { val: formatTime(elapsed), color: 'text-accent-purple', label: '用时' },
              ].map((s) => (
                <div key={s.label} className="p-4 bg-bg-primary/50 rounded-xl">
                  <p className={`text-3xl font-bold font-tech ${s.color}`}>{s.val}</p>
                  <p className="text-xs text-text-secondary mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            {wrongKps.length > 0 && (
              <div className="space-y-3 mb-8 text-left">
                <p className="text-sm font-medium text-text-primary">薄弱知识点：</p>
                <div className="flex flex-wrap gap-2">
                  {wrongKps.map((kp) => (
                    <span key={kp} className="text-sm px-3 py-1 bg-accent-pink/10 text-accent-pink rounded-full">
                      {kp}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-4">
              <button onClick={handleRestart} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 btn-tech">
                <RotateCcw className="w-4 h-4" />重新抽题
              </button>
              <button onClick={() => { setReviewMode(true); setQuizIndex(0); setShowExplanation(true); }}
                className="flex-1 px-6 py-3 btn-primary">查看解析</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============= 答题 / 解析回顾界面 =============
  return (
    <div className="h-full flex flex-col animate-fade-in-up opacity-0">
      {renderHeader()}
      <div className="flex-1 flex gap-6">
        {/* 左侧导航 */}
        <div className="w-64 flex-shrink-0">
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-4">答题进度</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="rgba(0,212,255,0.1)" strokeWidth="4" fill="none" />
                  <circle cx="32" cy="32" r="28" stroke="url(#progressGradient)" strokeWidth="4" fill="none"
                    strokeDasharray={`${progressPercent} 175.9`} strokeLinecap="round" className="transition-all duration-500" />
                  <defs>
                    <linearGradient id="progressGradient">
                      <stop offset="0%" stopColor="#00d4ff" /><stop offset="100%" stopColor="#7b2ff7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-text-primary font-tech">{answeredCount}/{totalQuestions}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-text-secondary">已答题目</p>
                <p className="text-xs text-text-secondary/70">共 {totalQuestions} 题</p>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {quizQuestions.map((q, i) => {
                const answered = userAnswers[q.id] !== undefined;
                const bookmarked = bookmarkedQuestions.includes(q.id);
                return (
                  <button key={q.id} onClick={() => goToIndex(i)}
                    className={`aspect-square rounded-lg text-sm font-medium transition-all relative ${
                      quizIndex === i ? 'bg-accent-cyan text-bg-primary'
                        : answered ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30'
                        : 'bg-bg-primary/50 text-text-secondary border border-white/10 hover:border-accent-cyan/30'}`}>
                    {i + 1}
                    {bookmarked && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent-pink" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 收藏题目列表 */}
          <div className="glass-card p-4 mt-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-accent-pink" />收藏题目
              <span className="text-xs text-text-secondary ml-auto">{bookmarkedQuestions.length}</span>
            </h3>
            {bookmarkedQuestions.length === 0 ? (
              <p className="text-xs text-text-secondary/70 text-center py-3">暂无收藏题目</p>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {bookmarkedQuestions.map((id) => {
                  const idx = quizQuestions.findIndex((q) => q.id === id);
                  if (idx === -1) return null;
                  return (
                    <button key={id} onClick={() => goToIndex(idx)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 ${
                        quizIndex === idx ? 'bg-accent-pink/20 text-accent-pink'
                          : 'text-text-secondary hover:bg-bg-primary/50 hover:text-text-primary'}`}>
                      <Bookmark className="w-3 h-3 flex-shrink-0 text-accent-pink" />
                      <span className="truncate">第{idx + 1}题 · {quizQuestions[idx].knowledgePoint}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 知识点分布 */}
          <div className="glass-card p-4 mt-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-accent-purple" />知识点分布
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {Object.entries(kpStats).map(([kp, cnt]) => (
                <div key={kp} className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary truncate">{kp}</span>
                  <span className="text-accent-cyan flex-shrink-0 ml-2">{cnt}题</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 中间题目区域 */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-accent-purple/20 text-accent-purple text-sm rounded-full">
                第 {quizIndex + 1} 题 / 共 {totalQuestions} 题
              </span>
              <span className={`px-3 py-1 text-sm rounded-full ${DIFFICULTY_TAG_CLASS[currentQuestion.difficulty]}`}>
                {DIFFICULTY_LABEL[currentQuestion.difficulty]}
              </span>
              <span className="text-xs text-text-secondary">{currentQuestion.knowledgePoint}</span>
              {reviewMode && <span className="px-3 py-1 bg-accent-cyan/20 text-accent-cyan text-sm rounded-full">解析回顾中</span>}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-text-secondary">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-tech">{formatTime(elapsed)}</span>
              </div>
              <button onClick={() => toggleBookmark(currentQuestion.id)} title={isBookmarked ? '取消收藏' : '收藏题目'}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-all border ${
                  isBookmarked ? 'bg-accent-pink/20 text-accent-pink border-accent-pink/40'
                    : 'bg-bg-primary/50 text-text-secondary border-white/10 hover:border-accent-pink/30 hover:text-accent-pink'}`}>
                {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                {isBookmarked ? '已收藏' : '收藏'}
              </button>
            </div>
          </div>

          <div className="flex-1 glass-card p-8 flex flex-col">
            <div className="mb-8">
              <h3 className="text-lg font-medium text-text-primary leading-relaxed mb-6">
                {currentQuestion.type === 'single' ? '【单选题】' : currentQuestion.type === 'multiple' ? '【多选题】' : '【判断题】'}
                {currentQuestion.question}
              </h3>
              <div className="space-y-3">
                {currentQuestion.options.map((option, i) => renderOption(option, i))}
              </div>
            </div>

            {showExplanation && (
              <div className="mt-auto pt-6 border-t border-white/10 animate-fade-in-up opacity-0">
                <div className="p-4 bg-accent-cyan/5 border border-accent-cyan/20 rounded-xl">
                  <p className="text-sm font-medium text-accent-cyan mb-2">📝 答案解析</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{currentQuestion.explanation}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <button onClick={() => goToIndex(Math.max(0, quizIndex - 1))} disabled={quizIndex === 0}
              className="flex items-center gap-2 px-4 py-2 btn-tech disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />上一题
            </button>
            <div className="flex items-center gap-3">
              {reviewMode ? (
                <button onClick={() => setReviewMode(false)} className="px-6 py-2 btn-primary">返回结果</button>
              ) : (
                <>
                  <button onClick={() => setShowExplanation(!showExplanation)} className="px-4 py-2 btn-tech">
                    {showExplanation ? '隐藏解析' : '查看解析'}
                  </button>
                  {quizIndex === totalQuestions - 1 ? (
                    <button onClick={handleSubmit} disabled={answeredCount < totalQuestions}
                      className="px-6 py-2 btn-primary disabled:opacity-50">提交答卷</button>
                  ) : (
                    <button onClick={() => goToIndex(Math.min(totalQuestions - 1, quizIndex + 1))}
                      className="flex items-center gap-2 px-4 py-2 btn-primary">
                      下一题<ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
