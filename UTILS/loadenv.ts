import * as dotenv from 'dotenv';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Get __dirname in ESM context
 */
function getDirname(): string {
  const __filename = fileURLToPath(import.meta.url);
  return path.dirname(__filename);
}

/**
 * Load environment variables from a .env file based on the environment name
 * @param environment - The environment name (e.g., 'local', 'staging', 'production')
 * @throws Error if the environment file doesn't exist
 */
export function loadEnv(environment: string): void {
  const baseDir = getDirname();
  const envPath = resolve(baseDir, `../configs/.env.${environment}`);

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
    throw new Error(
      `Failed to load environment file ${envPath}: ${result.error.message}`
    );
  }

  console.log(`✓ Environment loaded: ${environment}`);
}

/**
 * Validate that required environment variables are set
 * @param requiredVars - Array of required variable names
 * @throws Error if any required variable is missing
 */
export function validateRequiredEnvVars(requiredVars: string[]): void {
  const missing = requiredVars.filter((varName) => {
    const value = process.env[varName];
    return !value || value.trim() === '';
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        `Please update your .env file with these values.`
    );
  }

  console.log(`✓ All required environment variables validated`);
}

/**
 * Get environment variable with type safety and default value
 * @param key - Environment variable key
 * @param defaultValue - Default value if not found
 * @returns Environment variable value or default
 */
export function getEnvVar(
  key: string,
  defaultValue: string | undefined = undefined
): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

/**
 * Get environment variable as boolean
 * @param key - Environment variable key
 * @param defaultValue - Default value if not found
 * @returns Boolean value
 */
export function getEnvBool(key: string, defaultValue = false): boolean {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1' || value === 'yes';
}

/**
 * Get environment variable as number
 * @param key - Environment variable key
 * @param defaultValue - Default value if not found
 * @returns Numeric value
 */
export function getEnvNumber(key: string, defaultValue = 0): number {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  const num = parseInt(value, 10);
  if (isNaN(num)) {
    throw new Error(
      `Environment variable ${key} is not a valid number: ${value}`
    );
  }
  return num;
}
