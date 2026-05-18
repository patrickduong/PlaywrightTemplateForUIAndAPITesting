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
    if (!fs.existsSync(dir)) {
      // Create directory if it doesn't exist
      fs.mkdirSync(dir, { recursive: true });
      return;
    }

    try {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile()) {
          fs.unlinkSync(filePath); // Remove file
        } else if (stat.isDirectory()) {
          // For directories, we can choose to delete recursively or skip
          this.cleanDirectory(filePath);
          fs.rmdirSync(filePath);
        }
      });
    } catch (error) {
      throw new Error(
        `Failed to clean directory ${dir}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Delete a directory and all its contents
   * @param dir - Directory path to delete
   */
  static deleteDirectory(dir: string): void {
    if (fs.existsSync(dir)) {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
      } catch (error) {
        throw new Error(
          `Failed to delete directory ${dir}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  }

  /**
   * Read file content as string
   * @param filePath - Path to the file
   * @returns File content
   */
  static readFile(filePath: string): string {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      throw new Error(
        `Failed to read file ${filePath}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Read JSON file
   * @param filePath - Path to the JSON file
   * @returns Parsed JSON object
   */
  static readJSON<T = Record<string, unknown>>(filePath: string): T {
    try {
      const content = this.readFile(filePath);
      return JSON.parse(content) as T;
    } catch (error) {
      throw new Error(
        `Failed to parse JSON from ${filePath}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Write content to file
   * @param filePath - Path to the file
   * @param content - Content to write
   */
  static writeFile(filePath: string, content: string): void {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, content, 'utf-8');
    } catch (error) {
      throw new Error(
        `Failed to write file ${filePath}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Write JSON to file
   * @param filePath - Path to the file
   * @param data - Object to write as JSON
   * @param pretty - Pretty print JSON
   */
  static writeJSON(
    filePath: string,
    data: Record<string, unknown>,
    pretty = true
  ): void {
    try {
      const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
      this.writeFile(filePath, content);
    } catch (error) {
      throw new Error(
        `Failed to write JSON to ${filePath}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Check if file exists
   * @param filePath - Path to check
   * @returns True if file exists
   */
  static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  }

  /**
   * Check if directory exists
   * @param dirPath - Path to check
   * @returns True if directory exists
   */
  static dirExists(dirPath: string): boolean {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  }
}