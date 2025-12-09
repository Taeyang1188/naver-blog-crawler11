# 🚀 GitHub + Vercel 배포 가이드

## 📦 Step 1: GitHub에 업로드

### 방법 1: GitHub Desktop (쉬움)
```
1. GitHub Desktop 실행
2. File → New Repository
3. Name: naver-blog-crawler
4. Local Path: vercel-crawler 폴더 선택
5. Create Repository
6. Publish Repository
```

### 방법 2: Git CLI
```bash
cd vercel-crawler
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/naver-blog-crawler.git
git push -u origin main
```

---

## ⚡ Step 2: Vercel 배포

```
1. Vercel 로그인
2. Add New → Project
3. Import Git Repository 
4. 방금 만든 naver-blog-crawler 선택
5. Deploy 클릭
6. 완료! (자동 배포됨)
```

---

## 🎯 Step 3: API URL 확인

배포 완료 후:
```
https://naver-blog-crawler-xxx.vercel.app/api/analyze
```

테스트:
```
https://naver-blog-crawler-xxx.vercel.app/api/analyze?blogId=halfwatermelon&logNo=224098498972
```

---

## 🔧 Step 4: 탬퍼몽키 연동

v19.5 스크립트에서 API 호출:

```javascript
const response = await fetch(
    `https://your-project.vercel.app/api/analyze?blogId=${blogId}&logNo=${logNo}`
);
const data = await response.json();

console.log('댓글:', data.commentCount);
console.log('공감:', data.likeCount);
```

---

## ✅ 완료!

이제 탬퍼몽키 → Vercel API → 정확한 댓글/공감!
