-- ENUM type
DO $$ BEGIN
    CREATE TYPE enum_transactions_type AS ENUM('deposit', 'withdraw_request', 'withdraw');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create or update the accounts table to include the new pendingWithdrawals column
CREATE TABLE IF NOT EXISTS accounts (
    id VARCHAR(255) PRIMARY KEY,
    balance FLOAT DEFAULT 0,
    "pendingWithdrawals" FLOAT DEFAULT 0,  
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(255) PRIMARY KEY,
    type enum_transactions_type NOT NULL,
    amount FLOAT NOT NULL,
    "accountId" VARCHAR(255) NOT NULL,
    timestamp VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("accountId") REFERENCES accounts(id) ON DELETE CASCADE
);

INSERT INTO accounts (id, balance, "pendingWithdrawals", "createdAt", "updatedAt")
VALUES ('123', 0, 0, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
