export class DynamicDataGenerator {
    static generateUniqueTitle(baseTitle: string) {
        const uniqueSuffix = new Date().getTime(); // Using timestamp for uniqueness
        return `${baseTitle}_${uniqueSuffix}`;
    }

    static generateRandomCoordinates() {
        const lat = (Math.random() * 90).toFixed(6);  // Random latitude
        const long = (Math.random() * 180).toFixed(6); // Random longitude
        return { lat, long };
    }

    static generateRandomAddress() {
        return `Address_${Math.floor(Math.random() * 10000)}`;
    }

    static generateRandomPincode() {
        const randomFourDigits = Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999
        return `11${randomFourDigits}`;
    }

    random2DigitInRange(): string {
        const num = Math.floor(Math.random() * 50) + 1;
        return num < 10 ? `0${num}` : `${num}`;  // Ensure 2 digits
    }

    random4Digits(): string {
        return Math.floor(Math.random() * 10000).toString();
    }
}