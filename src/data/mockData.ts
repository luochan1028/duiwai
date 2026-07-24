import type { QuizQuestion as BaseQuizQuestion } from '@/types';

export interface QAItem {
  id: string;
  keyword: string;
  question: string;
  answer: string;
  relatedTopics: string[];
  chapter: string;
  difficulty: 'basic' | 'advanced';
  week: number;
  microCourses: MicroCourse[];
  reviewed: boolean;
}

export interface MicroCourse {
  title: string;
  duration: string;
  url: string;
  type: 'video' | 'doc' | 'exercise';
}

export interface GraphNode {
  id: string;
  name: string;
  category: string;
  description: string;
  x: number;
  y: number;
  color: string;
}

export interface GraphLink {
  source: string;
  target: string;
  relation: string;
}

export interface QuizQuestion extends BaseQuizQuestion {
  explanation: string;
}

export interface ChapterProgress {
  name: string;
  progress: number;
  mastery: number;
  weakPoints: string[];
  suggestions: string[];
}

export interface UserProgress {
  userId: string;
  overallProgress: number;
  totalStudyTime: number;
  todayStudyTime: number;
  questionsAnswered: number;
  chapters: ChapterProgress[];
}

export interface TeachingCalendarItem {
  week: number;
  topic: string;
  chapter: string;
  content: string;
  preClassTasks: string[];
  postClassTasks: string[];
}

export interface PendingTask {
  id: string;
  title: string;
  type: 'pre-study' | 'exercise' | 'experiment' | 'review';
  chapter: string;
  deadline: string;
  completed: boolean;
  description: string;
}

export interface HighFreqQuestion {
  question: string;
  count: number;
  category: string;
  trend: 'up' | 'down' | 'stable';
}

export interface StudentStat {
  class: string;
  totalStudents: number;
  activeUsers: number;
  avgScore: number;
  completionRate: number;
}

export interface LearningReportItem {
  section: string;
  content: string;
  score?: number;
  suggestion?: string;
}

export const categoryColors: Record<string, string> = {
  '运算器': '#00d4ff',
  '控制器': '#7b2ff7',
  '存储器': '#00ff9d',
  '输入输出': '#ff2d92',
  '指令系统': '#ffaa00',
  '数据表示': '#00d4ff',
  'CPU': '#7b2ff7',
};

export const knowledgePoints = [
  '存储器层次结构',
  'IEEE 754标准',
  'DMA方式',
  'CPU结构',
  'Cache映射',
  '指令系统',
  '总线系统',
  '数据表示',
  '中断系统',
  '浮点运算',
  '寻址方式',
  '指令流水线',
];

