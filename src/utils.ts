import * as fs from 'fs';

export function isDirectory(path: string) {
    try {
        const stats = fs.statSync(path);
        return stats.isDirectory();
    } catch(e) {
        return false;
    }
};

export function listDir(path: string) {
    try {
        return fs.readdirSync(path);
    } catch(e) {
        return [];
    }
}