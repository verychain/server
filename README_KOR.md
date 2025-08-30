# VeryPool - P2P 암호화폐 거래 플랫폼

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)

**안전하고 투명한 P2P 암호화폐 거래를 위한 블록체인 기반 플랫폼**

---

## 목차

- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [아키텍처](#-아키텍처)
- [설치 및 실행](#-설치-및-실행)
- [API 문서](#-api-문서)

---

## 주요 기능

### 사용자 관리

- 회원가입/로그인 (JWT 인증)
- 프로필 관리 및 KYC 인증
- 지갑 주소 등록 및 관리
- 포인트 시스템

### 거래 시스템

- **P2P 거래 생성**: 매수/매도 주문 등록
- **거래 매칭**: 구매자와 판매자 자동 매칭
- **토큰 예치**: 스마트 컨트랙트를 통한 안전한 토큰 예치
- **결제 확인**: 다양한 결제 수단 지원
- **거래 완료**: 블록체인을 통한 자동 토큰 전송

### 거래 상태 관리

- `INITIATED`: 거래 시작
- `TOKEN_DEPOSITED`: 토큰 예치 완료
- `PAYMENT_SENT`: 결제 완료
- `PAYMENT_CONFIRMED`: 결제 확인
- `COMPLETED`: 거래 완료
- `CANCELLED`: 거래 취소
- `FAILED`: 거래 실패

### 결제 수단

- 계좌이체 (BANK_TRANSFER)
- 카카오페이 (KAKAO_PAY)
- 토스 (TOSS)
- 네이버페이 (NAVER_PAY)
- Remitly
- Paysend

---

## 기술 스택

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js 5.1.0
- **Database**: PostgreSQL
- **ORM**: Prisma 6.12.0
- **Authentication**: JWT + bcrypt
- **Library**: ethers.js 6.15.0

---

## 아키텍처

### Domain-Driven Layered Structure

```

📁 domain/
┣ 📁 user/ # 사용자 도메인
┃ ┣ 📁 controller/
┃ ┣ 📁 service/
┃ ┗ 📁 repository/
┃ ┗ 📁 dto/
┣ 📁 trade/ # 거래 도메인
┃ ┣ 📁 controller/
┃ ┣ 📁 service/
┃ ┗ 📁 repository/
┃ ┗ 📁 dto/
┣ 📁 chain/ # 블록체인 도메인
┃ ┣ 📁 service/
📁 router/
┣ 📄 userRouter.js
┗ 📄 tradeRouter.js

```

### 레이어별 책임

| 레이어         | 책임                                     |
| -------------- | ---------------------------------------- |
| **Controller** | HTTP 요청 처리, 데이터 검증, 서비스 호출 |
| **Service**    | 비즈니스 로직, 에러 처리                 |
| **Repository** | 데이터베이스 쿼리, 데이터 접근           |

---

## 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/verychain/server.git
cd server
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

```bash
cp .env.example .env
```

필요한 환경 변수:

```env
# Database
DATABASE_URL=""

# JWT
JWT_SECRET="your-jwt-secret"

# Blockchain
BLOCKCHAIN_RPC_URL="https://rpc.verylabs.io"
CORE_CONTRACT_ADDRESS="0x..."
TREASURY_CONTRACT_ADDRESS="0x..."
RELAYER_WALLET_ADDRESS="0x..."
RELAYER_PRIVATE_KEY="0x..."

# Server
PORT=3000
API_PREFIX="/api"
```

### 4. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 마이그레이션 실행
npx prisma migrate dev

# 데이터베이스 시드 (선택사항)
npx prisma db seed
```

### 5. 개발 서버 실행

```bash
npm run dev
```

서버가 `http://localhost:3000`에서 실행됩니다.

---

## 📚 API 문서

### Swagger UI

API 문서는 다음 URL에서 확인할 수 있습니다:

- **로컬**: `http://localhost:3000/docs`
- **온라인**: [Postman Documentation](https://documenter.getpostman.com/view/47758969/2sB3BKGU1n#c0e2c455-f04b-4d1c-a332-48bf511c602e)
