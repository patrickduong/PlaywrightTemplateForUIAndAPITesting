import fs from 'fs';
import path from 'path';

/**
 * FileHelper provides utility methods for file operations
 */
export class FileHelper {
    /**
     * Clean all files from a directory (non-recursive)
     * @param dir - Directory path to clean
     * @example FileHelper.cleanDirectory('./test-results');
     */
    static cleanDirectory(dir: string): void {
        if (fs.existsSync(dir)) {
            fs.readdirSync(dir).forEach((file) => {
                const filePath = path.join(dir, file);
                if (fs.statSync(filePath).isFile()) {
                    fs.unlinkSync(filePath); // Remove file
                }
            });
        }
    }

    /**
     * Delete a directory and all its contents
     * @param dir - Directory path to delete
     */
    static deleteDirectory(dir: string): void {
        if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true, force: true });
        }
    }
}