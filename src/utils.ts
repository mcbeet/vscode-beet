import * as vscode from 'vscode';
import * as fs from 'fs';
import * as util from 'util';

export async function isDirectory(path: string) {
    try {
        const stat = await util.promisify(fs.stat)(path);
        return stat.isDirectory();
    } catch(e) {
        return false;
    }
};

export async function listDir(path: string) {
    try {
        return await util.promisify(fs.readdir)(path);
    } catch(e) {
        return [];
    }
}

export async function pickFile(files: vscode.Uri[], placeHolder: string): Promise<vscode.Uri | undefined> {
    if (files.length === 0) {
        return undefined;
    } else if(files.length === 1) {
        return files[0];
    }

    let options: { [key: string]: (vscode.Uri) } = {};
    files.filter((f) => f.scheme === "file").forEach((f) => {
        options[vscode.workspace.asRelativePath(f.fsPath)] = f;
    });

    return vscode.window.showQuickPick(Object.keys(options).map((label) => ({ label })), { placeHolder }).then((selection) => {
        return selection ? options[selection.label] : undefined;
    });
}