export const qaDatabase: QAItem[] = [
  {
    id: 'q1',
    keyword: 'DMA',
    question: '什么是DMA方式？它与程序中断方式有什么区别？',
    answer: `## DMA方式定义

**DMA（Direct Memory Access，直接存储器访问）** 是一种高速数据传输方式，它允许外部设备直接与主存储器进行数据交换，而不需要CPU的干预。

## 与程序中断方式的区别

| 对比项 | DMA方式 | 程序中断方式 |
|-------|---------|-------------|
| **数据传输** | 由DMA控制器直接完成 | 需要CPU执行中断服务程序 |
| **CPU干预** | 仅在传输开始和结束时干预 | 每个数据都需要CPU处理 |
| **响应速度** | 非常快，适合高速设备 | 较慢，有中断开销 |
| **并行性** | CPU与外设可并行工作 | CPU需要暂停当前程序 |
| **适用场景** | 磁盘、网卡等高速设备 | 键盘、鼠标等低速设备 |

## DMA工作过程

1. **预处理**：CPU向DMA控制器发送命令，设置传输参数
2. **数据传送**：DMA控制器接管总线，直接在内存和外设间传输数据
3. **后处理**：传输完成后，DMA向CPU发中断，CPU进行结束处理

> 关键点：DMA方式的核心优势是数据传输过程中完全不需要CPU参与，大大提高了系统的并行性和数据传输效率。`,
    relatedTopics: ['中断系统', '总线系统', '输入输出系统'],
    chapter: '第5章 输入输出系统',
    difficulty: 'basic',
    week: 14,
    reviewed: true,
    microCourses: [
      { title: 'DMA工作原理动画演示', duration: '8分钟', url: '#video-dma', type: 'video' },
      { title: 'DMA与中断对比练习', duration: '15分钟', url: '#exercise-dma', type: 'exercise' },
    ],
  },
  {
    id: 'q2',
    keyword: '浮点数精度',
    question: '为什么浮点数运算会有精度损失？',
    answer: `## 浮点数精度损失的原因

浮点数精度损失是由**二进制表示的固有局限性**造成的。

## 根本原因

### 1. 有限位数存储
IEEE 754单精度浮点数只有32位：
- 符号位：1位
- 阶码：8位
- 尾数：23位（隐含1位，共24位有效位）

### 2. 十进制与二进制的转换误差
很多十进制小数在二进制中是**无限循环小数**，例如：
- 0.1（十进制） = 0.0001100110011...（二进制，循环）

### 3. 对阶操作导致低位丢失
两个浮点数相加时需要**对阶**（小阶向大阶看齐），阶差较大时，小数的低位会被移出尾数范围。

## 减小精度损失的方法

1. **使用双精度**：double类型有52位尾数，精度更高
2. **合理设计算法**：避免大数加小数、避免相近数相减
3. **使用定点数**：在金融等对精度要求极高的场景
4. **设置误差范围**：比较浮点数时使用 eps 容差`,
    relatedTopics: ['IEEE 754标准', '数据表示', '浮点运算器'],
    chapter: '第2章 数据的表示和运算',
    difficulty: 'basic',
    week: 5,
    reviewed: true,
    microCourses: [
      { title: 'IEEE 754标准详解', duration: '12分钟', url: '#video-ieee754', type: 'video' },
      { title: '浮点数转换练习题', duration: '20分钟', url: '#exercise-float', type: 'exercise' },
    ],
  },
  {
    id: 'q3',
    keyword: '微程序控制',
    question: '微程序控制与硬布线控制有什么区别？',
    answer: `## 两种控制器设计方式

微程序控制和硬布线控制是CPU控制器的两种主要实现方式。

## 核心区别

| 对比项 | 微程序控制 | 硬布线控制 |
|-------|-----------|-----------|
| **核心思想** | 用程序（微程序）产生控制信号 | 用组合逻辑电路产生控制信号 |
| **控制信号来源** | 控制存储器（ROM）中的微指令 | 译码器、门电路等组合逻辑 |
| **修改难度** | 容易，只需修改微程序 | 困难，需要重新设计电路 |
| **速度** | 较慢，需要读取微指令 | 快，信号直接由电路产生 |
| **灵活性** | 高，易于扩展指令 | 低，指令集固定 |
| **适用场景** | CISC架构、复杂指令集 | RISC架构、追求高性能 |

## 如何选择？

- **追求性能** - 硬布线（现代CPU大多采用）
- **追求灵活** - 微程序（早期大型机、教学用）
- **现代CPU** - 混合策略（复杂指令用微码，简单指令用硬布线）`,
    relatedTopics: ['CPU结构', '指令周期', '控制单元'],
    chapter: '第4章 中央处理器',
    difficulty: 'advanced',
    week: 12,
    reviewed: true,
    microCourses: [
      { title: '微程序控制器设计微课', duration: '15分钟', url: '#video-micro', type: 'video' },
      { title: '控制器对比分析文档', duration: '10分钟', url: '#doc-controller', type: 'doc' },
    ],
  },
  {
    id: 'q4',
    keyword: 'Cache映射',
    question: 'Cache有哪几种映射方式？各有什么优缺点？',
    answer: `## Cache映射方式

Cache映射是指**主存块如何装入Cache**的规则。

## 三种映射方式对比

| 映射方式 | 原理 | 优点 | 缺点 | 适用场景 |
|---------|------|------|------|---------|
| **直接映射** | 每个主存块只能映射到Cache的一个固定位置 | 简单，成本低，速度快 | 冲突率高，Cache利用率低 | 大容量Cache |
| **全相联映射** | 主存块可映射到Cache任意位置 | 冲突率最低，利用率最高 | 成本高，速度慢 | 小容量Cache |
| **组相联映射** | 主存块映射到特定组的任意位置 | 前两者的折中，性能均衡 | 设计相对复杂 | 大多数现代CPU |

## 直接映射

Cache行号 = 主存块号 mod Cache行数

## 组相联映射

组号 = 主存块号 mod 组数
常见配置：2路、4路、8路组相联

## 性能比较

以命中率从高到低排序：**全相联 > 组相联 > 直接映射**
以访问速度从快到慢排序：**直接映射 > 组相联 > 全相联**

记忆口诀：直接最简单，全相最灵活，组相在中间，现代最常用。`,
    relatedTopics: ['存储层次', 'Cache替换算法', '存储器'],
    chapter: '第3章 存储器层次结构',
    difficulty: 'basic',
    week: 8,
    reviewed: true,
    microCourses: [
      { title: 'Cache映射方式动画演示', duration: '10分钟', url: '#video-cache', type: 'video' },
      { title: 'Cache映射计算练习', duration: '15分钟', url: '#exercise-cache', type: 'exercise' },
    ],
  },
  {
    id: 'q5',
    keyword: '指令周期',
    question: '什么是指令周期？一个完整的指令周期包含哪些阶段？',
    answer: `## 指令周期定义

**指令周期（Instruction Cycle）** 是指CPU从主存取出一条指令并执行这条指令的时间总和。

## 指令周期的四个阶段

### 1. 取指周期（Fetch）
- **任务**：从主存中取出指令
- PC -> MAR -> 地址总线 -> 主存
- 主存 -> 数据总线 -> MDR -> IR
- PC + 1 -> PC（指向下一条指令）

### 2. 间址周期（Indirect，可选）
- **任务**：获取操作数的有效地址
- 仅当指令采用间接寻址时存在

### 3. 执行周期（Execute）
- **任务**：执行指令的具体操作
- 不同指令的执行周期差异很大

### 4. 中断周期（Interrupt，可选）
- **任务**：处理中断请求
- 保存断点（PC压栈）、关中断、向量地址 -> PC

## 相关概念辨析

- **时钟周期**：最小时序单位，一个节拍
- **机器周期**：完成一个基本操作的时间
- **指令周期**：从取指到执行完成的总时间

关系：**指令周期 = 若干机器周期 = 若干时钟周期**

关键点：不是所有指令都有四个阶段。间址周期和中断周期是"可选"的。`,
    relatedTopics: ['CPU结构', '时序系统', '指令系统'],
    chapter: '第4章 中央处理器',
    difficulty: 'basic',
    week: 11,
    reviewed: true,
    microCourses: [
      { title: '指令周期流程图讲解', duration: '8分钟', url: '#video-cycle', type: 'video' },
    ],
  },
  {
    id: 'q6',
    keyword: '寻址方式',
    question: '什么是指令寻址方式？常见的寻址方式有哪些？',
    answer: `## 寻址方式定义

**寻址方式**是指确定本条指令的数据地址及下一条待执行指令地址的方法。

## 常见寻址方式

| 寻址方式 | 有效地址 | 特点 |
|---------|---------|------|
| **立即寻址** | 操作数直接在指令中 | 速度最快，但操作数长度有限 |
| **直接寻址** | EA = A | 简单，但寻址范围有限 |
| **间接寻址** | EA = (A) | 寻址范围大，但需多次访存 |
| **寄存器寻址** | EA = Ri | 速度快，但寄存器数量有限 |
| **基址寻址** | EA = (BR) + A | 适合多道程序设计 |
| **变址寻址** | EA = (IX) + A | 适合数组、循环处理 |
| **相对寻址** | EA = (PC) + A | 适合转移指令，位置无关 |

## 选择原则

- 追求速度：立即寻址、寄存器寻址
- 追求灵活性：基址寻址、变址寻址
- 追求代码紧凑：相对寻址`,
    relatedTopics: ['指令系统', '指令格式', '寄存器组'],
    chapter: '第4章 中央处理器',
    difficulty: 'basic',
    week: 10,
    reviewed: true,
    microCourses: [
      { title: '寻址方式图解微课', duration: '12分钟', url: '#video-addressing', type: 'video' },
      { title: '寻址方式练习题', duration: '15分钟', url: '#exercise-addressing', type: 'exercise' },
    ],
  },
  {
    id: 'q7',
    keyword: '指令流水线',
    question: '什么是指令流水线？它如何提高CPU性能？',
    answer: `## 指令流水线定义

**指令流水线**是将指令执行过程分成多个子过程，每个子过程由不同部件完成，使多条指令在不同部件上并行执行。

## 流水线基本原理

假设指令执行分为5个阶段：
1. 取指（IF）
2. 译码（ID）
3. 执行（EX）
4. 访存（MEM）
5. 写回（WB）

在理想情况下，5条指令同时在不同阶段执行，吞吐率提升约5倍。

## 流水线冲突（冒险）

| 冲突类型 | 原因 | 解决方法 |
|---------|------|---------|
| **结构冲突** | 硬件资源争用 | 资源重复、流水线停顿 |
| **数据冲突** | 数据依赖 | 转发（旁路）、停顿、编译调度 |
| **控制冲突** | 分支指令 | 分支预测、延迟分支 |

## 性能指标

- **吞吐率** = 指令数 / 总时间
- **加速比** = 不用流水线时间 / 用流水线时间
- **效率** = 加速比 / 流水段数`,
    relatedTopics: ['CPU结构', '指令周期', '流水线冲突'],
    chapter: '第4章 中央处理器',
    difficulty: 'advanced',
    week: 13,
    reviewed: true,
    microCourses: [
      { title: '指令流水线原理动画', duration: '15分钟', url: '#video-pipeline', type: 'video' },
    ],
  },
];

