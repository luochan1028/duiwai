import { useState } from 'react';
import {
  Flag, Star, Award, BookOpen, Users, Heart, Zap,
  ChevronRight, Target, Lightbulb, GraduationCap, Shield,
} from 'lucide-react';

interface RedEducationItem {
  id: string;
  title: string;
  category: string;
  icon: typeof Flag;
  color: string;
  bgColor: string;
  borderColor: string;
  content: string;
  keywords: string[];
}

const redEducationItems: RedEducationItem[] = [
  {
    id: 'red-1',
    title: '红色课程思政',
    category: '课程育人',
    icon: BookOpen,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    content: '将红色育人元素深度融入计算机组成原理课程教学。通过讲述我国计算机发展史中的科学家精神，如"银河一号"超级计算机的研制历程，激发学生科技报国情怀。在指令系统设计中引入国产龙芯CPU案例分析，培养民族自豪感与工程伦理意识。',
    keywords: ['科学家精神', '银河一号', '龙芯CPU', '工程伦理'],
  },
  {
    id: 'red-2',
    title: '红色文化传承',
    category: '文化育人',
    icon: Flag,
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    content: '依托成都东软学院所在地四川的红色资源（邓小平故里、川陕革命根据地），开展红色文化主题实践活动。组织学生参观红色教育基地，撰写技术发展与社会进步主题报告，将红色基因传承与专业学习有机结合。',
    keywords: ['邓小平故里', '川陕革命', '红色基因', '主题实践'],
  },
  {
    id: 'red-3',
    title: '红色科技报国',
    category: '实践育人',
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    content: '引导学生关注国家"卡脖子"技术攻关领域。在实验辅助模块中设置国产芯片相关实验项目，如基于龙芯指令集的汇编编程实践。鼓励学生参加"挑战杯"、"互联网+"等创新创业大赛，以技术服务国家战略需求。',
    keywords: ['卡脖子技术', '龙芯指令集', '挑战杯', '创新创业'],
  },
  {
    id: 'red-4',
    title: '红色育人评价',
    category: '管理育人',
    icon: Award,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    content: '建立红色育人成效评价体系。在教师端学情分析中增设"思政元素覆盖度"指标，统计课程中融入的红色育人案例数量。学生端学习报告增加"价值观培养"维度，关注学生在科技报国、工匠精神、团队协作等方面的成长。',
    keywords: ['思政覆盖度', '价值观培养', '工匠精神', '成效评价'],
  },
  {
    id: 'red-5',
    title: '红色网络阵地',
    category: '网络育人',
    icon: Shield,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    content: '结合网络空间安全专业特色，建设红色网络文化传播阵地。在视频资源模块中设立"红色科技"专栏，推送我国科技工作者奋斗故事。通过智能问答模块解答学生关于科技伦理、网络安全法治等问题，构建清朗网络学习空间。',
    keywords: ['网络安全', '科技伦理', '红色专栏', '法治教育'],
  },
  {
    id: 'red-6',
    title: '红色心理育人',
    category: '心理育人',
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    content: '关注学生学习心理健康。在学习路径模块中设置"红色激励"机制，当学生遇到学习困难时推送革命先辈攻坚克难的故事激励。建立学习状态预警系统，对长时间未活跃或成绩下滑的学生进行关怀干预，体现育人温度。',
    keywords: ['心理健康', '红色激励', '学习预警', '关怀干预'],
  },
];

const categories = ['全部', '课程育人', '文化育人', '实践育人', '管理育人', '网络育人', '心理育人'];

const stats = [
  { label: '思政案例', value: '48', icon: BookOpen, color: 'text-red-600' },
  { label: '红色视频', value: '12', icon: Star, color: 'text-amber-600' },
  { label: '实践活动', value: '6', icon: Users, color: 'text-orange-600' },
  { label: '覆盖学生', value: '86', icon: GraduationCap, color: 'text-rose-600' },
];

export default function RedEducationPage() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [selectedItem, setSelectedItem] = useState<RedEducationItem | null>(null);

  const filtered = activeCategory === '全部'
    ? redEducationItems
    : redEducationItems.filter(item => item.category === activeCategory);

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* 标题栏 */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-red-600 to-rose-600">
          <Flag className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">红色育人</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">将红色基因融入专业教学，培养科技报国时代新人</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="glass-card p-4 flex items-center gap-3">
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
            <div>
              <div className="text-2xl font-bold text-[var(--color-text-primary)]">{stat.value}</div>
              <div className="text-xs text-[var(--color-text-secondary)]">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 分类标签 */}
      <div className="flex items-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-red-600 text-white border border-red-600'
                : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-red-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 详情视图 */}
      {selectedItem ? (
        <div className="glass-card p-6 animate-fade-in-up">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${selectedItem.bgColor}`}>
                <selectedItem.icon className={`w-6 h-6 ${selectedItem.color}`} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{selectedItem.title}</h2>
                <span className={`text-sm px-2 py-0.5 rounded ${selectedItem.bgColor} ${selectedItem.color}`}>
                  {selectedItem.category}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)]"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
            {selectedItem.content}
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedItem.keywords.map(kw => (
              <span key={kw} className="px-3 py-1 text-xs rounded-full bg-red-50 text-red-700 border border-red-200">
                {kw}
              </span>
            ))}
          </div>
        </div>
      ) : (
        /* 卡片列表 */
        <div className="grid grid-cols-2 gap-5">
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`glass-card p-5 cursor-pointer hover:scale-[1.02] transition-all duration-300 border-l-4 ${item.borderColor}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-2.5 rounded-lg ${item.bgColor}`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[var(--color-text-primary)] mb-1">{item.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${item.bgColor} ${item.color}`}>
                    {item.category}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 leading-relaxed">
                {item.content}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {item.keywords.slice(0, 3).map(kw => (
                  <span key={kw} className="px-2 py-0.5 text-xs rounded bg-[var(--color-bg-primary)] text-[var(--color-text-muted)]">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
