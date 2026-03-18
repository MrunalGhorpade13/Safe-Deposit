# SafeDeposit 🛡️ - Soroban Smart Lease Escrow

**SafeDeposit** is a decentralized smart lease escrow application built on the Stellar network using Soroban Smart Contracts. It secures the process of managing rent security deposits between Tenants and Landlords without traditional banking intermediaries.

[![CI Pipeline](https://github.com/MrunalGhorpade13/Safe-Deposit/actions/workflows/main.yml/badge.svg)](https://github.com/MrunalGhorpade13/Safe-Deposit/actions/workflows/main.yml)
[![Live Demo](https://img.shields.io/badge/Demo-Live_on_Vercel-blue?style=flat-square)](https://frontend-sigma-three-gf8m1lpe3b.vercel.app)

---

## 🔗 Project Resources

| Feature | Link |
| :--- | :--- |
| **Live Demo Link** | [https://frontend-sigma-three-gf8m1lpe3b.vercel.app](https://frontend-sigma-three-gf8m1lpe3b.vercel.app) |
| **Demo Video** | [Watch Full Process Demo](./demo/safedeposit_demo.webp) |
| **Source Code** | [GitHub Repository](https://github.com/MrunalGhorpade13/Safe-Deposit) |

---

## 🏆 Level 4 Submission Highlights

This project has been upgraded to meet all **Level 4 Production-Readiness** requirements of the Rise In Stellar Journey.

### ✅ Completed Requirements Checklist
- [x] **Inter-contract Logic**: Integrated `FeeCollector` contract for automated protocol fee routing.
- [x] **Real-time Event Streaming**: Frontend listens to Soroban events (`DepositLocked`, `DeductionProposed`, etc.) for instant UI updates.
- [x] **Premium UI/UX**: Implemented a sleek, dark-mode design with Glassmorphism and responsive Tailwind layouts.
- [x] **Error Handling**: Added React Error Boundaries and dynamic user feedback for RPC/Wallet failures.
- [x] **CI/CD Pipeline**: Fully automated build, test, and optimization workflow via GitHub Actions.
- [x] **Live Deployment**: Hosted on Vercel with automated deployment from GitHub.

---

## 🛠️ Technical Architecture

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Smart Contracts** | Rust / Soroban | Core escrow logic and cross-contract fee collection. |
| **Frontend** | Next.js 16 / React | Responsive dashboard with real-time state management. |
| **Styling** | Tailwind CSS | Premium dark-mode aesthetic with custom animations. |
| **Web3 Integration** | Freighter / Stellar SDK | Seamless wallet connection and transaction signing. |
| **Infrastructure** | GitHub Actions | Automated CI/CD for contract optimization and testing. |

---

## 🎯 Core Features

### 1. Tenant: Secure Locking
Tenants can lock XLM into the escrow contract by specifying the landlord's address. The funds are held securely until the lease ends.

### 2. Landlord: Proposed Deductions
At the end of the lease, landlords can propose a deduction for damages. The state updates in real-time for the tenant to see.

### 3. Mutual Release
Once the tenant approves, the contract automatically splits the funds: sending the deduction to the landlord and the remainder back to the tenant.

---

## 🚀 Quick Setup

### Smart Contract
```bash
cd safe_deposit
stellar contract build
stellar contract test
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## ✍️ Author
**Developed by Mrunal Ghorpade**  
*Rise In Stellar Journey to Mastery - Level 4*

🚀 *Building the future of finance on Stellar.*
