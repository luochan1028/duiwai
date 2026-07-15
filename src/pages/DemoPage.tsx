import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, SkipForward, Maximize } from 'lucide-react';

// ==================== 场景定义 ====================

interface DemoScene {
  id: string;
  title: string;
  duration: number; // 秒
  narration: string;
  content: 'intro' | 'architecture' | 'qa' | 'graph' | 'path' | 'lab' | 'quiz' | 'teacher' | 'results' | 'outro';
}

const scenes: DemoScene[] = [
  {
    id: 'intro',
    title: '开场与背景',
    duration: 90,
    narration: '大家好，欢迎观看"计组智学"教育智能体的设计与应用展示。我是本次演示的AI解说员。《计算机组成原理》作为网络空间安全专业的核心基础课，知识体系庞杂，涵盖布尔代数、数据表示、CPU设计、存储体系等多个抽象层次。学生普遍反映"入门难、理解难、应用难"。课后遇到概念困惑或实验障碍时，缺乏即时精准的反馈渠道。为破解这一困境，我们基于生成式AI技术，设计了一款深度绑定课程知识的教育智能体——"计组智学"，实现从"人找知识"到"知识找人"的转变。',
    content: 'intro',
  },
  {
    id: 'architecture',
    title: '系统架构',
    duration: 60,
    narration: '系统采用三层架构设计。底层融合了课程标准、教学日历、超星题库和实验指导书等结构化资源；中层是AI对话引擎、个性化推荐算法和代码调试引擎；上层提供六大功能模块，贯穿"预习-学习-练习-实验-复习"全流程，形成"教-学-评-辅"闭环。与通用AI助手不同，我们的智能体深度绑定教学日历，确保回答与教学进度一致。所有回答经教学团队审核，学习数据本地化存储，不用于模型训练。',
    content: 'architecture',
  },
  {
    id: 'qa',
    title: '智能问答',
    duration: 90,
    narration: '首先是智能问答模块。学生可以用自然语言提问，比如"什么是DMA方式"。AI以打字机效果逐字呈现回答，提供清晰的表格对比。回答底部自动关联教学日历，标注"第15周，输入输出方式"，帮助学生定位课程进度。同时推荐相关微课资源和练习题。每条回答都有"教学团队已审核"标识，确保内容准确性。输入框下方也有隐私提示，学习数据本地化存储，不用于模型训练。点击知识点标签，可以直接跳转到知识图谱查看关联。这就是自然语言智能问答的完整体验。',
    content: 'qa',
  },
  {
    id: 'graph',
    title: '知识图谱',
    duration: 60,
    narration: '知识图谱模块帮助学生建立系统化认知。画布中有运算器、控制器、存储器、指令系统等核心节点，背景粒子缓缓漂浮，营造科技氛围。节点支持拖拽和缩放交互。点击任意节点，关联的节点和连线自动高亮，右侧展示详细信息。更重要的是，每个节点都提供了跨模块跳转入口，可以一键跳转到问答页面提问，或前往自测系统做相关练习，实现模块间的无缝衔接，帮助学生形成"由点到面"的系统化认知。',
    content: 'graph',
  },
  {
    id: 'path',
    title: '学习路径与闭环推送',
    duration: 90,
    narration: '学习路径模块是"教-学-评-辅"闭环的核心。顶部展示学习数据统计，包括学习时长、活跃天数、问答次数等。雷达图直观呈现六维掌握度。章节进度卡片标注了每个模块的薄弱点和个性化建议。这里特别重要的是"本周学习计划"，系统根据教学日历自动推送课前预习和课后巩固任务，实现课前课中课后的全流程学习支持。待完成任务列表按类型分类，涵盖预习、练习、实验和复习。点击"生成学习报告"，系统会生成个性化的学习分析报告，包括学习概况、优势与薄弱知识点、实验表现，以及具体的改进建议和下阶段目标。',
    content: 'path',
  },
  {
    id: 'lab',
    title: '实验辅助',
    duration: 80,
    narration: '实验辅助模块为学生提供代码级支持。编辑器支持8086汇编语法高亮，不同语法元素用不同颜色区分。学生可以点击上传代码按钮，直接上传自己编写的汇编文件。点击"智能调试"，系统会自动分析代码，识别语法错误和逻辑漏洞，如"缺少STACK段定义""寄存器使用冲突"等，并给出具体修改建议和代码评分。更实用的是"修复建议代码"功能，点击后可以并排查看原始代码和修复后代码，红色标记删除行，绿色标记新增行，清晰直观。',
    content: 'lab',
  },
  {
    id: 'quiz',
    title: '自测系统',
    duration: 70,
    narration: '自测系统支持按知识点和难度动态抽题。比如选择"Cache映射"相关题目，难度选中等，抽取10题。题库目前涵盖20道题，覆盖12个知识点。答题过程中，每道题都可以收藏标记，方便后续回顾。提交答案后，系统即时给出成绩分析，包括正确率和薄弱知识点识别，帮助查漏补缺。这就是学习成效自测与反馈的完整流程。',
    content: 'quiz',
  },
  {
    id: 'teacher',
    title: '教师端学情分析',
    duration: 50,
    narration: '教师端提供学情分析仪表盘。可以看到班级的活跃度、平均分和完成率对比。高频问题TOP10排行帮助教师快速了解学生困惑集中点，趋势箭头指示问题热度变化。知识点掌握度柱状图和教学调整建议，为教学优化提供数据支撑。教师从重复性答疑中解放，可将精力集中于教学设计与深度辅导。',
    content: 'teacher',
  },
  {
    id: 'results',
    title: '应用成效',
    duration: 60,
    narration: '在2025级网络空间安全专业两个班级共86人的4周试点中，智能体日均活跃用户达62人，累计回答问题1347次，实验代码辅助调用213次。学习效果方面，布尔代数化简和指令系统设计两个难点模块的随堂测验平均分分别提升了12.3%和9.7%。学生反馈实验调试时间缩短约40%。满意度调查显示，91.2%的学生认为智能体显著提升学习体验，86.7%表示更愿意主动探索课程难点。',
    content: 'results',
  },
  {
    id: 'outro',
    title: '创新性与展望',
    duration: 50,
    narration: '本智能体有四大创新点：第一，垂直领域知识深度融合，每个回答关联教学日历；第二，教-学-评-辅闭环设计，贯穿预习到复习全流程；第三，教育伦理与数据安全并重；第四，可推广的轻量化架构，可快速迁移至数据结构、操作系统等其他课程。"计组智学"教育智能体，实现了AI技术与专业课程的深度耦合，为未来课堂提供了可落地的智能化解决方案。感谢观看！',
    content: 'outro',
  },
];

