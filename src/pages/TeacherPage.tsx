import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Lightbulb,
  BarChart3,
  School,
  Award,
  Activity,
} from 'lucide-react';
import {
  highFreqQuestions,
  classStats,
  categoryColors,
  radarChartData,
} from '@/data/mockData';

type TrendKey = 'up' | 'down' | 'stable';

const trendConfig: Record<TrendKey, { Icon: typeof TrendingUp; color: string; label: string }> = {
  up: { Icon: TrendingUp, color: 'text-red-400', label: '上升' },
  down: { Icon: TrendingDown, color: 'text-accent-green', label: '下降' },
  stable: { Icon: Minus, color: 'text-text-secondary', label: '平稳' },
};

const actionMap: Record<string, string> = {
  存储器: '增加Cache映射专项计算练习与动画演示',
  数据表示: '补充IEEE 754转换与浮点运算微课资源',
  CPU: '开展控制器与流水线冲突专题讲解',
  指令系统: '梳理寻址方式对比表与典型例题',
  IO系统: '结合实验强化DMA与中断对比理解',
};

export default function TeacherPage() {
  const maxCount = Math.max(...highFreqQuestions.map((q) => q.count));

  // 知识点掌握度柱状图配置（青蓝→紫色渐变，暗色主题）
  const barOption = useMemo(
    () => ({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(17,24,39,0.95)',
        borderColor: 'rgba(0,212,255,0.3)',
        textStyle: { color: '#e5e7eb' },
        formatter: '{b}: {c}%',
      },
      grid: { left: '3%', right: '5%', bottom: '3%', top: '14%', containLabel: true },
      xAxis: {
        type: 'category',
        data: radarChartData.indicators.map((i) => i.name),
        axisLabel: { color: '#9ca3af', fontSize: 11, rotate: 18 },
        axisLine: { lineStyle: { color: 'rgba(0,212,255,0.2)' } },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: { color: '#9ca3af', fontSize: 11, formatter: '{value}%' },
        splitLine: { lineStyle: { color: 'rgba(0,212,255,0.08)' } },
        axisLine: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: radarChartData.values,
          barWidth: '46%',
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#00d4ff' },
                { offset: 1, color: '#7b2ff7' },
              ],
            },
            shadowColor: 'rgba(0,212,255,0.4)',
            shadowBlur: 10,
          },
          label: {
            show: true,
            position: 'top',
            color: '#e5e7eb',
            fontSize: 11,
            formatter: '{c}%',
          },
        },
      ],
    }),
    [],
  );

  // 根据高频问题趋势自动生成教学建议
  const suggestions = useMemo(() => {
    const upItems = highFreqQuestions.filter((q) => q.trend === 'up').slice(0, 3);
    return upItems.map((q) => {
      const pct = Math.round(q.count / 4);
      return {
        pct,
        title: `${q.category}相关提问上升${pct}%`,
        desc: `"${q.question}"持续受关注，${actionMap[q.category] || '建议增加课堂练习时间'}`,
      };
    });
  }, []);

  return (
    <div className="animate-fade-in-up opacity-0">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 font-tech">
            <span className="glow-text">教师端</span>{' '}
            <span className="glow-text-purple">学情分析仪表盘</span>
          </h2>
          <p className="text-text-secondary">班级学情概览、高频问题追踪与教学调整建议</p>
        </div>
        <button className="px-4 py-2 btn-tech text-sm">导出学情报告</button>
      </div>

      {/* 班级统计概览卡片 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {classStats.map((cls, i) => {
          const activeRate = Math.round((cls.activeUsers / cls.totalStudents) * 100);
          return (
            <div
              key={i}
              className="glass-card p-6 animate-fade-in-up opacity-0"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-cyan/10 flex items-center justify-center">
                    <School className="w-5 h-5 text-accent-cyan" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary font-tech">
                    {cls.class}
                  </h3>
                </div>
                <span className="text-xs px-2 py-1 bg-accent-purple/15 text-accent-purple rounded-full">
                  班级概览
                </span>
              </div>

              {/* 活跃用户 / 总人数 进度条 */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-text-secondary flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-accent-cyan" /> 活跃用户 / 总人数
                  </span>
                  <span className="text-text-primary font-tech">
                    {cls.activeUsers} / {cls.totalStudents}
                  </span>
                </div>
                <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
                  <div
                    className="h-full progress-bar-glow transition-all duration-1000"
                    style={{ width: `${activeRate}%` }}
                  />
                </div>
              </div>

              {/* 平均分 + 完成率 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-bg-primary/40 rounded-lg">
                  <div className="flex items-center gap-1.5 text-text-secondary text-xs mb-1">
                    <Award className="w-3.5 h-3.5 text-accent-green" /> 平均分
                  </div>
                  <div className="text-2xl font-bold text-text-primary font-tech">
                    {cls.avgScore}
                    <span className="text-sm text-text-secondary font-normal ml-1">分</span>
                  </div>
                </div>
                <div className="p-3 bg-bg-primary/40 rounded-lg">
                  <div className="flex items-center gap-1.5 text-text-secondary text-xs mb-1">
                    <Activity className="w-3.5 h-3.5 text-accent-pink" /> 完成率
                  </div>
                  <div className="text-2xl font-bold text-text-primary font-tech">
                    {cls.completionRate}
                    <span className="text-sm text-text-secondary font-normal ml-1">%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 高频问题 TOP10 + 知识点掌握度柱状图 */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* 高频问题 TOP10 */}
        <div className="col-span-2 glass-card p-6">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-accent-pink" />
            高频问题 TOP10 排行
          </h3>
          <div className="space-y-1.5">
            {highFreqQuestions.map((q, i) => {
              const { Icon, color, label } = trendConfig[q.trend];
              const widthPct = Math.round((q.count / maxCount) * 100);
              const catColor = categoryColors[q.category] || '#00d4ff';
              return (
                <div
                  key={i}
                  className="group p-2.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        i < 3
                          ? 'bg-accent-pink/20 text-accent-pink'
                          : 'bg-bg-primary/60 text-text-secondary'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-sm text-text-primary truncate">{q.question}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${catColor}1a`, color: catColor }}
                          >
                            {q.category}
                          </span>
                          <span className={`flex items-center gap-0.5 text-xs ${color}`}>
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                          </span>
                          <span className="text-sm font-bold text-text-primary font-tech w-10 text-right">
                            {q.count}
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-bg-primary rounded-full overflow-hidden">
                        <div
                          className="h-full progress-bar-glow transition-all duration-1000"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 知识点掌握度分布柱状图 */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent-purple" />
            知识点掌握度分布
          </h3>
          <ReactECharts
            option={barOption}
            style={{ height: '340px' }}
            opts={{ renderer: 'svg' }}
          />
          <p className="text-xs text-text-secondary mt-2 text-center">
            班级平均掌握度（满分100%）
          </p>
        </div>
      </div>

      {/* 教学调整建议 */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text-primary flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            教学调整建议
            <span className="text-xs text-text-secondary font-normal">
              （基于高频问题趋势自动生成）
            </span>
          </h3>
          <span className="chip-decoration relative inline-block text-xs px-3 py-1 bg-accent-cyan/10 text-accent-cyan rounded-full">
            智能分析
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {suggestions.map((s, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-accent-pink/30 bg-accent-pink/5 animate-fade-in-up opacity-0"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-accent-pink">{s.title}</h4>
                <TrendingUp className="w-4 h-4 text-accent-pink flex-shrink-0" />
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
