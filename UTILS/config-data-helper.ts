import fs from 'fs';
import path from 'path';
import { DateTimeDataHelper } from './date-time-data-helper';
import { DynamicDataGenerator } from './dynamic-data-generator';

/**
 * ConfigDataHelper provides methods to load and process test data configurations
 * Supports placeholder replacement for dynamic values
 * 
 * Supported placeholders:
 * - {timestamp} - Current full timestamp
 * - {random} - Random 4-digit number
 * - {random2} - Random 2-digit number (1-50)
 * - {single_date} - Single date (dd)
 * - {full_date} - Full date (mm/dd/yyyy)
 */

/**
 * Replace placeholders in strings with dynamic values
 * @param value - String containing placeholders
 * @returns String with placeholders replaced
 * @private
 */
function replacePlaceholders(value: string): string {
    const dateTimeHelper = new DateTimeDataHelper();
    const dynamicDataGenerator = new DynamicDataGenerator()
    return value
        .replace(/{timestamp}/g, dateTimeHelper.getFullDate())
        .replace(/{random}/g, dynamicDataGenerator.random4Digits())
        .replace(/{random2}/g, dynamicDataGenerator.random2DigitInRange())
        .replace(/{single_date}/g, dateTimeHelper.getSingleDate())
        .replace(/{full_date}/g, dateTimeHelper.getCurrentDayInYear());
}

/**
 * Load test data configuration from JSON file with placeholder replacement
 * @param datadir - Base directory containing test data (e.g., 'TEST_PROJECT/API')
 * @param datatype - Data type/name (e.g., 'user', 'contact')
 * @param environment - Environment name (default: 'local')
 * @returns Parsed configuration object with placeholders replaced
 * @throws Error if config file not found or JSON is invalid
 * @example loadDataConfig('TEST_PROJECT/API', 'user', 'local')
 */
export function loadDataConfig(datadir: string, datatype: string, environment: string = 'local') {
    const configPath = path.resolve(__dirname, `../${datadir}/data-test/${datatype}/${datatype}_data_${environment}.json`);

    if (!fs.existsSync(configPath)) {
        throw new Error(`DataConfig "${datatype}" file for environment "${environment}" not found at ${configPath}`);
    }

    try {
        const fileData = fs.readFileSync(configPath, 'utf-8');
        const configData = JSON.parse(fileData);

        console.log(`Loaded configuration data from ${configPath}`);

        // Replace placeholders in config data
        const configString = JSON.stringify(configData, (key, value) => {
            return typeof value === 'string' ? replacePlaceholders(value) : value;
        });

        return JSON.parse(configString);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error loading or parsing JSON config file at ${configPath}:`, error);
        throw new Error(`Failed to load config file: ${errorMessage}`);
    }
}
