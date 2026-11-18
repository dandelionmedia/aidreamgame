# AI 꿈 탐험 게임 교실 V4 — GitHub Pages 배포 안내

## 포함 파일
- `index.html` : 학생/강사용 단일 웹페이지
- `style.css` : 입체형 3D 스타일 및 태블릿 반응형 디자인
- `app.js` : 날짜 자동 인식, 8개 미션, 수료 화면, 강사용 현황판
- `backend.js` : Firebase Firestore 및 데모 저장 구현
- `firebase-config.js` : Firebase 웹앱 공개 설정 (처음에는 자리표시자)
- `firestore.rules` : 학생별 접근과 강사 권한을 제한하는 Firestore 보안 규칙
- `.nojekyll` : GitHub Pages 정적 파일 배포용

## 단계 1 — GitHub Pages에서 디자인/게임부터 실행
1. GitHub에서 **공개(Public)** 저장소 `aidreamgame`을 새로 만듭니다.
2. 이 ZIP의 파일들을 압축 해제하여 **저장소 최상위(루트)**에 모두 업로드합니다. ZIP 파일 자체를 올리는 것이 아닙니다.
3. GitHub 저장소 **Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save**.
4. 수 분 후 `https://계정명.github.io/aidreamgame/` 주소에 접속합니다.
5. Firebase 설정 전에는 **데모 모드**로 열립니다. 데모에서는 날짜 선택이 가능하고 결과는 **접속한 태블릿의 브라우저에만** 저장됩니다. 다른 기기와 실시간 결과가 공유되지 않습니다. 

## 단계 2 — Firebase 프로젝트 준비(여러 학생 동시 참여용, 반드시 필요)
1. https://console.firebase.google.com/ 에서 새 프로젝트를 만듭니다.
2. 프로젝트에 **웹 앱(</>)**을 등록합니다. 앱의 `firebaseConfig` 값을 복사하여 `firebase-config.js`의 네 항목 `apiKey`, `authDomain`, `projectId`, `appId`에 입력합니다. 이 값은 공개 설정입니다. **서비스 계정 비공개 키, 관리자 비밀번호는 절대 GitHub에 올리지 마세요.**
3. **Authentication → Sign-in method**에서 **Anonymous**와 **Email/Password**를 활성화합니다.
4. **Authentication → Users → Add user**에서 선생님용 이메일/비밀번호 계정을 생성합니다. 일반 학생 계정은 만들지 않습니다.
5. 해당 선생님 계정의 **User UID**를 복사합니다.
6. **Firestore Database**를 만들고 운영 지역을 선택합니다. 테스트 모드가 아니라 보안 규칙을 적용한 운영을 사용하세요.
7. `firestore.rules`에서 `REPLACE_WITH_TEACHER_UID`를 5번의 실제 UID로 바꾼 뒤 **Firestore Database → Rules**에 전체 규칙을 붙여넣고 **Publish**합니다.
8. `firebase-config.js` 파일을 저장소에 업데이트하고, GitHub Pages의 새 버전이 반영되면 학생 화면에 `🟢 실시간 연결`이 나타납니다.
9. 강사는 오른쪽 위 **선생님** 메뉴로 들어가 Firebase Authentication에 등록한 이메일/비밀번호로 로그인합니다. 학생은 이메일 없이 익명 인증으로 참가합니다.

