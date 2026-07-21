import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel, AlignmentType, convertInchesToTwip, PageNumber, Footer, Header } from 'docx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== 辅助函数 ====================

function createNormalParagraph(text, options = {}) {
    return new Paragraph({
        spacing: { before: options.before || 100, after: options.after || 0 },
        indent: options.indent ? { firstLine: convertInchesToTwip(0.5) } : undefined,
        alignment: options.alignment || AlignmentType.JUSTIFIED,
        children: [
            new TextRun({
                text: text,
                font: '宋体',
                size: options.size || 24,
                bold: options.bold || false,
                color: options.color,
            }),
        ],
    });
}

function createHeading(text, level, options = {}) {
    const sizes = { 1: 32, 2: 28, 3: 24, 4: 22 };
    return new Paragraph({
        heading: level,
        spacing: { before: options.before || 300, after: options.after || 150 },
        children: [
            new TextRun({
                text: text,
                font: '黑体',
                size: sizes[level] || 24,
                bold: true,
                color: '#1a5fb4',
            }),
        ],
    });
}

function createBulletParagraph(text, indentLevel = 0) {
    const indent = convertInchesToTwip(0.25 + indentLevel * 0.3);
    return new Paragraph({
        spacing: { before: 50 },
        indent: { left: indent },
        children: [
            new TextRun({
                text: '• ' + text,
                font: '宋体',
                size: 24,
            }),
        ],
    });
}

function createNumberedParagraph(text, number) {
    return new Paragraph({
        spacing: { before: 80 },
        indent: { left: convertInchesToTwip(0.3) },
        children: [
            new TextRun({
                text: `${number}. `,
                font: '宋体',
                size: 24,
                bold: true,
            }),
            new TextRun({
                text: text,
                font: '宋体',
                size: 24,
            }),
        ],
    });
}

// 分镜表格行
function createSceneRow(sceneNo, sceneTitle, duration, narration, screenContent) {
    return new TableRow({
        children: [
            new TableCell({
                width: { size: 8, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: sceneNo, font: '宋体', size: 20, bold: true })] })],
            }),
            new TableCell({
                width: { size: 14, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: sceneTitle, font: '宋体', size: 20, bold: true })] })],
            }),
            new TableCell({
                width: { size: 8, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: duration, font: '宋体', size: 20 })] })],
            }),
            new TableCell({
                width: { size: 35, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ children: [new TextRun({ text: narration, font: '宋体', size: 20 })] })],
            }),
            new TableCell({
                width: { size: 35, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ children: [new TextRun({ text: screenContent, font: '宋体', size: 20 })] })],
            }),
        ],
    });
}

// 分镜表头
function createSceneHeader() {
    return new TableRow({
        tableHeader: true,
        children: [
            new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '序号', font: '黑体', size: 20, bold: true, color: '#ffffff' })] })],
                shading: { fill: '#1a5fb4' }
            }),
            new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '场景', font: '黑体', size: 20, bold: true, color: '#ffffff' })] })],
                shading: { fill: '#1a5fb4' }
            }),
            new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '时长', font: '黑体', size: 20, bold: true, color: '#ffffff' })] })],
                shading: { fill: '#1a5fb4' }
            }),
            new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '旁白/台词', font: '黑体', size: 20, bold: true, color: '#ffffff' })] })],
                shading: { fill: '#1a5fb4' }
            }),
            new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '画面内容/操作', font: '黑体', size: 20, bold: true, color: '#ffffff' })] })],
                shading: { fill: '#1a5fb4' }
            }),
        ],
    });
}

// ==================== 分镜数据 ====================

