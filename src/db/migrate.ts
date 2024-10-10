import fs from 'fs';
import path from 'path';
import { sequelize } from './database.js';

const migrate = async () => {
    try {
        await sequelize.authenticate(); // Ensure connection to the database
        await sequelize.sync({ force: true }); // Create tables based on models
        console.log('Database migrated successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await sequelize.close();
    }
};

migrate();
