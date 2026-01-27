package com.example.banking_backend;

public class Transaction {
    private String id;
    private String type; // DEPOSIT, WITHDRAW, TRANSFER
    private double amount;
    private String date; // ISO string
    private Integer recipientAccount; // optional
    private String description;       // optional

    public Transaction(String id, String type, double amount, String date) {
        this.id = id;
        this.type = type;
        this.amount = amount;
        this.date = date;
    }

    // getters and setters
    public String getId() { return id; }
    public String getType() { return type; }
    public double getAmount() { return amount; }
    public String getDate() { return date; }
    public Integer getRecipientAccount() { return recipientAccount; }
    public String getDescription() { return description; }

    public void setRecipientAccount(Integer recipientAccount) { this.recipientAccount = recipientAccount; }
    public void setDescription(String description) { this.description = description; }
}