export const graphNodes: GraphNode[] = [
  { id: 'alu', name: '运算器ALU', category: '运算器', description: '算术逻辑单元，执行加减乘除和逻辑运算', x: 400, y: 150, color: '#00d4ff' },
  { id: 'controller', name: '控制器CU', category: '控制器', description: '控制单元，产生控制信号指挥各部件工作', x: 650, y: 150, color: '#7b2ff7' },
  { id: 'memory', name: '主存储器', category: '存储器', description: '存储程序和数据，CPU可直接访问', x: 520, y: 350, color: '#00ff9d' },
  { id: 'cache', name: 'Cache缓存', category: '存储器', description: '高速缓冲存储器，缓解CPU与主存速度差', x: 520, y: 240, color: '#00ff9d' },
  { id: 'register', name: '寄存器组', category: '运算器', description: 'CPU内高速存储单元，存放操作数和结果', x: 280, y: 240, color: '#00d4ff' },
  { id: 'instruction', name: '指令系统', category: '指令系统', description: 'CPU能执行的全部指令集合', x: 650, y: 350, color: '#ffaa00' },
  { id: 'io', name: '输入输出系统', category: '输入输出', description: '管理外设与主机的数据交换', x: 280, y: 350, color: '#ff2d92' },
  { id: 'bus', name: '总线系统', category: '输入输出', description: '连接各部件的公共信息传输通道', x: 520, y: 480, color: '#ff2d92' },
  { id: 'data-rep', name: '数据表示', category: '数据表示', description: '定点数、浮点数、字符等编码方式', x: 150, y: 150, color: '#00d4ff' },
  { id: 'cpu', name: 'CPU', category: 'CPU', description: '中央处理器 = 运算器 + 控制器', x: 520, y: 80, color: '#7b2ff7' },
];

