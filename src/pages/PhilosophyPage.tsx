import { BookOpen, Target, FlaskConical, Lightbulb, Users, BarChart3, Heart, Bot, GraduationCap, Globe, Link2, TrendingUp, Scale, UsersRound } from 'lucide-react';

const philosophy15th = [
  {
    icon: Target,
    title: '立德树人 · 五育并举',
    color: 'text-red-500',
    borderColor: 'border-red-500/30',
    bgColor: 'bg-red-500/10',
    points: [
      '将立德树人作为高校育人的根本任务，坚持"四全育人"（全员、全过程、全方位、全领域）',
      '摒弃"唯成绩论"，注重德智体美劳全面发展，坚持"健康第一"的教育理念',
      '产品体现：教学团队审核机制确保内容正确，学习报告涵盖知识、能力、实践多维度评估',
    ],
  },
  {
    icon: FlaskConical,
    title: '科教融汇 · 产教融合',
    color: 'text-blue-500',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/10',
    points: [
      '将教学、科研与国家重大科技攻关深度绑定，以科研赋能教学、以项目培育人才',
      '推动专业设置精准对接产业升级与市场需求，打通从基础研究到成果转化的创新链条',
      '产品体现：实验辅助结合真实硬件平台，自测系统对接超星题库，实现学以致用',
    ],
  },
  {
    icon: Lightbulb,
    title: '拔尖创新 · 交叉融合',
    color: 'text-purple-500',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/10',
    points: [
      '聚焦关键领域，大力发展新兴交叉学科，推广"项目制"育人培养方式',
      '深化新工科、新医科、新农科、新文科建设，培养适配新质生产力的复合型人才',
      '产品体现：知识图谱展现跨知识点关联，个性化推荐促进深度学习',
    ],
  },
  {
    icon: Users,
    title: '多元协同 · 全周期赋能',
    color: 'text-green-500',
    borderColor: 'border-green-500/30',
    bgColor: 'bg-green-500/10',
    points: [
      '构建学校主导、家庭筑基、社会支撑的协同育人生态',
      '贯穿入学适应、学业成长、人格塑造、实践历练、就业升学全周期',
      '产品体现：教学日历联动课堂教学，课前预习+课后巩固+实验实践形成闭环',
    ],
  },
  {
    icon: BarChart3,
    title: '破除唯分数 · 重质效',
    color: 'text-amber-500',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/10',
    points: [
      '发挥教育评价指挥棒作用，破除"唯分数、唯名校、唯学历"等功利化倾向',
      '完善学业评价办法，加强科学精神、创新能力等评价',
      '产品体现：过程性评价与终结性评价结合，掌握度雷达图、学习报告多维度评估',
    ],
  },
];

const futureEducation = [
  { icon: Heart, title: '人的复归', desc: '从工具理性向人格养成转变，关注价值观塑造与创造力培养，培养精神富足的终身学习者', product: '注重学习体验与动机激发，个性化推荐关注个体成长' },
  { icon: Bot, title: '人机协同', desc: '实现"千人千面"个性化学习，AI学伴提供定制化辅导和作业，线上线下深度融合', product: 'AI智能问答提供千人千面辅导，学习路径自适应推荐' },
  { icon: GraduationCap, title: '角色转型', desc: '教师从知识传授者转向学习设计师、项目式学习引导、情感支持和价值引领', product: '教师端学情分析助力教师转向学习设计师和成长合伙人' },
  { icon: Globe, title: '泛在学习', desc: '打破固定教室局限，学习延伸至家庭、社区、企业及虚拟空间，实现"时时可学"', product: '7×24小时在线答疑，支持随时随地学习' },
  { icon: Link2, title: '跨学科融合', desc: '打破单一学科壁垒，推动科技、人文、艺术跨学科融合，模块化课程动态迭代', product: '知识图谱打破学科壁垒，实验项目模块化设计' },
  { icon: TrendingUp, title: '能力本位', desc: '弱化终结性考试，转向过程性评价，通过大数据和AI生成动态"成长画像"', product: '学习报告生成动态成长画像，过程性评价贯穿全周期' },
  { icon: Scale, title: '教育公平', desc: '通过数字化技术将优质教育资源低成本、大规模辐射至农村和偏远地区', product: '低成本部署方案，可推广至更多院校共享优质资源' },
  { icon: UsersRound, title: '社交化生态', desc: '学习打破"标准化"流水线，向"自选制"和"探究式"转变，游戏化激发内驱力', product: '收藏题目、薄弱点专项突破等自选制学习方式' },
];

export default function PhilosophyPage() {
  return (
    <div className="p-6 space-y-8 animate-fade-in circuit-bg">
      {/* 页面标题 */}
      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-[var(--color-accent-primary)]" />
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">教育理念</h1>
        </div>
        <p className="text-[var(--color-text-secondary)] ml-11">
          计组智学深度契合国家教育发展战略，积极实践未来教育新范式
        </p>
      </div>

      {/* 十五五规划 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-[var(--color-accent-primary)] rounded-full" />
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            十五五教育规划 · 五大育人理念
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {philosophy15th.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`glass-card p-5 border-l-4 ${item.borderColor} hover:border-l-[6px] transition-all`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{item.title}</h3>
                </div>
                <div className="ml-13 space-y-2">
                  {item.points.map((point, pi) => (
                    <div key={pi} className="flex gap-2">
                      <span className={`text-xs mt-1.5 flex-shrink-0 ${pi === item.points.length - 1 ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                        {pi === item.points.length - 1 ? '★' : '•'}
                      </span>
                      <p className={`text-sm ${pi === item.points.length - 1 ? 'text-[var(--color-accent-primary)] font-medium' : 'text-[var(--color-text-secondary)]'}`}>
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 未来教育 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-[var(--color-accent-secondary)] rounded-full" />
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            未来教育 · 八大特点
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {futureEducation.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-card p-5 hover:scale-[1.02] transition-all cursor-default"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-secondary)]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[var(--color-accent-secondary)]" />
                  </div>
                  <h3 className="text-base font-bold text-[var(--color-text-primary)]">{item.title}</h3>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-2 ml-13">{item.desc}</p>
                <div className="ml-13 px-3 py-2 bg-[var(--color-accent-primary)]/5 border border-[var(--color-accent-primary)]/20 rounded-lg">
                  <p className="text-xs text-[var(--color-accent-primary)]">
                    <span className="font-medium">产品实践：</span>{item.product}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
