/**
 * Custom waits for various test scenarios
 * Unit: milliseconds
 */
export enum CUSTOM_WAIT {
    QUICK_WAIT = 2500,
    MEDIUM_WAIT = 10000,
    SLOW_WAIT = 15000,
    VERY_SLOW_WAIT = 25000
}

/**
 * Test Tags for categorizing and filtering tests
 * Usage: test('@smoke', () => { ... })
 */
export enum TestTags {
    SMOKE = '@smoke',
    REGRESSION = '@regression',
    SANITY = '@sanity',
    E2E = '@e2e',
    API = '@api',
    INTEGRATION = '@integration',
    CRITICAL = '@critical',
    SLOW = '@slow',
    FLAKY = '@flaky'
}

/**
 * Test timeouts for different test categories
 * Unit: milliseconds
 */
export enum TestTimeouts {
    QUICK = 5000,        // Quick unit tests
    STANDARD = 30000,    // Standard API/E2E tests
    EXTENDED = 60000,    // Slow operations, uploads, downloads
    VERY_SLOW = 120000   // Very slow operations
}

/**
 * Default waits between actions
 * Unit: milliseconds
 */
export enum DefaultWaits {
    QUICK = 500,
    SHORT = 1000,
    MEDIUM = 2000,
    NORMAL = 3000,
    LONG = 5000,
    VERY_LONG = 10000
}

/**
 * API Response codes
 */
export enum APIResponseCodes {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503
}

/**
 * Retry strategies for flaky operations
 */
export const RETRY_CONFIG = {
    API_RETRIES: 3,
    E2E_RETRIES: 1,
    WAIT_BETWEEN_RETRIES: 1000
} as const;
