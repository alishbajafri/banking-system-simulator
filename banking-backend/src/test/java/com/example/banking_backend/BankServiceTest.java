package com.example.banking_backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class BankServiceTest {

    private BankService service;

    @BeforeEach
    public void setup() {
        service = new BankService();

        // create accounts
        service.createAccount(1, 1000);
        service.createAccount(2, 500);

        // create users and LINK them to accounts
        service.createUser("alice", "1234", 1);
        service.createUser("bob", "abcd", 2);
    }

    @Test
    public void testConcurrentDeposit() throws InterruptedException {
        Thread t1 = new Thread(() -> service.deposit("alice", 500));
        Thread t2 = new Thread(() -> service.deposit("alice", 300));

        t1.start();
        t2.start();
        t1.join();
        t2.join();

        assertEquals(1800, service.getBalance("alice"));
    }

    @Test
    public void testTransfer() {
        service.transfer("alice", 2, 400);

        assertEquals(600, service.getBalance("alice"));
        assertEquals(900, service.getBalance("bob"));
    }

    @Test
    public void testLogin() {
        assertTrue(service.login("alice", "1234"));
        assertFalse(service.login("alice", "wrongpass"));
    }
}
