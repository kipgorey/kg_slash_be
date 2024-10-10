import express from "express";
import Account from "./db/models/account.js"; // Adjust the import path if necessary
import Transaction from "./db/models/transaction.js"; // Import the Transaction model

const app = express();
app.use(express.json());

interface TransactionData {
    id: string; // must be a string to match Sequelize's STRING type
    type: "deposit" | "withdraw_request" | "withdraw"; // must match the enum type in the model
    amount: number; // ensure this is a number
    accountId: string; // must be a string to match the foreign key reference
    timestamp: string; // consider changing this to Date if you're using Date type in your model
}

// To keep track of approved withdraw requests
const approvedWithdrawRequests: { [key: string]: number } = {};

// Check server health
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Handle transaction requests
app.post("/transaction", async (req, res) => {
    const transactionData: TransactionData = req.body;

    try {
        const account = await Account.findByPk(transactionData.accountId);

        if (!account) {
            return res.status(404).send("Account not found");
        }

        // Create a new transaction entry in the database
        await Transaction.create({
            id: transactionData.id,
            type: transactionData.type,
            amount: transactionData.amount,
            accountId: transactionData.accountId,
            timestamp: transactionData.timestamp,
        });

        // Proceed with the transaction logic
        switch (transactionData.type) {
            case "deposit":
                account.balance += transactionData.amount;
                await account.save();
                res.status(200).send("Deposit processed");
                break;

              case "withdraw_request": {
                const totalApproved = approvedWithdrawRequests[transactionData.accountId] || 0;
            
                // Check if the current balance allows for this request
                if (account.balance >= totalApproved + transactionData.amount) {
                    approvedWithdrawRequests[transactionData.accountId] = totalApproved + transactionData.amount; // Update approved requests
                    res.status(201).send("Withdraw request approved");
                } else {
                    res.status(402).send("Withdraw request denied due to insufficient funds");
                }
                break;
              }
              

            case "withdraw": {
                const totalApproved = approvedWithdrawRequests[transactionData.accountId] || 0;

                // Ensure the withdrawal can be processed without exceeding the balance
                if (account.balance - totalApproved >= transactionData.amount) {
                    account.balance -= transactionData.amount; // Process the withdrawal
                    await account.save();

                    // Reset approved withdraw requests if the withdraw is successful
                    approvedWithdrawRequests[transactionData.accountId] = Math.max(totalApproved - transactionData.amount, 0);
                    res.status(200).send("Withdraw processed");
                } else {
                    res.status(402).send("Insufficient funds");
                }
                break;
            }

            default:
                res.status(400).send("Invalid transaction type");
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send("An error occurred: " + error.message);
        } else {
            res.status(500).send("An unknown error occurred");
        }
    }
});

// Get account balance endpoint
app.get("/account/:accountId", async (req, res) => {
    const { accountId } = req.params;

    try {
        const account = await Account.findByPk(accountId);

        if (!account) {
            return res.status(404).send("Account not found");
        }

        res.status(200).json({ accountId, balance: account.balance });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send("An error occurred: " + error.message);
        } else {
            res.status(500).send("An unknown error occurred");
        }
    }
});

// Set the server to listen on the PORT environment variable
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
