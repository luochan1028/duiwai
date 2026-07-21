import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取HTML文件
const htmlPath = path.join(__dirname, 'docs', '计组智学教育智能体软件著作权申请材料.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

// 提取SVG内容
const svgRegex = /<svg[\s\S]*?<\/svg>/g;
const svgs = htmlContent.match(svgRegex);

if (!svgs || svgs.length === 0) {
    console.error('未找到SVG内容');
    process.exit(1);
}

console.log(`找到 ${svgs.length} 个SVG流程图`);

// 创建输出目录
const outputDir = path.join(__dirname, 'docs', 'flowchart-images');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 转换每个SVG为PNG
const titles = [
    '图1-系统架构图',
    '图2-智能问答流程图',
    '图3-学习路径推荐流程图',
    '图4-实验调试流程图',
    '图5-自测系统流程图'
];

for (let i = 0; i < svgs.length; i++) {
    const svg = svgs[i];
    const title = titles[i] || `图${i + 1}`;
    const outputPath = path.join(outputDir, `${title}.png`);
    
    // 将SVG转换为Buffer
    const svgBuffer = Buffer.from(svg, 'utf-8');
    
    // 使用sharp转换
    await sharp(svgBuffer, { density: 300 })
        .png()
        .toFile(outputPath);
    
    console.log(`已转换: ${title}.png`);
}

console.log('所有流程图转换完成！');