export const graphLinks: GraphLink[] = [
  { source: 'cpu', target: 'alu', relation: '包含' },
  { source: 'cpu', target: 'controller', relation: '包含' },
  { source: 'alu', target: 'register', relation: '使用' },
  { source: 'controller', target: 'instruction', relation: '执行' },
  { source: 'controller', target: 'memory', relation: '控制' },
  { source: 'cache', target: 'memory', relation: '缓存' },
  { source: 'cpu', target: 'cache', relation: '访问' },
  { source: 'alu', target: 'data-rep', relation: '运算对象' },
  { source: 'io', target: 'bus', relation: '通过' },
  { source: 'memory', target: 'bus', relation: '连接' },
  { source: 'io', target: 'memory', relation: 'DMA' },
  { source: 'instruction', target: 'register', relation: '操作' },
];

export const quizQuestions: QuizQuestion[] = [
  { id: 'qz1', type: 'single', question: '在计算机中，CPU访问速度最快的存储器是？', options: ['Cache', '主存储器', '寄存器', '硬盘'], answer: 2, explanation: '寄存器位于CPU内部，是访问速度最快的存储单元。速度从快到慢依次为：寄存器 > Cache > 主存 > 硬盘。', knowledgePoint: '存储器层次结构', difficulty: 'easy' },
  { id: 'qz2', type: 'single', question: 'IEEE 754标准中，单精度浮点数的尾数位数是？', options: ['23位', '24位', '32位', '52位'], answer: 1, explanation: 'IEEE 754单精度浮点数格式：1位符号位 + 8位阶码 + 23位尾数。但由于规格化数的尾数最高位隐含为1，所以实际有效位数是24位。', knowledgePoint: 'IEEE 754标准', difficulty: 'medium' },
  { id: 'qz3', type: 'judge', question: 'DMA方式在数据传输过程中完全不需要CPU干预。', options: ['正确', '错误'], answer: 0, explanation: '正确。DMA的核心特点就是数据传输过程由DMA控制器控制，不需要CPU参与。CPU只需要在传输前进行初始化，传输完成后处理中断即可。', knowledgePoint: 'DMA方式', difficulty: 'easy' },
  { id: 'qz4', type: 'multiple', question: '以下哪些属于控制器的组成部分？（多选）', options: ['程序计数器PC', '指令寄存器IR', '算术逻辑单元ALU', '控制单元CU', '状态寄存器PSW'], answer: [0, 1, 3], explanation: '控制器由PC、IR、指令译码器、CU、时序产生器等组成。ALU属于运算器，PSW也属于运算器相关。', knowledgePoint: 'CPU结构', difficulty: 'medium' },
  { id: 'qz5', type: 'single', question: '某Cache容量为16KB，块大小为16B，采用直接映射方式，Cache行数是多少？', options: ['256行', '512行', '1024行', '2048行'], answer: 2, explanation: 'Cache行数 = Cache容量 / 块大小 = 16KB / 16B = 1024行。', knowledgePoint: 'Cache映射', difficulty: 'hard' },
  { id: 'qz6', type: 'single', question: '以下哪种寻址方式操作数直接包含在指令中？', options: ['直接寻址', '立即寻址', '寄存器寻址', '间接寻址'], answer: 1, explanation: '立即寻址方式中，操作数直接编码在指令中，不需要访问存储器获取操作数，因此速度最快。', knowledgePoint: '寻址方式', difficulty: 'easy' },
  { id: 'qz7', type: 'judge', question: '在组相联映射中，每组只有1个Cache行时，它就等价于直接映射。', options: ['正确', '错误'], answer: 0, explanation: '正确。组相联映射中，当每组只有1路（1个Cache行）时，主存块只能映射到固定的一个位置，等价于直接映射。', knowledgePoint: 'Cache映射', difficulty: 'medium' },
  { id: 'qz8', type: 'single', question: '一个完整的指令周期通常不包含以下哪个阶段？', options: ['取指周期', '间址周期', '执行周期', '写回周期'], answer: 3, explanation: '标准指令周期包含取指、间址（可选）、执行、中断（可选）四个阶段。"写回周期"是流水线中的概念，不属于传统指令周期的阶段。', knowledgePoint: 'CPU结构', difficulty: 'medium' },
  { id: 'qz9', type: 'multiple', question: '以下哪些是指令流水线冲突的类型？（多选）', options: ['结构冲突', '数据冲突', '控制冲突', '地址冲突', '资源冲突'], answer: [0, 1, 2], explanation: '指令流水线冲突分为三类：结构冲突（硬件资源争用）、数据冲突（数据依赖）、控制冲突（分支指令引起）。', knowledgePoint: '指令流水线', difficulty: 'hard' },
  { id: 'qz10', type: 'single', question: '以下哪种总线仲裁方式中，优先级固定？', options: ['链式查询', '计数器定时查询', '独立请求', '分布式仲裁'], answer: 0, explanation: '链式查询方式中，离总线控制器越近的设备优先级越高，优先级是固定的。', knowledgePoint: '总线系统', difficulty: 'medium' },
  { id: 'qz11', type: 'judge', question: '在补码表示中，0有两种表示形式。', options: ['正确', '错误'], answer: 1, explanation: '错误。补码表示中0只有一种形式（全0），这是补码相对于原码和反码的优势之一。原码和反码中0有正零和负零两种表示。', knowledgePoint: '数据表示', difficulty: 'easy' },
  { id: 'qz12', type: 'single', question: '中断向量表中存放的是？', options: ['中断类型号', '中断服务程序入口地址', '中断屏蔽字', '中断优先级'], answer: 1, explanation: '中断向量表中存放的是中断服务程序的入口地址（中断向量）。CPU通过中断类型号在中断向量表中查找对应的入口地址。', knowledgePoint: '中断系统', difficulty: 'medium' },
  { id: 'qz13', type: 'single', question: 'IEEE 754单精度浮点数能表示的最大正数约为？', options: ['3.4×10^38', '1.7×10^308', '6.5×10^4', '2.1×10^9'], answer: 0, explanation: '单精度浮点数阶码8位，最大阶码127（偏移127后），2^127约等于1.7×10^38，加上尾数最大值约1.99...，约为3.4×10^38。', knowledgePoint: 'IEEE 754标准', difficulty: 'hard' },
  { id: 'qz14', type: 'multiple', question: '以下哪些是RISC架构的特点？（多选）', options: ['指令长度固定', '指令种类少', '使用较多的寻址方式', '大量使用寄存器', '以存储器-存储器操作为主'], answer: [0, 1, 3], explanation: 'RISC特点：指令长度固定、指令种类少、寻址方式少、大量使用寄存器、以寄存器-寄存器操作为主、使用流水线技术。', knowledgePoint: '指令系统', difficulty: 'medium' },
  { id: 'qz15', type: 'judge', question: 'Cache对程序员是透明的。', options: ['正确', '错误'], answer: 0, explanation: '正确。Cache的存在对程序员是透明的，程序员不需要关心数据是在Cache还是在主存中，这是由硬件自动管理的。', knowledgePoint: '存储器层次结构', difficulty: 'easy' },
  { id: 'qz16', type: 'single', question: '浮点数加减运算中对阶操作的原则是？', options: ['大阶向小阶看齐', '小阶向大阶看齐', '取两阶平均值', '阶码直接相加'], answer: 1, explanation: '对阶操作的原则是小阶向大阶看齐（小阶的尾数右移，阶码增大），因为大阶向小阶看齐可能导致尾数溢出。', knowledgePoint: '浮点运算', difficulty: 'medium' },
  { id: 'qz17', type: 'single', question: '某机器字长16位，采用补码表示，能表示的整数范围是？', options: ['-32768~32767', '-32767~32767', '0~65535', '-65536~65535'], answer: 0, explanation: 'n位补码表示范围：-2^(n-1) ~ 2^(n-1)-1。16位补码范围：-32768~32767。', knowledgePoint: '数据表示', difficulty: 'medium' },
  { id: 'qz18', type: 'judge', question: '在指令流水线中，数据旁路（转发）技术可以解决所有数据冲突。', options: ['正确', '错误'], answer: 1, explanation: '错误。数据旁路（转发）可以解决大部分数据冲突（如EX到EX的转发），但对于Load-Use冲突（前一条指令是访存指令）仍需要插入一个气泡（停顿一拍）。', knowledgePoint: '指令流水线', difficulty: 'hard' },
  { id: 'qz19', type: 'single', question: '在程序中断方式中，CPU响应中断的时间是？', options: ['任一时刻', '当前指令执行完毕', '当前时钟周期结束', '当前机器周期结束'], answer: 1, explanation: 'CPU在每条指令执行完毕后检查是否有中断请求，如果有且允许中断，则在当前指令执行完毕后响应中断。', knowledgePoint: '中断系统', difficulty: 'medium' },
  { id: 'qz20', type: 'single', question: '某机器主存地址32位，Cache容量256KB，块大小32B，采用4路组相联，则组地址为几位？', options: ['8位', '10位', '11位', '13位'], answer: 2, explanation: 'Cache行数=256KB/32B=8192行=8K行，每组4路，所以组数=8192/4=2048=2^11，组地址为11位。', knowledgePoint: 'Cache映射', difficulty: 'hard' },
];

