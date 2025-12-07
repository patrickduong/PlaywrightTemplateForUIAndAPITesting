import * as dotenv from 'dotenv';
import { resolve } from 'path';
import fs from 'fs';

/**
 * Load environment variables from a .env file based on the environment name
 * @param environment - The environment name (e.g., 'local', 'staging', 'production')
 * @throws Error if the environment file doesn't exist
 */
export function loadEnv(environment: string): void {
    const envPath = resolve(__dirname, `../configs/.env.${environment}`);
    
    // Validate that the environment file exists
    if (!fs.existsSync(envPath)) {
        throw new Error(
            `Environment file not found: ${envPath}. ` +
            `Please create it or use a valid environment name. ` +
            `You can copy from configs/.env.example`
        );
    }
    
    const result = dotenv.config({ path: envPath });
    
    if (result.error) {
        throw new Error(`Failed to load environment file ${envPath}: ${result.error.message}`);
    }
    
    console.log(`Environment loaded: ${environment}`);
}

/**
 * Validate that required environment variables are set
 * @param requiredVars - Array of required variable names
 * @throws Error if any required variable is missing
 */
export function validateRequiredEnvVars(requiredVars: string[]): void {
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}. ` +
            `Please update your .env file with these values.`
        );
    }
}
