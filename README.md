# Tech Blog

Next.js와 Supabase를 활용한 기술 블로그 프로젝트입니다.

## 주요 기능

- 사용자 인증 및 프로필 관리
- 블로그 포스트 작성 및 관리
- 댓글 시스템 (대댓글 지원)
- 조회수 및 좋아요 기능

## 기술 스택

- Frontend: Next.js
- Backend: Supabase
- Database: PostgreSQL
- Authentication: Supabase Auth

## 데이터베이스 구조

### Profile

- 사용자 프로필 정보 관리
- 사용자 ID, 이름, 프로필 이미지 저장

### Post

- 블로그 포스트 관리
- 제목, 내용, 작성자, 조회수, 좋아요 수 등 저장

### Comment

- 댓글 시스템
- 대댓글 기능 지원
- 작성자, 내용, 부모 댓글 참조 등 저장

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```
