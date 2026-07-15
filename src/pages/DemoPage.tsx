import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Play, Pause, RotateCcw, Volume2, VolumeX, SkipForward, Maximize,
  MessageSquare, Network, Route, Code2, FileCheck, BarChart3,
  Bot, Zap, Shield, Sparkles, BookOpen, Cpu, Database, Lightbulb,
  ShieldCheck, Video, FileText, Edit3, Calendar, ArrowUpRight,
  ZoomIn, ZoomOut, Maximize2, Info, ArrowRight, Send,
  TrendingUp, Target, Award, Clock, ChevronRight,
  CheckCircle2, Circle, ClipboardList, BookMarked,
  FlaskConical, RotateCw, GraduationCap, AlertTriangle,
  Upload, Copy, Bug, GitCompare, CheckCircle, AlertCircle,
  Users, TrendingDown, Minus, School, Activity, Settings2, Filter,
  Trophy, XCircle, Bookmark, BookmarkCheck, ChevronLeft,
} from 'lucide-react';
import {
  graphNodes, graphLinks, categoryColors, highFreqQuestions, classStats,
  knowledgePoints, radarChartData, userProgress, teachingCalendar,
  pendingTasks, learningReport, qaDatabase,
} from '@/data/mockData';

// ==================== 场景定义 ====================

interface DemoScene {
  id: string;
  title: string;
  duration: number;
  narration: string;
  navTarget: string;
}

const scenes: DemoScene[] = [
  {
    id: 'intro', title: '开场', duration: 60,
    narration: '大家好，欢迎观看计组智学教育智能体演示视频。计组智学是为计算机组成原理课程量身打造的AI辅导平台。',
    navTarget: 'qa',
  },
  {
    id: 'architecture', title: '系统架构', duration: 60,
    narration: '系统采用三层架构设计。底层融合课程标准、教学日历、超星题库和实验指导书四大数据源。中层部署AI对话引擎、个性化推荐算法和代码调试引擎三大核心引擎。上层提供智能问答、知识图谱、学习路径、实验辅助、自测系统和教师端六大功能模块。',
    navTarget: 'qa',
  },
  {
    id: 'qa-1', title: '智能问答·提问与回答', duration: 60,
    narration: '首先是智能问答模块。页面顶部展示热门问题，每个问题带有知识点标签，如基础、难点、重点等。学生输入问题后，AI逐字呈现回答，支持Markdown格式，包含标题、加粗关键词和有序列表，提供清晰的表格对比。',
    navTarget: 'qa',
  },
  {
    id: 'qa-2', title: '智能问答·关联与审核', duration: 60,
    narration: 'AI回答底部自动关联教学日历，标注第几周的学习内容。下方推荐关联微课资源，区分视频、文档和练习三种类型。相关知识点标签可点击跳转到知识图谱。每条回答都有教学团队已审核标识。输入框下方还有隐私提示，学习数据本地化存储，不用于模型训练。',
    navTarget: 'qa',
  },
  {
    id: 'graph-1', title: '知识图谱·画布交互', duration: 60,
    narration: '知识图谱模块展示课程核心概念及其关联关系。画布支持拖拽平移和滚轮缩放，有网格背景和粒子漂浮效果。画布中有CPU、运算器、控制器、存储器等十个核心节点，用不同颜色区分类别。点击任意节点，关联节点和连线自动高亮，未关联的变暗，连线上显示关系文字。',
    navTarget: 'graph',
  },
  {
    id: 'graph-2', title: '知识图谱·详情与路径', duration: 60,
    narration: '右侧详情面板展示选中节点的名称、分类标签和详细描述。下方提供两个跨模块跳转按钮：在问答中提问和做相关练习，实现知识图谱与问答、自测的无缝衔接。关联知识点列表支持点击切换。下方还有五步学习路径建议，从数据表示到IO系统逐步推进。左下角图例展示知识点分类颜色。',
    navTarget: 'graph',
  },
  {
    id: 'path-1', title: '学习路径·统计与进度', duration: 60,
    narration: '学习路径模块是教-学-评-辅闭环的核心。顶部展示七个学习数据统计卡片，包括总学习时长、总体进度、已答题数、正确率、活跃天数、累计问答和实验调试次数。雷达图直观呈现六维掌握度。各章节进度条展示学习进度和掌握度，薄弱知识点用红色标签标注。',
    navTarget: 'path',
  },
  {
    id: 'path-2', title: '学习路径·计划与报告', duration: 60,
    narration: '系统根据教学日历自动推送本周学习计划，分课前预习和课后巩固两类任务，均可勾选完成。待完成任务列表按类型分类，涵盖预习、练习、实验和复习，显示截止日期。个性化推荐区提供薄弱点突破、拓展阅读和实验预习建议。点击生成学习报告，可查看学习概况、优势知识点、薄弱知识点、实验表现等维度的评分和改进建议。',
    navTarget: 'path',
  },
  {
    id: 'lab-1', title: '实验辅助·编辑器', duration: 60,
    narration: '实验辅助模块为学生提供代码级支持。左侧列出实验项目，点击切换不同实验。中间代码编辑器支持8086汇编语法高亮，关键字、寄存器和数字用不同颜色标注。工具栏提供上传代码按钮，可直接上传汇编文件，还有重置和复制功能。',
    navTarget: 'lab',
  },
  {
    id: 'lab-2', title: '实验辅助·调试与对比', duration: 60,
    narration: '点击智能调试按钮后，右侧显示调试结果。错误用红色标记，显示行号和修复建议。警告用黄色标记。点击查看修复建议代码，弹出代码对比视图，左原始右修复，红色标记删除行，绿色标记新增行。下方还有优化建议和代码质量评分。',
    navTarget: 'lab',
  },
  {
    id: 'quiz-1', title: '自测系统·抽题配置', duration: 60,
    narration: '自测系统支持按知识点和难度动态抽题。首先选择知识点，如Cache映射、IEEE754、DMA方式等十二个知识点可选。然后选择难度级别，包括简单、中等和困难。再设置题目数量，5到20题可选。底部显示题库匹配结果，确认后点击开始答题。',
    navTarget: 'quiz',
  },
  {
    id: 'quiz-2', title: '自测系统·答题与成绩', duration: 60,
    narration: '答题界面左侧显示答题进度环形图和题目导航网格，支持收藏标记。中间展示题目内容、难度和知识点标签，选项支持单选和多选。提交后展示成绩分析，包括正确题数、正确率和用时，并识别薄弱知识点，提供重新抽题和查看解析功能。',
    navTarget: 'quiz',
  },
  {
    id: 'teacher-1', title: '教师端·班级与问题', duration: 60,
    narration: '教师端提供学情分析仪表盘。班级统计卡片展示各班活跃用户进度条、平均分和完成率对比。高频问题TOP10排行帮助教师快速了解学生困惑集中点，每条问题带有分类标签和趋势箭头，进度条直观展示提问频次。',
    navTarget: 'teacher',
  },
  {
    id: 'teacher-2', title: '教师端·柱状图与建议', duration: 60,
    narration: '知识点掌握度柱状图用渐变色直观展示各模块掌握情况。系统根据高频问题趋势自动生成教学调整建议，为教学优化提供数据支撑。例如Cache映射相关提问上升22%，建议增加课堂练习时间。',
    navTarget: 'teacher',
  },
  {
    id: 'results', title: '应用成效', duration: 60,
    narration: '在86名学生的4周试点中，智能体日均活跃用户62人，累计回答问题1347次，实验代码辅助调用213次。布尔代数化简和指令系统设计两个难点模块的随堂测验平均分分别提升12.3%和9.7%。满意度调查显示，91.2%的学生认为智能体显著提升学习体验，86.7%表示更愿意主动探索课程难点。',
    navTarget: 'teacher',
  },
  {
    id: 'outro', title: '总结', duration: 60,
    narration: '计组智学教育智能体，实现了AI技术与专业课程的深度耦合。知识深度融合教学日历，教-学-评-辅形成闭环，数据安全并重，架构可迁移至数据结构、操作系统等课程。谢谢！试用平台，可以访问：http://159.138.92.82/qa',
    navTarget: 'qa',
  },
];

// ==================== 交互状态 ====================

interface QAInteract {
  typing: boolean;
  showAnswer: boolean;
  showCalendar: boolean;
  showMicroCourses: boolean;
  showTopics: boolean;
  showReviewBadge: boolean;
}
interface GraphInteract {
  highlightNode: boolean;
  showDetail: boolean;
  showCrossModule: boolean;
  showLearningPath: boolean;
}
interface PathInteract {
  showStats: boolean;
  showRadar: boolean;
  showChapterProgress: boolean;
  showWeeklyPlan: boolean;
  showTasks: boolean;
  showRecommendations: boolean;
  showReport: boolean;
}
interface LabInteract {
  showCode: boolean;
  showUpload: boolean;
  showDebugResult: boolean;
  showDiff: boolean;
  showScore: boolean;
}
interface QuizInteract {
  showConfig: boolean;
  showQuestion: boolean;
  showResult: boolean;
}
interface TeacherInteract {
  showClassStats: boolean;
  showTop10: boolean;
  showBarChart: boolean;
  showSuggestions: boolean;
}

interface InteractState {
  qa: QAInteract;
  graph: GraphInteract;
  path: PathInteract;
  lab: LabInteract;
  quiz: QuizInteract;
  teacher: TeacherInteract;
}

const defaultInteract = (): InteractState => ({
  qa: { typing: false, showAnswer: false, showCalendar: false, showMicroCourses: false, showTopics: false, showReviewBadge: false },
  graph: { highlightNode: false, showDetail: false, showCrossModule: false, showLearningPath: false },
  path: { showStats: false, showRadar: false, showChapterProgress: false, showWeeklyPlan: false, showTasks: false, showRecommendations: false, showReport: false },
  lab: { showCode: false, showUpload: false, showDebugResult: false, showDiff: false, showScore: false },
  quiz: { showConfig: false, showQuestion: false, showResult: false },
  teacher: { showClassStats: false, showTop10: false, showBarChart: false, showSuggestions: false },
});

// ==================== 开场内容 ====================

