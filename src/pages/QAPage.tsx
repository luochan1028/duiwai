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
  { icon: Cpu, text: 'CPU由哪些部分组成？', tag: '基础' },
  { icon: Database, text: '原码反码补码的区别', tag: '常考' },
  { icon: Sparkles, text: 'RISC和CISC有什么区别？', tag: '重点' },
  { icon: BookOpen, text: '期末复习重点有哪些？', tag: '复习' },
  { icon: Lightbulb, text: '中断处理过程是怎样的？', tag: '基础' },
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

  // 同义词/关键词映射表：用于模糊匹配
  // key 是用户可能输入的词，value 是 qaDatabase 中对应的 keyword
  const synonymMap: Record<string, string> = {
    // CPU相关
    'cpu': 'CPU', '处理器': 'CPU', '中央处理器': 'CPU', '芯片': 'CPU',
    // 存储相关
    '内存': '存储器', '主存': '存储器', '存储系统': '存储器', '存储层次': '存储器',
    '高速缓存': 'Cache映射', '缓存': 'Cache映射', 'cache': 'Cache映射',
    '虚拟内存': '虚拟存储器', '缺页': '虚拟存储器',
    // 数据表示
    '浮点数': '浮点数精度', '浮点': '浮点数精度', '精度': '浮点数精度',
    'ieee': 'IEEE754', '浮点数标准': 'IEEE754',
    '原码': '原码反码补码', '反码': '原码反码补码', '补码': '原码反码补码', '机器数': '原码反码补码',
    '进制': '数制转换', '进制转换': '数制转换', '二进制': '数制转换', '十六进制': '数制转换', '八进制': '数制转换',
    // 运算器
    'alu': 'ALU', '算术逻辑单元': 'ALU', '运算器': 'ALU',
    '加法器': '加法器', '全加': '加法器', '半加': '加法器', '进位': '加法器',
    '溢出': '补码运算', '加减法': '补码运算',
    // 控制器
    '控制器': '微程序控制', '控制单元': '微程序控制', '硬布线': '微程序控制', '微程序': '微程序控制',
    '指令流水': '指令流水线', '流水线': '指令流水线', 'pipeline': '指令流水线', '冒险': '指令流水线', '冲突': '指令流水线',
    '周期': '机器周期', '时钟': '机器周期', '指令周期': '指令周期',
    // 指令
    '指令': '指令系统', '指令格式': '指令系统', '寻址': '寻址方式', '地址': '寻址方式',
    'risc': 'RISC', '精简指令': 'RISC', '复杂指令': 'RISC', 'arm': 'RISC',
    // IO
    'dma': 'DMA', '直接存储器存取': 'DMA',
    '中断': '中断', 'irq': '中断',
    'io': '输入输出', 'i/o': '输入输出', '外设': '输入输出', '输入输出': '输入输出',
    // 总线
    '总线': '总线', 'bus': '总线', '数据总线': '总线', '地址总线': '总线',
    // 寄存器
    '寄存器': '寄存器', 'pc寄存器': '寄存器', 'ir寄存器': '寄存器',
    // 性能
    '性能': '性能指标', '主频': '性能指标',
    // 多核
    '多核': '多核', '双核': '多核', '四核': '多核', '多处理器': '多核',
    // 其他
    '局部性': '局部性原理', '摩尔定律': '摩尔定律', '摩尔': '摩尔定律',
    '存储单元': '存储单元', '编址': '存储单元',
    // 第1章扩展
    '冯诺依曼': '冯诺依曼体系', '冯·诺依曼': '冯诺依曼体系', '诺依曼': '冯诺依曼体系', '存储程序': '冯诺依曼体系',
    '哈佛结构': '哈佛结构', '总线结构': '总线结构',
    '计算机发展': '计算机发展史', '发展史': '计算机发展史', '代': '计算机发展史',
    '系统软件': '系统软件', '应用软件': '应用软件', '操作系统': '系统软件',
    // 第2章扩展
    '移码': '移码', '增码': '移码',
    'bcd': 'BCD码', '二进制编码': 'BCD码', 'ascii': 'ASCII', '字符编码': '字符编码',
    'unicode': 'Unicode', 'utf': 'Unicode', '汉字编码': '汉字编码',
    '奇偶校验': '奇偶校验', '海明码': '海明码', '汉明码': '海明码', 'crc': 'CRC', '循环冗余': 'CRC',
    '定点数': '定点数', '定点': '定点数',
    '规格化': '规格化', '对阶': '对阶', '舍入': '舍入',
    '阵列乘法': '阵列乘法', '布斯': '布斯算法', 'booth': '布斯算法',
    '恢复余数': '恢复余数法', '不恢复余数': '不恢复余数法', '加减交替': '不恢复余数法',
    // 第3章扩展
    'sram': 'SRAM', 'dram': 'DRAM',
    'eprom': 'EPROM', 'eeprom': 'EEPROM', '闪存': '闪存', 'flash': '闪存',
    '替换算法': '替换算法', 'lru': 'LRU', 'fifo': 'FIFO', 'random': '随机替换',
    '写策略': '写策略', '写直达': '写直达', '写回': '写回',
    '命中率': '命中率', '缺失率': '缺失率', '缺失': '缺失率',
    '页表': '页表', '快表': 'TLB', 'tlb': 'TLB', '地址转换': '地址转换',
    '缺页中断': '缺页中断', '页面置换': '页面置换', 'lfu': 'LFU',
    '存储扩展': '存储扩展', '字扩展': '存储扩展', '位扩展': '存储扩展',
    '交叉编址': '交叉编址', '多体交叉': '交叉编址',
    // 第4章扩展
    '操作码': '操作码', '地址码': '地址码', '指令字长': '指令字长',
    '立即寻址': '立即寻址', '直接寻址': '直接寻址', '间接寻址': '间接寻址',
    '寄存器寻址': '寄存器寻址', '基址寻址': '基址寻址', '变址寻址': '变址寻址',
    '相对寻址': '相对寻址', '堆栈寻址': '堆栈寻址',
    '堆栈': '堆栈', '栈': '堆栈', '后进先出': '堆栈',
    'cisc': 'CISC',
    // 第5章扩展
    '程序计数器': '程序计数器', 'pc': '程序计数器',
    '指令寄存器': '指令寄存器', 'ir': '指令寄存器',
    '状态寄存器': '状态寄存器', 'psw': '状态寄存器',
    '取指': '取指周期', '间址': '间址周期', '执行': '执行周期',
    '微指令': '微指令', '微操作': '微操作', '微命令': '微命令',
    '控制存储器': '控制存储器', '微地址': '微地址',
    '数据冒险': '数据冒险', '数据冲突': '数据冒险',
    '结构冒险': '结构冒险', '结构冲突': '结构冒险',
    '控制冒险': '控制冒险', '分支预测': '分支预测',
    '转发': '转发', '旁路': '转发', '前递': '转发',
    '延迟分支': '延迟分支', '延迟槽': '延迟分支',
    '超标量': '超标量', '乱序': '乱序执行', '动态调度': '动态调度',
    // 第6章扩展
    '总线仲裁': '总线仲裁', '链式查询': '链式查询', '独立请求': '独立请求',
    '总线宽度': '总线宽度', '总线带宽': '总线带宽',
    '同步通信': '同步通信', '异步通信': '异步通信',
    // 第7章扩展
    '程序查询': '程序查询', '查询方式': '程序查询',
    '中断向量': '中断向量', '向量中断': '中断向量',
    '中断嵌套': '中断嵌套', '多重中断': '中断嵌套',
    '通道': '通道', 'i/o通道': '通道',
    '统一编址': '统一编址', '内存映射': '统一编址', '独立编址': '独立编址',
    // 第8章扩展
    '并行': '并行性', 'simd': 'SIMD', 'mimd': 'MIMD',
    '向量处理': '向量处理', '向量机': '向量处理',
    '互连网络': '互连网络', '互连': '互连网络',
    'cache一致性': 'Cache一致性', '一致性': 'Cache一致性',
    'mesi': 'MESI协议', '监听': '监听协议',
    // 第9章扩展
    'cpi': 'CPI', 'mips': 'MIPS', 'flops': 'FLOPS',
    '基准': '基准测试', 'benchmark': '基准测试',
    'amdahl': 'Amdahl定律', '阿姆达尔': 'Amdahl定律',
    '功耗': '功耗', '散热': '散热', '流水线气泡': '气泡',
    // 第10章
    'logisim': 'Logisim', 'verilog': 'Verilog', 'vhdl': 'Verilog',
    '汇编': '汇编语言', 'assembly': '汇编语言',
    '仿真': '仿真', '调试': '调试', 'testbench': '测试',
  };

  // 根据问题特征分类，用于兜底回答
  const categorizeQuestion = (q: string): { category: string; hint: string } => {
    const lower = q.toLowerCase();
    if (/复习|总结|重点|考点|考试|期末/.test(q)) {
      return { category: '复习', hint: '建议关注：CPU结构、存储系统、指令系统、输入输出系统四大模块，重点掌握Cache映射、流水线冲突、DMA与中断的区别等高频考点' };
    }
    if (/怎么学|如何学|学习方|建议|入门/.test(q)) {
      return { category: '学习方法', hint: '建议按"数据表示→运算器→存储器→指令系统→CPU→IO系统"顺序学习，多动手做实验，结合知识图谱建立体系' };
    }
    if (/作业|实验|代码|编程|verilog|logisim/.test(lower)) {
      return { category: '实验', hint: '可以前往"实验辅助"模块进行代码调试，或查看实验视频资源' };
    }
    if (/视频|课件|资料|资源/.test(q)) {
      return { category: '资源', hint: '可以前往"视频资源"模块查看课程视频，或在"学习路径"中按周次查看微课' };
    }
    if (/你是谁|你好|在吗|谢谢|辛苦/.test(q)) {
      return { category: '闲聊', hint: '我是计组智学AI助教，随时为你解答《计算机组成原理》相关问题！' };
    }
    return { category: '通用', hint: '可以尝试更具体地描述问题，或使用知识图谱探索相关概念' };
  };

  const simulateAIResponse = (question: string) => {
    setIsTyping(true);

    setTimeout(() => {
      // 改进的匹配逻辑：三层匹配
      const lowerQ = question.toLowerCase();

      // 第1层：同义词映射匹配
      let matchedQA = qaDatabase.find((qa) => {
        // 检查问题中是否包含同义词映射到该 QA 的 keyword
        for (const [syn, kw] of Object.entries(synonymMap)) {
          if (lowerQ.includes(syn.toLowerCase()) && kw === qa.keyword) {
            return true;
          }
        }
        return false;
      });

      // 第2层：原始 keyword 直接包含匹配
      if (!matchedQA) {
        matchedQA = qaDatabase.find(
          (qa) =>
            lowerQ.includes(qa.keyword.toLowerCase()) ||
            qa.question.toLowerCase().includes(lowerQ) ||
            question.includes(qa.question.slice(0, 5)),
        );
      }

      // 第3层：question 字段的模糊包含（双向）
      if (!matchedQA) {
        matchedQA = qaDatabase.find((qa) => {
          // 提取 QA question 的关键词（去停用词）
          const qaWords = qa.question.replace(/[？?什么是的有哪些和区别与如何它怎样各什么由组成作用过程定义原理|？，。、]/g, ' ').split(/\s+/).filter(w => w.length >= 2);
          return qaWords.some(w => question.includes(w));
        });
      }

      let answer: string;
      let relatedTopics: string[] | undefined;
      let reviewed: boolean | undefined;
      let microCourses: any[] | undefined;
      let week: number | undefined;

      if (matchedQA) {
        answer = matchedQA.answer;
        relatedTopics = matchedQA.relatedTopics;
        reviewed = matchedQA.reviewed;
        microCourses = matchedQA.microCourses;
        week = findWeekForQuestion(question, matchedQA.week);
      } else {
        // 兜底回答：根据问题类型给出有针对性的回答
        const { category, hint } = categorizeQuestion(question);
        answer = generateFallbackAnswer(question, category, hint);
        reviewed = false;
      }

      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'ai' as const,
        content: answer,
        timestamp: new Date(),
        relatedTopics,
        week,
        microCourses,
        reviewed,
      };

      setIsTyping(false);
      addMessage(aiMessage);
      startTypewriter(aiMessage.id, answer);
    }, 800 + Math.random() * 600);
  };

  // 生成兜底回答
  const generateFallbackAnswer = (question: string, category: string, hint: string): string => {
    if (category === '闲聊') {
      return `你好！我是**计组智学**AI助教 👋\n\n我专注于《计算机组成原理》课程辅导，可以帮你：\n- 解答知识点疑问\n- 梳理知识体系\n- 提供学习建议\n\n有什么计算机组成原理相关的问题，尽管问我吧！`;
    }

    if (category === '复习') {
      return `## 期末复习指南\n\n关于《计算机组成原理》的复习，建议按以下重点进行：\n\n### 高频考点\n1. **数据表示**：原码/反码/补码、IEEE 754浮点数\n2. **运算器**：ALU、加法器、补码运算与溢出判断\n3. **存储系统**：Cache映射方式、虚拟存储器、存储层次\n4. **指令系统**：寻址方式、指令格式、RISC vs CISC\n5. **CPU**：指令周期、流水线、控制器\n6. **输入输出**：中断、DMA、总线\n\n### 复习建议\n- 结合教学日历按周复习\n- 多做练习题，重点关注计算题\n- 使用知识图谱梳理概念关系\n\n> 💡 ${hint}`;
    }

    if (category === '学习方法') {
      return `## 计算机组成原理学习方法\n\n### 学习路径\n1. **数据表示**（第1-2周）：数制转换、编码方式\n2. **运算器**（第3周）：ALU、加法器\n3. **存储系统**（第5-8周）：存储层次、Cache、虚拟存储\n4. **指令系统**（第7周）：指令格式、寻址方式\n5. **CPU**（第4、13-14周）：控制器、流水线\n6. **IO系统**（第9-10周）：中断、DMA、总线\n\n### 学习建议\n- 多画结构图和流程图\n- 动手做实验加深理解\n- 关联实际CPU（如x86、ARM）理解概念\n\n> 💡 ${hint}`;
    }

    if (category === '实验') {
      return `关于实验和代码，你可以：\n\n1. 前往 **实验辅助** 模块进行代码调试\n2. 在 **视频资源** 中查看实验演示视频\n3. 常见实验工具：\n   - Logisim：数字电路仿真\n   - Verilog：硬件描述语言\n   - 汇编模拟器：如MASM、8086模拟器\n\n> 💡 ${hint}`;
    }

    if (category === '资源') {
      return `课程资源获取：\n\n1. **视频资源**：课程讲解、实验指导视频\n2. **知识图谱**：可视化知识点关系\n3. **学习路径**：按周次组织的学习内容\n4. **自测系统**：练习题巩固知识\n\n> 💡 ${hint}`;
    }

    // 通用兜底
    return `关于"${question}"，这个问题超出了我目前知识库的精确覆盖范围，但我可以提供一些方向性解答：\n\n## 分析\n\n《计算机组成原理》中，你提到的内容可能涉及以下某个方面：\n- 数据表示与运算\n- 存储系统\n- 指令系统与CPU设计\n- 输入输出系统\n\n## 建议\n\n1. 尝试用更具体的关键词提问，例如"什么是Cache直接映射"\n2. 前往 **知识图谱** 模块探索相关概念\n3. 查看 **学习路径** 中按周次组织的内容\n\n> 💡 ${hint}\n\n如果你有更具体的问题，欢迎继续提问！`;
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
