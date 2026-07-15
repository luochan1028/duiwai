import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ZoomIn, ZoomOut, Maximize2, Info, ArrowRight,
  MessageSquare, FileCheck, Sparkles,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { graphNodes, graphLinks, categoryColors } from '@/data/mockData';
import type { GraphNode } from '@/data/mockData';

type Particle = {
  cx: number;
  cy: number;
  r: number;
  color: string;
  dx: number;
  dy: number;
  delay: number;
  dur: number;
};

// 粒子背景：青蓝与电光紫交替，缓慢漂浮
const PARTICLES: Particle[] = [
  { cx: 60, cy: 80, r: 2.5, color: 'rgba(0, 212, 255, 0.2)', dx: 22, dy: -30, delay: 0, dur: 9 },
  { cx: 180, cy: 50, r: 1.8, color: 'rgba(123, 47, 247, 0.15)', dx: -18, dy: -28, delay: 1.2, dur: 11 },
  { cx: 320, cy: 120, r: 3, color: 'rgba(0, 212, 255, 0.2)', dx: 25, dy: -35, delay: 2.4, dur: 10 },
  { cx: 450, cy: 60, r: 2, color: 'rgba(123, 47, 247, 0.15)', dx: -22, dy: -24, delay: 0.8, dur: 12 },
  { cx: 580, cy: 180, r: 2.5, color: 'rgba(0, 212, 255, 0.2)', dx: 20, dy: -32, delay: 3, dur: 9.5 },
  { cx: 720, cy: 90, r: 1.5, color: 'rgba(123, 47, 247, 0.15)', dx: -25, dy: -30, delay: 1.8, dur: 11.5 },
  { cx: 820, cy: 150, r: 2.8, color: 'rgba(0, 212, 255, 0.2)', dx: 24, dy: -26, delay: 2.2, dur: 10.5 },
  { cx: 100, cy: 300, r: 2.2, color: 'rgba(123, 47, 247, 0.15)', dx: -20, dy: -34, delay: 0.5, dur: 12.5 },
  { cx: 260, cy: 420, r: 2.6, color: 'rgba(0, 212, 255, 0.2)', dx: 26, dy: -28, delay: 2.8, dur: 9.8 },
  { cx: 430, cy: 500, r: 1.9, color: 'rgba(123, 47, 247, 0.15)', dx: -24, dy: -32, delay: 1.5, dur: 11.2 },
  { cx: 620, cy: 440, r: 2.4, color: 'rgba(0, 212, 255, 0.2)', dx: 22, dy: -30, delay: 3.2, dur: 10.2 },
  { cx: 780, cy: 360, r: 2.1, color: 'rgba(123, 47, 247, 0.15)', dx: -26, dy: -26, delay: 0.2, dur: 12.8 },
];

const particleStyle = (p: Particle): React.CSSProperties =>
  ({
    '--dx': `${p.dx}px`,
    '--dy': `${p.dy}px`,
    animation: `particle-drift ${p.dur}s ease-in-out ${p.delay}s infinite`,
  }) as React.CSSProperties;

