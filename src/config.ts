import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as which from 'which';
import * as os from 'os';
import * as nodeUtils from 'util';

export function checkPythonPath() {
    let pythonPath = getPythonPath();

    // Check if path points to executable
    if(vscode.workspace.workspaceFolders) {
        if(fs.existsSync(path.resolve(vscode.workspace.workspaceFolders[0].uri.fsPath, pythonPath))) {
            return;
        }
    }

    // Check if path is in PATH
    which(pythonPath, {}, (err) => {
        if(err) {
            vscode.window.showErrorMessage(`Beet: Invalid python path: '${pythonPath}'`);
        }
    });
}

export function getPythonPath(): string {
    let path: string | undefined = vscode.workspace.getConfiguration("beet").get("pythonPath");

    if(!path || path.length === 0) {
        path = vscode.workspace.getConfiguration("python").get("pythonPath", "python");
    }

    return path;
}

export async function getMinecraftPath() {
    let x = await locateMinecraft();
    console.log(x);
}
