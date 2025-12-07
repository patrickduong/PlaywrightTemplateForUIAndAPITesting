/**
 * DynamicDataGenerator provides methods to generate random and unique test data
 */
export class DynamicDataGenerator {
    /**
     * Generate a unique title using timestamp suffix
     * @param baseTitle - Base title to append timestamp to
     * @returns Unique title with timestamp
     * @example DynamicDataGenerator.generateUniqueTitle('Contact') // 'Contact_1702000000000'
     */
    static generateUniqueTitle(baseTitle: string): string {
        const uniqueSuffix = new Date().getTime();
        return `${baseTitle}_${uniqueSuffix}`;
    }

    /**
     * Generate random geographic coordinates
     * @returns Object with lat and long as strings with 6 decimal places
     * @example DynamicDataGenerator.generateRandomCoordinates() // { lat: '45.123456', long: '120.654321' }
     */
    static generateRandomCoordinates(): { lat: string; long: string } {
        const lat = (Math.random() * 90).toFixed(6);
        const long = (Math.random() * 180).toFixed(6);
        return { lat, long };
    }

    /**
     * Generate a random address
     * @returns Random address string
     * @example DynamicDataGenerator.generateRandomAddress() // 'Address_5432'
     */
    static generateRandomAddress(): string {
        return `Address_${Math.floor(Math.random() * 10000)}`;
    }

    /**
     * Generate a random pincode (11XXXX format)
     * @returns Random pincode string
     * @example DynamicDataGenerator.generateRandomPincode() // '115432'
     */
    static generateRandomPincode(): string {
        const randomFourDigits = Math.floor(1000 + Math.random() * 9000);
        return `11${randomFourDigits}`;
    }

    /**
     * Generate a random 2-digit number between 01-50
     * @returns Random 2-digit number as string
     * @example random2DigitInRange() // '07'
     */
    random2DigitInRange(): string {
        const num = Math.floor(Math.random() * 50) + 1;
        return num < 10 ? `0${num}` : `${num}`;
    }

    /**
     * Generate a random 4-digit number
     * @returns Random 4-digit number as string
     * @example random4Digits() // '7531'
     */
    random4Digits(): string {
        return Math.floor(Math.random() * 10000).toString();
    }
}