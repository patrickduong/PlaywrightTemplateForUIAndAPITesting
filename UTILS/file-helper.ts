import fs from 'fs';
import path from 'path';

export class FileHelper {
    static cleanDirectory(dir: string) {
        if (fs.existsSync(dir)) {
            fs.readdirSync(dir).forEach((file) => {
                const filePath = path.join(dir, file);
                if (fs.statSync(filePath).isFile()) {
                    fs.unlinkSync(filePath); // Remove file
                }
            });
        }
    }

}