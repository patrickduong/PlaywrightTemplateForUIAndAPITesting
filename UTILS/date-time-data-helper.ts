
export class DateTimeDataHelper {
    currentDate: any;

    parseDuration(duration: string): [number, number] {
        const [monthString, yearString] = duration.split('/');

        // Ensure the input format is valid
        if (!monthString || !yearString) {
            throw new Error(`Invalid duration format: "${duration}". Expected format: "MM/YYYY".`);
        }

        const month = parseInt(monthString.trim(), 10); // Trim and parse month
        const year = parseInt(yearString.trim(), 10);  // Trim and parse year

        // Validate the parsed month and year
        if (
            isNaN(month) ||
            isNaN(year) ||
            month < 1 ||
            month > 12 || // Month should be in the range [1, 12]
            year < 0      // Year must be a valid positive number
        ) {
            throw new Error(`Invalid month or year in duration: "${duration}". Ensure it is in "MM/YYYY" format.`);
        }

        return [month - 1, year];
        // Convert month to zero-based index. -> wrong on this one
    }

    compareDate(targetMonth: number, targetYear: number): 'current' | 'past' | 'future' {
        this.currentDate = new Date();
        const currentMonth = this.currentDate.getMonth();
        const currentYear = this.currentDate.getFullYear();

        if (targetYear === currentYear && targetMonth === currentMonth) return 'current';
        if (targetYear < currentYear || (targetYear === currentYear && targetMonth < currentMonth)) return 'past';
        return 'future';
    }

    getMonthName(month: number): string {
        return new Date(0, month).toLocaleString('default', { month: 'long' });
    }

    getFullDate(): string {
        return Date.now().toString(); //return epoch time like '1732513931770'
    }

    getSingleDate(): string {
        return new Date(Date.now()).toLocaleString().split(',')[0].split('/')[1]; // get only date "dd"
    }

    getCurrentDayInYear(): string {
        return new Date(Date.now()).toLocaleString().split(',')[0]; // get "mm/dd/yyyy"
    }

    getFormattedDateWithOffset(offsetType: any, offsetValue: number): string {
        const today = new Date();

        switch (offsetType) {
            case 'days':
                today.setDate(today.getDate() + offsetValue);
                break;
            case 'weeks':
                today.setDate(today.getDate() + offsetValue * 7);
                break;
            case 'months':
                today.setMonth(today.getMonth() + offsetValue);
                break;
            case 'years':
                today.setFullYear(today.getFullYear() + offsetValue);
                break;
            default:
                throw new Error('Invalid offset type. Use "days", "weeks", "months", or "years".');
        }

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
}

