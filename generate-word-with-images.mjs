import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel, AlignmentType, ImageRun, convertInchesToTwip } from 'docx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 辅助函数：创建表格行
function createTableRow(label, value) {
    return new TableRow({
        children: [
            new TableCell({
                width: { size: 25, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ children: [new TextRun({ text: label, font: '宋体', size: 24 })] })],
            }),
            new TableCell({
                width: { size: 75, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ children: [new TextRun({ text: value, font: '宋体', size: 24 })] })],
            }),
        ],
    });
}

// 辅助函数：创建普通段落
function createNormalParagraph(text, bold = false) {
    return new Paragraph({
        spacing: { before: 100 },
        children: [
            new TextRun({
                text: text,
                font: '宋体',
                size: 24,
                bold: bold,
            }),
        ],
    });
}

// 辅助函数：创建项目符号段落
function createBulletParagraph(text, indent = false) {
    return new Paragraph({
        spacing: { before: 50 },
        indent: indent ? { left: convertInchesToTwip(0.5) } : { left: convertInchesToTwip(0.25) },
        children: [
            new TextRun({
                text: '• ' + text,
                font: '宋体',
                size: 24,
            }),
        ],
    });
}

// 辅助函数：创建编号段落
function createNumberedParagraph(text) {
    return new Paragraph({
        spacing: { before: 100 },
        children: [
            new TextRun({
                text: text,
                font: '宋体',
                size: 24,
            }),
        ],
    });
}

// 辅助函数：创建图片段落
function createImageParagraph(imageBuffer, width, height, title) {
    const aspectRatio = width / height;
    const maxWidth = convertInchesToTwip(5.5); // 最大宽度5.5英寸
    const imgWidth = Math.min(width * 9525, maxWidth); // 转换为twips (1像素 = 9525 twips)
    const imgHeight = imgWidth / aspectRatio;
    
    return [
        new Paragraph({
            spacing: { before: 200, after: 100 },
            alignment: AlignmentType.CENTER,
            children: [
                new ImageRun({
                    data: imageBuffer,
                    transformation: {
                        width: Math.round(imgWidth / 9525),
                        height: Math.round(imgHeight / 9525),
                    },
                    type: 'png',
                }),
            ],
        }),
        new Paragraph({
            spacing: { after: 200 },
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: title,
                    font: '黑体',
                    size: 20,
                    bold: true,
                }),
            ],
        }),
    ];
}

// 读取流程图图片
const imageDir = path.join(__dirname, 'docs', 'flowchart-images');
const images = {
    architecture: fs.readFileSync(path.join(imageDir, '图1-系统架构图.png')),
    qa: fs.readFileSync(path.join(imageDir, '图2-智能问答流程图.png')),
    path: fs.readFileSync(path.join(imageDir, '图3-学习路径推荐流程图.png')),
    lab: fs.readFileSync(path.join(imageDir, '图4-实验调试流程图.png')),
    quiz: fs.readFileSync(path.join(imageDir, '图5-自测系统流程图.png')),
};

