package com.example.banking_backend;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;


public class BankService {

    private Map<Integer, Account> accounts = new HashMap<>();
    private Map<String, String> users = new HashMap<>();
    private Map<String, Integer> userAccounts = new HashMap<>();
    private Map<Integer, List<Transaction>> transactions = new HashMap<>();

    // Create account
    public void createAccount(int id, double initialBalance) {
        accounts.put(id, new Account(id, initialBalance));
        transactions.put(id, new ArrayList<>());
    }

    // Create user + link to account
    public void createUser(String username, String password, int accountId) {
        users.put(username, password);
        userAccounts.put(username, accountId);
    }

    // Login
    public boolean login(String username, String password) {
        return users.containsKey(username) && users.get(username).equals(password);
    }

    // Get accountId from username
    public int getAccountIdByUsername(String username) {
        Integer accountId = userAccounts.get(username);
        if (accountId == null) throw new IllegalArgumentException("Account not found");
        return accountId;
    }

    // Get balance by username
    public double getBalance(String username) {
        int accountId = getAccountIdByUsername(username);
        return accounts.get(accountId).getBalance();
    }

    // Deposit
    public synchronized double deposit(String username, double amount) {
        int accountId = getAccountIdByUsername(username);
        Account acc = accounts.get(accountId);
        acc.setBalance(acc.getBalance() + amount);
        transactions.get(accountId).add(
            new Transaction(UUID.randomUUID().toString(), "DEPOSIT", amount, new Date().toInstant().toString())
        );
        return acc.getBalance();
    }

    // Withdraw
    public synchronized double withdraw(String username, double amount) {
        int accountId = getAccountIdByUsername(username);
        Account acc = accounts.get(accountId);
        if (acc.getBalance() < amount) throw new IllegalArgumentException("Insufficient balance");
        acc.setBalance(acc.getBalance() - amount);

        transactions.get(accountId).add(
            new Transaction(UUID.randomUUID().toString(), "WITHDRAW", amount, new Date().toInstant().toString())
        );
        return acc.getBalance();
    }

    // Transfer with locks for multithreading
    // Transfer with locks for multithreading
    public void transfer(String fromUser, int toId, double amount) {
        int fromId = getAccountIdByUsername(fromUser);

        if (!accounts.containsKey(toId)) throw new IllegalArgumentException("Account not found");

        Account fromAcc = accounts.get(fromId);
        Account toAcc = accounts.get(toId);

        // Locking to prevent deadlocks — use getAccountId() instead of getId()
        Account firstLock = fromAcc.getAccountId() < toAcc.getAccountId() ? fromAcc : toAcc;
        Account secondLock = fromAcc.getAccountId() < toAcc.getAccountId() ? toAcc : fromAcc;

        synchronized (firstLock) {
            synchronized (secondLock) {
                if (fromAcc.getBalance() < amount) throw new IllegalArgumentException("Insufficient balance");
                fromAcc.setBalance(fromAcc.getBalance() - amount);
                toAcc.setBalance(toAcc.getBalance() + amount);
                // add transaction to sender
                Transaction t = new Transaction(UUID.randomUUID().toString(), "TRANSFER", amount, new Date().toInstant().toString());
                t.setRecipientAccount(toId);
                transactions.get(fromId).add(t);

                // add transaction to receiver
                Transaction t2 = new Transaction(UUID.randomUUID().toString(), "TRANSFER", amount, new Date().toInstant().toString());
                t2.setDescription("Received from " + fromUser);
                transactions.get(toId).add(t2);
            }
        }
    }
    // get transaction history
    public List<Transaction> getTransactions(String username) {
        int accountId = getAccountIdByUsername(username);
        return transactions.get(accountId);
    }

}