const scenes = [
    { no: '1', title: '开场', duration: '60秒',
        narration: '大家好，欢迎观看计组智学教育智能体演示视频。计组智学是为计算机组成原理课程量身打造的AI辅导平台，深度契合十五五教育规划五大育人理念：立德树人、科教融汇、拔尖创新、多元协同和质量导向。',
        screen: '展示产品名称和Logo，背景为科技风格动画，逐渐显示系统主界面。' },
    { no: '2', title: '系统架构', duration: '60秒',
        narration: '系统采用三层架构设计。底层融合课程标准、教学日历、超星题库和实验指导书四大数据源。中层部署AI对话引擎、个性化推荐算法和代码调试引擎三大核心引擎。上层提供智能问答、知识图谱、学习路径、实验辅助、自测系统和教师端六大功能模块。',
        screen: '三层架构图动画展示，从数据层、引擎层到应用层依次出现，各层模块名称逐一显示。' },
    { no: '3', title: '智能问答·提问与回答', duration: '60秒',
        narration: '首先是智能问答模块。页面顶部展示热门问题，每个问题带有知识点标签，如基础、难点、重点等。学生输入问题后，AI逐字呈现回答，支持Markdown格式，包含标题、加粗关键词和有序列表，提供清晰的表格对比。',
        screen: '切换到智能问答页面，展示热门问题列表，点击其中一个问题，AI逐字输出回答，展示表格、列表等格式。' },
    { no: '4', title: '智能问答·关联与审核', duration: '60秒',
        narration: 'AI回答底部自动关联教学日历，标注第几周的学习内容。下方推荐关联微课资源，区分视频、文档和练习三种类型。相关知识点标签可点击跳转到知识图谱。每条回答都有教学团队已审核标识。输入框下方还有隐私提示，学习数据本地化存储，不用于模型训练。',
        screen: '滚动到回答底部，展示教学日历关联、微课资源推荐、知识点标签，以及审核标识和隐私声明。' },
    { no: '5', title: '知识图谱·画布交互', duration: '60秒',
        narration: '知识图谱模块展示课程核心概念及其关联关系。画布支持拖拽平移和滚轮缩放，有网格背景和粒子漂浮效果。画布中有CPU、运算器、控制器、存储器等十个核心节点，用不同颜色区分类别。点击任意节点，关联节点和连线自动高亮，未关联的变暗，连线上显示关系文字。',
        screen: '切换到知识图谱页面，展示完整图谱，拖拽画布、滚轮缩放，点击CPU节点，关联节点高亮显示。' },
    { no: '6', title: '知识图谱·详情与路径', duration: '60秒',
        narration: '右侧详情面板展示选中节点的名称、分类标签和详细描述。下方提供两个跨模块跳转按钮：在问答中提问和做相关练习，实现知识图谱与问答、自测的无缝衔接。关联知识点列表支持点击切换。下方还有五步学习路径建议，从数据表示到IO系统逐步推进。左下角图例展示知识点分类颜色。',
        screen: '展示右侧详情面板，点击跨模块跳转按钮，展示学习路径建议和图例。' },
    { no: '7', title: '学习路径·统计与进度', duration: '60秒',
        narration: '学习路径模块是教-学-评-辅闭环的核心。顶部展示七个学习数据统计卡片，包括总学习时长、总体进度、已答题数、正确率、活跃天数、累计问答和实验调试次数。雷达图直观呈现六维掌握度。各章节进度条展示学习进度和掌握度，薄弱知识点用红色标签标注。',
        screen: '切换到学习路径页面，展示统计卡片、雷达图、章节进度条和薄弱点标注。' },
    { no: '8', title: '学习路径·计划与报告', duration: '60秒',
        narration: '系统根据教学日历自动推送本周学习计划，分课前预习和课后巩固两类任务，均可勾选完成。待完成任务列表按类型分类，涵盖预习、练习、实验和复习，显示截止日期。个性化推荐区提供薄弱点突破、拓展阅读和实验预习建议。点击生成学习报告，可查看学习概况、优势知识点、薄弱知识点、实验表现等维度的评分和改进建议。',
        screen: '展示本周学习计划、待完成任务列表、个性化推荐区，点击生成学习报告，展示报告详情。' },
    { no: '9', title: '实验辅助·编辑器', duration: '60秒',
        narration: '实验辅助模块为学生提供代码级支持。左侧列出实验项目，点击切换不同实验。中间代码编辑器支持8086汇编语法高亮，关键字、寄存器和数字用不同颜色标注。工具栏提供上传代码按钮，可直接上传汇编文件，还有重置和复制功能。',
        screen: '切换到实验辅助页面，展示实验项目列表，代码编辑器中的汇编代码及语法高亮效果。' },
    { no: '10', title: '实验辅助·调试与对比', duration: '60秒',
        narration: '点击智能调试按钮后，右侧显示调试结果。错误用红色标记，显示行号和修复建议。警告用黄色标记。点击查看修复建议代码，弹出代码对比视图，左原始右修复，红色标记删除行，绿色标记新增行。下方还有优化建议和代码质量评分。',
        screen: '点击智能调试按钮，展示调试结果面板，点击代码对比，展示左右对比视图和质量评分。' },
    { no: '11', title: '自测系统·抽题配置', duration: '60秒',
        narration: '自测系统支持按知识点和难度动态抽题。首先选择知识点，如Cache映射、IEEE754、DMA方式等十二个知识点可选。然后选择难度级别，包括简单、中等和困难。再设置题目数量，5到20题可选。底部显示题库匹配结果，确认后点击开始答题。',
        screen: '切换到自测系统页面，依次选择知识点、难度、题目数量，展示题库匹配结果，点击开始答题。' },
    { no: '12', title: '自测系统·答题与成绩', duration: '60秒',
        narration: '答题界面左侧显示答题进度环形图和题目导航网格，支持收藏标记。中间展示题目内容、难度和知识点标签，选项支持单选和多选。提交后展示成绩分析，包括正确题数、正确率和用时，并识别薄弱知识点，提供重新抽题和查看解析功能。',
        screen: '展示答题界面，包括进度环、题目导航、题目选项，提交后展示成绩分析页面。' },
    { no: '13', title: '教师端·班级与问题', duration: '60秒',
        narration: '教师端提供学情分析仪表盘。班级统计卡片展示各班活跃用户进度条、平均分和完成率对比。高频问题TOP10排行帮助教师快速了解学生困惑集中点，每条问题带有分类标签和趋势箭头，进度条直观展示提问频次。',
        screen: '切换到教师端页面，展示班级统计卡片和高频问题TOP10排行榜。' },
    { no: '14', title: '教师端·柱状图与建议', duration: '60秒',
        narration: '知识点掌握度柱状图用渐变色直观展示各模块掌握情况。系统根据高频问题趋势自动生成教学调整建议，为教学优化提供数据支撑。例如Cache映射相关提问上升22%，建议增加课堂练习时间。',
        screen: '展示知识点掌握度柱状图和教学调整建议列表。' },
    { no: '15', title: '应用成效', duration: '60秒',
        narration: '在86名学生的4周试点中，智能体日均活跃用户62人，累计回答问题1347次，实验代码辅助调用213次。布尔代数化简和指令系统设计两个难点模块的随堂测验平均分分别提升12.3%和9.7%。满意度调查显示，91.2%的学生认为智能体显著提升学习体验，86.7%表示更愿意主动探索课程难点。',
        screen: '数据图表动画展示，包括活跃用户数、问答次数、成绩提升百分比、满意度数据等。' },
    { no: '16', title: '总结', duration: '60秒',
        narration: '计组智学教育智能体，实现了AI技术与专业课程的深度耦合，积极实践未来教育八大特点：从工具理性向人的复归、个性化学习与人机协同、教师角色转型、泛在化学习、跨学科融合、能力本位评价、技术赋能教育公平、社交化学习生态。知识深度融合教学日历，教-学-评-辅形成闭环，数据安全并重，架构可迁移至数据结构、操作系统等课程。谢谢！试用平台，可以访问：http://159.138.92.82/qa',
        screen: '回到产品主界面，展示总结文字和试用链接，渐隐结束。' },
];

