import puppeteer from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';

export default async function handler(req, res) {
    // CORS 허용
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { blogId, logNo } = req.query;

    if (!blogId || !logNo) {
        return res.status(400).json({ 
            error: 'blogId와 logNo 필요',
            example: '/api/analyze?blogId=halfwatermelon&logNo=224098498972'
        });
    }

    try {
        const browser = await puppeteer.launch({
            args: chrome.args,
            executablePath: await chrome.executablePath,
            headless: true
        });

        const page = await browser.newPage();
        const url = `https://blog.naver.com/${blogId}/${logNo}`;
        
        await page.goto(url, { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });

        // iframe으로 이동
        const frames = page.frames();
        const mainFrame = frames.find(f => f.url().includes('PostView'));

        let commentCount = 0;
        let likeCount = 0;

        if (mainFrame) {
            // 댓글 수
            try {
                const commentElement = await mainFrame.$('.num__OVfhz');
                if (commentElement) {
                    commentCount = parseInt(await mainFrame.evaluate(el => el.textContent, commentElement)) || 0;
                }
            } catch (e) {}

            // 공감 수
            try {
                const likeElement = await mainFrame.$('.u_likeit_text._count.num');
                if (likeElement) {
                    likeCount = parseInt(await mainFrame.evaluate(el => el.textContent, likeElement)) || 0;
                }
            } catch (e) {}
        }

        await browser.close();

        return res.status(200).json({
            success: true,
            blogId,
            logNo,
            commentCount,
            likeCount,
            url
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            blogId,
            logNo
        });
    }
}