export const userProgress: UserProgress = {
  userId: 'student_2025',
  overallProgress: 62,
  totalStudyTime: 3840,
  todayStudyTime: 75,
  questionsAnswered: 127,
  chapters: [
    { name: '第1章 计算机系统概述', progress: 100, mastery: 92, weakPoints: [], suggestions: ['已掌握良好，建议做进阶练习'] },
    { name: '第2章 数据的表示和运算', progress: 85, mastery: 76, weakPoints: ['浮点数加减运算', '卡诺图化简'], suggestions: ['复习浮点数对阶操作', '多加练习卡诺图化简题'] },
    { name: '第3章 存储器层次结构', progress: 70, mastery: 68, weakPoints: ['Cache组相联映射', '虚拟存储器'], suggestions: ['重点理解Cache映射计算', '结合例题理解虚存机制'] },
    { name: '第4章 中央处理器', progress: 45, mastery: 55, weakPoints: ['微程序控制器', '指令流水线'], suggestions: ['观看微程序控制专题微课', '画指令周期流程图加深理解'] },
    { name: '第5章 输入输出系统', progress: 20, mastery: 40, weakPoints: ['DMA工作原理', '中断处理过程'], suggestions: ['先学习本章基础概念', '结合实验理解IO接口'] },
  ],
};

