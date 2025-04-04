import fs from 'fs';
import path from 'path';
import { DateTimeDataHelper } from './date-time-data-helper';
import { DynamicDataGenerator } from './dynamic-data-generator';

function replacePlaceholders(value: string): string {
    const dateTimeHelper = new DateTimeDataHelper();
    const dynamicDataGenerator = new DynamicDataGenerator()
    return value
        .replace(/{timestamp}/g, dateTimeHelper.getFullDate())
        .replace(/{random}/g, dynamicDataGenerator.random4Digits())
        .replace(/{random2}/g, dynamicDataGenerator.random2DigitInRange())  // Use 2-digit range replacement
        .replace(/{single_date}/g, dateTimeHelper.getSingleDate()) // get only date "dd"
        .replace(/{full_date}/g, dateTimeHelper.getCurrentDayInYear()); // get "mm/dd/yyyy"
}

//----------
export function loadDataConfig(datadir: string, datatype: string, environment: string = 'local') {

    const configPath = path.resolve(__dirname, `${datadir}/data-test/${datatype}/${datatype}_data_${environment}.json`);

    if (!fs.existsSync(configPath)) {
        throw new Error(`DataConfig "${datatype}" file for environment "${environment}" not found at ${configPath}`);
    }

    try {
        const fileData = fs.readFileSync(configPath, 'utf-8');
        const configData = JSON.parse(fileData);

        // Log for debugging
        console.log(`Loaded configuration data from ${configPath}`);

        // Replace placeholders in config data
        const configString = JSON.stringify(configData, (key, value) => {
            return typeof value === 'string' ? replacePlaceholders(value) : value;
        });

        return JSON.parse(configString);
    } catch (error) {
        console.error(`Error loading or parsing JSON config file at ${configPath}:`, error);
        throw new Error(`Failed to load config file: ${error.message}`);
    }
}
