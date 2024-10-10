import express from "express";
import Account from "./db/models/account.js"; 
import Transaction from "./db/models/transaction.js"; 

const app = express();
app.use(express.json());

interface TransactionData {
    id: string;
    type: "deposit" | "withdraw_request" | "withdraw";
    amount: number;
    accountId: string;
    timestamp: string;
}

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.post("/transaction", async (req, res) => {
    const transactionData: TransactionData = req.body;

    try {
        const account = await Account.findByPk(transactionData.accountId);

        if (!account) {
            return res.status(404).send("Account not found");
        }

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
                const totalPendingWithdrawals = account.pendingWithdrawals || 0;

                // Check if this withdrawal request exceeds the account balance
                if (account.balance >= totalPendingWithdrawals + transactionData.amount) {
                    account.pendingWithdrawals += transactionData.amount;
                    await account.save();
                    res.status(201).send("Withdraw request approved");
                } else {
                    res.status(402).send("Withdraw request denied due to insufficient funds");
                }
                break;
            }

            case "withdraw": {
                const totalPendingWithdrawals = account.pendingWithdrawals || 0;

                // Check if the account has enough balance after accounting for pending withdrawals
                if (account.balance >= transactionData.amount) {
                    account.balance -= transactionData.amount; 
                    
                    if (totalPendingWithdrawals >= transactionData.amount) {
                      account.pendingWithdrawals -= transactionData.amount; 
                    }
                    await account.save();
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


app.get("/account/:accountId", async (req, res) => {
    const { accountId } = req.params;

    try {
        const account = await Account.findByPk(accountId);

        if (!account) {
            return res.status(404).send("Account not found");
        }

        res.status(200).json({ accountId, balance: account.balance, pendingWithdrawals: account.pendingWithdrawals });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send("An error occurred: " + error.message);
        } else {
            res.status(500).send("An unknown error occurred");
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