export const radarChartData = {
  indicators: [
    { name: '数据表示', max: 100 },
    { name: '运算方法', max: 100 },
    { name: '存储系统', max: 100 },
    { name: 'CPU设计', max: 100 },
    { name: '指令系统', max: 100 },
    { name: 'IO系统', max: 100 },
  ],
  values: [85, 72, 68, 55, 78, 40],
};

export const teachingCalendar: TeachingCalendarItem[] = [
  { week: 1, topic: '计算机系统概述', chapter: '第1章', content: '计算机发展历程、层次结构、性能指标', preClassTasks: ['预习教材1.1-1.3节', '了解冯·诺依曼架构'], postClassTasks: ['完成第1章课后习题', '阅读扩展材料：现代计算机架构'] },
  { week: 2, topic: '数据表示-数制与编码', chapter: '第2章', content: '进位计数制、定点数表示、字符编码', preClassTasks: ['预习2.1节数制转换', '复习二进制基础'], postClassTasks: ['完成数制转换练习', '理解ASCII与Unicode'] },
  { week: 3, topic: '定点数运算', chapter: '第2章', content: '加减乘除运算、溢出判断', preClassTasks: ['预习2.2节定点运算', '复习补码表示'], postClassTasks: ['完成定点运算习题', '理解溢出检测方法'] },
  { week: 4, topic: '浮点数表示与运算', chapter: '第2章', content: 'IEEE 754标准、浮点运算流程', preClassTasks: ['预习2.3节浮点数表示', '了解IEEE 754标准'], postClassTasks: ['完成浮点数转换练习', '理解精度损失原因'] },
  { week: 5, topic: 'ALU设计', chapter: '第2章', content: '加法器设计、ALU结构', preClassTasks: ['复习全加器原理', '预习ALU设计'], postClassTasks: ['完成4位加法器设计实验', '理解串行/并行进位'] },
  { week: 6, topic: '存储器概述与SRAM/DRAM', chapter: '第3章', content: '存储器分类、SRAM与DRAM原理', preClassTasks: ['预习3.1-3.2节', '了解存储器层次'], postClassTasks: ['完成存储器扩展练习', '理解SRAM与DRAM区别'] },
  { week: 7, topic: '存储器扩展与交叉编址', chapter: '第3章', content: '字扩展、位扩展、多体交叉', preClassTasks: ['预习3.3节存储器扩展', '复习编址方式'], postClassTasks: ['完成存储器设计习题', '理解交叉编址优势'] },
  { week: 8, topic: 'Cache基本原理', chapter: '第3章', content: 'Cache映射方式、替换算法', preClassTasks: ['预习3.4节Cache原理', '了解局部性原理'], postClassTasks: ['完成Cache映射计算题', '理解三种映射方式'] },
  { week: 9, topic: '虚拟存储器', chapter: '第3章', content: '页表、TLB、虚存机制', preClassTasks: ['预习3.5节虚拟存储器', '了解分页机制'], postClassTasks: ['完成虚存地址转换题', '理解TLB作用'] },
  { week: 10, topic: '指令系统', chapter: '第4章', content: '指令格式、寻址方式', preClassTasks: ['预习4.1-4.2节', '了解RISC与CISC'], postClassTasks: ['完成寻址方式练习', '理解各种寻址方式'] },
  { week: 11, topic: 'CPU结构与指令周期', chapter: '第4章', content: 'CPU内部结构、指令周期流程', preClassTasks: ['预习4.3节CPU结构', '复习指令系统'], postClassTasks: ['画指令周期流程图', '理解数据通路'] },
  { week: 12, topic: '控制器设计', chapter: '第4章', content: '硬布线控制器、微程序控制器', preClassTasks: ['预习4.4节控制器', '复习指令周期'], postClassTasks: ['完成控制器设计习题', '对比两种控制器'] },
  { week: 13, topic: '指令流水线', chapter: '第4章', content: '流水线原理、冲突处理', preClassTasks: ['预习4.5节流水线', '了解并行处理'], postClassTasks: ['完成流水线性能计算', '理解流水线冲突'] },
  { week: 14, topic: '总线系统', chapter: '第5章', content: '总线仲裁、总线通信', preClassTasks: ['预习5.1节总线', '了解总线分类'], postClassTasks: ['完成总线仲裁练习', '理解同步/异步通信'] },
  { week: 15, topic: '输入输出方式', chapter: '第5章', content: '程序查询、中断、DMA', preClassTasks: ['预习5.2-5.3节IO方式', '复习中断概念'], postClassTasks: ['完成IO方式对比题', '理解DMA工作过程'] },
  { week: 16, topic: '期末复习', chapter: '全部', content: '知识点梳理、典型题分析', preClassTasks: ['整理各章笔记', '回顾错题'], postClassTasks: ['完成模拟试题', '查漏补缺'] },
];

