# Closify 웹앱 배포 가이드

이 폴더를 Vercel에 올리면 `https://closify-xxx.vercel.app` 같은 주소의 사이트가 생깁니다.
휴대폰에서 열고 "홈 화면에 추가"를 누르면 앱처럼 쓸 수 있어요.

## 폴더 구성
- `public/index.html` : 앱 화면 전체
- `public/manifest.json`, `public/sw.js`, `public/icons/` : 홈 화면 추가(PWA)용
- `api/ai.js` : AI 분석을 처리하는 서버 함수 (API 키를 숨기기 위해 필요)

## 1. GitHub에 올리기 (코딩 없이 가능)
1. github.com 로그인 → 오른쪽 위 `+` → New repository → 이름 `closify-web` → Create
2. "uploading an existing file" 클릭 → 이 폴더 안의 파일·폴더를 전부 끌어다 놓기 → Commit

## 2. Vercel로 배포
1. vercel.com → GitHub 계정으로 로그인
2. Add New → Project → `closify-web` 선택 → Import
3. 설정은 그대로 두고 Deploy → 1분 뒤 주소가 나옵니다

## 3. AI 연결 (API 키)
키가 없으면 AI 대신 데모 응답이 나옵니다. 실제 AI를 쓰려면:
1. console.anthropic.com 에서 API 키 발급, 결제 수단 등록 후 **월 사용 한도(Spend limit)를 꼭 설정**
2. Vercel 프로젝트 → Settings → Environment Variables
   - Name: `ANTHROPIC_API_KEY` / Value: 발급받은 키
3. Deployments → 최신 배포 오른쪽 `⋯` → Redeploy
- 모델을 바꾸려면 환경변수 `CLAUDE_MODEL` 을 추가 (기본값 `claude-haiku-5-5`)
- **API 키를 index.html 등 코드에 직접 넣지 마세요.** 누구나 볼 수 있게 됩니다.

## 4. Google Analytics 연결
1. analytics.google.com → 관리 → 속성 만들기 → 데이터 스트림 → 웹 → 배포된 주소 입력
2. 나오는 측정 ID(`G-XXXXXXXXXX`) 복사
3. `public/index.html` 위쪽의 `window.GA_ID = "";` 를 `window.GA_ID = "G-XXXXXXXXXX";` 로 수정
   (GitHub에서 파일 열고 연필 아이콘으로 수정 → Commit 하면 Vercel이 자동 재배포)
4. GA → 보고서 → 실시간에서 이벤트가 들어오는지 확인
   - 퍼널 추천: `onboarding_complete` → `consult_submit` → `mission_accept` → `mission_result` → `begin_checkout` → `purchase`

## 알아 둘 점
- 기록은 각자 휴대폰 브라우저에 저장됩니다. 다른 기기와 동기화되지 않고, 브라우저 데이터를 지우면 사라져요.
- 로그인·결제는 화면만 있는 프로토타입입니다. 실제 결제는 일어나지 않아요.
- 음성 입력은 안드로이드 크롬에서 잘 되고, 아이폰 사파리는 지원이 제한적입니다.
- 공개 주소라 누구나 AI를 호출할 수 있어요. 베타 기간에는 Anthropic 콘솔의 사용 한도로 비용을 막아 두세요.
