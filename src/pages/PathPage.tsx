import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  TrendingUp, Target, BookOpen, AlertTriangle, Award, Clock, ChevronRight,
  CheckCircle2, Circle, FileText, Calendar, ClipboardList, BookMarked,
  FlaskConical, RotateCw, GraduationCap,
} from 'lucide-react';
import {
  userProgress, radarChartData,
  pendingTasks as mockTasks, learningReport, teachingCalendar,
} from '@/data/mockData';
import { useStore } from '@/store/useStore';

// 任务类型样式映射
const taskTypeConfig: Record<
  'pre-study' | 'exercise' | 'experiment' | 'review',
  { icon: typeof BookOpen; label: string; color: string; bg: string; ring: string }
> = {
  'pre-study': { icon: BookOpen, label: '预习', color: 'text-accent-cyan', bg: 'bg-accent-cyan/10', ring: 'border-accent-cyan/30' },
  exercise: { icon: ClipboardList, label: '练习', color: 'text-accent-green', bg: 'bg-accent-green/10', ring: 'border-accent-green/30' },
  experiment: { icon: FlaskConical, label: '实验', color: 'text-accent-purple', bg: 'bg-accent-purple/10', ring: 'border-accent-purple/30' },
  review: { icon: RotateCw, label: '复习', color: 'text-accent-pink', bg: 'bg-accent-pink/10', ring: 'border-accent-pink/30' },
};

const CURRENT_WEEK = 14;

