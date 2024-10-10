import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

class Transaction extends Model {
    public id!: string;
    public type!: 'deposit' | 'withdraw_request' | 'withdraw';
    public amount!: number;
    public accountId!: string;
    public timestamp!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Transaction.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        type: {
            type: DataTypes.ENUM('deposit', 'withdraw_request', 'withdraw'),
            allowNull: false,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        accountId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'accountId',
        },
        timestamp: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: 'transactions',
        timestamps: true, // This enables automatic handling of createdAt and updatedAt
    }
);

export default Transaction;