// ==================== 构建文档 ====================

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
                new Paragraph({ spacing: { before: 2500 } }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: '计组智学教育智能体', font: '黑体', size: 72, bold: true, color: '#1a5fb4' }),
                    ],
                }),
                new Paragraph({ spacing: { before: 200 } }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: '演示视频录制脚本', font: '黑体', size: 44, color: '#3584e4' }),
                    ],
                }),
                new Paragraph({ spacing: { before: 1500 } }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: '版本：V1.0', font: '宋体', size: 28 }),
                    ],
                }),
                new Paragraph({ spacing: { before: 200 } }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: '总时长：约16分钟', font: '宋体', size: 28 }),
                    ],
                }),
                new Paragraph({ spacing: { before: 200 } }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: '编制日期：2026年07月', font: '宋体', size: 28 }),
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
                headers: {
                    default: new Header({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.RIGHT,
                                children: [
                                    new TextRun({ text: '计组智学教育智能体 - 演示视频录制脚本', font: '宋体', size: 18, color: '#666666' }),
                                ],
                            }),
                        ],
                    }),
                },
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({ children: [PageNumber.CURRENT], font: '宋体', size: 18, color: '#666666' }),
                                    new TextRun({ text: ' / ', font: '宋体', size: 18, color: '#666666' }),
                                    new TextRun({ children: [PageNumber.TOTAL_PAGES], font: '宋体', size: 18, color: '#666666' }),
                                ],
                            }),
                        ],
                    }),
                },
            },
            children: [
                // 一、视频概述
                createHeading('一、视频概述', HeadingLevel.HEADING_1),
                createNormalParagraph('本视频是计组智学教育智能体的产品演示视频，旨在向观众全面展示系统的功能架构、核心模块和应用价值。', { indent: true }),

                createHeading('1.1 视频目标', HeadingLevel.HEADING_2),
                createBulletParagraph('展示计组智学教育智能体的整体架构和核心功能'),
                createBulletParagraph('演示各模块的主要操作流程和交互效果'),
                createBulletParagraph('突出产品特色和创新点'),
                createBulletParagraph('呈现试点应用成效和数据'),

                createHeading('1.2 目标受众', HeadingLevel.HEADING_2),
                createBulletParagraph('高校计算机专业教师和教学管理者'),
                createBulletParagraph('学习计算机组成原理课程的学生'),
                createBulletParagraph('教育技术和AI教育领域从业者'),
                createBulletParagraph('潜在合作方和投资人'),

                createHeading('1.3 视频参数', HeadingLevel.HEADING_2),
                createBulletParagraph('总时长：约16分钟（16个场景，每个约60秒）'),
                createBulletParagraph('分辨率：1920×1080（全高清）'),
                createBulletParagraph('帧率：30fps'),
                createBulletParagraph('格式：MP4（H.264编码）'),
                createBulletParagraph('配音：中文普通话，语速适中'),
                createBulletParagraph('背景音乐：轻科技风格，低音量不干扰旁白'),

                // 二、视频结构
                createHeading('二、视频结构', HeadingLevel.HEADING_1),
                createNormalParagraph('视频采用"总—分—总"的叙事结构，分为三个部分：', { indent: true }),

                createHeading('2.1 开篇部分（场景1-2，约2分钟）', HeadingLevel.HEADING_2),
                createBulletParagraph('开场介绍：问候、产品定位、教育理念'),
                createBulletParagraph('系统架构：三层架构设计说明'),

                createHeading('2.2 主体部分（场景3-14，约12分钟）', HeadingLevel.HEADING_2),
                createBulletParagraph('智能问答模块（2个场景）：提问回答、关联推荐'),
                createBulletParagraph('知识图谱模块（2个场景）：画布交互、详情路径'),
                createBulletParagraph('学习路径模块（2个场景）：统计进度、计划报告'),
                createBulletParagraph('实验辅助模块（2个场景）：编辑器、调试对比'),
                createBulletParagraph('自测系统模块（2个场景）：抽题配置、答题成绩'),
                createBulletParagraph('教师端模块（2个场景）：班级问题、柱状图建议'),

                createHeading('2.3 结尾部分（场景15-16，约2分钟）', HeadingLevel.HEADING_2),
                createBulletParagraph('应用成效：试点数据展示'),
                createBulletParagraph('总结展望：教育理念、试用信息'),

                // 三、分镜脚本表
                createHeading('三、分镜脚本表', HeadingLevel.HEADING_1),
                createNormalParagraph('以下为详细的分镜脚本，包含场景序号、场景名称、时长、旁白台词和画面内容说明。', { indent: true }),

                // 分镜表
                new Paragraph({ spacing: { before: 200 } }),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                        createSceneHeader(),
                        ...scenes.map(s => createSceneRow(s.no, s.title, s.duration, s.narration, s.screen)),
                    ],
                }),

                // 四、录制准备工作
                createHeading('四、录制准备工作', HeadingLevel.HEADING_1),

                createHeading('4.1 环境准备', HeadingLevel.HEADING_2),
                createBulletParagraph('确保开发服务器正常运行，访问地址正确'),
                createBulletParagraph('浏览器设置：Chrome浏览器，窗口最大化，关闭书签栏和扩展栏'),
                createBulletParagraph('系统主题：默认暗色科技主题（如无特别说明）'),
                createBulletParagraph('屏幕分辨率：1920×1080或更高'),
                createBulletParagraph('关闭通知、弹窗等可能干扰录制的程序'),

                createHeading('4.2 录制工具', HeadingLevel.HEADING_2),
                createBulletParagraph('录屏软件：OBS Studio / Bandicam / 剪映专业版'),
                createBulletParagraph('麦克风：确保音质清晰，无背景噪音'),
                createBulletParagraph('视频参数：1080p，30fps，MP4格式'),

                createHeading('4.3 录制前检查清单', HeadingLevel.HEADING_2),
                createNumberedParagraph('确认所有页面功能正常，数据加载完整', 1),
                createNumberedParagraph('准备好旁白稿，建议先通读2-3遍', 2),
                createNumberedParagraph('测试麦克风录音效果，调整音量', 3),
                createNumberedParagraph('关闭电脑通知、QQ、微信等弹窗', 4),
                createNumberedParagraph('清理浏览器缓存，确保页面加载速度', 5),
                createNumberedParagraph('预留充足硬盘空间（建议10GB以上）', 6),

                // 五、录制技巧与注意事项
                createHeading('五、录制技巧与注意事项', HeadingLevel.HEADING_1),

                createHeading('5.1 画面录制技巧', HeadingLevel.HEADING_2),
                createBulletParagraph('操作速度适中，不宜过快，确保观众能看清内容'),
                createBulletParagraph('鼠标移动要平稳，避免快速晃动'),
                createBulletParagraph('重要内容可以适当停留2-3秒'),
                createBulletParagraph('点击操作要准确，避免误操作后反复纠正'),
                createBulletParagraph('滚动页面时速度均匀，不要快速翻动'),

                createHeading('5.2 配音录制技巧', HeadingLevel.HEADING_2),
                createBulletParagraph('语速：每分钟约150-180字，清晰自然'),
                createBulletParagraph('语气：专业、自信、有亲和力'),
                createBulletParagraph('提前练习旁白稿，熟悉内容避免卡顿'),
                createBulletParagraph('录音时保持与麦克风的距离一致'),
                createBulletParagraph('每段录制前稍作停顿，方便后期剪辑'),

                createHeading('5.3 后期制作建议', HeadingLevel.HEADING_2),
                createBulletParagraph('添加字幕：建议添加中文字幕，便于理解'),
                createBulletParagraph('背景音乐：选择轻科技风格，音量低于旁白'),
                createBulletParagraph('转场效果：场景切换使用淡入淡出，简洁自然'),
                createBulletParagraph('重点标注：关键数据和功能点可用箭头、圆圈等标注'),
                createBulletParagraph('片头片尾：添加产品Logo和版权信息'),

                // 六、后期剪辑流程
                createHeading('六、后期剪辑流程', HeadingLevel.HEADING_1),
                createNumberedParagraph('素材整理：将录制的原始素材按场景编号整理', 1),
                createNumberedParagraph('粗剪：按照分镜表顺序拼接各场景片段', 2),
                createNumberedParagraph('配音：导入旁白音频，与画面对齐', 3),
                createNumberedParagraph('精剪：调整节奏，删除冗余片段，确保画面与旁白同步', 4),
                createNumberedParagraph('字幕：添加中文字幕，校对文字准确性', 5),
                createNumberedParagraph('特效：添加转场效果、标注动画等', 6),
                createNumberedParagraph('配乐：添加背景音乐，调整音量平衡', 7),
                createNumberedParagraph('调色：统一画面色调，确保视觉一致性', 8),
                createNumberedParagraph('片头片尾：制作开场和结束画面', 9),
                createNumberedParagraph('导出：输出1080p MP4格式，检查音画同步', 10),

                // 七、附录
                createHeading('七、附录', HeadingLevel.HEADING_1),

                createHeading('7.1 旁白全文', HeadingLevel.HEADING_2),
                new Paragraph({ spacing: { before: 100 } }),
                ...scenes.map(s => [
                    new Paragraph({
                        spacing: { before: 150 },
                        children: [
                            new TextRun({ text: `【场景${s.no}：${s.title}】`, font: '黑体', size: 22, bold: true, color: '#1a5fb4' }),
                        ],
                    }),
                    new Paragraph({
                        spacing: { before: 50 },
                        indent: { firstLine: convertInchesToTwip(0.5) },
                        children: [
                            new TextRun({ text: s.narration, font: '宋体', size: 22 }),
                        ],
                    }),
                ]).flat(),

                createHeading('7.2 关键时间点', HeadingLevel.HEADING_2),
                new Paragraph({ spacing: { before: 100 } }),
                ...(() => {
                    let totalSeconds = 0;
                    return scenes.map(s => {
                        const time = formatTime(totalSeconds);
                        totalSeconds += 60;
                        return createBulletParagraph(`${time} - 场景${s.no}：${s.title}`);
                    });
                })(),

                createHeading('7.3 相关文件', HeadingLevel.HEADING_2),
                createBulletParagraph('演示PPT：计组智学演讲PPT.html'),
                createBulletParagraph('操作手册：计组智学操作手册.md'),
                createBulletParagraph('Demo页面：src/pages/DemoPage.tsx'),
                createBulletParagraph('项目代码：jizu-zhixue/'),
            ],
        },
    ],
});

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 生成文档
const buffer = await Packer.toBuffer(doc);
const outputPath = path.join(__dirname, 'docs', '计组智学演示视频录制脚本.docx');
fs.writeFileSync(outputPath, buffer);
console.log('Word文档已生成：', outputPath);