export default function PathPage() {
  const { pendingTasks: taskStates, toggleTask, reportGenerated, setReportGenerated } = useStore();

  // 本周教学日历任务勾选状态（store 未追踪，使用本地状态）
  const [weekTaskDone, setWeekTaskDone] = useState<Record<string, boolean>>({});
  const toggleWeekTask = (key: string) =>
    setWeekTaskDone((prev) => ({ ...prev, [key]: !prev[key] }));

  // 合并 mock 详情与 store 完成状态
  const mergedTasks = mockTasks.map((t) => {
    const state = taskStates.find((s) => s.id === t.id);
    return { ...t, completed: state?.completed ?? t.completed };
  });
  const completedTaskCount = mergedTasks.filter((t) => t.completed).length;

  const currentCalendar = teachingCalendar.find((c) => c.week === CURRENT_WEEK);

  // 衍生统计：活跃天数（按总学习时长估算）、累计问答次数、实验调试次数
  const activeDays = Math.round(userProgress.totalStudyTime / 180);
  const debugCount = 213;

  const radarOption = {
    backgroundColor: 'transparent',
    radar: {
      indicator: radarChartData.indicators,
      shape: 'polygon',
      splitNumber: 4,
      axisName: { color: '#9ca3af', fontSize: 12 },
      splitLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.1)' } },
      splitArea: {
        show: true,
        areaStyle: { color: ['rgba(0, 212, 255, 0.02)', 'rgba(0, 212, 255, 0.05)'] },
      },
      axisLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.2)' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: radarChartData.values,
            name: '掌握度',
            itemStyle: { color: '#00d4ff' },
            areaStyle: { color: 'rgba(0, 212, 255, 0.2)' },
            lineStyle: { color: '#00d4ff', width: 2, shadowColor: 'rgba(0, 212, 255, 0.5)', shadowBlur: 10 },
          },
        ],
      },
    ],
  };

  const stats = [
    { icon: Clock, label: '总学习时长', value: `${Math.floor(userProgress.totalStudyTime / 60)}h`, sub: '小时', color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
    { icon: Target, label: '总体进度', value: `${userProgress.overallProgress}%`, sub: '已完成', color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
    { icon: BookOpen, label: '已答题数', value: `${userProgress.questionsAnswered}`, sub: '道题', color: 'text-accent-green', bg: 'bg-accent-green/10' },
    { icon: Award, label: '正确率', value: '78%', sub: '平均', color: 'text-accent-pink', bg: 'bg-accent-pink/10' },
    { icon: Calendar, label: '活跃天数', value: `${activeDays}`, sub: '天', color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
    { icon: FileText, label: '累计问答', value: `${userProgress.questionsAnswered}`, sub: '次', color: 'text-accent-green', bg: 'bg-accent-green/10' },
    { icon: FlaskConical, label: '实验调试', value: `${debugCount}`, sub: '次', color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
  ];

  const recommendations = [
    {
      title: '薄弱点专项突破',
      desc: '针对浮点数运算、Cache映射等薄弱点',
      type: '重点推荐',
      items: ['浮点数加减运算', 'Cache组相联映射', '微程序控制器'],
      borderColor: 'border-accent-pink/30',
      iconColor: 'text-accent-pink',
      bgColor: 'bg-accent-pink/10',
    },
    {
      title: '拓展阅读材料',
      desc: '学有余力？看看这些拓展内容',
      type: '拓展提升',
      items: ['RISC-V指令集架构', '量子计算基础', '神经形态计算'],
      borderColor: 'border-accent-purple/30',
      iconColor: 'text-accent-purple',
      bgColor: 'bg-accent-purple/10',
    },
    {
      title: '实验预习建议',
      desc: '下一次实验：简单CPU设计',
      type: '实验预告',
      items: ['数据通路设计', '控制单元设计', '指令译码实现'],
      borderColor: 'border-accent-cyan/30',
      iconColor: 'text-accent-cyan',
      bgColor: 'bg-accent-cyan/10',
    },
  ];

  return (
    <div className="animate-fade-in-up opacity-0">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2 font-tech">
          <span className="glow-text">学习路径</span>
        </h2>
        <p className="text-text-secondary">个性化学习建议与进度追踪，查漏补缺高效学习</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="glass-card p-5 animate-fade-in-up opacity-0"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold font-tech text-text-primary mb-1">
              {stat.value} <span className="text-sm font-normal text-text-secondary">{stat.sub}</span>
            </div>
            <p className="text-sm text-text-secondary">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 掌握度雷达图 */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent-cyan" />
            知识点掌握度
          </h3>
          <ReactECharts option={radarOption} style={{ height: '280px' }} opts={{ renderer: 'svg' }} />
        </div>

        {/* 章节进度 */}
        <div className="col-span-2 glass-card p-6">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent-purple" />
            各章节学习进度
          </h3>
          <div className="space-y-4">
            {userProgress.chapters.map((chapter, i) => (
              <div key={i} className="group p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">{chapter.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-secondary">
                      掌握度 <span className="text-accent-cyan font-semibold">{chapter.mastery}%</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-accent-cyan transition-colors" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-bg-primary rounded-full overflow-hidden">
                    <div className="h-full progress-bar-glow transition-all duration-1000" style={{ width: `${chapter.progress}%` }} />
                  </div>
                  <span className="text-xs text-text-secondary w-12 text-right">{chapter.progress}%</span>
                </div>
                {chapter.weakPoints.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-accent-pink flex-shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {chapter.weakPoints.map((wp, j) => (
                        <span key={j} className="text-xs px-2 py-0.5 bg-accent-pink/10 text-accent-pink rounded-full">{wp}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 本周学习计划（课前/课后闭环） */}
      {currentCalendar && (
        <div className="mt-6 glass-card p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-text-primary flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent-purple" />
              本周学习计划
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent-purple/10 text-accent-purple">
              第 {CURRENT_WEEK} 周
            </span>
          </div>
          <p className="text-sm text-text-secondary mb-1">
            {currentCalendar.topic} · {currentCalendar.chapter}
          </p>
          <p className="text-xs text-text-secondary mb-4">{currentCalendar.content}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 课前预习 */}
            <div className="p-4 rounded-xl border border-accent-cyan/30 bg-accent-cyan/5">
              <h4 className="flex items-center gap-2 font-medium text-accent-cyan mb-3">
                <BookMarked className="w-4 h-4" /> 课前预习任务
              </h4>
              <div className="space-y-2">
                {currentCalendar.preClassTasks.map((t, i) => {
                  const key = `pre-${i}`;
                  const done = !!weekTaskDone[key];
                  return (
                    <button key={i} onClick={() => toggleWeekTask(key)} className="flex items-start gap-2 w-full text-left group">
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-accent-green flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-text-secondary group-hover:text-accent-cyan flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm text-text-primary ${done ? 'line-through opacity-60' : ''}`}>{t}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* 课后巩固 */}
            <div className="p-4 rounded-xl border border-accent-green/30 bg-accent-green/5">
              <h4 className="flex items-center gap-2 font-medium text-accent-green mb-3">
                <CheckCircle2 className="w-4 h-4" /> 课后巩固任务
              </h4>
              <div className="space-y-2">
                {currentCalendar.postClassTasks.map((t, i) => {
                  const key = `post-${i}`;
                  const done = !!weekTaskDone[key];
                  return (
                    <button key={i} onClick={() => toggleWeekTask(key)} className="flex items-start gap-2 w-full text-left group">
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-accent-green flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-text-secondary group-hover:text-accent-green flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm text-text-primary ${done ? 'line-through opacity-60' : ''}`}>{t}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 待完成任务列表 */}
      <div className="mt-6 glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text-primary flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-accent-cyan" />
            待完成任务
          </h3>
          <span className="text-xs text-text-secondary">
            已完成 <span className="text-accent-green font-semibold">{completedTaskCount}</span> / {mergedTasks.length}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mergedTasks.map((task, i) => {
            const cfg = taskTypeConfig[task.type];
            const Icon = cfg.icon;
            return (
              <div
                key={task.id}
                className={`p-4 rounded-lg border ${cfg.ring} bg-gradient-to-br from-bg-primary/30 to-transparent transition-all hover:shadow-glow-cyan animate-fade-in-up opacity-0 ${task.completed ? 'opacity-50' : ''}`}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="flex items-start gap-3">
                  <button onClick={() => toggleTask(task.id)} className="mt-0.5 flex-shrink-0" aria-label="切换任务完成状态">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-accent-green" />
                    ) : (
                      <Circle className="w-5 h-5 text-text-secondary hover:text-accent-cyan transition-colors" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1.5">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </span>
                      <span className="text-xs text-text-secondary">{task.chapter}</span>
                      <span className="text-xs text-text-secondary flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {task.deadline}
                      </span>
                    </div>
                    <h4 className={`font-medium text-text-primary ${task.completed ? 'line-through text-text-secondary' : ''}`}>
                      {task.title}
                    </h4>
                    <p className="text-sm text-text-secondary mt-1">{task.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 个性化推荐 */}
      <div className="mt-6 glass-card p-6">
        <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-accent-green" />
          个性化学习推荐
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((card, i) => (
            <div
              key={i}
              className={`p-5 rounded-xl border bg-gradient-to-br from-bg-primary/50 to-transparent transition-all hover:shadow-glow-cyan hover:-translate-y-1 ${card.borderColor}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-text-primary">{card.title}</h4>
                <span className={`text-xs px-2 py-0.5 ${card.bgColor} ${card.iconColor} rounded-full`}>{card.type}</span>
              </div>
              <p className="text-sm text-text-secondary mb-4">{card.desc}</p>
              <ul className="space-y-2">
                {card.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-text-primary/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 学习报告生成 */}
      <div className="mt-6 glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text-primary flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent-cyan" />
            学习报告
          </h3>
          <button
            onClick={() => setReportGenerated(true)}
            className="btn-tech btn-primary inline-flex items-center gap-2 text-sm"
          >
            <GraduationCap className="w-4 h-4" />
            {reportGenerated ? '重新生成报告' : '生成学习报告'}
          </button>
        </div>

        {reportGenerated ? (
          <div className="space-y-3">
            {learningReport.map((item, i) => (
              <div
                key={i}
                className="animate-fade-in-up opacity-0 p-4 rounded-lg bg-bg-primary/30 border border-white/5 hover:border-accent-cyan/20 transition-colors"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4 text-accent-cyan flex-shrink-0" />
                  <h4 className="font-semibold text-text-primary">{item.section}</h4>
                </div>
                <p className="text-sm text-text-secondary mb-3">{item.content}</p>

                {item.score !== undefined && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary">评分</span>
                      <span className="text-accent-cyan font-semibold">{item.score} / 100</span>
                    </div>
                    <div className="h-1.5 bg-bg-primary rounded-full overflow-hidden">
                      <div
                        className="h-full progress-bar-glow transition-all duration-1000"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                )}

                {item.suggestion && (
                  <div className="flex items-start gap-2 p-2 rounded bg-accent-pink/10 text-accent-pink text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>{item.suggestion}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-text-secondary">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">点击「生成学习报告」查看个性化学习分析报告</p>
          </div>
        )}
      </div>
    </div>
  );
}
