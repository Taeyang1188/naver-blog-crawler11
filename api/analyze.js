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
            args: [...chrome.args, '--no-sandbox', '--disable-setuid-sandbox'],
            executablePath: await chrome.executablePath || '/usr/bin/chromium-browser',
            headless: true
        });

        const page = await browser.newPage();
        
        // 모바일 버전으로 접속!
        const url = `https://m.blog.naver.com/${blogId}/${logNo}`;
        
        await page.goto(url, { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });

        // JavaScript 렌더링 대기
        await page.waitForTimeout(3000);

        let commentCount = 0;
        let likeCount = 0;

        // 댓글 수 추출
        try {
            const commentElement = await page.$('.num__OVfhz');
            if (commentElement) {
                const text = await page.evaluate(el => el.textContent, commentElement);
                commentCount = parseInt(text) || 0;
            }
        } catch (e) {
            console.log('댓글 추출 실패:', e.message);
        }

        // 공감 수 추출
        try {
            const likeElement = await page.$('.u_likeit_text._count.num');
            if (likeElement) {
                const text = await page.evaluate(el => el.textContent, likeElement);
                likeCount = parseInt(text) || 0;
            }
        } catch (e) {
            console.log('공감 추출 실패:', e.message);
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