// 创建文档
const doc = new Document({
    styles: {
        default: {
            document: {
                font: '宋体',
            },
        },
    },
    sections: [
        // 封面
        {
            properties: {
                page: {
                    margin: {
                        top: convertInchesToTwip(1),
                        right: convertInchesToTwip(1),
                        bottom: convertInchesToTwip(1),
                        left: convertInchesToTwip(1),
                    },
                },
            },
            children: [
                new Paragraph({ spacing: { before: 2000 } }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: '计组智学教育智能体软件', font: '黑体', size: 72, bold: true }),
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 200 },
                    children: [
                        new TextRun({ text: 'V1.0', font: '黑体', size: 48 }),
                    ],
                }),
                new Paragraph({ spacing: { before: 1000 } }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: '软件著作权申请材料', font: '黑体', size: 36 }),
                    ],
                }),
                new Paragraph({ spacing: { before: 2000 } }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: '著作权人：____________________', font: '宋体', size: 28 }),
                    ],
                }),
                new Paragraph({ spacing: { before: 500 } }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: '申请日期：____________________', font: '宋体', size: 28 }),
                    ],
                }),
            ],
        },
        // 正文
        {
            properties: {
                page: {
                    margin: {
                        top: convertInchesToTwip(1),
                        right: convertInchesToTwip(1),
                        bottom: convertInchesToTwip(1),
                        left: convertInchesToTwip(1),
                    },
                },
            },
            children: [
                // 一、软件基本信息
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [new TextRun({ text: '一、软件基本信息', font: '黑体', size: 32, bold: true })],
                }),
                new Paragraph({ spacing: { before: 200 } }),
                
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                        createTableRow('软件全称', '计组智学教育智能体软件'),
                        createTableRow('软件简称', '计组智学'),
                        createTableRow('版本号', 'V1.0'),
                        createTableRow('开发完成日期', '2025年06月'),
                        createTableRow('首次发表日期', '2025年06月'),
                        createTableRow('著作权人', '（请填写申请人姓名/单位名称）'),
                        createTableRow('软件开发方式', '独立开发'),
                        createTableRow('权利取得方式', '原始取得'),
                    ],
                }),
                
                new Paragraph({ spacing: { before: 400 } }),
                
                // 二、软件用途和技术特点
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [new TextRun({ text: '二、软件用途和技术特点', font: '黑体', size: 32, bold: true })],
                }),
                new Paragraph({ spacing: { before: 200 } }),
                
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    children: [new TextRun({ text: '1. 软件用途', font: '黑体', size: 28, bold: true })],
                }),
                new Paragraph({ spacing: { before: 100 } }),
                createNormalParagraph('本软件是一款面向计算机组成原理课程的智能辅导系统，旨在为学生提供个性化、智能化的学习支持服务。主要应用场景包括：'),
                createBulletParagraph('智能问答辅导：学生可随时向AI助教提问课程相关问题，系统自动识别知识点并给出专业解答，支持Markdown格式呈现。'),
                createBulletParagraph('知识图谱导航：可视化展示课程核心概念及其关联关系，支持拖拽、缩放、节点高亮等交互操作。'),
                createBulletParagraph('个性化学习路径：基于学生的学习数据，自动推送学习计划、薄弱知识点突破建议、拓展阅读资源等。'),
                createBulletParagraph('实验代码辅助：提供8086汇编代码编辑器，支持语法高亮、智能调试、错误定位、修复建议等功能。'),
                createBulletParagraph('自适应测试系统：支持按知识点和难度动态抽题，提供答题界面、成绩分析、薄弱点识别等完整测试流程。'),
                createBulletParagraph('学情分析仪表盘：面向教师端，展示班级活跃度、高频问题排行、知识点掌握度柱状图等。'),
                
                new Paragraph({ spacing: { before: 300 } }),
                
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    children: [new TextRun({ text: '2. 技术特点', font: '黑体', size: 28, bold: true })],
                }),
                new Paragraph({ spacing: { before: 100 } }),
                
                createNormalParagraph('（1）三层架构设计', true),
                createBulletParagraph('数据层：融合课程标准、教学日历、超星题库、实验指导书四大数据源。'),
                createBulletParagraph('引擎层：部署AI对话引擎、个性化推荐算法、代码调试引擎三大核心引擎。'),
                createBulletParagraph('应用层：提供智能问答、知识图谱、学习路径、实验辅助、自测系统、教师端六大功能模块。'),
                
                createNormalParagraph('（2）深度学习与大模型技术', true),
                createBulletParagraph('集成大型语言模型（LLM），实现自然语言理解与生成。'),
                createBulletParagraph('支持上下文记忆、多轮对话、知识点关联推荐。'),
                
                createNormalParagraph('（3）知识图谱可视化', true),
                createBulletParagraph('采用D3.js力导向图算法，实现节点动态布局。'),
                createBulletParagraph('支持节点拖拽、滚轮缩放、画布平移等交互。'),
                
                createNormalParagraph('（4）多主题响应式界面', true),
                createBulletParagraph('支持暗色科技、明亮白色、爱国红色三种主题切换。'),
                createBulletParagraph('采用CSS变量系统，实现主题动态切换。'),
                
                createNormalParagraph('（5）数据安全与隐私保护', true),
                createBulletParagraph('学习数据本地化存储，不用于模型训练。'),
                createBulletParagraph('前端加密存储敏感信息。'),
                
                // 图1：系统架构图
                ...createImageParagraph(images.architecture, 600, 400, '图1 系统架构图'),
                
                new Paragraph({ spacing: { before: 400 } }),
                
                // 三、运行环境
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [new TextRun({ text: '三、运行环境', font: '黑体', size: 32, bold: true })],
                }),
                new Paragraph({ spacing: { before: 200 } }),
                
                createNormalParagraph('1. 硬件环境', true),
                createBulletParagraph('CPU：Intel Core i5及以上或同等性能处理器'),
                createBulletParagraph('内存：8GB及以上'),
                createBulletParagraph('硬盘：500MB可用空间'),
                createBulletParagraph('网络：支持互联网访问'),
                
                createNormalParagraph('2. 软件环境', true),
                createBulletParagraph('操作系统：Windows 10/11、macOS 10.15+、Linux（Ubuntu 18.04+）'),
                createBulletParagraph('浏览器：Chrome 90+、Firefox 88+、Edge 90+、Safari 14+'),
                createBulletParagraph('运行时：Node.js 18.x LTS'),
                
                createNormalParagraph('3. 开发环境', true),
                createBulletParagraph('前端框架：React 18 + TypeScript'),
                createBulletParagraph('构建工具：Vite 5.x'),
                createBulletParagraph('样式框架：Tailwind CSS 3.x'),
                createBulletParagraph('状态管理：React Context API'),
                createBulletParagraph('路由管理：React Router 6.x'),
                createBulletParagraph('可视化库：D3.js 7.x'),
                
                new Paragraph({ spacing: { before: 400 } }),
                
                // 四、编程语言
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [new TextRun({ text: '四、编程语言', font: '黑体', size: 32, bold: true })],
                }),
                new Paragraph({ spacing: { before: 200 } }),
                createBulletParagraph('主要编程语言：TypeScript、JavaScript'),
                createBulletParagraph('样式语言：CSS、Tailwind CSS'),
                createBulletParagraph('标记语言：HTML5、Markdown'),
                
                new Paragraph({ spacing: { before: 400 } }),
                
                // 五、源程序量
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [new TextRun({ text: '五、源程序量', font: '黑体', size: 32, bold: true })],
                }),
                new Paragraph({ spacing: { before: 200 } }),
                createBulletParagraph('前端源代码：约15,000行（含注释）'),
                createBulletParagraph('组件数量：30+个React组件'),
                createBulletParagraph('页面模块：6个主要功能页面'),
                createBulletParagraph('样式文件：包含主题系统、动画、响应式布局等'),
                
                new Paragraph({ spacing: { before: 400 } }),
                
                // 六、主要功能模块
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [new TextRun({ text: '六、主要功能模块', font: '黑体', size: 32, bold: true })],
                }),
                new Paragraph({ spacing: { before: 200 } }),
                
                createNormalParagraph('1. 智能问答模块', true),
                createBulletParagraph('热门问题推荐、自然语言提问输入'),
                createBulletParagraph('AI逐字流式回答、Markdown内容渲染'),
                createBulletParagraph('教学日历关联提示、微课资源推荐'),
                createBulletParagraph('相关知识点标签跳转、教学团队审核标识'),
                
                // 图2：智能问答流程图
                ...createImageParagraph(images.qa, 650, 180, '图2 智能问答流程图'),
                
                createNormalParagraph('2. 知识图谱模块', true),
                createBulletParagraph('D3.js力导向图画布、节点拖拽与缩放'),
                createBulletParagraph('节点点击高亮与关联显示'),
                createBulletParagraph('知识点详情面板、跨模块跳转'),
                
                createNormalParagraph('3. 学习路径模块', true),
                createBulletParagraph('学习数据统计卡片、六维掌握度雷达图'),
                createBulletParagraph('章节进度条与薄弱点标注'),
                createBulletParagraph('本周学习计划推送、待完成任务列表'),
                createBulletParagraph('个性化推荐、学习报告生成'),
                
                // 图3：学习路径推荐流程图
                ...createImageParagraph(images.path, 650, 180, '图3 学习路径推荐流程图'),
                
                createNormalParagraph('4. 实验辅助模块', true),
                createBulletParagraph('8086汇编代码编辑器、语法高亮'),
                createBulletParagraph('智能调试、错误/警告定位与修复建议'),
                createBulletParagraph('代码对比视图、优化建议与质量评分'),
                
                // 图4：实验调试流程图
                ...createImageParagraph(images.lab, 700, 200, '图4 实验调试流程图'),
                
                createNormalParagraph('5. 自测系统模块', true),
                createBulletParagraph('知识点选择、难度级别选择、题目数量设置'),
                createBulletParagraph('答题进度环形图、题目导航网格'),
                createBulletParagraph('成绩分析、薄弱知识点识别'),
                
                // 图5：自测系统流程图
                ...createImageParagraph(images.quiz, 650, 180, '图5 自测系统流程图'),
                
                createNormalParagraph('6. 教师端模块', true),
                createBulletParagraph('班级活跃度进度条、高频问题TOP10排行榜'),
                createBulletParagraph('知识点掌握度柱状图'),
                createBulletParagraph('教学调整建议自动生成'),
                
                createNormalParagraph('7. 教育理念模块', true),
                createBulletParagraph('十五五规划五大育人理念展示'),
                createBulletParagraph('未来教育八大特点说明'),
                
                createNormalParagraph('8. 视频资源模块', true),
                createBulletParagraph('Bilibili/YouTube视频链接解析'),
                createBulletParagraph('视频分类筛选、在线iframe播放'),
                
                new Paragraph({ spacing: { before: 400 } }),
                
                // 七、创新点
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [new TextRun({ text: '七、创新点', font: '黑体', size: 32, bold: true })],
                }),
                new Paragraph({ spacing: { before: 200 } }),
                createNumberedParagraph('1. 课程深度融合：将课程标准、教学日历、题库、实验指导书四大数据源融合，构建课程专属知识库。'),
                createNumberedParagraph('2. 教-学-评-辅闭环：从知识点学习、练习测试、AI辅导、学习报告形成完整闭环。'),
                createNumberedParagraph('3. 代码级实验支持：提供8086汇编代码编辑与智能调试功能，填补AI教育工具在实验环节的空白。'),
                createNumberedParagraph('4. 多主题响应式设计：支持三种主题切换，暗色科技风格契合计算机课程特点。'),
                createNumberedParagraph('5. 隐私安全并重：学习数据本地存储，不用于模型训练，体现教育伦理责任。'),
                
                new Paragraph({ spacing: { before: 400 } }),
                
                // 八、应用成效
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [new TextRun({ text: '八、应用成效', font: '黑体', size: 32, bold: true })],
                }),
                new Paragraph({ spacing: { before: 200 } }),
                createNormalParagraph('在86名学生的4周试点中：'),
                createBulletParagraph('日均活跃用户：62人'),
                createBulletParagraph('累计问答次数：1,347次'),
                createBulletParagraph('实验代码辅助调用：213次'),
                createBulletParagraph('布尔代数化简模块测验平均分提升：12.3%'),
                createBulletParagraph('指令系统设计模块测验平均分提升：9.7%'),
                createBulletParagraph('满意度：91.2%的学生认为显著提升学习体验'),
                createBulletParagraph('主动探索意愿：86.7%的学生更愿意主动探索课程难点'),
                
                new Paragraph({ spacing: { before: 400 } }),
                
                // 九、软件截图
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [new TextRun({ text: '九、软件截图', font: '黑体', size: 32, bold: true })],
                }),
                new Paragraph({ spacing: { before: 200 } }),
                createNormalParagraph('（此处需附上软件运行截图，建议包括：首页界面、智能问答界面、知识图谱界面、实验辅助界面、自测系统界面、教师端界面）'),
                
                new Paragraph({ spacing: { before: 400 } }),
                
                // 十、申请材料清单
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    children: [new TextRun({ text: '十、申请材料清单', font: '黑体', size: 32, bold: true })],
                }),
                new Paragraph({ spacing: { before: 200 } }),
                createNumberedParagraph('1. 软件著作权登记申请表（在线填写）'),
                createNumberedParagraph('2. 软件鉴别材料：'),
                createBulletParagraph('源程序文档（前30页、后30页，每页不少于50行）', true),
                createBulletParagraph('软件说明书（操作说明或设计说明）', true),
                createNumberedParagraph('3. 申请人身份证明文件：'),
                createBulletParagraph('个人申请：身份证复印件', true),
                createBulletParagraph('单位申请：营业执照副本复印件或组织机构代码证复印件', true),
                createNumberedParagraph('4. 其他证明文件（如有）：'),
                createBulletParagraph('委托开发：委托开发协议', true),
                createBulletParagraph('合作开发：合作开发协议', true),
                createBulletParagraph('职务开发：单位出具的职务开发证明', true),
            ],
        },
    ],
});

// 生成文档
const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(path.join(__dirname, 'docs', '计组智学教育智能体软件著作权申请材料（含流程图）.docx'), buffer);
console.log('Word文档已生成：docs/计组智学教育智能体软件著作权申请材料（含流程图）.docx');