# SafeDeposit 🛡️ - Soroban Smart Lease Escrow

**SafeDeposit** is a decentralized smart lease escrow application built on the Stellar network using Soroban Smart Contracts. It secures the process of managing rent security deposits between Tenants and Landlords without traditional banking intermediaries.

[![CI Pipeline](https://github.com/MrunalGhorpade13/Safe-Deposit/actions/workflows/main.yml/badge.svg)](https://github.com/MrunalGhorpade13/Safe-Deposit/actions/workflows/main.yml)
[![Live Demo](https://img.shields.io/badge/Demo-Live_on_Vercel-blue?style=flat-square)](https://frontend-sigma-three-gf8m1lpe3b.vercel.app)

---

## 🌟 Level 3: Core Project Development

In Level 3, the foundational escrow protocol was built to allow trustless management of security deposits.

### 🎯 Core Features & Escrow Flow
1. **Tenant: Secure Locking**
   Tenants can lock XLM into the escrow contract by specifying the landlord's address. The funds are held securely until the lease ends.
2. **Landlord: Proposed Deductions**
   At the end of the lease, landlords can propose a deduction for damages. The state updates in real-time for the tenant to see.
3. **Mutual Release**
   Once the tenant reviews and approves the deduction, the contract automatically splits the funds: sending the deduction to the landlord and the remainder back to the tenant.

### 💻 Tech Stack (Level 3 Foundation)
* **Smart Contracts:** Rust, Soroban SDK
* **Frontend Framework:** Next.js (App Router), React
* **Styling:** Tailwind CSS, Lucide Icons
* **Web3 Integration:** `@stellar/freighter-api`, `@stellar/stellar-sdk`
* **State & Caching:** `@tanstack/react-query`

### 📖 User Guide & How to Use
1. **Connecting Your Wallet:** Click **"Connect Wallet"** to link your Freighter extension.
2. **Tenant - Locking a Deposit:** Enter the Landlord's Stellar address and deposit amount. Click **"Lock New Deposit"**. Status goes to **Locked**.
3. **Landlord - Proposing a Deduction:** The Landlord logs in, enters a deduction for damages, and clicks **"Propose Deduction"**. Status goes to **Pending Approval**.
4. **Tenant - Approving Release:** The Tenant reviews the deduction and clicks **"Approve & Release"**. The contract executes and shifts to the **Released** state.

### 📜 Smart Contract Logic (`safe_deposit/src/lib.rs`)
* `lock_deposit`: Locks the XLM from the tenant and initiates the `Locked` state.
* `propose_deduction`: Allows the authorized landlord to propose damage costs. Moves to `PendingApproval`.
* `approve_and_release`: Tenant approves. Contract completes the deal. Moves state to `Released`.

---

## 🚀 Level 4: Production-Readiness Advancements

Building upon the Level 3 foundation, the project was upgraded to meet **Level 4 Production-Readiness** requirements, introducing protocol fees, real-time UI/UX, and automated CI/CD.

### 🔗 Project Resources
| Feature | Link |
| :--- | :--- |
| **Live Demo Link** | [https://frontend-sigma-three-gf8m1lpe3b.vercel.app](https://frontend-sigma-three-gf8m1lpe3b.vercel.app) |
| **Demo Video** | [Watch Full Process Demo](./demo/safedeposit_demo.webp) |
| **Source Code** | [GitHub Repository](https://github.com/MrunalGhorpade13/Safe-Deposit) |

### 🏆 Level 4 Submission Highlights
- [x] **Inter-contract Logic**: Integrated `FeeCollector` contract for automated protocol fee routing.
- [x] **Real-time Event Streaming**: Frontend listens to Soroban events (`DepositLocked`, `DeductionProposed`, etc.) for instant UI updates.
- [x] **Premium UI/UX**: Implemented a sleek, dark-mode design with Glassmorphism and responsive Tailwind layouts.
- [x] **Error Handling**: Added React Error Boundaries and dynamic user feedback for RPC/Wallet failures.
- [x] **CI/CD Pipeline**: Fully automated build, test, and optimization workflow via GitHub Actions.
- [x] **Live Deployment**: Hosted on Vercel with automated deployment from GitHub.

### 🛠️ Technical Architecture Upgrades
| Component | Technology | Description |
| :--- | :--- | :--- |
| **Smart Contracts** | Rust / Soroban | Core escrow logic and **cross-contract fee collection**. |
| **Frontend** | Next.js 16 / React | Responsive dashboard with **real-time state management**. |
| **Styling** | Tailwind CSS | **Premium dark-mode aesthetic** with custom animations. |
| **Infrastructure** | GitHub Actions / Vercel | Automated CI/CD for contract optimization and UI deployment. |

### 📸 Visual Proof (Level 4 Features)

#### 🖥️ 1. Live Wallet Connection
The application seamlessly integrates with the **Freighter Wallet** to manage Stellar accounts.
![Wallet Connection](./screenshots/wallet_connection.png)

#### 🎥 2. Full Process Demo & Real-Time Events
Watch the complete flow: locking a deposit, proposing a deduction, and the final automated release with event tracking.
![SafeDeposit Demo](./demo/safedeposit_demo.webp)

---

## 🚀 Setup & Execution

### 1. Smart Contract
```bash
cd safe_deposit
stellar contract build
stellar contract test
```

### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev
```

---

## ✍️ Author
**Developed by Mrunal Ghorpade**  
*Rise In Stellar Journey to Mastery - Level 3 & Level 4*

🚀 *Building the future of finance on Stellar.*
