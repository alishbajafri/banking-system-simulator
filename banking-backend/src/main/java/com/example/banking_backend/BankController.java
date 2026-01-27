package com.example.banking_backend;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// DTOs
class LoginRequest {
    public String username;
    public String password;
}

class TransactionRequest {
    public String username; // logged-in user
    public int toId;        // For transfer
    public double amount;
}

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class BankController {

    private BankService service = new BankService();

    public BankController() {
        // Create accounts
        service.createAccount(1, 1000);
        service.createAccount(2, 500);

        // Create users
        service.createUser("alice", "1234", 1);
        service.createUser("bob", "abcd", 2);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {
        Map<String, Object> response = new HashMap<>();

        if (service.login(request.username, request.password)) {
            int accountId = service.getAccountIdByUsername(request.username);
            response.put("message", "Login Successful");
            response.put("token", "dummy-token");
            response.put("user", request.username);
            response.put("balance", service.getBalance(request.username));
            response.put("accountId", accountId); // for frontend
        } else {
            response.put("message", "Invalid username or password");
        }
        return response;
    }

    @PostMapping("/deposit")
    public double deposit(@RequestBody TransactionRequest request) {
        return service.deposit(request.username, request.amount);
    }

    @PostMapping("/withdraw")
    public double withdraw(@RequestBody TransactionRequest request) {
        return service.withdraw(request.username, request.amount);
    }

    @PostMapping("/transfer")
    public Map<String, Object> transfer(@RequestBody Map<String, String> request) {
        String fromUser = request.get("username"); // make sure frontend sends this
        int toAccountId = Integer.parseInt(request.get("recipientAccount"));
        double amount = Double.parseDouble(request.get("amount"));

        // Use the correct service instance
        service.transfer(fromUser, toAccountId, amount);

        // return sender's updated balance
        double newBalance = service.getBalance(fromUser);

        Map<String, Object> response = new HashMap<>();
        response.put("balance", newBalance);
        return response;
    }



    @GetMapping("/transactions")
    public List<Transaction> getTransactions(@RequestParam String username) {
        return service.getTransactions(username);
    }


    @GetMapping("/balance")
    public Map<String, Object> getBalance(@RequestParam String username) {
        Map<String, Object> response = new HashMap<>();
        response.put("balance", service.getBalance(username));
        return response;
    }


}