export const pendingTasks: PendingTask[] = [
  { id: 't1', title: '预习：浮点数表示与运算', type: 'pre-study', chapter: '第2章', deadline: '本周三前', completed: false, description: '预习2.3节，了解IEEE 754标准，观看浮点数转换微课' },
  { id: 't2', title: '练习：Cache映射计算专项', type: 'exercise', chapter: '第3章', deadline: '本周五前', completed: false, description: '完成10道Cache映射计算题，巩固直接映射和组相联映射' },
  { id: 't3', title: '实验：4位加法器设计', type: 'experiment', chapter: '第2章', deadline: '下周一前', completed: false, description: '使用Logisim完成4位加法器电路设计，提交实验报告' },
  { id: 't4', title: '复习：微程序控制器', type: 'review', chapter: '第4章', deadline: '本周日前', completed: false, description: '观看微程序控制专题微课，整理控制器对比笔记' },
  { id: 't5', title: '预习：指令流水线', type: 'pre-study', chapter: '第4章', deadline: '下周三前', completed: false, description: '预习4.5节，了解流水线原理和冲突类型' },
  { id: 't6', title: '练习：中断与DMA对比', type: 'exercise', chapter: '第5章', deadline: '下周五前', completed: true, description: '完成中断与DMA方式对比分析题' },
];

