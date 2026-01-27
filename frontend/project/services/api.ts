import {
  LoginRequest,
  LoginResponse,
  Transaction,
  TransactionRequest,
  AccountBalance,
} from '@/types/api';

const API_BASE_URL = 'http://192.168.100.146:8080/api';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

export const apiService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }

    const data = await response.json();
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  async getBalance(username: string): Promise<AccountBalance> {
    const response = await fetch(`${API_BASE_URL}/balance?username=${username}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch balance');
    }

    return response.json();
  },

  async deposit(request: TransactionRequest): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/deposit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Deposit failed');
    }

    return response.json();
  },

  async withdraw(request: TransactionRequest): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/withdraw`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Withdrawal failed');
    }

    const data = await response.json();
    return data; // data = new balance number
  },

  async transfer(request: TransactionRequest): Promise<{ balance: number }> {
    const response = await fetch(`${API_BASE_URL}/transfer`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Transfer failed');
    }

    return response.json(); // will now return { balance: number }
  },

  async getTransactionHistory(username: string): Promise<Transaction[]> {
      const response = await fetch(`${API_BASE_URL}/transactions?username=${username}`, {
          method: 'GET',
          headers: getHeaders(),
      });

      if (!response.ok) {
          throw new Error('Failed to fetch transaction history');
      }

      return response.json();
  },
};