// ==================== 场景渲染组件 ====================

function IntroScene() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center px-12">
      <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
        <div className="text-6xl font-bold font-tech mb-4">
          <span className="glow-text">计组</span><span className="glow-text-purple">智学</span>
        </div>
        <div className="text-2xl text-text-secondary mb-8">计算机组成原理 · 智能辅导智能体</div>
      </div>
      <div className="animate-fade-in-up opacity-0 grid grid-cols-3 gap-6 mt-8 max-w-3xl" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
        {[
          { icon: '❌', label: '入门难', desc: '知识体系庞杂抽象' },
          { icon: '❌', label: '理解难', desc: '概念缺乏直观解释' },
          { icon: '❌', label: '应用难', desc: '实验缺乏有效引导' },
        ].map((item, i) => (
          <div key={i} className="glass-card p-6 text-center">
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="text-lg font-bold text-accent-pink mb-1">{item.label}</div>
            <div className="text-sm text-text-secondary">{item.desc}</div>
          </div>
        ))}
      </div>
      <div className="animate-fade-in-up opacity-0 mt-12 flex items-center gap-3 text-accent-cyan" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
        <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
        <span className="text-lg">生成式AI → 从"人找知识"到"知识找人"</span>
      </div>
    </div>
  );
}

function ArchitectureScene() {
  const layers = [
    { name: '应用层', color: 'cyan', items: ['智能问答', '知识图谱', '学习路径', '实验辅助', '自测系统', '教师端'] },
    { name: '引擎层', color: 'purple', items: ['AI对话引擎', '推荐算法', '代码调试引擎'] },
    { name: '数据层', color: 'green', items: ['课程标准', '教学日历', '超星题库', '实验指导书'] },
  ];
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-12 py-8">
      <h2 className="text-3xl font-bold glow-text mb-2">系统架构</h2>
      <p className="text-text-secondary mb-8">三层架构 · 教-学-评-辅 闭环设计</p>
      <div className="w-full max-w-4xl space-y-4">
        {layers.map((layer, li) => (
          <div key={li} className={`animate-fade-in-up opacity-0 glass-card p-5`} style={{ animationDelay: `${li * 0.5 + 0.3}s`, animationFillMode: 'forwards' }}>
            <div className={`text-sm font-bold mb-3 ${layer.color === 'cyan' ? 'text-accent-cyan' : layer.color === 'purple' ? 'text-accent-purple' : 'text-accent-green'}`}>
              {layer.name}
            </div>
            <div className="flex flex-wrap gap-2">
              {layer.items.map((item, ii) => (
                <span key={ii} className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                  layer.color === 'cyan' ? 'border-accent-cyan/30 text-accent-cyan bg-accent-cyan/5' :
                  layer.color === 'purple' ? 'border-accent-purple/30 text-accent-purple bg-accent-purple/5' :
                  'border-accent-green/30 text-accent-green bg-accent-green/5'
                }`}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="animate-fade-in-up opacity-0 mt-6 flex gap-8 text-sm text-text-secondary" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-accent-cyan" />教学日历深度绑定</span>
        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-accent-green" />数据安全本地存储</span>
        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-accent-purple" />回答经教学团队审核</span>
      </div>
    </div>
  );
}

function QAScene() {
  const [displayText, setDisplayText] = useState('');
  const fullText = `## DMA方式定义

**DMA（直接存储器访问）** 是一种高速数据传输方式，它允许外部设备直接与主存储器进行数据交换，而不需要CPU的干预。

## 与程序中断方式的区别

| 对比项 | DMA方式 | 程序中断方式 |
|-------|---------|-------------|
| **数据传输** | 由DMA控制器直接完成 | 需要CPU执行中断服务程序 |
| **CPU干预** | 仅在传输开始和结束时干预 | 每个数据都需要CPU处理 |
| **响应速度** | 非常快，适合高速设备 | 较慢，有中断开销 |
| **适用场景** | 磁盘、网卡等高速设备 | 键盘、鼠标等低速设备 |`;

  useEffect(() => {
    let idx = 0;
    const timer = setInterval(() => {
      idx += 3;
      if (idx >= fullText.length) { idx = fullText.length; clearInterval(timer); }
      setDisplayText(fullText.slice(0, idx));
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full flex gap-4 px-8 py-6">
      {/* 左侧对话 */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-bold glow-text mb-4">智能问答</h3>
        <div className="glass-card flex-1 p-4 overflow-hidden">
          {/* 用户消息 */}
          <div className="flex justify-end mb-3">
            <div className="chat-bubble-user px-4 py-2 max-w-[70%]">什么是DMA方式？</div>
          </div>
          {/* AI回复 */}
          <div className="chat-bubble-ai p-4 max-w-[85%]">
            <pre className="whitespace-pre-wrap text-sm text-text-primary font-sans">{displayText}<span className="animate-pulse text-accent-cyan">▌</span></pre>
          </div>
          {/* 底部标签 */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="px-2 py-1 text-xs bg-accent-purple/10 text-accent-purple rounded border border-accent-purple/20">📅 教学日历：第15周 - 输入输出方式</span>
            <span className="px-2 py-1 text-xs bg-accent-cyan/10 text-accent-cyan rounded border border-accent-cyan/20">🎬 DMA工作原理动画演示 8分钟</span>
            <span className="px-2 py-1 text-xs bg-accent-green/10 text-accent-green rounded border border-accent-green/20 flex items-center gap-1">✅ 教学团队已审核</span>
          </div>
        </div>
        <div className="mt-2 text-center text-xs text-accent-green/60">🔒 学习数据本地化存储，不用于模型训练</div>
      </div>
      {/* 右侧快捷问题 */}
      <div className="w-64 flex flex-col gap-2">
        <div className="text-sm text-text-secondary mb-1">快捷问题</div>
        {['什么是DMA方式？', '为什么浮点数有精度损失？', '微程序控制与硬布线控制的区别？', 'Cache有哪几种映射方式？'].map((q, i) => (
          <div key={i} className="glass-card px-3 py-2 text-sm text-text-primary hover:border-accent-cyan/50 cursor-pointer transition-all">
            {q}
          </div>
        ))}
      </div>
    </div>
  );
}

function GraphScene() {
  return (
    <div className="w-full h-full flex gap-4 px-8 py-6">
      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-bold glow-text mb-4">知识图谱</h3>
        <div className="glass-card flex-1 p-4 relative overflow-hidden">
          {/* 简化图谱 */}
          <svg viewBox="0 0 800 500" className="w-full h-full">
            {/* 连线 */}
            {[
              [520,80,400,150],[520,80,650,150],[400,150,280,240],[650,150,650,350],
              [650,150,520,350],[520,240,520,350],[280,350,520,480],[520,350,520,480],
            ].map(([x1,y1,x2,y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,212,255,0.15)" strokeWidth="1.5" />
            ))}
            {/* 高亮连线 */}
            <line x1={400} y1={150} x2={150} y2={150} stroke="#00d4ff" strokeWidth="2" opacity="0.6" />
            <line x1={400} y1={150} x2={280} y2={240} stroke="#00d4ff" strokeWidth="2" opacity="0.6" />
            {/* 粒子 */}
            {[{x:100,y:100},{x:700,y:300},{x:300,y:400},{x:600,y:80},{x:200,y:250}].map((p,i) => (
              <circle key={i} cx={p.x} cy={p.y} r="2" fill="rgba(0,212,255,0.3)">
                <animate attributeName="cy" values={`${p.y};${p.y-20};${p.y}`} dur={`${3+i}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.6;0.3" dur={`${3+i}s`} repeatCount="indefinite" />
              </circle>
            ))}
            {/* 节点 */}
            {[
              { x: 520, y: 80, name: 'CPU', color: '#7b2ff7', r: 28, selected: false },
              { x: 400, y: 150, name: '运算器ALU', color: '#00d4ff', r: 24, selected: true },
              { x: 650, y: 150, name: '控制器CU', color: '#7b2ff7', r: 24, selected: false },
              { x: 520, y: 240, name: 'Cache', color: '#00ff9d', r: 20, selected: false },
              { x: 280, y: 240, name: '寄存器组', color: '#00d4ff', r: 20, selected: false },
              { x: 520, y: 350, name: '主存储器', color: '#00ff9d', r: 22, selected: false },
              { x: 650, y: 350, name: '指令系统', color: '#ffaa00', r: 22, selected: false },
              { x: 280, y: 350, name: 'IO系统', color: '#ff2d92', r: 22, selected: false },
              { x: 150, y: 150, name: '数据表示', color: '#00d4ff', r: 20, selected: false },
              { x: 520, y: 480, name: '总线系统', color: '#ff2d92', r: 20, selected: false },
            ].map((node, i) => (
              <g key={i}>
                {node.selected && <circle cx={node.x} cy={node.y} r={node.r + 8} fill="none" stroke={node.color} strokeWidth="2" opacity="0.4">
                  <animate attributeName="r" values={`${node.r+5};${node.r+12};${node.r+5}`} dur="2s" repeatCount="indefinite" />
                </circle>}
                <circle cx={node.x} cy={node.y} r={node.r} fill={node.color} opacity={node.selected ? 1 : 0.7} />
                <text x={node.x} y={node.y + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">{node.name}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
      {/* 右侧详情面板 */}
      <div className="w-72 flex flex-col gap-3">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-accent-cyan" />
            <span className="font-bold text-accent-cyan">运算器ALU</span>
          </div>
          <p className="text-sm text-text-secondary mb-3">算术逻辑单元，执行加减乘除和逻辑运算</p>
          <div className="text-xs text-text-secondary mb-2">关联知识点：</div>
          <div className="flex flex-wrap gap-1 mb-3">
            {['数据表示', '寄存器组', '布尔代数'].map((t, i) => (
              <span key={i} className="px-2 py-0.5 text-xs bg-accent-cyan/10 text-accent-cyan rounded border border-accent-cyan/20">{t}</span>
            ))}
          </div>
          <div className="space-y-2">
            <button className="w-full btn-tech py-2 text-sm flex items-center justify-center gap-2">💬 在问答中提问 →</button>
            <button className="w-full btn-tech py-2 text-sm flex items-center justify-center gap-2">📝 做相关练习 →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PathScene() {
  return (
    <div className="w-full h-full flex gap-4 px-8 py-6 overflow-y-auto">
      <div className="flex-1 flex flex-col gap-4">
        <h3 className="text-xl font-bold glow-text">学习路径与闭环推送</h3>
        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '总学习时长', value: '64h', color: 'cyan' },
            { label: '活跃天数', value: '21天', color: 'green' },
            { label: '累计问答', value: '127次', color: 'purple' },
            { label: '实验调试', value: '213次', color: 'pink' },
          ].map((s, i) => (
            <div key={i} className="glass-card p-3 text-center">
              <div className={`text-2xl font-tech font-bold ${s.color === 'cyan' ? 'text-accent-cyan' : s.color === 'green' ? 'text-accent-green' : s.color === 'purple' ? 'text-accent-purple' : 'text-accent-pink'}`}>{s.value}</div>
              <div className="text-xs text-text-secondary">{s.label}</div>
            </div>
          ))}
        </div>
        {/* 雷达图占位 + 本章学习计划 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4">
            <div className="text-sm font-bold text-text-primary mb-2">掌握度雷达图</div>
            <svg viewBox="0 0 200 200" className="w-40 h-40 mx-auto">
              <polygon points="100,30 155,65 155,135 100,170 45,135 45,65" fill="none" stroke="rgba(0,212,255,0.2)" strokeWidth="1" />
              <polygon points="100,50 145,72 140,130 100,155 60,120 55,68" fill="rgba(0,212,255,0.15)" stroke="#00d4ff" strokeWidth="1.5" />
              {['数据85','运算72','存储68','CPU55','指令78','IO40'].map((l, i) => {
                const angles = [-90, -30, 30, 90, 150, 210];
                const rad = (angles[i] * Math.PI) / 180;
                const x = 100 + 85 * Math.cos(rad);
                const y = 100 + 85 * Math.sin(rad);
                return <text key={i} x={x} y={y} textAnchor="middle" fill="#9ca3af" fontSize="8">{l}</text>;
              })}
            </svg>
          </div>
          {/* 本周学习计划 */}
          <div className="glass-card p-4 border-l-2 border-accent-cyan">
            <div className="text-sm font-bold text-accent-cyan mb-3">📋 本周学习计划（第14周）</div>
            <div className="mb-2">
              <div className="text-xs text-accent-cyan mb-1">课前预习</div>
              <div className="flex items-center gap-2 text-sm mb-1"><input type="checkbox" className="accent-accent-cyan" readOnly /> 预习5.1节总线</div>
              <div className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-accent-cyan" readOnly /> 了解总线分类</div>
            </div>
            <div>
              <div className="text-xs text-accent-green mb-1">课后巩固</div>
              <div className="flex items-center gap-2 text-sm mb-1"><input type="checkbox" className="accent-accent-green" readOnly /> 完成总线仲裁练习</div>
              <div className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-accent-green" defaultChecked readOnly /> <span className="line-through opacity-50">理解同步/异步通信</span></div>
            </div>
          </div>
        </div>
        {/* 学习报告 */}
        <div className="glass-card p-4 border-l-2 border-accent-purple">
          <div className="text-sm font-bold text-accent-purple mb-2">📊 个性化学习报告</div>
          <div className="space-y-2">
            {[
              { label: '学习概况', score: 62 },
              { label: '优势知识点', score: 85 },
              { label: '薄弱知识点', score: 40 },
              { label: '实验表现', score: 82 },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-text-secondary w-20">{r.label}</span>
                <div className="flex-1 h-2 bg-bg-primary rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${r.score >= 70 ? 'bg-accent-green' : r.score >= 50 ? 'bg-accent-cyan' : 'bg-accent-pink'}`}
                    style={{ width: `${r.score}%`, transition: 'width 1s' }} />
                </div>
                <span className="text-xs text-text-secondary">{r.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LabScene() {
  const code = `; 实验3：分支与循环程序设计
; 计算 1+2+3+...+10 的和
DSEG SEGMENT
    num DB 10
    result DW ?
DSEG ENDS

CSEG SEGMENT
    ASSUME CS:CSEG, DS:DSEG
START:
    MOV AX, DSEG
    MOV DS, AX
    MOV CX, num    ; 设置循环次数
    MOV AX, 0      ; 累加器清零
    MOV BX, 1      ; 从1开始
LOOP1:
    ADD AX, BX     ; 累加
    INC BX         ; 下一个数
    LOOP LOOP1     ; 循环
    MOV result, AX ; 保存结果
    MOV AH, 4CH
    INT 21H
CSEG ENDS
END START`;

  const fixedCode = `; 实验3：分支与循环程序设计（修复版）
; 计算 1+2+3+...+10 的和
DSEG SEGMENT
    num DB 10
    result DW ?
DSEG ENDS

STACK SEGMENT STACK      ; +添加STACK段
    DW 100 DUP(?)        ; +分配栈空间
STACK ENDS               ; +结束STACK段

CSEG SEGMENT
    ASSUME CS:CSEG, DS:DSEG
START:
    MOV AX, DSEG
    MOV DS, AX
    MOV CX, num
    MOV AX, 0
    PUSH BX              ; +保护BX寄存器
    MOV BX, 1
LOOP1:
    ADD AX, BX
    INC BX
    LOOP LOOP1
    POP BX               ; +恢复BX寄存器
    MOV result, AX
    MOV AH, 4CH
    INT 21H
CSEG ENDS
END START`;

  return (
    <div className="w-full h-full flex gap-4 px-8 py-6">
      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-bold glow-text mb-4">实验辅助</h3>
        {/* 代码对比视图 */}
        <div className="glass-card flex-1 p-4 flex gap-4 overflow-hidden">
          <div className="flex-1">
            <div className="text-xs text-accent-pink mb-2 font-bold">原始代码</div>
            <pre className="text-xs leading-5 overflow-hidden">
              {code.split('\n').map((line, i) => (
                <div key={i} className={`px-2 ${line.includes('LOOP1:') && !line.includes('PUSH') ? 'bg-red-500/10 border-l-2 border-red-500' : ''}`}>
                  <span className="text-text-secondary/40 mr-3">{String(i + 1).padStart(2, ' ')}</span>
                  <span className="text-text-primary">{line}</span>
                </div>
              ))}
            </pre>
          </div>
          <div className="w-px bg-accent-cyan/20" />
          <div className="flex-1">
            <div className="text-xs text-accent-green mb-2 font-bold">修复后代码</div>
            <pre className="text-xs leading-5 overflow-hidden">
              {fixedCode.split('\n').map((line, i) => (
                <div key={i} className={`px-2 ${line.includes('; +') ? 'bg-green-500/15 border-l-2 border-green-500' : ''}`}>
                  <span className="text-text-secondary/40 mr-3">{String(i + 1).padStart(2, ' ')}</span>
                  <span className={line.includes('; +') ? 'text-accent-green' : 'text-text-primary'}>{line}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
      {/* 右侧调试面板 */}
      <div className="w-72 flex flex-col gap-3">
        <div className="glass-card p-4">
          <div className="text-sm font-bold text-text-primary mb-3">🔍 调试结果</div>
          <div className="text-xs space-y-2">
            <div className="flex items-start gap-2"><span className="text-red-400">✖</span><div><span className="text-red-400">错误:</span> 缺少STACK段定义</div></div>
            <div className="flex items-start gap-2"><span className="text-yellow-400">⚠</span><div><span className="text-yellow-400">警告:</span> BX寄存器未保护</div></div>
          </div>
          <div className="mt-3 pt-3 border-t border-accent-cyan/10">
            <div className="text-xs text-text-secondary">代码评分</div>
            <div className="text-2xl font-tech font-bold text-accent-cyan glow-text">82<span className="text-sm text-text-secondary">/100</span></div>
          </div>
        </div>
        <div className="glass-card p-3 flex items-center gap-2 text-sm text-accent-green">
          <span>📎 上传代码</span>
          <span className="ml-auto">⚡ 智能调试</span>
        </div>
      </div>
    </div>
  );
}

function QuizScene() {
  return (
    <div className="w-full h-full flex gap-4 px-8 py-6">
      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-bold glow-text mb-4">自测系统</h3>
        {/* 配置区 */}
        <div className="glass-card p-4 mb-4">
          <div className="text-sm font-bold text-text-primary mb-3">抽题配置</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-text-secondary mb-2">知识点</div>
              <div className="flex flex-wrap gap-1">
                {['全部', 'Cache映射', 'IEEE 754', 'DMA方式'].map((k, i) => (
                  <span key={i} className={`px-2 py-1 text-xs rounded border ${i === 1 ? 'border-accent-purple text-accent-purple bg-accent-purple/10' : 'border-accent-cyan/20 text-text-secondary'}`}>{k}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-text-secondary mb-2">难度</div>
              <div className="flex gap-1">
                {['全部', '简单', '中等', '困难'].map((d, i) => (
                  <span key={i} className={`px-2 py-1 text-xs rounded ${i === 2 ? 'bg-accent-purple/20 text-accent-purple' : 'bg-bg-primary text-text-secondary'}`}>{d}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* 答题区 */}
        <div className="glass-card p-5 flex-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-text-secondary">第 3/10 题 · Cache映射</span>
            <span className="text-sm text-accent-cyan flex items-center gap-1">⏱ 02:35</span>
          </div>
          <div className="text-lg text-text-primary mb-4">某Cache容量为16KB，块大小为16B，采用直接映射方式，Cache行数是多少？</div>
          <div className="space-y-2">
            {['A. 256行', 'B. 512行', 'C. 1024行 ✓', 'D. 2048行'].map((opt, i) => (
              <div key={i} className={`px-4 py-3 rounded-lg border ${i === 2 ? 'border-accent-green bg-accent-green/10 text-accent-green' : 'border-accent-cyan/10 text-text-secondary hover:border-accent-cyan/30'} transition-all cursor-pointer`}>
                {opt}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-accent-pink">🔖 已收藏</span>
          </div>
        </div>
      </div>
      {/* 右侧结果 */}
      <div className="w-64 flex flex-col gap-3">
        <div className="glass-card p-4 text-center">
          <div className="text-sm text-text-secondary mb-1">当前成绩</div>
          <div className="text-4xl font-tech font-bold text-accent-cyan glow-text">80%</div>
          <div className="text-xs text-text-secondary mt-1">8/10 正确</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-sm font-bold text-text-primary mb-2">薄弱知识点</div>
          <div className="space-y-1.5">
            {['Cache映射计算', '浮点数对阶'].map((w, i) => (
              <div key={i} className="text-xs text-accent-pink bg-accent-pink/10 px-2 py-1 rounded">⚠ {w}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherScene() {
  return (
    <div className="w-full h-full flex gap-4 px-8 py-6">
      <div className="flex-1 flex flex-col gap-4">
        <h3 className="text-xl font-bold glow-text">教师端 · 学情分析</h3>
        {/* 班级统计 */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: '网安2025-1班', students: 43, active: 38, avg: 78.5, rate: 82 },
            { name: '网安2025-2班', students: 43, active: 41, avg: 81.2, rate: 88 },
          ].map((cls, i) => (
            <div key={i} className="glass-card p-4">
              <div className="text-sm font-bold text-text-primary mb-2">{cls.name}</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-text-secondary">活跃:</span> <span className="text-accent-cyan">{cls.active}/{cls.students}</span></div>
                <div><span className="text-text-secondary">平均分:</span> <span className="text-accent-green">{cls.avg}</span></div>
                <div className="col-span-2">
                  <div className="h-1.5 bg-bg-primary rounded-full overflow-hidden"><div className="h-full progress-bar-glow" style={{ width: `${cls.rate}%` }} /></div>
                  <span className="text-text-secondary">完成率 {cls.rate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* 高频问题 */}
        <div className="glass-card p-4">
          <div className="text-sm font-bold text-text-primary mb-3">高频问题 TOP5</div>
          {[
            { q: 'Cache三种映射方式的区别和计算', count: 89, trend: '↑' },
            { q: 'IEEE 754浮点数转换与精度损失', count: 76, trend: '→' },
            { q: '微程序控制与硬布线控制对比', count: 65, trend: '↑' },
            { q: 'DMA工作原理与中断方式区别', count: 58, trend: '→' },
            { q: '指令流水线冲突及解决方法', count: 52, trend: '↑' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-1.5 border-b border-accent-cyan/5 last:border-0">
              <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-accent-pink/20 text-accent-pink' : 'bg-bg-primary text-text-secondary'}`}>{i + 1}</span>
              <span className="flex-1 text-sm text-text-primary truncate">{item.q}</span>
              <span className={`text-xs ${item.trend === '↑' ? 'text-red-400' : 'text-text-secondary'}`}>{item.trend}</span>
              <span className="text-xs text-text-secondary">{item.count}次</span>
            </div>
          ))}
        </div>
      </div>
      {/* 教学建议 */}
      <div className="w-72 flex flex-col gap-3">
        <div className="glass-card p-4">
          <div className="text-sm font-bold text-accent-purple mb-3">💡 教学调整建议</div>
          <div className="space-y-3 text-sm">
            <div className="p-2 bg-accent-pink/5 rounded border border-accent-pink/20 text-text-secondary">Cache映射相关提问上升22%，建议增加课堂练习时间</div>
            <div className="p-2 bg-accent-purple/5 rounded border border-accent-purple/20 text-text-secondary">微程序控制提问增多，建议增加动画演示环节</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsScene() {
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
          <div key={i} className="glass-card p-5 text-center animate-fade-in-up opacity-0" style={{ animationDelay: `${i * 0.15}s`, animationFillMode: 'forwards' }}>
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
            <div><span className="text-sm text-text-secondary">布尔代数化简</span><div className="flex items-center gap-2 mt-1"><div className="flex-1 h-2 bg-bg-primary rounded-full overflow-hidden"><div className="h-full bg-accent-cyan rounded-full" style={{ width: '80%' }} /></div><span className="text-accent-cyan font-bold">+12.3%</span></div></div>
            <div><span className="text-sm text-text-secondary">指令系统设计</span><div className="flex items-center gap-2 mt-1"><div className="flex-1 h-2 bg-bg-primary rounded-full overflow-hidden"><div className="h-full bg-accent-purple rounded-full" style={{ width: '70%' }} /></div><span className="text-accent-purple font-bold">+9.7%</span></div></div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="text-sm font-bold text-text-primary mb-3">学生满意度</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm text-text-secondary">显著提升学习体验</span><span className="text-accent-green font-bold">91.2%</span></div>
            <div className="h-2 bg-bg-primary rounded-full overflow-hidden"><div className="h-full bg-accent-green rounded-full" style={{ width: '91.2%' }} /></div>
            <div className="flex items-center justify-between"><span className="text-sm text-text-secondary">更愿主动探索难点</span><span className="text-accent-purple font-bold">86.7%</span></div>
            <div className="h-2 bg-bg-primary rounded-full overflow-hidden"><div className="h-full bg-accent-purple rounded-full" style={{ width: '86.7%' }} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OutroScene() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center px-12">
      <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
        <div className="text-5xl font-bold font-tech mb-4">
          <span className="glow-text">计组</span><span className="glow-text-purple">智学</span>
        </div>
        <div className="text-xl text-text-secondary mb-8">AI技术赋能专业基础课教学的创新实践</div>
      </div>
      <div className="animate-fade-in-up opacity-0 grid grid-cols-2 gap-4 max-w-2xl" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
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
      <div className="animate-fade-in-up opacity-0 mt-10 text-text-secondary" style={{ animationDelay: '2.5s', animationFillMode: 'forwards' }}>
        <p className="text-lg">成都东软学院 · 网络空间安全专业</p>
        <p className="text-sm mt-2 text-accent-cyan">感谢观看</p>
      </div>
    </div>
  );
}

// ==================== 场景渲染映射 ====================

const sceneComponents: Record<string, () => JSX.Element> = {
  intro: IntroScene,
  architecture: ArchitectureScene,
  qa: QAScene,
  graph: GraphScene,
  path: PathScene,
  lab: LabScene,
  quiz: QuizScene,
  teacher: TeacherScene,
  results: ResultsScene,
  outro: OutroScene,
};

// ==================== 主组件 ====================

export default function DemoPage() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sceneElapsed, setSceneElapsed] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scene = scenes[currentScene];
  const totalDuration = scenes.reduce((s, sc) => s + sc.duration, 0);

  // 语音旁白
  const speak = useCallback((text: string) => {
    window.speechSynthesis.cancel();
    if (isMuted) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.rate = 1.05;
    u.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(v => v.lang.startsWith('zh')) || voices[0];
    if (zhVoice) u.voice = zhVoice;
    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
  }, [isMuted]);

  // 停止语音
  const stopSpeak = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  // 播放/暂停
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // 下一场景
  const nextScene = useCallback(() => {
    stopSpeak();
    if (currentScene < scenes.length - 1) {
      setCurrentScene(prev => prev + 1);
      setSceneElapsed(0);
    } else {
      setIsPlaying(false);
      stopSpeak();
    }
  }, [currentScene, stopSpeak]);

  // 重新开始
  const restart = useCallback(() => {
    stopSpeak();
    setCurrentScene(0);
    setSceneElapsed(0);
    setElapsed(0);
    setIsPlaying(true);
  }, [stopSpeak]);

  // 主计时器
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

  // 场景切换
  useEffect(() => {
    if (sceneElapsed >= scene.duration && isPlaying) {
      nextScene();
    }
  }, [sceneElapsed, scene.duration, isPlaying, nextScene]);

  // 开始播放时朗读
  useEffect(() => {
    if (isPlaying) {
      // 延迟一点让组件先渲染
      const t = setTimeout(() => speak(scene.narration), 300);
      return () => clearTimeout(t);
    }
  }, [currentScene, isPlaying, speak, scene.narration]);

  // 预加载语音
  useEffect(() => {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

  // 格式化时间
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const SceneComponent = sceneComponents[scene.content];

  return (
    <div className="fixed inset-0 bg-bg-primary z-50 flex flex-col">
      {/* 场景内容区 */}
      <div className="flex-1 overflow-hidden relative">
        <SceneComponent />

        {/* 字幕 */}
        {isPlaying && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-3xl w-full px-4">
            <div className="glass-card px-6 py-3 text-center">
              <p className="text-sm text-text-primary leading-relaxed">{scene.narration}</p>
            </div>
          </div>
        )}
      </div>

      {/* 控制栏 */}
      <div className="h-16 bg-bg-secondary/80 backdrop-blur border-t border-accent-cyan/10 flex items-center px-6 gap-4">
        {/* 场景标题 */}
        <div className="w-40 text-sm text-text-secondary truncate">
          {currentScene + 1}/{scenes.length} · {scene.title}
        </div>

        {/* 进度条 */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="relative h-1.5 bg-bg-primary rounded-full cursor-pointer">
            {/* 总进度 */}
            <div
              className="absolute h-full progress-bar-glow rounded-full"
              style={{ width: `${(elapsed / totalDuration) * 100}%` }}
            />
            {/* 场景内进度 */}
            <div
              className="absolute h-full bg-accent-purple/50 rounded-full"
              style={{ left: `${(elapsed / totalDuration) * 100 - (sceneElapsed / totalDuration) * 100}%`, width: `${(sceneElapsed / totalDuration) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-text-secondary">
            <span>{formatTime(elapsed)}</span>
            <span>{formatTime(totalDuration)}</span>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex items-center gap-2">
          <button onClick={restart} className="p-2 text-text-secondary hover:text-accent-cyan transition-colors" title="重新开始">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={togglePlay} className="p-3 bg-accent-cyan/10 hover:bg-accent-cyan/20 rounded-full text-accent-cyan transition-colors" title={isPlaying ? '暂停' : '播放'}>
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button onClick={nextScene} className="p-2 text-text-secondary hover:text-accent-cyan transition-colors" title="下一场景">
            <SkipForward className="w-4 h-4" />
          </button>
          <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-text-secondary hover:text-accent-cyan transition-colors" title={isMuted ? '开启语音' : '静音'}>
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => document.documentElement.requestFullscreen?.()}
            className="p-2 text-text-secondary hover:text-accent-cyan transition-colors"
            title="全屏"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 启动覆盖层 */}
      {!isPlaying && currentScene === 0 && sceneElapsed === 0 && (
        <div className="absolute inset-0 bg-bg-primary/95 flex flex-col items-center justify-center z-50">
          <div className="text-6xl font-bold font-tech mb-4">
            <span className="glow-text">计组</span><span className="glow-text-purple">智学</span>
          </div>
          <div className="text-xl text-text-secondary mb-8">自动演示模式</div>
          <button onClick={() => { setIsPlaying(true); setSceneElapsed(0); setElapsed(0); }} className="btn-primary px-8 py-4 text-lg flex items-center gap-3">
            <Play className="w-6 h-6" /> 开始演示
          </button>
          <p className="text-sm text-text-secondary mt-6">演示时长约10分钟，带AI语音旁白和字幕</p>
          <p className="text-xs text-text-secondary/50 mt-2">提示：请确保浏览器已开启语音权限，建议使用Chrome浏览器</p>
        </div>
      )}
    </div>
  );
}
