export interface User {
  id: string;
  username: string;
  accountNumber?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  balance?: number;
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';
  amount: number;
  date: string;
  recipientAccount?: string;
  description?: string;
}

export interface TransactionRequest {
  amount: number;
  recipientAccount?: string;
}

export interface AccountBalance {
  balance: number;
  accountNumber: string;
}
