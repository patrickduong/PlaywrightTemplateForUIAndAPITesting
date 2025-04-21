import * as dotenv from 'dotenv';
import { resolve } from 'path';

export function loadEnv(environment: string) {
dotenv.config({ path: resolve(__dirname, `../configs/.env.${environment}`) });
}