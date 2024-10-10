import { Sequelize, DataTypes } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME || 'db',
    process.env.DB_USER || 'admin',
    process.env.DB_PASSWORD || 'admin',
    {
        host: process.env.DB_HOST || 'db',
        dialect: 'postgres',
    }
);

// Account Model for DB
const Account = sequelize.define('Account', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    pendingWithdrawals: {  
        type: DataTypes.FLOAT,
        defaultValue: 0,
    }
});

const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // schema file exec.
        const schemaPath = path.join(__dirname, 'migrations', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await sequelize.query(schemaSql);

        await sequelize.sync({ alter: true });

        console.log('Database initialized successfully.');
    } catch (error) {
        console.error('Unable to initialize database:', error);
    }
};

initializeDatabase().catch(err => console.error('Database initialization failed:', err));

export { sequelize, Account };
