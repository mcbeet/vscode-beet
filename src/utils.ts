import * as vscode from 'vscode';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

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
        throw Error(`Invalid directory path: ${path}`);
    }
}

export async function pickFile(placeHolder: string, files: vscode.Uri[], descriptions?: string[], openDialogOptions?: vscode.OpenDialogOptions): Promise<vscode.Uri | undefined> {
    if (files.length === 0) {
        return undefined;
    } else if(files.length === 1) {
        return files[0];
    }

    const items: vscode.QuickPickItem[] = [
        {
            label: "Enter path ...",
            detail: "Enter path or find file"
        },
        ...<vscode.QuickPickItem[]> files.map((file, i) => ({
            label: path.basename(file.fsPath),
            detail: file.fsPath,
            description: descriptions? descriptions[i] : undefined
        }))
    ];

    const selection = await vscode.window.showQuickPick(items, { placeHolder, matchOnDescription: true});

    if(selection?.detail === "Enter path or find file") {
        const selectedFiles = await vscode.window.showOpenDialog(openDialogOptions);
        return selectedFiles ? selectedFiles[0] : undefined;
    }

    const options: { [key: string]: (vscode.Uri) } = {};
    files.forEach((f, i) => {
        options[files[i].fsPath] = f;
    });
    return selection?.detail ? options[selection.detail] : undefined;
}

export function distanceToWorkspaceRoot(uri: vscode.Uri) {
    const root = vscode.workspace.getWorkspaceFolder(uri);
    if(root === undefined) return Number.MAX_SAFE_INTEGER;

    return path.posix.relative(root.uri.path, uri.path).split(path.posix.sep).length;
}