function IntroContent() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center px-12">
      <div className="animate-fade-in-up">
        <div className="text-6xl font-bold font-tech mb-4">
          <span className="glow-text">计组</span><span className="glow-text-purple">智学</span>
        </div>
        <div className="text-2xl text-text-secondary mb-6">计算机组成原理 · 智能辅导智能体</div>
      </div>
      <div className="grid grid-cols-3 gap-6 max-w-3xl animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
        {[
          { icon: '📚', label: '知识体系', desc: '深度融合课程标准' },
          { icon: '🤖', label: 'AI辅导', desc: '7×24小时智能答疑' },
          { icon: '🎯', label: '个性推荐', desc: '精准定位薄弱点' },
        ].map((item, i) => (
          <div key={i} className="glass-card p-6 text-center">
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="text-lg font-bold text-accent-cyan mb-1">{item.label}</div>
            <div className="text-sm text-text-secondary">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== 架构内容 ====================

function ArchitectureContent() {
  const [activeLayer, setActiveLayer] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveLayer(p => (p + 1) % 3), 2500);
    return () => clearInterval(t);
  }, []);

  const layers = [
    { name: '应用层', color: 'cyan', items: ['智能问答', '知识图谱', '学习路径', '实验辅助', '自测系统', '教师端'] },
    { name: '引擎层', color: 'purple', items: ['AI对话引擎', '个性化推荐', '代码调试引擎'] },
    { name: '数据层', color: 'green', items: ['课程标准', '教学日历', '超星题库', '实验指导书'] },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-16">
      <h2 className="text-3xl font-bold glow-text mb-2">系统架构</h2>
      <p className="text-text-secondary mb-8">三层架构 · 教-学-评-辅 闭环设计</p>
      <div className="w-full max-w-4xl space-y-4">
        {layers.map((layer, li) => (
          <div
            key={li}
            className={`glass-card p-5 transition-all duration-500 ${activeLayer === li ? 'border-accent-cyan/40 scale-[1.02]' : 'opacity-70'}`}
          >
            <div className={`text-sm font-bold mb-3 ${layer.color === 'cyan' ? 'text-accent-cyan' : layer.color === 'purple' ? 'text-accent-purple' : 'text-accent-green'}`}>
              {layer.name}
            </div>
            <div className="flex flex-wrap gap-2">
              {layer.items.map((item, ii) => (
                <span key={ii} className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-300 ${
                  activeLayer === li ? 'border-accent-cyan/40 text-accent-cyan bg-accent-cyan/10' : 'border-white/10 text-text-secondary'
                }`}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== 智能问答内容 ====================

const qaQuickQuestions = [
  { icon: Cpu, text: '什么是DMA方式？', tag: '基础' },
  { icon: Database, text: '为什么浮点数运算会有精度损失？', tag: '难点' },
  { icon: Sparkles, text: '微程序控制与硬布线控制的区别', tag: '重点' },
  { icon: BookOpen, text: 'Cache有哪几种映射方式？', tag: '常考' },
  { icon: Lightbulb, text: '指令周期包含哪些阶段？', tag: '基础' },
];

const microCourseMeta: Record<string, { icon: typeof Video; label: string; color: string }> = {
  video: { icon: Video, label: '视频', color: 'text-accent-cyan' },
  doc: { icon: FileText, label: '文档', color: 'text-accent-green' },
  exercise: { icon: Edit3, label: '练习', color: 'text-accent-purple' },
};

function QAContent({ interact }: { interact: QAInteract }) {
  const [typedText, setTypedText] = useState('');
  const fullQuestion = '什么是DMA方式？';

  useEffect(() => {
    if (interact.typing) {
      let i = 0;
      const timer = setInterval(() => {
        i++;
        setTypedText(fullQuestion.slice(0, i));
        if (i >= fullQuestion.length) clearInterval(timer);
      }, 80);
      return () => clearInterval(timer);
    }
  }, [interact.typing]);

  const dmaAnswer = qaDatabase[0];

  return (
    <div className="w-full h-full flex flex-col px-8 py-6 overflow-hidden">
      {/* 页面标题 */}
      <div className="mb-4 flex-shrink-0">
        <h2 className="text-2xl font-bold text-text-primary mb-1 font-tech">
          <span className="glow-text">智能问答</span>
        </h2>
        <p className="text-text-secondary text-sm">有问题随时问，AI助教7x24小时在线</p>
      </div>

      {/* 热门问题 */}
      <div className="mb-4 flex-shrink-0">
        <p className="text-sm text-text-secondary mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-cyan" />
          热门问题
        </p>
        <div className="flex flex-wrap gap-2">
          {qaQuickQuestions.map((q, i) => (
            <button key={i} className="group flex items-center gap-2 px-3 py-1.5 bg-bg-card border border-accent-cyan/20 rounded-lg">
              <q.icon className="w-3.5 h-3.5 text-accent-cyan" />
              <span className="text-xs text-text-primary">{q.text}</span>
              <span className="text-xs px-1.5 py-0.5 bg-accent-purple/20 text-accent-purple rounded-full">{q.tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 对话区域 */}
      <div className="flex-1 glass-card overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* 用户消息 */}
          {(interact.typing || interact.showAnswer) && (
            <div className="flex justify-end animate-fade-in">
              <div className="flex gap-2 max-w-[80%]">
                <div className="chat-bubble-user px-4 py-2">
                  {interact.typing ? typedText : fullQuestion}
                  {interact.typing && <span className="animate-pulse text-accent-cyan">▌</span>}
                </div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-cyan to-accent-green flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-bg-primary">我</span>
                </div>
              </div>
            </div>
          )}

          {/* AI回答 */}
          {interact.showAnswer && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex gap-2 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center flex-shrink-0 shadow-glow-purple">
                  <Sparkles className="w-3.5 h-3.5 text-bg-primary" />
                </div>
                <div className="chat-bubble-ai p-4">
                  <div className="text-sm">
                    <h3 className="text-base font-bold text-accent-cyan mb-2">DMA方式定义</h3>
                    <p className="text-text-primary/90 mb-2">
                      <strong className="text-accent-cyan font-semibold">DMA（Direct Memory Access，直接存储器访问）</strong>是一种高速数据传输方式，允许外部设备直接与主存储器进行数据交换，而不需要CPU的干预。
                    </p>
                    <h4 className="text-sm font-semibold text-accent-purple mb-1">与程序中断方式的区别</h4>
                    <div className="overflow-x-auto mb-2">
                      <table className="text-xs w-full border-collapse">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="py-1 pr-2 text-text-secondary text-left">对比项</th>
                            <th className="py-1 pr-2 text-accent-cyan text-left">DMA方式</th>
                            <th className="py-1 text-accent-purple text-left">程序中断方式</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            ['数据传输', 'DMA控制器直接完成', '需CPU执行中断程序'],
                            ['CPU干预', '仅开始和结束时干预', '每个数据需CPU处理'],
                            ['响应速度', '非常快，适合高速设备', '较慢，有中断开销'],
                          ].map(([a, b, c], i) => (
                            <tr key={i} className="border-b border-white/5">
                              <td className="py-1 pr-2 text-text-secondary">{a}</td>
                              <td className="py-1 pr-2 text-text-primary/90">{b}</td>
                              <td className="py-1 text-text-primary/90">{c}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <h4 className="text-sm font-semibold text-accent-purple mb-1">DMA工作过程</h4>
                    <ol className="list-decimal list-inside text-text-primary/90 space-y-0.5 text-xs">
                      <li><strong className="text-accent-cyan">预处理</strong>：CPU向DMA控制器发送命令</li>
                      <li><strong className="text-accent-cyan">数据传送</strong>：DMA控制器接管总线，直接传输数据</li>
                      <li><strong className="text-accent-cyan">后处理</strong>：传输完成后，DMA向CPU发中断</li>
                    </ol>
                  </div>

                  {/* 教学日历关联 */}
                  {interact.showCalendar && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <button className="group flex items-center gap-2 text-xs px-3 py-1.5 bg-accent-purple/10 text-accent-purple rounded-lg">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>教学日历：第14周 - 总线系统</span>
                        <ArrowUpRight className="w-3 h-3 opacity-60" />
                      </button>
                    </div>
                  )}

                  {/* 关联微课资源 */}
                  {interact.showMicroCourses && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-xs text-text-secondary mb-2 flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3 text-accent-cyan" />
                        关联微课资源
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {dmaAnswer.microCourses.map((course, i) => {
                          const meta = microCourseMeta[course.type] || microCourseMeta.doc;
                          const Icon = meta.icon;
                          return (
                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-bg-primary/40 border border-accent-cyan/20 rounded-lg">
                              <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                              <span className="text-xs text-text-primary">{course.title}</span>
                              <span className="text-xs text-text-secondary">{course.duration}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 相关知识点标签 */}
                  {interact.showTopics && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-xs text-text-secondary mb-2">相关知识点（点击跳转知识图谱）：</p>
                      <div className="flex flex-wrap gap-1.5">
                        {dmaAnswer.relatedTopics.map((topic, i) => (
                          <button key={i} className="flex items-center gap-1 text-xs px-2 py-1 bg-accent-cyan/10 text-accent-cyan rounded-md">
                            <span>#{topic}</span>
                            <ArrowUpRight className="w-3 h-3 opacity-60" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 教学团队已审核 */}
                  {interact.showReviewBadge && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-accent-green/15 text-accent-green rounded-full">
                        <ShieldCheck className="w-3 h-3" />
                        教学团队已审核
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 隐私提示 + 输入框 */}
        <div className="p-3 border-t border-accent-cyan/10 bg-bg-primary/30 flex-shrink-0">
          {interact.showReviewBadge && (
            <p className="text-xs text-text-secondary mb-2 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-accent-green" />
              学习数据本地化存储，不用于模型训练
            </p>
          )}
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={interact.typing ? typedText : interact.showAnswer ? fullQuestion : ''}
                readOnly
                placeholder="输入你的问题，按Enter发送..."
                className="w-full px-4 py-3 pr-12 bg-bg-primary/70 border border-accent-cyan/20 rounded-xl text-text-primary placeholder:text-text-secondary text-sm resize-none min-h-[44px] max-h-24"
                rows={1}
              />
            </div>
            <button className="p-3 bg-gradient-to-r from-accent-cyan to-accent-purple text-bg-primary rounded-xl">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== 知识图谱内容 ====================

function GraphContent({ interact }: { interact: GraphInteract }) {
  const selectedNode = graphNodes.find(n => n.id === 'alu');
  const relatedLinks = graphLinks.filter(l => l.source === 'alu' || l.target === 'alu');
  const relatedNodeIds = new Set<string>();
  relatedLinks.forEach(l => { relatedNodeIds.add(l.source); relatedNodeIds.add(l.target); });
  relatedNodeIds.delete('alu');

  const categories = Object.entries(categoryColors);

  return (
    <div className="w-full h-full flex flex-col px-8 py-6 overflow-hidden">
      <div className="mb-4 flex justify-between items-start flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-1 font-tech">
            <span className="glow-text-purple">知识图谱</span>
          </h2>
          <p className="text-text-secondary text-sm">点击节点探索知识点之间的关联关系</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 glass-card"><ZoomOut className="w-4 h-4 text-text-secondary" /></button>
          <span className="text-sm text-text-secondary w-12 text-center">100%</span>
          <button className="p-2 glass-card"><ZoomIn className="w-4 h-4 text-text-secondary" /></button>
          <button className="p-2 glass-card"><Maximize2 className="w-4 h-4 text-text-secondary" /></button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* 画布区域 */}
        <div className="flex-1 glass-card overflow-hidden relative">
          <svg viewBox="0 0 800 550" className="w-full h-full">
            <defs>
              <pattern id="demo-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,212,255,0.05)" strokeWidth="1" />
              </pattern>
              <style>{`
                @keyframes particle-drift-demo {
                  0%   { transform: translate(0, 0); opacity: 0; }
                  25%  { opacity: 0.85; }
                  75%  { opacity: 0.85; }
                  100% { transform: translate(var(--dx), var(--dy)); opacity: 0; }
                }
              `}</style>
            </defs>
            <rect width="100%" height="100%" fill="url(#demo-grid)" />

            {/* 粒子 */}
            {[
              { cx:60,cy:80,r:2.5,color:'rgba(0,212,255,0.2)',dx:22,dy:-30,delay:0,dur:9 },
              { cx:180,cy:50,r:1.8,color:'rgba(123,47,247,0.15)',dx:-18,dy:-28,delay:1.2,dur:11 },
              { cx:320,cy:120,r:3,color:'rgba(0,212,255,0.2)',dx:25,dy:-35,delay:2.4,dur:10 },
              { cx:450,cy:60,r:2,color:'rgba(123,47,247,0.15)',dx:-22,dy:-24,delay:0.8,dur:12 },
              { cx:580,cy:180,r:2.5,color:'rgba(0,212,255,0.2)',dx:20,dy:-32,delay:3,dur:9.5 },
              { cx:720,cy:90,r:1.5,color:'rgba(123,47,247,0.15)',dx:-25,dy:-30,delay:1.8,dur:11.5 },
            ].map((p, i) => (
              <circle key={`p-${i}`} cx={p.cx} cy={p.cy} r={p.r} fill={p.color}
                style={{ '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, animation: `particle-drift-demo ${p.dur}s ease-in-out ${p.delay}s infinite` } as React.CSSProperties}
              />
            ))}

            {/* 连线 */}
            {graphLinks.map((link, i) => {
              const source = graphNodes.find(n => n.id === link.source);
              const target = graphNodes.find(n => n.id === link.target);
              if (!source || !target) return null;
              const highlighted = interact.highlightNode && (link.source === 'alu' || link.target === 'alu');
              return (
                <g key={`link-${i}`}>
                  <line x1={source.x} y1={source.y} x2={target.x} y2={target.y}
                    stroke={highlighted ? '#00d4ff' : 'rgba(0,212,255,0.15)'}
                    strokeWidth={highlighted ? 2 : 1}
                    className="transition-all duration-300"
                    style={{ filter: highlighted ? 'drop-shadow(0 0 4px rgba(0,212,255,0.5))' : 'none' }}
                  />
                  {highlighted && (
                    <text x={(source.x + target.x) / 2} y={(source.y + target.y) / 2 - 8}
                      textAnchor="middle" fill="rgba(0,212,255,0.8)" fontSize="11" className="font-mono-code">
                      {link.relation}
                    </text>
                  )}
                </g>
              );
            })}

            {/* 节点 */}
            {graphNodes.map((node) => {
              const isRelated = interact.highlightNode && relatedNodeIds.has(node.id);
              const isSelected = interact.highlightNode && node.id === 'alu';
              const highlighted = !interact.highlightNode || isSelected || isRelated;
              return (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`}
                  style={{ opacity: highlighted ? 1 : 0.25, transition: 'opacity 0.3s' }}>
                  {(isSelected) && (
                    <circle r={40} fill={node.color} opacity="0.2" className="animate-pulse" />
                  )}
                  <circle r={28} fill="rgba(10,14,26,0.9)" stroke={node.color}
                    strokeWidth={isSelected ? 3 : 2}
                    style={{ filter: isSelected ? `drop-shadow(0 0 10px ${node.color})` : 'none', transition: 'all 0.3s' }}
                  />
                  <text textAnchor="middle" dy="0.3em" fill={highlighted ? '#e5e7eb' : '#6b7280'}
                    fontSize="11" fontWeight={isSelected ? 'bold' : 'normal'} className="select-none pointer-events-none">
                    {node.name.length > 6 ? node.name.slice(0, 6) : node.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* 图例 */}
          {interact.showLearningPath && (
            <div className="absolute bottom-4 left-4 glass-card p-3">
              <p className="text-xs text-text-secondary mb-2">知识点分类</p>
              <div className="flex flex-wrap gap-2 max-w-[200px]">
                {categories.map(([name, color]) => (
                  <div key={name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-xs text-text-primary">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="absolute top-4 left-4 text-xs text-text-secondary bg-bg-primary/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-accent-cyan" />
            <span>拖拽平移 · 滚轮缩放 · 点击节点查看详情</span>
          </div>
        </div>

        {/* 右侧详情面板 */}
        <div className="w-80 flex flex-col gap-4 flex-shrink-0">
          <div className={`glass-card p-5 transition-all duration-500 ${interact.showDetail ? 'opacity-100' : 'opacity-50'}`}>
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-accent-purple" />
              <h3 className="font-semibold text-text-primary">节点详情</h3>
            </div>
            {interact.showDetail && selectedNode ? (
              <div className="animate-fade-in">
                <div className="text-xl font-bold mb-2" style={{ color: selectedNode.color }}>{selectedNode.name}</div>
                <div className="text-xs px-2 py-1 rounded-full inline-block mb-4"
                  style={{ backgroundColor: `${selectedNode.color}20`, color: selectedNode.color }}>
                  {selectedNode.category}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">{selectedNode.description}</p>

                {/* 跨模块跳转 */}
                {interact.showCrossModule && (
                  <div className="flex gap-2 mb-4">
                    <button className="btn-tech flex-1 flex items-center justify-center gap-1.5 text-sm">
                      <MessageSquare className="w-4 h-4" />
                      <span>在问答中提问</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button className="btn-tech flex-1 flex items-center justify-center gap-1.5 text-sm">
                      <FileCheck className="w-4 h-4" />
                      <span>做相关练习</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs text-text-secondary mb-2">关联知识点</p>
                  <div className="space-y-2">
                    {graphNodes.filter(n => relatedNodeIds.has(n.id)).map(node => (
                      <button key={node.id} className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }} />
                          <span className="text-sm text-text-primary">{node.name}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-text-secondary">
                <Info className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">点击图谱中的节点</p>
                <p className="text-xs">查看详细信息</p>
              </div>
            )}
          </div>

          {/* 学习路径建议 */}
          {interact.showLearningPath && (
            <div className="glass-card p-5 flex-1 animate-fade-in">
              <h3 className="font-semibold text-text-primary mb-4">📚 学习路径建议</h3>
              <div className="space-y-3">
                {[
                  { step: 1, title: '数据表示', desc: '理解数制与编码' },
                  { step: 2, title: '运算方法', desc: '掌握定点与浮点运算' },
                  { step: 3, title: '存储系统', desc: 'Cache与虚拟存储' },
                  { step: 4, title: 'CPU设计', desc: '控制器与运算器' },
                  { step: 5, title: 'IO系统', desc: '中断与DMA方式' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-accent-cyan/20 text-accent-cyan text-xs flex items-center justify-center font-bold">{item.step}</div>
                      {i < 4 && <div className="w-px flex-1 bg-accent-cyan/20" />}
                    </div>
                    <div className="pb-3">
                      <p className="text-sm font-medium text-text-primary">{item.title}</p>
                      <p className="text-xs text-text-secondary">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== 学习路径内容 ====================

const taskTypeConfig: Record<string, { icon: typeof BookOpen; label: string; color: string; bg: string; ring: string }> = {
  'pre-study': { icon: BookOpen, label: '预习', color: 'text-accent-cyan', bg: 'bg-accent-cyan/10', ring: 'border-accent-cyan/30' },
  exercise: { icon: ClipboardList, label: '练习', color: 'text-accent-green', bg: 'bg-accent-green/10', ring: 'border-accent-green/30' },
  experiment: { icon: FlaskConical, label: '实验', color: 'text-accent-purple', bg: 'bg-accent-purple/10', ring: 'border-accent-purple/30' },
  review: { icon: RotateCw, label: '复习', color: 'text-accent-pink', bg: 'bg-accent-pink/10', ring: 'border-accent-pink/30' },
};

const pathRecommendations = [
  { title: '薄弱点专项突破', desc: '针对浮点数运算、Cache映射等薄弱点', type: '重点推荐', items: ['浮点数加减运算', 'Cache组相联映射', '微程序控制器'], borderColor: 'border-accent-pink/30', iconColor: 'text-accent-pink', bgColor: 'bg-accent-pink/10' },
  { title: '拓展阅读材料', desc: '学有余力？看看这些拓展内容', type: '拓展提升', items: ['RISC-V指令集架构', '量子计算基础', '神经形态计算'], borderColor: 'border-accent-purple/30', iconColor: 'text-accent-purple', bgColor: 'bg-accent-purple/10' },
  { title: '实验预习建议', desc: '下一次实验：简单CPU设计', type: '实验预告', items: ['数据通路设计', '控制单元设计', '指令译码实现'], borderColor: 'border-accent-cyan/30', iconColor: 'text-accent-cyan', bgColor: 'bg-accent-cyan/10' },
];

function PathContent({ interact }: { interact: PathInteract }) {
  const activeDays = Math.round(userProgress.totalStudyTime / 180);
  const debugCount = 213;
  const currentCalendar = teachingCalendar.find(c => c.week === 14);
  const containerRef = useRef<HTMLDivElement>(null);
  const recoRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // 新内容出现时自动滚动到可视区域
  useEffect(() => {
    if (interact.showReport && reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (interact.showRecommendations && recoRef.current) {
      recoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (interact.showTasks || interact.showWeeklyPlan) {
      // 出现新内容时滚动到底部
      if (containerRef.current) {
        containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [interact.showWeeklyPlan, interact.showTasks, interact.showRecommendations, interact.showReport]);

  const stats = [
    { icon: Clock, label: '总学习时长', value: `${Math.floor(userProgress.totalStudyTime / 60)}h`, sub: '小时', color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
    { icon: Target, label: '总体进度', value: `${userProgress.overallProgress}%`, sub: '已完成', color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
    { icon: BookOpen, label: '已答题数', value: `${userProgress.questionsAnswered}`, sub: '道题', color: 'text-accent-green', bg: 'bg-accent-green/10' },
    { icon: Award, label: '正确率', value: '78%', sub: '平均', color: 'text-accent-pink', bg: 'bg-accent-pink/10' },
    { icon: Calendar, label: '活跃天数', value: `${activeDays}`, sub: '天', color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
    { icon: FileText, label: '累计问答', value: `${userProgress.questionsAnswered}`, sub: '次', color: 'text-accent-green', bg: 'bg-accent-green/10' },
    { icon: FlaskConical, label: '实验调试', value: `${debugCount}`, sub: '次', color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
  ];

  // 雷达图数据点计算
  const radarPoints = (() => {
    const indicators = radarChartData.indicators;
    const values = radarChartData.values;
    const cx = 100, cy = 100, r = 80;
    return indicators.map((_, i) => {
      const angle = (Math.PI * 2 * i) / indicators.length - Math.PI / 2;
      const val = values[i] / 100;
      return `${cx + r * val * Math.cos(angle)},${cy + r * val * Math.sin(angle)}`;
    }).join(' ');
  })();
  const radarGrid = radarChartData.indicators.map((_, i) => {
    const angle = (Math.PI * 2 * i) / radarChartData.indicators.length - Math.PI / 2;
    return `${100 + 80 * Math.cos(angle)},${100 + 80 * Math.sin(angle)}`;
  }).join(' ');
  const radarLabels = radarChartData.indicators.map((ind, i) => {
    const angle = (Math.PI * 2 * i) / radarChartData.indicators.length - Math.PI / 2;
    return { x: 100 + 95 * Math.cos(angle), y: 100 + 95 * Math.sin(angle), name: ind.name };
  });

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col px-8 py-6 overflow-y-auto">
      <div className="mb-4 flex-shrink-0">
        <h2 className="text-2xl font-bold text-text-primary mb-1 font-tech">
          <span className="glow-text">学习路径</span>
        </h2>
        <p className="text-text-secondary text-sm">个性化学习建议与进度追踪，查漏补缺高效学习</p>
      </div>

      {/* 统计卡片 */}
      {interact.showStats && (
        <div className="grid grid-cols-4 gap-3 mb-4 animate-fade-in flex-shrink-0">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card p-4">
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-xl font-bold font-tech text-text-primary mb-0.5">
                {stat.value} <span className="text-xs font-normal text-text-secondary">{stat.sub}</span>
              </div>
              <p className="text-xs text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 flex-shrink-0">
        {/* 雷达图 */}
        {interact.showRadar && (
          <div className="glass-card p-4 animate-fade-in">
            <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-accent-cyan" />
              知识点掌握度
            </h3>
            <svg viewBox="0 0 200 200" className="w-44 h-44 mx-auto">
              <polygon points={radarGrid} fill="none" stroke="rgba(0,212,255,0.15)" strokeWidth="1" />
              <polygon points={radarPoints} fill="rgba(0,212,255,0.15)" stroke="#00d4ff" strokeWidth="1.5" />
              {radarLabels.map((lbl, i) => (
                <text key={i} x={lbl.x} y={lbl.y} textAnchor="middle" dominantBaseline="middle" fill="#9ca3af" fontSize="9">{lbl.name}</text>
              ))}
            </svg>
          </div>
        )}

        {/* 章节进度 */}
        {interact.showChapterProgress && (
          <div className="col-span-2 glass-card p-4 animate-fade-in">
            <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-accent-purple" />
              各章节学习进度
            </h3>
            <div className="space-y-3">
              {userProgress.chapters.map((chapter, i) => (
                <div key={i} className="group p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-text-primary">{chapter.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-secondary">
                        掌握度 <span className="text-accent-cyan font-semibold">{chapter.mastery}%</span>
                      </span>
                      <ChevronRight className="w-3 h-3 text-text-secondary" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-bg-primary rounded-full overflow-hidden">
                      <div className="h-full progress-bar-glow" style={{ width: `${chapter.progress}%` }} />
                    </div>
                    <span className="text-xs text-text-secondary w-10 text-right">{chapter.progress}%</span>
                  </div>
                  {chapter.weakPoints.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <AlertTriangle className="w-3 h-3 text-accent-pink flex-shrink-0" />
                      <div className="flex flex-wrap gap-1">
                        {chapter.weakPoints.map((wp, j) => (
                          <span key={j} className="text-xs px-1.5 py-0.5 bg-accent-pink/10 text-accent-pink rounded-full">{wp}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 本周学习计划 */}
      {interact.showWeeklyPlan && currentCalendar && (
        <div className="mt-4 glass-card p-4 animate-fade-in flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-text-primary flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-accent-purple" />
              本周学习计划
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent-purple/10 text-accent-purple">第 14 周</span>
          </div>
          <p className="text-xs text-text-secondary mb-3">{currentCalendar.topic} · {currentCalendar.chapter}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl border border-accent-cyan/30 bg-accent-cyan/5">
              <h4 className="flex items-center gap-2 font-medium text-accent-cyan mb-2 text-sm">
                <BookMarked className="w-4 h-4" /> 课前预习任务
              </h4>
              <div className="space-y-1.5">
                {currentCalendar.preClassTasks.map((t, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <Circle className="w-3.5 h-3.5 text-text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-text-primary">{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 rounded-xl border border-accent-green/30 bg-accent-green/5">
              <h4 className="flex items-center gap-2 font-medium text-accent-green mb-2 text-sm">
                <CheckCircle2 className="w-4 h-4" /> 课后巩固任务
              </h4>
              <div className="space-y-1.5">
                {currentCalendar.postClassTasks.map((t, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-green flex-shrink-0 mt-0.5" />
                    <span className={`text-text-primary ${i === 0 ? 'line-through opacity-50' : ''}`}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 待完成任务 */}
      {interact.showTasks && (
        <div className="mt-4 glass-card p-4 animate-fade-in flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-text-primary flex items-center gap-2 text-sm">
              <ClipboardList className="w-4 h-4 text-accent-cyan" />
              待完成任务
            </h3>
            <span className="text-xs text-text-secondary">已完成 1 / {pendingTasks.length}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {pendingTasks.map((task) => {
              const cfg = taskTypeConfig[task.type];
              const Icon = cfg.icon;
              return (
                <div key={task.id} className={`p-3 rounded-lg border ${cfg.ring} bg-gradient-to-br from-bg-primary/30 to-transparent ${task.completed ? 'opacity-50' : ''}`}>
                  <div className="flex items-start gap-2">
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-accent-green flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-text-secondary flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                          <Icon className="w-3 h-3" /> {cfg.label}
                        </span>
                        <span className="text-xs text-text-secondary flex items-center gap-0.5">
                          <Clock className="w-3 h-3" /> {task.deadline}
                        </span>
                      </div>
                      <h4 className={`text-xs font-medium text-text-primary ${task.completed ? 'line-through text-text-secondary' : ''}`}>{task.title}</h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 个性化推荐 */}
      {interact.showRecommendations && (
        <div ref={recoRef} className="mt-4 glass-card p-4 animate-fade-in flex-shrink-0">
          <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2 text-sm">
            <Target className="w-4 h-4 text-accent-green" />
            个性化学习推荐
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {pathRecommendations.map((card, i) => (
              <div key={i} className={`p-4 rounded-xl border bg-gradient-to-br from-bg-primary/50 to-transparent ${card.borderColor}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-text-primary text-sm">{card.title}</h4>
                  <span className={`text-xs px-2 py-0.5 ${card.bgColor} ${card.iconColor} rounded-full`}>{card.type}</span>
                </div>
                <p className="text-xs text-text-secondary mb-3">{card.desc}</p>
                <ul className="space-y-1.5">
                  {card.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-1.5 text-xs text-text-primary/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 学习报告 */}
      {interact.showReport && (
        <div ref={reportRef} className="mt-4 glass-card p-4 animate-fade-in flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-text-primary flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-accent-cyan" />
              学习报告
            </h3>
            <button className="btn-tech btn-primary inline-flex items-center gap-2 text-xs px-3 py-1.5">
              <GraduationCap className="w-3.5 h-3.5" />生成学习报告
            </button>
          </div>
          <div className="space-y-2">
            {learningReport.slice(0, 4).map((item, i) => (
              <div key={i} className="p-3 rounded-lg bg-bg-primary/30 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <GraduationCap className="w-3.5 h-3.5 text-accent-cyan flex-shrink-0" />
                  <h4 className="font-semibold text-text-primary text-sm">{item.section}</h4>
                </div>
                <p className="text-xs text-text-secondary mb-2">{item.content}</p>
                {item.score !== undefined && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary">评分</span>
                      <span className="text-accent-cyan font-semibold">{item.score} / 100</span>
                    </div>
                    <div className="h-1.5 bg-bg-primary rounded-full overflow-hidden">
                      <div className="h-full progress-bar-glow" style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                )}
                {item.suggestion && (
                  <div className="flex items-start gap-1.5 p-1.5 rounded bg-accent-pink/10 text-accent-pink text-xs mt-1">
                    <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    <span>{item.suggestion}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 实验辅助内容 ====================

const labExamples = [
  { name: '实验3：分支循环程序', desc: '计算1~10累加和', active: true },
  { name: '实验2：数码转换', desc: 'BCD码转二进制' },
  { name: '实验4：子程序设计', desc: '冒泡排序实现' },
];

const labCodeLines = [
  '; 实验3：分支与循环程序设计',
  '; 计算 1+2+3+...+10 的和',
  '',
  'DSEG SEGMENT',
  '    num DB 10',
  '    result DW ?',
  'DSEG ENDS',
  '',
  'CSEG SEGMENT',
  '    ASSUME CS:CSEG, DS:DSEG',
  'START:',
  '    MOV AX, DSEG',
  '    MOV DS, AX',
  '    MOV CX, num',
  '    MOV AX, 0',
  '    MOV BX, 1',
  'LOOP1:',
  '    ADD AX, BX',
  '    INC BX',
  '    LOOP LOOP1',
  '    MOV result, AX',
  '    MOV AH, 4CH',
  '    INT 21H',
  'CSEG ENDS',
  'END START',
];

function LabContent({ interact }: { interact: LabInteract }) {
  const highlightLine = (line: string) => {
    let r = line.replace(/^;.*/g, '<span class="code-comment">$&</span>');
    r = r.replace(/\b(MOV|ADD|INC|LOOP|INT|ASSUME|SEGMENT|ENDS|PUSH|POP|CMP|JMP)\b/g, '<span class="code-instruction">$1</span>');
    r = r.replace(/\b(AX|BX|CX|DX|AL|BL|CL|DL|AH|BH|CH|DH|SI|DI|BP|SP|CS|DS|ES|SS)\b/g, '<span class="code-register">$1</span>');
    r = r.replace(/\b\d+\b/g, '<span class="code-number">$&</span>');
    return r;
  };

  return (
    <div className="w-full h-full flex flex-col px-8 py-6 overflow-hidden">
      <div className="mb-4 flex-shrink-0">
        <h2 className="text-2xl font-bold text-text-primary mb-1 font-tech">
          <span className="glow-text-purple">实验辅助</span>
        </h2>
        <p className="text-text-secondary text-sm">汇编代码智能调试，助你快速定位问题</p>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* 左侧实验列表 */}
        <div className="w-56 flex-shrink-0 flex flex-col gap-3">
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-accent-cyan" />
              实验项目
            </h3>
            <div className="space-y-2">
              {labExamples.map((ex, i) => (
                <button key={i} className={`w-full text-left p-2.5 rounded-lg transition-all ${
                  i === 0 ? 'bg-accent-cyan/10 border border-accent-cyan/30' : 'hover:bg-white/5 border border-transparent'
                }`}>
                  <p className={`text-sm font-medium ${i === 0 ? 'text-accent-cyan' : 'text-text-primary'}`}>{ex.name}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{ex.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-accent-green" />
              实验小贴士
            </h3>
            <ul className="space-y-1.5 text-xs text-text-secondary">
              <li className="flex gap-2"><span className="text-accent-cyan">•</span>注意寄存器使用规范</li>
              <li className="flex gap-2"><span className="text-accent-cyan">•</span>循环次数与CX要匹配</li>
              <li className="flex gap-2"><span className="text-accent-cyan">•</span>段定义与段寄存器初始化</li>
            </ul>
          </div>
        </div>

        {/* 中间代码编辑器 */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text-primary">源代码</span>
              <span className="text-xs text-text-secondary">8086汇编</span>
            </div>
            <div className="flex items-center gap-2">
              {interact.showUpload && (
                <>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 glass-card hover:border-accent-cyan/40 transition-colors text-xs text-text-secondary">
                    <Upload className="w-3.5 h-3.5" />上传代码
                  </button>
                  <button className="p-1.5 glass-card hover:border-accent-cyan/40 transition-colors">
                    <RotateCcw className="w-3.5 h-3.5 text-text-secondary" />
                  </button>
                  <button className="p-1.5 glass-card hover:border-accent-cyan/40 transition-colors">
                    <Copy className="w-3.5 h-3.5 text-text-secondary" />
                  </button>
                </>
              )}
              <button className="flex items-center gap-2 px-3 py-1.5 btn-primary text-xs">
                <Bug className="w-3.5 h-3.5" />智能调试
              </button>
            </div>
          </div>

          {interact.showCode && (
            <div className="flex-1 glass-card overflow-hidden flex flex-col animate-fade-in">
              <div className="flex-1 overflow-auto code-editor-theme">
                <div className="flex min-w-max">
                  <div className="select-none text-right pr-4 pl-4 py-3 text-text-secondary/50 text-xs leading-5">
                    {labCodeLines.map((_, i) => <div key={i}>{i + 1}</div>)}
                  </div>
                  <div className="flex-1 pr-4 py-3">
                    {labCodeLines.map((line, i) => (
                      <div key={i} className="leading-5 px-2 -mx-2"
                        dangerouslySetInnerHTML={{ __html: highlightLine(line) || '&nbsp;' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 右侧调试结果 */}
        <div className="w-80 flex-shrink-0 flex flex-col">
          <div className="flex items-center gap-2 mb-2 flex-shrink-0">
            <Bug className="w-4 h-4 text-accent-pink" />
            <span className="text-sm font-medium text-text-primary">调试结果</span>
          </div>

          <div className="flex-1 glass-card p-4 overflow-y-auto">
            {interact.showDebugResult ? (
              <div className="space-y-4 animate-fade-in">
                {/* 错误列表 */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-sm font-medium text-red-400">错误 (1)</span>
                  </div>
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-red-400 font-mono-code flex-shrink-0">L15</span>
                      <div>
                        <p className="text-sm text-red-300">寄存器使用冲突</p>
                        <p className="text-xs text-text-secondary mt-1">💡 BX 在LOOP1前添加PUSH BX保护寄存器</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 警告列表 */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-400">警告 (2)</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-yellow-400 font-mono-code flex-shrink-0">L8</span>
                        <p className="text-sm text-yellow-300">缺少STACK段定义</p>
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-yellow-400 font-mono-code flex-shrink-0">L22</span>
                        <p className="text-sm text-yellow-300">结果未使用result变量</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 查看修复建议 */}
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2 btn-tech text-sm">
                  <GitCompare className="w-4 h-4" />
                  查看修复建议代码
                </button>

                {/* 代码对比弹窗模拟 */}
                {interact.showDiff && (
                  <div className="border border-accent-cyan/20 rounded-lg overflow-hidden animate-fade-in">
                    <div className="px-3 py-1.5 text-xs text-text-secondary bg-white/5 border-b border-white/10">原始代码 / 修复代码</div>
                    <div className="text-xs font-mono-code">
                      <div className="flex leading-5 px-2 bg-red-500/10 border-l-2 border-red-500">
                        <span className="text-text-secondary/40 w-6 text-right pr-1 flex-shrink-0">7</span>
                        <span className="text-red-300">DSEG ENDS</span>
                      </div>
                      <div className="flex leading-5 px-2 bg-green-500/10 border-l-2 border-green-500">
                        <span className="text-text-secondary/40 w-6 pr-1 flex-shrink-0">&nbsp;</span>
                        <span className="text-green-300">STACK SEGMENT STACK</span>
                      </div>
                      <div className="flex leading-5 px-2 bg-green-500/10 border-l-2 border-green-500">
                        <span className="text-text-secondary/40 w-6 pr-1 flex-shrink-0">&nbsp;</span>
                        <span className="text-green-300">    DW 100 DUP(?)</span>
                      </div>
                      <div className="flex leading-5 px-2 bg-green-500/10 border-l-2 border-green-500">
                        <span className="text-text-secondary/40 w-6 pr-1 flex-shrink-0">&nbsp;</span>
                        <span className="text-green-300">STACK ENDS</span>
                      </div>
                      <div className="flex leading-5 px-2 bg-green-500/10 border-l-2 border-green-500">
                        <span className="text-text-secondary/40 w-6 pr-1 flex-shrink-0">&nbsp;</span>
                        <span className="text-green-300">    PUSH BX    ; 保护BX寄存器</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 优化建议 */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-accent-green" />
                    <span className="text-sm font-medium text-accent-green">优化建议</span>
                  </div>
                  <ul className="space-y-1.5">
                    {['建议添加注释说明程序功能', '可以使用更高效的累加公式', '实验报告中建议添加运行结果验证'].map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-text-secondary">
                        <CheckCircle className="w-3.5 h-3.5 text-accent-green flex-shrink-0 mt-0.5" />{s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 代码质量评分 */}
                {interact.showScore && (
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">代码质量评分</span>
                      <span className="text-lg font-bold text-accent-cyan font-tech">75/100</span>
                    </div>
                    <div className="w-full h-2 bg-bg-primary rounded-full mt-2 overflow-hidden">
                      <div className="h-full progress-bar-glow" style={{ width: '75%' }} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <Bug className="w-14 h-14 text-text-secondary/30 mb-4" />
                <p className="text-text-secondary mb-1 text-sm">点击"智能调试"按钮</p>
                <p className="text-xs text-text-secondary/60">AI将自动分析代码问题</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== 自测系统内容 ====================

const DIFFICULTY_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困难' },
];

const COUNT_OPTIONS = [5, 10, 15, 20].map(c => ({ value: c, label: `${c} 题` }));

function QuizContent({ interact }: { interact: QuizInteract }) {
  return (
    <div className="w-full h-full flex flex-col px-8 py-6 overflow-hidden">
      <div className="mb-4 flex-shrink-0">
        <h2 className="text-2xl font-bold text-text-primary mb-1 font-tech">
          <span className="glow-text">自测系统</span>
        </h2>
        <p className="text-text-secondary text-sm">检验学习成果，即时反馈巩固知识</p>
      </div>

      {/* 抽题配置界面 */}
      {interact.showConfig && !interact.showQuestion && (
        <div className="flex-1 flex items-center justify-center animate-fade-in">
          <div className="glass-card p-6 max-w-2xl w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                <Settings2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary font-tech">抽题配置</h3>
                <p className="text-sm text-text-secondary">选择知识点、难度和题量</p>
              </div>
            </div>

            <div className="mb-5">
              <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
                <Filter className="w-4 h-4 text-accent-cyan" />知识点
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button className="px-3 py-2 rounded-lg text-sm bg-accent-cyan text-bg-primary border border-accent-cyan">全部</button>
                {knowledgePoints.slice(0, 7).map((kp) => (
                  <button key={kp} className="px-3 py-2 rounded-lg text-sm truncate bg-bg-primary/50 text-text-secondary border border-white/10 hover:border-accent-cyan/30">{kp}</button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-text-primary mb-2">难度</label>
              <div className="grid grid-cols-4 gap-2">
                {DIFFICULTY_OPTIONS.map((opt, i) => (
                  <button key={opt.value} className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    i === 2 ? 'bg-accent-purple/30 text-accent-purple border border-accent-purple/50' : 'bg-bg-primary/50 text-text-secondary border border-white/10'
                  }`}>{opt.label}</button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-text-primary mb-2">题目数量</label>
              <div className="grid grid-cols-4 gap-2">
                {COUNT_OPTIONS.map((opt, i) => (
                  <button key={opt.value} className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    i === 1 ? 'bg-accent-cyan/30 text-accent-cyan border border-accent-cyan/50' : 'bg-bg-primary/50 text-text-secondary border border-white/10'
                  }`}>{opt.label}</button>
                ))}
              </div>
            </div>

            <div className="mb-5 p-3 bg-bg-primary/40 rounded-lg border border-white/5 flex items-center justify-between text-sm">
              <span className="text-text-secondary">题库匹配</span>
              <span className="text-accent-cyan font-tech">共 20 题可用 / 抽取 10 题</span>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 btn-primary">
              <Play className="w-4 h-4" />开始答题
            </button>
          </div>
        </div>
      )}

      {/* 答题界面 */}
      {interact.showQuestion && !interact.showResult && (
        <div className="flex-1 flex gap-4 min-h-0 animate-fade-in">
          {/* 左侧导航 */}
          <div className="w-56 flex-shrink-0 flex flex-col gap-3">
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-3">答题进度</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-14 h-14">
                  <svg className="w-14 h-14 transform -rotate-90">
                    <circle cx="28" cy="28" r="24" stroke="rgba(0,212,255,0.1)" strokeWidth="3" fill="none" />
                    <circle cx="28" cy="28" r="24" stroke="url(#progGrad)" strokeWidth="3" fill="none"
                      strokeDasharray={`${30 * 1.508} 150.8`} strokeLinecap="round" />
                    <defs>
                      <linearGradient id="progGrad"><stop offset="0%" stopColor="#00d4ff" /><stop offset="100%" stopColor="#7b2ff7" /></linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-text-primary font-tech">3/10</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">已答题目</p>
                  <p className="text-xs text-text-secondary/70">共 10 题</p>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <button key={n} className={`aspect-square rounded text-xs font-medium ${
                    n === 3 ? 'bg-accent-cyan text-bg-primary' : n <= 2 ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30' : 'bg-bg-primary/50 text-text-secondary border border-white/10'
                  }`}>{n}</button>
                ))}
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-accent-pink" />收藏题目
                <span className="text-xs text-text-secondary ml-auto">1</span>
              </h3>
              <div className="text-xs text-accent-pink flex items-center gap-1.5 py-1">
                <Bookmark className="w-3 h-3 flex-shrink-0" />
                <span>第5题 · Cache映射</span>
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-accent-purple" />知识点分布
              </h3>
              <div className="space-y-1.5">
                {[
                  { kp: 'Cache映射', cnt: 3 },
                  { kp: 'IEEE 754', cnt: 2 },
                  { kp: 'DMA方式', cnt: 2 },
                  { kp: 'CPU结构', cnt: 3 },
                ].map(({ kp, cnt }) => (
                  <div key={kp} className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary truncate">{kp}</span>
                    <span className="text-accent-cyan flex-shrink-0 ml-2">{cnt}题</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 中间题目 */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-accent-purple/20 text-accent-purple text-xs rounded-full">第 3 题 / 共 10 题</span>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">中等</span>
                <span className="text-xs text-text-secondary">Cache映射</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-text-secondary text-xs">
                  <Clock className="w-3.5 h-3.5" /><span className="font-tech">02:35</span>
                </div>
                <button className="flex items-center gap-1 px-2 py-1 rounded-full text-xs border bg-accent-pink/20 text-accent-pink border-accent-pink/40">
                  <BookmarkCheck className="w-3 h-3" />已收藏
                </button>
              </div>
            </div>

            <div className="flex-1 glass-card p-6 flex flex-col">
              <h3 className="text-base font-medium text-text-primary leading-relaxed mb-4">
                【单选题】某Cache容量为16KB，块大小为16B，采用直接映射方式，Cache行数是多少？
              </h3>
              <div className="space-y-2">
                {[
                  { letter: 'A', text: '256行', correct: false },
                  { letter: 'B', text: '512行', correct: false },
                  { letter: 'C', text: '1024行', correct: true },
                  { letter: 'D', text: '2048行', correct: false },
                ].map((opt) => (
                  <button key={opt.letter} className={`w-full text-left p-3 rounded-xl border transition-all ${
                    opt.correct ? 'border-accent-green bg-accent-green/10' : 'border-white/10 hover:border-accent-cyan/30'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        opt.correct ? 'bg-accent-green text-bg-primary' : 'bg-bg-primary/50 text-text-secondary'
                      }`}>{opt.letter}</span>
                      <span className="text-text-primary text-sm pt-0.5">{opt.text}</span>
                      {opt.correct && <CheckCircle2 className="w-4 h-4 text-accent-green ml-auto flex-shrink-0" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-white/10">
                <div className="p-3 bg-accent-cyan/5 border border-accent-cyan/20 rounded-xl">
                  <p className="text-xs font-medium text-accent-cyan mb-1">📝 答案解析</p>
                  <p className="text-xs text-text-secondary leading-relaxed">Cache行数 = Cache容量 / 块大小 = 16KB / 16B = 1024行。</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 flex-shrink-0">
              <button className="flex items-center gap-1.5 px-3 py-1.5 btn-tech text-sm">
                <ChevronLeft className="w-4 h-4" />上一题
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 btn-primary text-sm">
                下一题<ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 结果界面 */}
      {interact.showResult && (
        <div className="flex-1 flex items-center justify-center animate-fade-in">
          <div className="glass-card p-8 max-w-lg w-full text-center">
            <div className="w-20 h-20 mx-auto mb-5 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan to-accent-purple rounded-full animate-pulse-glow" />
              <div className="absolute inset-2 bg-bg-primary rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-accent-cyan" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2 font-tech">答题完成！</h3>
            <p className="text-text-secondary mb-6 text-sm">表现不错，继续加油！</p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { val: '8/10', color: 'text-accent-cyan', label: '正确题数' },
                { val: '80%', color: 'text-accent-green', label: '正确率' },
                { val: '05:23', color: 'text-accent-purple', label: '用时' },
              ].map((s) => (
                <div key={s.label} className="p-3 bg-bg-primary/50 rounded-xl">
                  <p className={`text-2xl font-bold font-tech ${s.color}`}>{s.val}</p>
                  <p className="text-xs text-text-secondary mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 mb-6 text-left">
              <p className="text-sm font-medium text-text-primary">薄弱知识点：</p>
              <div className="flex flex-wrap gap-2">
                {['Cache映射计算', '浮点数对阶', '指令流水线冲突'].map(kp => (
                  <span key={kp} className="text-sm px-3 py-1 bg-accent-pink/10 text-accent-pink rounded-full">{kp}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 btn-tech text-sm">
                <RotateCcw className="w-4 h-4" />重新抽题
              </button>
              <button className="flex-1 px-5 py-2.5 btn-primary text-sm">查看解析</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 教师端内容 ====================

function TeacherContent({ interact }: { interact: TeacherInteract }) {
  const maxCount = Math.max(...highFreqQuestions.map(q => q.count));
  const trendConfig: Record<string, { Icon: typeof TrendingUp; color: string; label: string }> = {
    up: { Icon: TrendingUp, color: 'text-red-400', label: '上升' },
    down: { Icon: TrendingDown, color: 'text-accent-green', label: '下降' },
    stable: { Icon: Minus, color: 'text-text-secondary', label: '平稳' },
  };

  // 柱状图渐变用SVG模拟
  const barValues = radarChartData.values;
  const barLabels = radarChartData.indicators.map(i => i.name);
  const maxVal = 100;

  const suggestions = highFreqQuestions.filter(q => q.trend === 'up').slice(0, 3).map(q => {
    const pct = Math.round(q.count / 4);
    const actionMap: Record<string, string> = {
      '存储器': '增加Cache映射专项计算练习与动画演示',
      'CPU': '开展控制器与流水线冲突专题讲解',
      'IO系统': '结合实验强化DMA与中断对比理解',
    };
    return { pct, title: `${q.category}相关提问上升${pct}%`, desc: `"${q.question}"持续受关注，${actionMap[q.category] || '建议增加课堂练习时间'}` };
  });

  return (
    <div className="w-full h-full flex flex-col px-8 py-6 overflow-y-auto">
      <div className="mb-4 flex-shrink-0">
        <h2 className="text-2xl font-bold mb-1 font-tech">
          <span className="glow-text">教师端</span>{' '}
          <span className="glow-text-purple">学情分析仪表盘</span>
        </h2>
        <p className="text-text-secondary text-sm">班级学情概览、高频问题追踪与教学调整建议</p>
      </div>

      {/* 班级统计 */}
      {interact.showClassStats && (
        <div className="grid grid-cols-2 gap-4 mb-4 animate-fade-in flex-shrink-0">
          {classStats.map((cls, i) => {
            const activeRate = Math.round((cls.activeUsers / cls.totalStudents) * 100);
            return (
              <div key={i} className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent-cyan/10 flex items-center justify-center">
                      <School className="w-5 h-5 text-accent-cyan" />
                    </div>
                    <h3 className="text-base font-semibold text-text-primary font-tech">{cls.class}</h3>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-accent-purple/15 text-accent-purple rounded-full">班级概览</span>
                </div>
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5 text-sm">
                    <span className="text-text-secondary flex items-center gap-1.5 text-xs">
                      <Users className="w-3.5 h-3.5 text-accent-cyan" /> 活跃用户 / 总人数
                    </span>
                    <span className="text-text-primary font-tech text-sm">{cls.activeUsers} / {cls.totalStudents}</span>
                  </div>
                  <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
                    <div className="h-full progress-bar-glow" style={{ width: `${activeRate}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-bg-primary/40 rounded-lg">
                    <div className="flex items-center gap-1 text-text-secondary text-xs mb-0.5">
                      <Award className="w-3 h-3 text-accent-green" /> 平均分
                    </div>
                    <div className="text-xl font-bold text-text-primary font-tech">{cls.avgScore}<span className="text-xs text-text-secondary font-normal ml-0.5">分</span></div>
                  </div>
                  <div className="p-2.5 bg-bg-primary/40 rounded-lg">
                    <div className="flex items-center gap-1 text-text-secondary text-xs mb-0.5">
                      <Activity className="w-3 h-3 text-accent-pink" /> 完成率
                    </div>
                    <div className="text-xl font-bold text-text-primary font-tech">{cls.completionRate}<span className="text-xs text-text-secondary font-normal ml-0.5">%</span></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 flex-shrink-0">
        {/* 高频问题TOP10 */}
        {interact.showTop10 && (
          <div className="col-span-2 glass-card p-4 animate-fade-in">
            <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-accent-pink" />
              高频问题 TOP10 排行
            </h3>
            <div className="space-y-1">
              {highFreqQuestions.map((q, i) => {
                const { Icon, color, label } = trendConfig[q.trend];
                const widthPct = Math.round((q.count / maxCount) * 100);
                const catColor = categoryColors[q.category] || '#00d4ff';
                return (
                  <div key={i} className="group p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        i < 3 ? 'bg-accent-pink/20 text-accent-pink' : 'bg-bg-primary/60 text-text-secondary'
                      }`}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs text-text-primary truncate">{q.question}</span>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${catColor}1a`, color: catColor }}>{q.category}</span>
                            <span className={`flex items-center gap-0.5 text-xs ${color}`}>
                              <Icon className="w-3 h-3" />{label}
                            </span>
                            <span className="text-xs font-bold text-text-primary font-tech w-8 text-right">{q.count}</span>
                          </div>
                        </div>
                        <div className="h-1 bg-bg-primary rounded-full overflow-hidden">
                          <div className="h-full progress-bar-glow" style={{ width: `${widthPct}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 知识点掌握度柱状图 */}
        {interact.showBarChart && (
          <div className="glass-card p-4 animate-fade-in">
            <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2 text-sm">
              <BarChart3 className="w-4 h-4 text-accent-purple" />
              知识点掌握度分布
            </h3>
            <svg viewBox="0 0 280 200" className="w-full">
              {barValues.map((val, i) => {
                const barW = 30;
                const gap = 14;
                const x = 20 + i * (barW + gap);
                const barH = (val / maxVal) * 140;
                const y = 155 - barH;
                return (
                  <g key={i}>
                    <defs>
                      <linearGradient id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00d4ff" />
                        <stop offset="100%" stopColor="#7b2ff7" />
                      </linearGradient>
                    </defs>
                    <rect x={x} y={y} width={barW} height={barH} rx={4} fill={`url(#barGrad${i})`} opacity="0.9" />
                    <text x={x + barW / 2} y={y - 5} textAnchor="middle" fill="#e5e7eb" fontSize="9">{val}%</text>
                    <text x={x + barW / 2} y={172} textAnchor="middle" fill="#9ca3af" fontSize="8" transform={`rotate(15,${x + barW / 2},172)`}>{barLabels[i]}</text>
                  </g>
                );
              })}
              <line x1="15" y1="155" x2="265" y2="155" stroke="rgba(0,212,255,0.2)" strokeWidth="1" />
            </svg>
            <p className="text-xs text-text-secondary mt-1 text-center">班级平均掌握度（满分100%）</p>
          </div>
        )}
      </div>

      {/* 教学调整建议 */}
      {interact.showSuggestions && (
        <div className="mt-4 glass-card p-4 animate-fade-in flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-text-primary flex items-center gap-2 text-sm">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              教学调整建议
              <span className="text-xs text-text-secondary font-normal">（基于高频问题趋势自动生成）</span>
            </h3>
            <span className="text-xs px-2 py-0.5 bg-accent-cyan/10 text-accent-cyan rounded-full">智能分析</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {suggestions.map((s, i) => (
              <div key={i} className="p-3 rounded-xl border border-accent-pink/30 bg-accent-pink/5">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-sm font-semibold text-accent-pink">{s.title}</h4>
                  <TrendingUp className="w-3.5 h-3.5 text-accent-pink flex-shrink-0" />
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 应用成效 ====================

function ResultsContent() {
  const stats = [
    { label: '试点人数', value: '86人', sub: '2个班级' },
    { label: '日均活跃', value: '62人', sub: '72%活跃率' },
    { label: '累计问答', value: '1,347次', sub: '4周数据' },
    { label: '实验辅助', value: '213次', sub: '代码调试' },
  ];
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-12 py-8">
      <h2 className="text-3xl font-bold glow-text mb-8">应用成效</h2>
      <div className="grid grid-cols-4 gap-4 mb-8 w-full max-w-4xl">
        {stats.map((s, i) => (
          <div key={i} className="glass-card p-5 text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
            <div className="text-3xl font-tech font-bold text-accent-cyan glow-text mb-1">{s.value}</div>
            <div className="text-sm text-text-primary">{s.label}</div>
            <div className="text-xs text-text-secondary mt-1">{s.sub}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
        <div className="glass-card p-5">
          <div className="text-sm font-bold text-text-primary mb-3">随堂测验提升</div>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-text-secondary">布尔代数化简</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 bg-bg-primary rounded-full overflow-hidden"><div className="h-full bg-accent-cyan rounded-full" style={{ width: '80%' }} /></div>
                <span className="text-accent-cyan font-bold">+12.3%</span>
              </div>
            </div>
            <div>
              <span className="text-sm text-text-secondary">指令系统设计</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 bg-bg-primary rounded-full overflow-hidden"><div className="h-full bg-accent-purple rounded-full" style={{ width: '70%' }} /></div>
                <span className="text-accent-purple font-bold">+9.7%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="text-sm font-bold text-text-primary mb-3">学生满意度</div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between"><span className="text-sm text-text-secondary">显著提升学习体验</span><span className="text-accent-green font-bold">91.2%</span></div>
              <div className="h-2 bg-bg-primary rounded-full overflow-hidden mt-1"><div className="h-full bg-accent-green rounded-full" style={{ width: '91.2%' }} /></div>
            </div>
            <div>
              <div className="flex items-center justify-between"><span className="text-sm text-text-secondary">更愿主动探索难点</span><span className="text-accent-purple font-bold">86.7%</span></div>
              <div className="h-2 bg-bg-primary rounded-full overflow-hidden mt-1"><div className="h-full bg-accent-purple rounded-full" style={{ width: '86.7%' }} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== 总结 ====================

function OutroContent() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center px-12">
      <div className="animate-fade-in-up">
        <div className="text-5xl font-bold font-tech mb-4">
          <span className="glow-text">计组</span><span className="glow-text-purple">智学</span>
        </div>
        <div className="text-xl text-text-secondary mb-8">AI技术赋能专业基础课教学的创新实践</div>
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
        {[
          { icon: '🎓', title: '知识深度融合', desc: '教学日历绑定，确保教学一致性' },
          { icon: '🔄', title: '教-学-评-辅闭环', desc: '贯穿预习到复习全流程' },
          { icon: '🔒', title: '数据安全并重', desc: '本地化存储，不用于训练' },
          { icon: '🚀', title: '可推广架构', desc: '可迁移至数据结构、操作系统' },
        ].map((item, i) => (
          <div key={i} className="glass-card p-4 text-left">
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="font-bold text-text-primary mb-1">{item.title}</div>
            <div className="text-sm text-text-secondary">{item.desc}</div>
          </div>
        ))}
      </div>
      <div className="mt-10 text-text-secondary animate-fade-in-up" style={{ animationDelay: '1.8s' }}>
        <p className="text-lg">成都东软学院 · 网络空间安全专业</p>
        <p className="text-sm mt-2 text-accent-cyan">谢谢！试用平台，可以访问：</p>
        <p className="text-base mt-1 font-tech text-accent-cyan glow-text">http://159.138.92.82/qa</p>
      </div>
    </div>
  );
}

// ==================== 侧边栏 ====================

const sidebarNavItems = [
  { id: 'qa', label: '智能问答', icon: MessageSquare },
  { id: 'graph', label: '知识图谱', icon: Network },
  { id: 'path', label: '学习路径', icon: Route },
  { id: 'lab', label: '实验辅助', icon: Code2 },
  { id: 'quiz', label: '自测系统', icon: FileCheck },
];

const sidebarTeacherItems = [
  { id: 'teacher', label: '学情分析', icon: BarChart3 },
];

function Sidebar({ activeNav }: { activeNav: string }) {
  return (
    <div className="w-64 h-screen bg-bg-secondary/80 backdrop-blur-xl border-r border-accent-cyan/10 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-accent-cyan/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center shadow-glow-cyan animate-pulse-glow">
            <Bot className="w-6 h-6 text-bg-primary" />
          </div>
          <div>
            <h1 className="font-tech text-lg font-bold text-accent-cyan glow-text">计组智学</h1>
            <p className="text-xs text-text-secondary">AI学习助手</p>
          </div>
        </div>
      </div>

      {/* 导航 */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 space-y-1">
          {sidebarNavItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <div key={item.id} className={`sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                isActive ? 'active text-accent-cyan' : 'text-text-secondary hover:text-text-primary hover:bg-accent-cyan/5'
              }`}>
                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />}
              </div>
            );
          })}
        </div>

        {/* 分隔线 */}
        <div className="mx-4 my-4 border-t border-accent-cyan/10" />

        {/* 教师端 */}
        <div className="px-3 space-y-1 mb-4">
          <p className="px-4 text-xs text-text-secondary/60 uppercase tracking-wider mb-1">教师端</p>
          {sidebarTeacherItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <div key={item.id} className={`sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                isActive ? 'active text-accent-purple' : 'text-text-secondary hover:text-text-primary hover:bg-accent-purple/5'
              }`}>
                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-accent-purple animate-pulse" />}
              </div>
            );
          })}
        </div>

        {/* 学习状态卡片 */}
        <div className="px-4">
          <div className="glass-card p-4 chip-decoration">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-accent-cyan" />
              <span className="text-sm font-medium text-text-primary">今日学习</span>
            </div>
            <div className="text-2xl font-tech font-bold text-accent-cyan glow-text mb-1">
              75<span className="text-sm font-normal text-text-secondary ml-1">分钟</span>
            </div>
            <div className="w-full h-1.5 bg-bg-primary rounded-full overflow-hidden">
              <div className="h-full progress-bar-glow" style={{ width: '62%' }} />
            </div>
            <p className="text-xs text-text-secondary mt-2">目标：120分钟，已完成62%</p>
          </div>
        </div>
      </nav>

      {/* 底部用户信息 */}
      <div className="p-4 border-t border-accent-cyan/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white font-semibold text-sm">学</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">网安2025级学生</p>
            <p className="text-xs text-text-secondary">学号：2025XXXX</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-1">
          <Shield className="w-3 h-3 text-accent-green flex-shrink-0" />
          <p className="text-xs text-text-secondary/60">数据本地存储，不用于训练</p>
        </div>
      </div>
    </div>
  );
}

// ==================== 主页面 ====================

export default function DemoPage() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sceneElapsed, setSceneElapsed] = useState(0);

  const [interactState, setInteractState] = useState<InteractState>(defaultInteract());

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speechEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextSceneRef = useRef<() => void>(() => {});

  const scene = scenes[currentScene];
  // 估算实际总时长：每字符280ms + 每场景3秒间隔
  const estimateSceneSeconds = (text: string) => Math.ceil(text.length * 0.28) + 3;
  const totalDuration = scenes.reduce((s, sc) => s + estimateSceneSeconds(sc.narration), 0);

  const stopSpeak = useCallback(() => {
    window.speechSynthesis.cancel();
    if (speechEndTimerRef.current) { clearTimeout(speechEndTimerRef.current); speechEndTimerRef.current = null; }
    if (fallbackTimerRef.current) { clearTimeout(fallbackTimerRef.current); fallbackTimerRef.current = null; }
  }, []);

  const nextScene = useCallback(() => {
    stopSpeak();
    setInteractState(defaultInteract());
    if (currentScene < scenes.length - 1) {
      setCurrentScene(prev => prev + 1);
      setSceneElapsed(0);
    } else {
      setIsPlaying(false);
      stopSpeak();
    }
  }, [currentScene, stopSpeak]);

  nextSceneRef.current = nextScene;

  // 语音：结束后等4秒再切换场景
  const speak = useCallback((text: string) => {
    window.speechSynthesis.cancel();
    if (speechEndTimerRef.current) { clearTimeout(speechEndTimerRef.current); speechEndTimerRef.current = null; }
    if (fallbackTimerRef.current) { clearTimeout(fallbackTimerRef.current); fallbackTimerRef.current = null; }

    if (isMuted) {
      // 静音模式：按字符数估算时长，结束后等4秒切换
      const estimatedMs = Math.max(3000, text.length * 280);
      speechEndTimerRef.current = setTimeout(() => nextSceneRef.current(), estimatedMs + 3000);
      return;
    }

    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.rate = 0.95;
    u.pitch = 1.15;
    u.volume = 0.95;
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(v => v.lang.startsWith('zh') && (v.name.includes('Xiaoxiao') || v.name.includes('Xiaoyi') || v.name.includes('Yaoyao'))) ||
                    voices.find(v => v.lang.startsWith('zh')) ||
                    voices[0];
    if (zhVoice) u.voice = zhVoice;

    u.onend = () => {
      // 语音播报结束，等待3秒后切换到下一场景
      speechEndTimerRef.current = setTimeout(() => {
        nextSceneRef.current();
      }, 3000);
    };

    // 兜底：如果onend未触发（语音引擎异常），按估算时长+15秒后强制切换
    const estimatedMs = Math.max(5000, text.length * 280);
    fallbackTimerRef.current = setTimeout(() => {
      nextSceneRef.current();
    }, estimatedMs + 15000);

    window.speechSynthesis.speak(u);
  }, [isMuted]);

  const restart = useCallback(() => {
    stopSpeak();
    setCurrentScene(0);
    setSceneElapsed(0);
    setElapsed(0);
    setInteractState(defaultInteract());
    setIsPlaying(true);
  }, [stopSpeak]);

  // 计时器（仅用于显示进度，不控制场景切换）
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setSceneElapsed(prev => prev + 1);
      setElapsed(prev => prev + 1);
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, currentScene]);

  // 兜底超时（仅在语音引擎完全失效时触发）
  useEffect(() => {
    if (sceneElapsed >= scene.duration && isPlaying) {
      nextScene();
    }
  }, [sceneElapsed, scene.duration, isPlaying, nextScene]);

  // 语音播放：场景切换时触发
  useEffect(() => {
    if (isPlaying) {
      const t = setTimeout(() => speak(scene.narration), 200);
      return () => clearTimeout(t);
    } else {
      stopSpeak();
    }
  }, [currentScene, isPlaying, speak, scene.narration, stopSpeak]);

  // 交互状态推进
  useEffect(() => {
    if (!isPlaying) return;

    const t = (fn: () => void, ms: number) => setTimeout(fn, ms);
    const timers: ReturnType<typeof setTimeout>[] = [];

    switch (scene.id) {
      case 'qa-1':
        timers.push(t(() => setInteractState(s => ({ ...s, qa: { ...s.qa, typing: true } })), 500));
        timers.push(t(() => setInteractState(s => ({ ...s, qa: { ...s.qa, typing: false, showAnswer: true } })), 3500));
        break;
      case 'qa-2':
        timers.push(t(() => setInteractState(s => ({ ...s, qa: { ...s.qa, typing: false, showAnswer: true, showCalendar: false } })), 0));
        timers.push(t(() => setInteractState(s => ({ ...s, qa: { ...s.qa, showCalendar: true } })), 1500));
        timers.push(t(() => setInteractState(s => ({ ...s, qa: { ...s.qa, showMicroCourses: true } })), 4500));
        timers.push(t(() => setInteractState(s => ({ ...s, qa: { ...s.qa, showTopics: true } })), 8000));
        timers.push(t(() => setInteractState(s => ({ ...s, qa: { ...s.qa, showReviewBadge: true } })), 12000));
        break;
      case 'graph-1':
        timers.push(t(() => setInteractState(s => ({ ...s, graph: { ...s.graph, highlightNode: true } })), 1500));
        break;
      case 'graph-2':
        timers.push(t(() => setInteractState(s => ({ ...s, graph: { ...s.graph, highlightNode: true, showDetail: true } })), 500));
        timers.push(t(() => setInteractState(s => ({ ...s, graph: { ...s.graph, highlightNode: true, showDetail: true, showCrossModule: true } })), 4000));
        timers.push(t(() => setInteractState(s => ({ ...s, graph: { ...s.graph, highlightNode: true, showDetail: true, showCrossModule: true, showLearningPath: true } })), 8000));
        break;
      case 'path-1':
        timers.push(t(() => setInteractState(s => ({ ...s, path: { ...s.path, showStats: true } })), 300));
        timers.push(t(() => setInteractState(s => ({ ...s, path: { ...s.path, showStats: true, showRadar: true } })), 2500));
        timers.push(t(() => setInteractState(s => ({ ...s, path: { ...s.path, showStats: true, showRadar: true, showChapterProgress: true } })), 5000));
        break;
      case 'path-2':
        timers.push(t(() => setInteractState(s => ({ ...s, path: { ...s.path, showStats: true, showRadar: true, showChapterProgress: true, showWeeklyPlan: true } })), 300));
        timers.push(t(() => setInteractState(s => ({ ...s, path: { ...s.path, showStats: true, showRadar: true, showChapterProgress: true, showWeeklyPlan: true, showTasks: true } })), 3500));
        timers.push(t(() => setInteractState(s => ({ ...s, path: { ...s.path, showStats: true, showRadar: true, showChapterProgress: true, showWeeklyPlan: true, showTasks: true, showRecommendations: true } })), 7000));
        timers.push(t(() => setInteractState(s => ({ ...s, path: { ...s.path, showStats: true, showRadar: true, showChapterProgress: true, showWeeklyPlan: true, showTasks: true, showRecommendations: true, showReport: true } })), 12000));
        break;
      case 'lab-1':
        timers.push(t(() => setInteractState(s => ({ ...s, lab: { ...s.lab, showCode: true } })), 300));
        timers.push(t(() => setInteractState(s => ({ ...s, lab: { ...s.lab, showCode: true, showUpload: true } })), 5000));
        break;
      case 'lab-2':
        timers.push(t(() => setInteractState(s => ({ ...s, lab: { ...s.lab, showCode: true, showUpload: true, showDebugResult: true } })), 500));
        timers.push(t(() => setInteractState(s => ({ ...s, lab: { ...s.lab, showCode: true, showUpload: true, showDebugResult: true, showDiff: true } })), 6000));
        timers.push(t(() => setInteractState(s => ({ ...s, lab: { ...s.lab, showCode: true, showUpload: true, showDebugResult: true, showDiff: true, showScore: true } })), 12000));
        break;
      case 'quiz-1':
        timers.push(t(() => setInteractState(s => ({ ...s, quiz: { ...s.quiz, showConfig: true } })), 300));
        break;
      case 'quiz-2':
        timers.push(t(() => setInteractState(s => ({ ...s, quiz: { ...s.quiz, showConfig: true, showQuestion: true } })), 300));
        timers.push(t(() => setInteractState(s => ({ ...s, quiz: { ...s.quiz, showConfig: false, showQuestion: false, showResult: true } })), 12000));
        break;
      case 'teacher-1':
        timers.push(t(() => setInteractState(s => ({ ...s, teacher: { ...s.teacher, showClassStats: true } })), 300));
        timers.push(t(() => setInteractState(s => ({ ...s, teacher: { ...s.teacher, showClassStats: true, showTop10: true } })), 3000));
        break;
      case 'teacher-2':
        timers.push(t(() => setInteractState(s => ({ ...s, teacher: { ...s.teacher, showClassStats: true, showTop10: true, showBarChart: true } })), 300));
        timers.push(t(() => setInteractState(s => ({ ...s, teacher: { ...s.teacher, showClassStats: true, showTop10: true, showBarChart: true, showSuggestions: true } })), 5000));
        break;
    }

    return () => timers.forEach(t => clearTimeout(t));
  }, [currentScene, isPlaying, scene.id]);

  // 加载语音列表
  useEffect(() => {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
    // 组件卸载时清理所有计时器和语音
    return () => {
      window.speechSynthesis.cancel();
      if (speechEndTimerRef.current) clearTimeout(speechEndTimerRef.current);
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const renderContent = () => {
    const sid = scene.id;
    if (sid === 'intro') return <IntroContent />;
    if (sid === 'architecture') return <ArchitectureContent />;
    if (sid.startsWith('qa')) return <QAContent interact={interactState.qa} />;
    if (sid.startsWith('graph')) return <GraphContent interact={interactState.graph} />;
    if (sid.startsWith('path')) return <PathContent interact={interactState.path} />;
    if (sid.startsWith('lab')) return <LabContent interact={interactState.lab} />;
    if (sid.startsWith('quiz')) return <QuizContent interact={interactState.quiz} />;
    if (sid.startsWith('teacher')) return <TeacherContent interact={interactState.teacher} />;
    if (sid === 'results') return <ResultsContent />;
    if (sid === 'outro') return <OutroContent />;
    return <IntroContent />;
  };

  const getNavTarget = () => {
    const sid = scene.id;
    if (sid.startsWith('qa')) return 'qa';
    if (sid.startsWith('graph')) return 'graph';
    if (sid.startsWith('path')) return 'path';
    if (sid.startsWith('lab')) return 'lab';
    if (sid.startsWith('quiz')) return 'quiz';
    if (sid.startsWith('teacher')) return 'teacher';
    return scene.navTarget;
  };

  return (
    <div className="fixed inset-0 bg-bg-primary z-50 flex">
      <Sidebar activeNav={getNavTarget()} />

      <div className="flex-1 overflow-hidden relative">
        <div key={currentScene} className="w-full h-full animate-fade-in">
          {renderContent()}
        </div>
        {isPlaying && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 max-w-3xl w-full px-4">
            <div className="glass-card px-6 py-3 text-center animate-fade-in-up">
              <p className="text-sm text-text-primary leading-relaxed">{scene.narration}</p>
            </div>
          </div>
        )}
      </div>

      {/* 底部控制条 */}
      <div className="absolute bottom-0 left-64 right-0 h-14 bg-bg-secondary/90 backdrop-blur border-t border-accent-cyan/10 flex items-center px-6 gap-4">
        <div className="w-48 text-sm text-text-secondary truncate">
          {currentScene + 1}/{scenes.length} · {scene.title}
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <div className="relative h-1.5 bg-bg-primary rounded-full cursor-pointer">
            <div className="absolute h-full progress-bar-glow rounded-full transition-all duration-1000" style={{ width: `${(elapsed / totalDuration) * 100}%` }} />
          </div>
          <div className="flex justify-between text-xs text-text-secondary">
            <span>{formatTime(elapsed)}</span>
            <span>{formatTime(totalDuration)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={restart} className="p-2 text-text-secondary hover:text-accent-cyan transition-colors" title="重新开始">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 bg-accent-cyan/10 hover:bg-accent-cyan/20 rounded-full text-accent-cyan transition-colors">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button onClick={nextScene} className="p-2 text-text-secondary hover:text-accent-cyan transition-colors" title="下一场景">
            <SkipForward className="w-4 h-4" />
          </button>
          <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-text-secondary hover:text-accent-cyan transition-colors">
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button onClick={() => document.documentElement.requestFullscreen?.()} className="p-2 text-text-secondary hover:text-accent-cyan transition-colors">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 开场封面 */}
      {!isPlaying && currentScene === 0 && sceneElapsed === 0 && (
        <div className="absolute inset-0 bg-bg-primary/95 flex flex-col items-center justify-center z-50">
          <div className="text-6xl font-bold font-tech mb-4">
            <span className="glow-text">计组</span><span className="glow-text-purple">智学</span>
          </div>
          <div className="text-xl text-text-secondary mb-8">教育智能体 · 演示视频</div>
          <button onClick={() => { setIsPlaying(true); setSceneElapsed(0); setElapsed(0); }} className="btn-primary px-8 py-4 text-lg flex items-center gap-3">
            <Play className="w-6 h-6" /> 开始演示
          </button>
          <p className="text-sm text-text-secondary mt-6">演示时长约 {Math.round(totalDuration / 60)} 分钟，带AI语音旁白和字幕</p>
        </div>
      )}
    </div>
  );
}
