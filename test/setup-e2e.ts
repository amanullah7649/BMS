import * as dotenv from 'dotenv';
import { join } from 'path';

// Load .env.e2e file for E2E tests
dotenv.config({ path: join(__dirname, '..', '.env.e2e') });