export const highFreqQuestions: HighFreqQuestion[] = [
  { question: 'Cache三种映射方式的区别和计算', count: 89, category: '存储器', trend: 'up' },
  { question: 'IEEE 754浮点数转换与精度损失', count: 76, category: '数据表示', trend: 'stable' },
  { question: '微程序控制与硬布线控制对比', count: 65, category: 'CPU', trend: 'up' },
  { question: 'DMA工作原理与中断方式区别', count: 58, category: 'IO系统', trend: 'stable' },
  { question: '指令流水线冲突及解决方法', count: 52, category: 'CPU', trend: 'up' },
  { question: '寻址方式有效地址计算', count: 47, category: '指令系统', trend: 'down' },
  { question: '补码运算与溢出判断', count: 43, category: '数据表示', trend: 'stable' },
  { question: '存储器扩展（字扩展/位扩展）', count: 38, category: '存储器', trend: 'down' },
  { question: '指令周期各阶段与数据通路', count: 35, category: 'CPU', trend: 'stable' },
  { question: '总线仲裁方式对比', count: 28, category: 'IO系统', trend: 'down' },
];

export const classStats: StudentStat[] = [
  { class: '网安2025-1班', totalStudents: 43, activeUsers: 38, avgScore: 78.5, completionRate: 82 },
  { class: '网安2025-2班', totalStudents: 43, activeUsers: 41, avgScore: 81.2, completionRate: 88 },
];

export const learningReport: LearningReportItem[] = [
  { section: '学习概况', content: '本学期累计学习64小时，完成答题127道，正确率78%。当前课程总体进度62%，处于中等水平。', score: 62 },
  { section: '优势知识点', content: '数据表示（掌握度85%）、指令系统（掌握度78%）表现较好，建议继续保持。', score: 85 },
  { section: '薄弱知识点', content: 'IO系统（掌握度40%）和CPU设计（掌握度55%）是当前薄弱环节，需重点突破。', score: 40, suggestion: '建议重点复习DMA工作原理和微程序控制器相关内容' },
  { section: '实验表现', content: '已完成3个实验项目，代码调试调用213次。实验代码质量评分平均82分，存在寄存器使用冲突等常见问题。', score: 82, suggestion: '注意汇编编程规范，使用前先保护寄存器现场' },
  { section: '学习建议', content: '建议制定第4-5章专项复习计划，每天投入30分钟进行Cache计算和CPU设计练习，同时预习指令流水线内容。' },
  { section: '下阶段目标', content: '2周内将CPU设计掌握度提升至70%以上，IO系统掌握度提升至60%以上。完成简易CPU设计实验。' },
];