import { useState, useRef } from 'react';
import { Play, Bug, FileCode, CheckCircle, AlertCircle, AlertTriangle, Copy, RotateCcw, Lightbulb, Upload, GitCompare } from 'lucide-react';
import { useStore } from '@/store/useStore';

const examples = [
  { name: '实验3：分支循环程序', desc: '计算1~10累加和', active: true },
  { name: '实验2：数码转换', desc: 'BCD码转二进制' },
  { name: '实验4：子程序设计', desc: '冒泡排序实现' },
];

interface DiffEntry { type: 'common' | 'removed' | 'added'; originalLine?: number; fixedLine?: number; content: string; }

// 基于 LCS 的逐行差异算法
function computeDiff(originalLines: string[], fixedLines: string[]): DiffEntry[] {
  const m = originalLines.length;
  const n = fixedLines.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = originalLines[i - 1] === fixedLines[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const diff: DiffEntry[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (originalLines[i - 1] === fixedLines[j - 1]) {
      diff.unshift({ type: 'common', originalLine: i, fixedLine: j, content: originalLines[i - 1] });
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      diff.unshift({ type: 'removed', originalLine: i, content: originalLines[i - 1] });
      i--;
    } else {
      diff.unshift({ type: 'added', fixedLine: j, content: fixedLines[j - 1] });
      j--;
    }
  }
  while (i > 0) { diff.unshift({ type: 'removed', originalLine: i, content: originalLines[i - 1] }); i--; }
  while (j > 0) { diff.unshift({ type: 'added', fixedLine: j, content: fixedLines[j - 1] }); j--; }
  return diff;
}

// 生成修复代码：添加 STACK 段定义、PUSH/POP 保护寄存器
function generateFixedCode(code: string): string {
  let fixed = code;
  if (!/STACK\s+SEGMENT/i.test(fixed)) {
    fixed = fixed.replace(/(DSEG\s+ENDS\s*\n)/i, '$1\nSTACK SEGMENT STACK\n    DW 100 DUP(?)\nSTACK ENDS\n');
  }
  if (/LOOP1:/i.test(fixed) && !/PUSH\s+BX/i.test(fixed)) {
    fixed = fixed.replace(/(LOOP1:)/i, '    PUSH BX    ; 保护BX寄存器\n$1');
    fixed = fixed.replace(/(LOOP\s+LOOP1[^\n]*)/i, '$1\n    POP BX     ; 恢复BX寄存器');
  }
  return fixed;
}

const DEFAULT_CODE = `; 实验3：分支与循环程序设计
; 计算 1+2+3+...+10 的和
; 结果存放在 AX 中

DSEG SEGMENT
    num DB 10
    result DW ?
DSEG ENDS

CSEG SEGMENT
    ASSUME CS:CSEG, DS:DSEG
START:
    MOV AX, DSEG
    MOV DS, AX
    
    MOV CX, num   ; 设置循环次数
    MOV AX, 0     ; 累加器清零
    MOV BX, 1     ; 从1开始
    
LOOP1:
    ADD AX, BX    ; 累加
    INC BX        ; 下一个数
    LOOP LOOP1    ; 循环
    
    MOV result, AX ; 保存结果
    
    MOV AH, 4CH
    INT 21H
CSEG ENDS
END START`;

export default function LabPage() {
  const { labCode, setLabCode, debugResult, setDebugResult, showCodeDiff, setShowCodeDiff } = useStore();
  const [selectedExample, setSelectedExample] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setDebugResult({
        errors: [
          { line: 15, type: 'error', message: '寄存器使用冲突', fix: 'BX 在LOOP1前添加PUSH BX保护寄存器' },
        ],
        warnings: [
          { line: 8, type: 'warning', message: 'DSEG段定义建议使用简化定义', fix: '添加 STACK SEGMENT STACK 定义堆栈段' },
          { line: 22, type: 'warning', message: '结果未使用result变量', fix: '可添加显示结果的DOS功能调用' },
        ],
        suggestions: [
          '建议添加注释说明程序功能',
          '可以考虑使用更高效的累加公式 n*(n+1)/2',
          '实验报告中建议添加程序运行结果验证',
        ],
        fixedCode: generateFixedCode(labCode),
      });
      setShowCodeDiff(false);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setLabCode(event.target?.result as string);
      setDebugResult(null);
      setShowCodeDiff(false);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    setLabCode(DEFAULT_CODE);
    setDebugResult(null);
    setShowCodeDiff(false);
  };

  const codeLines = labCode.split('\n');

  const getLineClass = (lineNum: number) => {
    if (!debugResult) return '';
    if (debugResult.errors.some((e) => e.line === lineNum)) return 'bg-red-500/10 border-l-2 border-red-500';
    if (debugResult.warnings.some((w) => w.line === lineNum)) return 'bg-yellow-500/10 border-l-2 border-yellow-500';
    return '';
  };

  const highlightLine = (line: string) => {
    let r = line.replace(/^;.*/g, '<span class="code-comment">$&</span>');
    r = r.replace(/\b(MOV|ADD|INC|LOOP|INT|ASSUME|SEGMENT|ENDS|PUSH|POP|CMP|JMP|JE|JNE|JG|JL)\b/g, '<span class="code-instruction">$1</span>');
    r = r.replace(/\b(AX|BX|CX|DX|AL|BL|CL|DL|AH|BH|CH|DH|SI|DI|BP|SP|CS|DS|ES|SS)\b/g, '<span class="code-register">$1</span>');
    r = r.replace(/\b\d+\b/g, '<span class="code-number">$&</span>');
    return r;
  };

  const diffEntries =
    debugResult?.fixedCode && showCodeDiff
      ? computeDiff(labCode.split('\n'), debugResult.fixedCode.split('\n'))
      : [];

  const getDiffLeftClass = (entry: DiffEntry) => {
    if (entry.type === 'removed') return 'bg-red-500/20 border-l-2 border-red-500';
    if (entry.type === 'common' && entry.originalLine) return getLineClass(entry.originalLine);
    return '';
  };

  // 复用：错误/警告列表渲染（使用完整字面量类名，确保 Tailwind JIT 可识别）
  const issueStyles: Record<'red' | 'yellow', { icon: string; card: string; line: string; msg: string }> = {
    red: { icon: 'text-red-400', card: 'bg-red-500/10 border border-red-500/30', line: 'text-red-400', msg: 'text-red-300' },
    yellow: { icon: 'text-yellow-400', card: 'bg-yellow-500/10 border border-yellow-500/30', line: 'text-yellow-400', msg: 'text-yellow-300' },
  };
  const renderIssueList = (
    issues: { line: number; type: string; message: string; fix?: string }[],
    color: 'red' | 'yellow',
    label: string,
    Icon: typeof AlertCircle
  ) => {
    if (issues.length === 0) return null;
    const s = issueStyles[color];
    return (
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`w-4 h-4 ${s.icon}`} />
          <span className={`text-sm font-medium ${s.icon}`}>{label} ({issues.length})</span>
        </div>
        <div className="space-y-2">
          {issues.map((iss, i) => (
            <div key={i} className={`p-3 ${s.card} rounded-lg`}>
              <div className="flex items-start gap-2">
                <span className={`text-xs ${s.line} font-mono-code flex-shrink-0`}>L{iss.line}</span>
                <div>
                  <p className={`text-sm ${s.msg}`}>{iss.message}</p>
                  {iss.fix && <p className="text-xs text-text-secondary mt-1">💡 {iss.fix}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 复用：对比视图单列渲染
  const renderDiffColumn = (side: 'left' | 'right') => {
    const isLeft = side === 'left';
    const bgClass = (entry: DiffEntry) =>
      isLeft ? getDiffLeftClass(entry) : entry.type === 'added' ? 'bg-green-500/20 border-l-2 border-green-500' : '';
    const skip = isLeft ? 'added' : 'removed';
    const lineNum = (entry: DiffEntry) =>
      entry.type === skip ? '' : (isLeft ? entry.originalLine : entry.fixedLine) ?? '';
    return (
      <div className="flex-1 min-w-0">
        <div className="px-4 py-2 text-xs text-text-secondary bg-white/5 border-b border-white/10 sticky top-0">
          {isLeft ? '原始代码（标记错误行）' : '修复后代码（标记修改行）'}
        </div>
        <div className="font-mono-code text-xs">
          {diffEntries.map((entry, idx) => (
            <div key={idx} className={`flex leading-6 px-2 ${bgClass(entry)}`}>
              <span className="select-none text-text-secondary/40 w-10 text-right pr-2 flex-shrink-0">{lineNum(entry)}</span>
              <span
                className="flex-1 pr-2 whitespace-pre"
                dangerouslySetInnerHTML={{
                  __html: entry.type === skip ? '&nbsp;' : highlightLine(entry.content) || '&nbsp;',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col animate-fade-in-up opacity-0">
      <input type="file" ref={fileInputRef} accept=".asm,.txt" className="hidden" onChange={handleFileUpload} />

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2 font-tech">
          <span className="glow-text-purple">实验辅助</span>
        </h2>
        <p className="text-text-secondary">汇编代码智能调试，助你快速定位问题</p>
      </div>

      <div className="flex-1 flex gap-6 min-h-[500px]">
        {/* 左侧示例列表 */}
        <div className="w-56 flex-shrink-0">
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-accent-cyan" />
              实验项目
            </h3>
            <div className="space-y-2">
              {examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedExample(i)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedExample === i ? 'bg-accent-cyan/10 border border-accent-cyan/30' : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <p className={`text-sm font-medium ${selectedExample === i ? 'text-accent-cyan' : 'text-text-primary'}`}>{ex.name}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{ex.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-4 mt-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-accent-green" />
              实验小贴士
            </h3>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li className="flex gap-2"><span className="text-accent-cyan">•</span>注意寄存器使用规范，使用前先保护现场</li>
              <li className="flex gap-2"><span className="text-accent-cyan">•</span>循环次数与CX要匹配</li>
              <li className="flex gap-2"><span className="text-accent-cyan">•</span>DOS功能调用号在AH中</li>
              <li className="flex gap-2"><span className="text-accent-cyan">•</span>段定义与段寄存器初始化</li>
            </ul>
          </div>
        </div>

        {/* 中间代码编辑器 */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text-primary">源代码</span>
              <span className="text-xs text-text-secondary">8086汇编</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 glass-card hover:border-accent-cyan/40 transition-colors text-xs text-text-secondary"
                title="上传代码文件 (.asm / .txt)"
              >
                <Upload className="w-4 h-4" />
                上传代码
              </button>
              <button onClick={handleReset} className="p-2 glass-card hover:border-accent-cyan/40 transition-colors" title="重置代码">
                <RotateCcw className="w-4 h-4 text-text-secondary" />
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(labCode)}
                className="p-2 glass-card hover:border-accent-cyan/40 transition-colors"
                title="复制代码"
              >
                <Copy className="w-4 h-4 text-text-secondary" />
              </button>
              <button onClick={handleAnalyze} disabled={isAnalyzing} className="flex items-center gap-2 px-4 py-2 btn-primary text-sm disabled:opacity-50">
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-bg-primary border-t-transparent rounded-full animate-spin" />
                    分析中...
                  </>
                ) : (
                  <>
                    <Bug className="w-4 h-4" />
                    智能调试
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 glass-card overflow-hidden flex flex-col">
            <div className="flex-1 overflow-auto code-editor-theme">
              <div className="flex min-w-max">
                <div className="select-none text-right pr-4 pl-4 py-4 text-text-secondary/50 text-xs leading-6">
                  {codeLines.map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <div className="flex-1 pr-4 py-4">
                  {codeLines.map((line, i) => (
                    <div
                      key={i}
                      className={`leading-6 px-2 -mx-2 ${getLineClass(i + 1)}`}
                      dangerouslySetInnerHTML={{ __html: highlightLine(line) || '&nbsp;' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧调试结果 */}
        <div className="w-80 flex-shrink-0 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Play className="w-4 h-4 text-accent-pink" />
            <span className="text-sm font-medium text-text-primary">调试结果</span>
          </div>

          <div className="flex-1 glass-card p-4 overflow-y-auto">
            {debugResult ? (
              <div className="space-y-4 animate-fade-in-up opacity-0">
                {renderIssueList(debugResult.errors, 'red', '错误', AlertCircle)}
                {renderIssueList(debugResult.warnings, 'yellow', '警告', AlertTriangle)}

                {debugResult.fixedCode && (
                  <button
                    onClick={() => setShowCodeDiff(!showCodeDiff)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 btn-tech text-sm"
                  >
                    <GitCompare className="w-4 h-4" />
                    {showCodeDiff ? '收起对比视图' : '查看修复建议代码'}
                  </button>
                )}

                {debugResult.suggestions.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-accent-green" />
                      <span className="text-sm font-medium text-accent-green">优化建议</span>
                    </div>
                    <ul className="space-y-2">
                      {debugResult.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                          <CheckCircle className="w-4 h-4 text-accent-green flex-shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">代码质量评分</span>
                    <span className="text-lg font-bold text-accent-cyan font-tech">
                      {debugResult.errors.length === 0 ? '92' : '75'}/100
                    </span>
                  </div>
                  <div className="w-full h-2 bg-bg-primary rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full progress-bar-glow"
                      style={{ width: `${debugResult.errors.length === 0 ? 92 : 75}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <Bug className="w-16 h-16 text-text-secondary/30 mb-4" />
                <p className="text-text-secondary mb-1">点击"智能调试"按钮</p>
                <p className="text-xs text-text-secondary/60">AI将自动分析代码问题</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 代码对比视图 */}
      {showCodeDiff && debugResult?.fixedCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6 animate-fade-in-up opacity-0">
          <div className="glass-card w-full max-w-6xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-accent-cyan" />
                <span className="text-base font-semibold text-text-primary">代码对比视图</span>
                <span className="text-xs text-text-secondary ml-2">（红色背景为删除行，绿色背景为新增行）</span>
              </div>
              <button
                onClick={() => setShowCodeDiff(false)}
                className="px-3 py-1 text-xs glass-card hover:border-accent-cyan/40 transition-colors text-text-secondary"
              >
                关闭
              </button>
            </div>
            <div className="flex-1 overflow-auto code-editor-theme">
              <div className="flex">
                {renderDiffColumn('left')}
                {renderDiffColumn('right')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
