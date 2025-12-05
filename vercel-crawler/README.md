# 네이버 블로그 크롤러 API

Vercel 서버리스로 네이버 블로그 댓글/공감 수집

## 🚀 배포

1. GitHub에 업로드
2. Vercel에서 Import
3. 자동 배포

## 📡 API 사용

```
GET https://your-project.vercel.app/api/analyze?blogId=halfwatermelon&logNo=224098498972
```

### 응답:
```json
{
  "success": true,
  "blogId": "halfwatermelon",
  "logNo": "224098498972",
  "commentCount": 2,
  "likeCount": 5,
  "url": "https://blog.naver.com/halfwatermelon/224098498972"
}
```

## 🔧 로컬 테스트

```bash
npm install
vercel dev
```

## ⚡ 특징

- Puppeteer로 동적 렌더링 처리
- CORS 허용
- 무료 (Vercel 무료 티어)
- 응답 시간: 5~10초
