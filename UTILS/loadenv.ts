import * as dotenv from 'dotenv';
import { resolve } from 'path';

export function loadEnv(environment: string) {
dotenv.config({ path: resolve(__dirname, `../TEST_PROJECT/CONFIGS/.env.${environment}`) });
}