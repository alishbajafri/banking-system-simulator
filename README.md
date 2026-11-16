# Banking System Simulator — Full-Stack

A full-stack banking simulator: a **Java Spring Boot backend** with thread-safe account operations and JUnit tests, plus a **React Native (Expo) mobile frontend** for deposits, withdrawals, transfers and transaction history.

## Features

**Backend (`banking-backend/`)**
- Accounts and transactions exposed through a REST controller (`BankController` / `BankService`)
- Deposit, withdraw and transfer operations
- **Thread-safe transfers:** service methods are `synchronized`, and transfers take the two account locks in a consistent order to avoid deadlock
- Unit tests with JUnit / Spring Boot Test (`BankServiceTest`, application context test)

**Frontend (`frontend/project/`)**
- Login with an Auth context
- Tabbed banking experience: **Deposit · Withdraw · Transfer · History**, plus a home/dashboard tab
- API service layer wired to the backend (see `frontend/project/API_INTEGRATION.md`)

## Tech Stack

- **Backend:** Java · Spring Boot (Web, DevTools, Test) · Maven · JUnit
- **Frontend:** React Native · Expo · TypeScript · React Navigation · Supabase JS client
- REST APIs between frontend and backend

## Project Structure

```
banking-backend/   Spring Boot API — Account, Transaction, BankService, BankController + tests
frontend/project/  Expo mobile app — app/(tabs)/ deposit, withdraw, transfer, history; services/api.ts
```

## How to Run

**1. Backend**

```bash
cd banking-backend
./mvnw spring-boot:run     # Windows: mvnw.cmd spring-boot:run
```

**2. Frontend** (in a second terminal)

```bash
cd frontend/project
npm install
npx expo start
```

Then open the app in Expo Go or an emulator. Make sure the frontend's API base URL points at your running backend (see `API_INTEGRATION.md`).

**Run the tests**

```bash
cd banking-backend
./mvnw test
```

## Author

**Alishba Fatima** — BS Software Engineering, Sir Syed University of Engineering & Technology (SSUET)
Portfolio: https://alishbafatima.vercel.app/ · LinkedIn: https://www.linkedin.com/in/alishba-fatimaa/ · GitHub: https://github.com/alishbajafri
