# FAN:STAGE - 음악 팬 커뮤니티 플랫폼

팬이 만드는 음악 생태계, FAN:STAGE의 전체 스택 애플리케이션입니다.

## 프로젝트 소개

FAN:STAGE는 개성 있는 인디/신인 아티스트와 진짜 음악 팬을 연결하는 커뮤니티 플랫폼입니다. 팬의 큐레이션이 곧 발견 알고리즘이 되어, 자본 없는 아티스트도 자연스럽게 발견되고 팬들은 자신이 발굴한 아티스트를 효과적으로 응원할 수 있습니다.

## 기술 스택

### 프론트엔드
- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **React Router** - 라우팅
- **Axios** - HTTP 클라이언트
- **Context API** - 상태 관리

### 백엔드
- **Node.js** - 런타임 환경
- **Express** - 웹 프레임워크
- **MongoDB** - 데이터베이스
- **Mongoose** - ODM
- **JWT** - 인증
- **bcryptjs** - 비밀번호 암호화

## 시작하기

### 사전 요구사항

- Node.js 18+ 
- MongoDB (로컬 또는 MongoDB Atlas)

### 설치

1. 저장소 클론 및 의존성 설치:
```bash
npm install
```

2. 환경 변수 설정:
```bash
# server/.env 파일 생성
cp server/.env.example server/.env

# .env 파일 수정 (필요시)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fanstage
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

3. 프론트엔드 환경 변수 설정:
```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 수정
VITE_API_URL=http://localhost:5000/api
```

### 실행

**개발 모드:**

터미널 1 - 백엔드 서버:
```bash
npm run server:dev
```

터미널 2 - 프론트엔드 개발 서버:
```bash
npm run dev
```

- 프론트엔드: http://localhost:5173
- 백엔드 API: http://localhost:5000

**프로덕션 빌드:**

```bash
# 프론트엔드 빌드
npm run build

# 백엔드 실행
npm run server
```

## 주요 기능

### MVP 기능 (구현 완료)

1. **사용자 인증**
   - 회원가입/로그인
   - JWT 기반 인증
   - 팬/아티스트 계정 구분

2. **음악 스트리밍**
   - 곡 업로드 (아티스트)
   - 곡 재생 (백그라운드 재생 지원)
   - 플레이리스트 생성/편집
   - 재생 큐 관리

3. **팬 큐레이션 피드**
   - 플레이리스트 생성 시 자동 피드 노출
   - 다른 팬의 큐레이션 보기
   - 큐레이션 재생, 좋아요, 공유

4. **아티스트 페이지 및 피드**
   - 아티스트 프로필 관리
   - 발표한 음악 목록
   - 아티스트 피드 게시
   - 팔로우 기능

5. **연관 아티스트 추천**
   - 협업 필터링 기반 추천
   - 장르 기반 추천
   - 사용자 취향 분석

6. **팬 등급 시스템**
   - 플레이리스트 생성/재생/좋아요 기반 점수
   - 큐레이터 등급 (씨앗 → 새싹 → 꽃 → 나무 → 숲)
   - 높은 등급 큐레이션 상위 노출

7. **검색 기능**
   - 아티스트 검색
   - 곡 검색
   - 플레이리스트 검색

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### 사용자
- `GET /api/users/:id` - 사용자 프로필
- `PUT /api/users/:id` - 프로필 수정
- `POST /api/users/:id/follow/:artistId` - 아티스트 팔로우/언팔로우

### 아티스트
- `GET /api/artists` - 아티스트 목록
- `GET /api/artists/:id` - 아티스트 상세 정보
- `POST /api/artists` - 아티스트 프로필 생성
- `PUT /api/artists/:id` - 아티스트 프로필 수정
- `POST /api/artists/:id/posts` - 아티스트 피드 게시

### 곡
- `GET /api/tracks` - 곡 목록
- `GET /api/tracks/:id` - 곡 상세 정보
- `POST /api/tracks` - 곡 업로드
- `POST /api/tracks/:id/like` - 곡 좋아요/좋아요 취소

### 플레이리스트
- `GET /api/playlists` - 플레이리스트 피드
- `GET /api/playlists/:id` - 플레이리스트 상세 정보
- `POST /api/playlists` - 플레이리스트 생성
- `PUT /api/playlists/:id` - 플레이리스트 수정
- `DELETE /api/playlists/:id` - 플레이리스트 삭제
- `POST /api/playlists/:id/like` - 플레이리스트 좋아요/좋아요 취소
- `POST /api/playlists/:id/share` - 플레이리스트 공유

### 추천
- `GET /api/recommendations/artists` - 추천 아티스트
- `GET /api/recommendations/tracks` - 추천 곡

## 데이터베이스 스키마

### Users
- 사용자 정보, 큐레이터 등급, 팔로잉 아티스트, 좋아요한 곡/플레이리스트

### Artists
- 아티스트 프로필, 장르, 소셜 링크, 팔로워 수

### Tracks
- 곡 정보, 아티스트 ID, 오디오 URL, 재생/좋아요 수

### Playlists
- 플레이리스트 정보, 생성자, 트랙 목록, 노출 점수

### Interactions
- 사용자 상호작용 (좋아요, 재생, 팔로우, 공유)

### ArtistPosts
- 아티스트 피드 게시물

## 프로젝트 구조

```
fanstage/
├── server/                 # 백엔드
│   ├── models/            # 데이터베이스 모델
│   ├── routes/            # API 라우트
│   ├── middleware/        # 미들웨어
│   └── index.js           # 서버 진입점
├── src/                   # 프론트엔드
│   ├── components/        # 재사용 컴포넌트
│   ├── pages/             # 페이지 컴포넌트
│   ├── context/           # Context API
│   ├── utils/             # 유틸리티 함수
│   └── App.jsx            # 앱 진입점
├── package.json
└── README.md
```

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
