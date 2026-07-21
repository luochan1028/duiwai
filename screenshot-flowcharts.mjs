import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function screenshotFlowcharts() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // 打开HTML文件
    const htmlPath = path.join(__dirname, 'docs', '计组智学教育智能体软件著作权申请材料.html');
    await page.goto('file:///' + htmlPath.replace(/\\/g, '/'));
    
    // 等待页面加载
    await page.waitForLoadState('networkidle');
    
    // 截图5个流程图
    const flowcharts = [
        { selector: '.flowchart-container:nth-of-type(1)', filename: 'flowchart-1-architecture.png', title: '图1 系统架构图' },
        { selector: '.flowchart-container:nth-of-type(2)', filename: 'flowchart-2-qa.png', title: '图2 智能问答流程图' },
        { selector: '.flowchart-container:nth-of-type(3)', filename: 'flowchart-3-path.png', title: '图3 学习路径推荐流程图' },
        { selector: '.flowchart-container:nth-of-type(4)', filename: 'flowchart-4-lab.png', title: '图4 实验调试流程图' },
        { selector: '.flowchart-container:nth-of-type(5)', filename: 'flowchart-5-quiz.png', title: '图5 自测系统流程图' },
    ];
    
    const screenshotsDir = path.join(__dirname, 'docs', 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    
    for (const flowchart of flowcharts) {
        const element = await page.locator(flowchart.selector);
        await element.screenshot({ 
            path: path.join(screenshotsDir, flowchart.filename),
            type: 'png'
        });
        console.log(`已截图: ${flowchart.title}`);
    }
    
    await browser.close();
    console.log('所有流程图截图完成！');
}

screenshotFlowcharts().catch(console.error);