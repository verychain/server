# VeryPool - P2P Cryptocurrency Trading Platform

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)

**A blockchain-based platform for safe and transparent P2P cryptocurrency trading**

---

## Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation & Setup](#-installation--setup)
- [API Documentation](#-api-documentation)

---

## Key Features

### User Management

- Registration/Login (JWT Authentication)
- Profile management and KYC verification
- Wallet address registration and management
- Point system

### Trading System

- **P2P Trade Creation**: Buy/sell order registration
- **Trade Matching**: Automatic matching between buyers and sellers
- **Token Deposit**: Secure token deposit through smart contracts
- **Payment Verification**: Support for various payment methods
- **Trade Completion**: Automatic token transfer through blockchain

### Trade Status Management

- `INITIATED`: Trade started
- `TOKEN_DEPOSITED`: Token deposit completed
- `PAYMENT_SENT`: Payment completed
- `PAYMENT_CONFIRMED`: Payment confirmed
- `COMPLETED`: Trade completed
- `CANCELLED`: Trade cancelled
- `FAILED`: Trade failed

### Payment Methods

- Bank Transfer (BANK_TRANSFER)
- KakaoPay (KAKAO_PAY)
- Toss (TOSS)
- NaverPay (NAVER_PAY)
- Remitly
- Paysend

---

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js 5.1.0
- **Database**: PostgreSQL
- **ORM**: Prisma 6.12.0
- **Authentication**: JWT + bcrypt
- **Library**: ethers.js 6.15.0

---

## Architecture

### Domain-Driven Layered Structure

```

📁 domain/
┣ 📁 user/
┃ ┣ 📁 controller/
┃ ┣ 📁 service/
┃ ┗ 📁 repository/
┃ ┗ 📁 dto/
┣ 📁 trade/
┃ ┣ 📁 controller/
┃ ┣ 📁 service/
┃ ┗ 📁 repository/
┃ ┗ 📁 dto/
┣ 📁 chain/
┃ ┣ 📁 service/
📁 router/
┣ 📄 userRouter.js
┗ 📄 tradeRouter.js

```

### Layer Responsibilities

| Layer          | Responsibility                                        |
| -------------- | ----------------------------------------------------- |
| **Controller** | HTTP request handling, data validation, service calls |
| **Service**    | Business logic, error handling                        |
| **Repository** | Database queries, data access                         |

---

## Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/verychain/server.git
cd server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

```bash
cp .env.example .env
```

Required environment variables:

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

### 4. Database Setup

```bash
npx prisma generate

npx prisma migrate dev

npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

The server will run at `http://localhost:3000`.

---

## 📚 API Documentation

### Swagger UI

API documentation is available at:

- **Local**: `http://localhost:3000/docs`
- **Online**: [Postman Documentation](https://documenter.getpostman.com/view/47758969/2sB3BKGU1n#c0e2c455-f04b-4d1c-a332-48bf511c602e)
