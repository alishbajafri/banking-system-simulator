# Banking System Simulator - API Integration Guide

This mobile app is designed to work with your Java REST API backend running at `http://localhost:8080/api`.

## Expected API Endpoints

The app makes requests to the following endpoints:

### 1. Login
- **Endpoint:** `POST /api/login`
- **Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```
- **Expected Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "accountNumber": "string" (optional)
  },
  "balance": 0.00 (optional)
}
```

### 2. Get Balance
- **Endpoint:** `GET /api/balance`
- **Headers:** `Authorization: Bearer {token}`
- **Expected Response:**
```json
{
  "balance": 0.00,
  "accountNumber": "string"
}
```

### 3. Deposit
- **Endpoint:** `POST /api/deposit`
- **Headers:** `Authorization: Bearer {token}`
- **Request Body:**
```json
{
  "amount": 0.00
}
```
- **Expected Response:**
```json
{
  "balance": 0.00,
  "message": "string" (optional)
}
```

### 4. Withdraw
- **Endpoint:** `POST /api/withdraw`
- **Headers:** `Authorization: Bearer {token}`
- **Request Body:**
```json
{
  "amount": 0.00
}
```
- **Expected Response:**
```json
{
  "balance": 0.00,
  "message": "string" (optional)
}
```

### 5. Transfer
- **Endpoint:** `POST /api/transfer`
- **Headers:** `Authorization: Bearer {token}`
- **Request Body:**
```json
{
  "amount": 0.00,
  "recipientAccount": "string"
}
```
- **Expected Response:**
```json
{
  "balance": 0.00,
  "message": "string" (optional)
}
```

### 6. Transaction History
- **Endpoint:** `GET /api/transactions`
- **Headers:** `Authorization: Bearer {token}`
- **Expected Response:**
```json
[
  {
    "id": "string",
    "type": "DEPOSIT" | "WITHDRAW" | "TRANSFER",
    "amount": 0.00,
    "date": "ISO 8601 date string",
    "recipientAccount": "string" (optional, for transfers),
    "description": "string" (optional)
  }
]
```

## CORS Configuration

Since the app runs on a different origin than your backend, you'll need to configure CORS on your Java backend to allow requests from the Expo app.

Add the following headers to your backend responses:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Changing the API URL

To change the backend API URL, edit the `API_BASE_URL` constant in:
`/services/api.ts`

## Testing Locally

When testing with Expo Go on a physical device:
1. Make sure your backend is running on your local machine
2. Update the API URL to use your machine's local IP address instead of `localhost`
   - Example: `http://192.168.1.100:8080/api`
3. Ensure your device is on the same network as your development machine

## Authentication Flow

1. User enters credentials on Login screen
2. App sends POST request to `/api/login`
3. Backend returns JWT token and user data
4. App stores token and includes it in Authorization header for all subsequent requests
5. User can perform banking operations (deposit, withdraw, transfer)
6. User can view transaction history
7. Logout clears the token and returns to login screen
