package com.example.banking_backend;

public class Account {
    private int accountId;
    private double balance;

    public Account(int accountId, double balance) {
        this.accountId = accountId;
        this.balance = balance;
    }

    public int getAccountId() { return accountId; }
    public double getBalance() { return balance; }
    public void setBalance(double balance) { this.balance = balance; }
}