### 개인정보 및 접근권한
- 학생에게 **실명 대신 별명** 사용을 안내합니다.
- Firebase 익명 로그인 UID로 학생별 기록을 구분합니다. 다른 학생의 기록을 읽거나 수정하지 못하도록 Firestore 규칙으로 제한합니다.
- 강사용 현황은 위에서 지정한 UID만 조회할 수 있습니다. 교사 화면으로 이동하는 버튼 자체는 공개되어도 데이터 접근은 보안 규칙으로 막혀 있습니다.
- 같은 기기에서 `다른 학생`을 누르면 다른 익명 인증 계정을 생성하며 이전 기록은 Firestore에 보존됩니다.
- 선생님 기기는 학생 기기와 **별도 기기**로 사용해 주세요. 같은 기기에서 선생님 로그인하면 학생 익명 인증 상태가 바뀝니다.
- 교육 종료 후 보관 기간을 정하고 Firestore 데이터 삭제 정책을 운영자가 관리해야 합니다. 현재 버전에 자동 삭제 기능은 없습니다.
- 보안 규칙은 수업 날짜 **한국시간 00:00~24:00**에만 새로운 학생 기록 생성이 가능하도록 제한했습니다. 교육 전날 실제 다중기기 테스트는 데모 모드 또는 Firebase Emulator에서 진행하세요.

## 날짜별 자동 표시
- 2026.11.19: 마장아이꿈누리터 (예정 12명, 준비 기준 22명)
- 2026.11.20: 서울금북초등학교 (예정 20명, 준비 기준 30명)
- 2026.11.25: 서울행현초등학교 (예정 18명, 준비 기준 28명)
- 실시간 모드에서는 **한국시간 기준 해당 날짜의 기관만** 표시되며 다른 날짜 학생 등록은 할 수 없습니다.
- 준비 기준 인원을 넘더라도 등록 제한은 없습니다. 실제 한도는 Firebase 서비스 이용량/할당량의 영향을 받을 수 있습니다.
- 데모 모드에서는 날짜 변경이 가능해 수업 전 사전 리허설을 할 수 있습니다. 실제 교육용 실시간 모드에서는 날짜 선택이 숨겨집니다.

## 운영 전 필수 점검
- 학생 2개 태블릿에서 각각 별명 등록, 게임 1 완료 후 선생님 현황에 **2명** 반영되는지 확인
- 각 태블릿에서 순서대로 8개 게임을 완료할 수 있는지 확인
- 브라우저 새로고침 후 현재 단계가 복원되는지 확인
- 강사가 잘못된 비밀번호로는 현황을 조회할 수 없는지 확인
- Firebase 콘솔에서 Firestore Rules가 게시되어 있는지 확인
- 수업 당일에도 무료 Firebase 요금제 사용량 제한 및 학교 Wi-Fi 접속 상태 확인

## QR 코드
- 배포된 GitHub Pages 주소를 QR 생성기에 입력합니다. 날짜별 URL을 나누지 않아도 해당 날짜 학교가 자동 표시됩니다.
- 이 프로젝트의 기본 진입 주소는 GitHub Pages 저장소 URL입니다.

## 기능 범위와 제약
- 외부 생성형 AI API를 호출하지 않습니다. 8번 게임의 작품은 선택한 캐릭터와 문장을 **6장면으로 자동 재생**하는 학습용 시뮬레이션입니다. 별도의 MP4 다운로드 기능은 없습니다.
- 미리보기 모드의 데이터는 브라우저 로컬 저장소로 관리되어 다른 태블릿과 공유되지 않습니다.
- Firebase 연결 후에는 Firestore 실시간 구독으로 강사용 통계가 갱신됩니다.
- GitHub Pages는 정적 사이트이며 Firebase 서버 기능은 별도 서비스입니다.

## 오류 대처
- `Missing or insufficient permissions`: Firestore Rules에 선생님 UID가 정확히 들어갔는지, 익명 로그인 및 이메일 로그인이 활성화되어 있는지 확인
- `auth/operation-not-allowed`: Authentication에서 Anonymous 또는 Email/Password 활성화 확인
- `Firebase 연결에 실패했습니다`: `firebase-config.js` 오타, 프로젝트 ID, 네트워크, 브라우저 콘솔 확인
- 기존 Google Apps Script의 Google Sheets 데이터는 **자동 이관되지 않습니다**. 이번 V4는 신규 Firebase 저장 구조입니다.
