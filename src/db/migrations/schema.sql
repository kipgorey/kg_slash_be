-- Create ENUM type if it does not exist
DO $$ BEGIN
    CREATE TYPE enum_transactions_type AS ENUM('deposit', 'withdraw_request', 'withdraw');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS accounts (
    id VARCHAR(255) PRIMARY KEY,
    balance FLOAT DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

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

-- Insert a pre-registered account with ID '123'
INSERT INTO accounts (id, balance, "createdAt", "updatedAt")
VALUES ('123', 0, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
