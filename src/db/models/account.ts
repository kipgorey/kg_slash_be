// src/db/models/account.ts
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database.js'; // Updated to import sequelize

class Account extends Model {
    public id!: string; // The ID of the account
    public balance!: number; // The balance of the account
}

Account.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        balance: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        tableName: 'accounts',
    }
);

export default Account;