export default function GraphPage() {
  const { selectedNodeId, setSelectedNodeId } = useStore();
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const selectedNode = graphNodes.find((n) => n.id === selectedNodeId);

  const getRelatedLinks = (nodeId: string) => {
    return graphLinks.filter(
      (l) => l.source === nodeId || l.target === nodeId
    );
  };

  const getRelatedNodes = (nodeId: string) => {
    const links = getRelatedLinks(nodeId);
    const relatedIds = new Set<string>();
    links.forEach((l) => {
      relatedIds.add(l.source);
      relatedIds.add(l.target);
    });
    relatedIds.delete(nodeId);
    return graphNodes.filter((n) => relatedIds.has(n.id));
  };

  const isLinkHighlighted = (source: string, target: string) => {
    if (!selectedNodeId && !hoveredNode) return true;
    const activeNode = selectedNodeId || hoveredNode;
    if (!activeNode) return true;
    return source === activeNode || target === activeNode;
  };

  const isNodeHighlighted = (nodeId: string) => {
    if (!selectedNodeId && !hoveredNode) return true;
    const activeNode = selectedNodeId || hoveredNode;
    if (!activeNode) return true;
    if (nodeId === activeNode) return true;
    return getRelatedLinks(activeNode).some(
      (l) => l.source === nodeId || l.target === nodeId
    );
  };

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNodeId(selectedNodeId === node.id ? null : node.id);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((s) => Math.max(0.5, Math.min(2, s + delta)));
  };

  const resetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const categories = Object.entries(categoryColors);

  return (
    <div className="h-full flex flex-col animate-fade-in-up opacity-0">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2 font-tech">
            <span className="glow-text-purple">知识图谱</span>
          </h2>
          <p className="text-text-secondary">点击节点探索知识点之间的关联关系</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
            className="p-2 glass-card hover:border-accent-cyan/40 transition-colors"
          >
            <ZoomOut className="w-4 h-4 text-text-secondary" />
          </button>
          <span className="text-sm text-text-secondary w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(2, s + 0.2))}
            className="p-2 glass-card hover:border-accent-cyan/40 transition-colors"
          >
            <ZoomIn className="w-4 h-4 text-text-secondary" />
          </button>
          <button
            onClick={resetView}
            className="p-2 glass-card hover:border-accent-cyan/40 transition-colors"
          >
            <Maximize2 className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-[500px]">
        {/* 图谱画布 */}
        <div className="flex-1 glass-card overflow-hidden relative cursor-grab active:cursor-grabbing">
          <svg
            ref={svgRef}
            className="w-full h-full"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,212,255,0.05)" strokeWidth="1" />
              </pattern>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* 粒子漂浮动画 */}
              <style>{`
                @keyframes particle-drift {
                  0%   { transform: translate(0, 0);     opacity: 0; }
                  25%  { opacity: 0.85; }
                  75%  { opacity: 0.85; }
                  100% { transform: translate(var(--dx), var(--dy)); opacity: 0; }
                }
              `}</style>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* 粒子背景：不参与交互 */}
            <g style={{ pointerEvents: 'none' }}>
              {PARTICLES.map((p, i) => (
                <circle
                  key={i}
                  cx={p.cx}
                  cy={p.cy}
                  r={p.r}
                  fill={p.color}
                  style={particleStyle(p)}
                />
              ))}
            </g>

            {/* 连线 */}
            <g
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transformOrigin: 'center center',
              }}
            >
              {graphLinks.map((link, i) => {
                const source = graphNodes.find((n) => n.id === link.source);
                const target = graphNodes.find((n) => n.id === link.target);
                if (!source || !target) return null;

                const highlighted = isLinkHighlighted(link.source, link.target);

                return (
                  <g key={i}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={highlighted ? '#00d4ff' : 'rgba(0,212,255,0.15)'}
                      strokeWidth={highlighted ? 2 : 1}
                      className="transition-all duration-300"
                      style={{
                        filter: highlighted ? 'drop-shadow(0 0 4px rgba(0,212,255,0.5))' : 'none',
                      }}
                    />
                    {highlighted && (
                      <text
                        x={(source.x + target.x) / 2}
                        y={(source.y + target.y) / 2 - 8}
                        textAnchor="middle"
                        fill="rgba(0,212,255,0.8)"
                        fontSize="11"
                        className="font-mono-code"
                      >
                        {link.relation}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* 节点 */}
              {graphNodes.map((node) => {
                const highlighted = isNodeHighlighted(node.id);
                const isSelected = selectedNodeId === node.id;
                const isHovered = hoveredNode === node.id;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => handleNodeClick(node)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="cursor-pointer transition-all duration-300"
                    style={{
                      opacity: highlighted ? 1 : 0.3,
                    }}
                  >
                    {/* 光晕 */}
                    {(isSelected || isHovered) && (
                      <circle
                        r={45}
                        fill={node.color}
                        opacity="0.2"
                        className="animate-pulse"
                      />
                    )}

                    {/* 节点主体 */}
                    <circle
                      r={30}
                      fill="rgba(10,14,26,0.9)"
                      stroke={node.color}
                      strokeWidth={isSelected ? 3 : 2}
                      style={{
                        filter: isSelected || isHovered
                          ? `drop-shadow(0 0 10px ${node.color})`
                          : 'none',
                      }}
                      className="transition-all duration-300"
                    />

                    {/* 节点文字 */}
                    <text
                      textAnchor="middle"
                      dy="0.3em"
                      fill={highlighted ? '#e5e7eb' : '#6b7280'}
                      fontSize="12"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="select-none"
                    >
                      {node.name.length > 6 ? node.name.slice(0, 6) + '...' : node.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* 图例 */}
          <div className="absolute bottom-4 left-4 glass-card p-3">
            <p className="text-xs text-text-secondary mb-2">知识点分类</p>
            <div className="flex flex-wrap gap-2 max-w-[200px]">
              {categories.map(([name, color]) => (
                <div key={name} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-text-primary">{name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute top-4 left-4 text-xs text-text-secondary bg-bg-primary/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-accent-cyan" />
            <span>拖拽平移 · 滚轮缩放 · 点击节点查看详情</span>
          </div>
        </div>

        {/* 节点详情面板 */}
        <div className="w-80 flex flex-col gap-4">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-accent-purple" />
              <h3 className="font-semibold text-text-primary">节点详情</h3>
            </div>

            {selectedNode ? (
              <div className="animate-fade-in-up opacity-0">
                <div
                  className="text-xl font-bold mb-2"
                  style={{ color: selectedNode.color }}
                >
                  {selectedNode.name}
                </div>
                <div className="text-xs px-2 py-1 rounded-full inline-block mb-4"
                  style={{ backgroundColor: `${selectedNode.color}20`, color: selectedNode.color }}
                >
                  {selectedNode.category}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  {selectedNode.description}
                </p>

                {/* 跨模块跳转 */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() =>
                      navigate('/qa', { state: { query: selectedNode.name } })
                    }
                    className="btn-tech flex-1 flex items-center justify-center gap-1.5 text-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>在问答中提问</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      navigate('/quiz', { state: { knowledgePoint: selectedNode.name } })
                    }
                    className="btn-tech flex-1 flex items-center justify-center gap-1.5 text-sm"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>做相关练习</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs text-text-secondary mb-2">关联知识点</p>
                  <div className="space-y-2">
                    {getRelatedNodes(selectedNode.id).map((node) => (
                      <button
                        key={node.id}
                        onClick={() => setSelectedNodeId(node.id)}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: node.color }}
                          />
                          <span className="text-sm text-text-primary">{node.name}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-text-secondary">
                <Info className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">点击图谱中的节点</p>
                <p className="text-xs">查看详细信息</p>
              </div>
            )}
          </div>

          {/* 学习路径建议 */}
          <div className="glass-card p-5 flex-1">
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
                    <div className="w-6 h-6 rounded-full bg-accent-cyan/20 text-accent-cyan text-xs flex items-center justify-center font-bold">
                      {item.step}
                    </div>
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
        </div>
      </div>
    </div>
  );
}
