import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as which from 'which';
import * as os from 'os';
import * as utils from './utils';

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
    let mcPath: string | undefined = vscode.workspace.getConfiguration("beet").get("minecraftPath");
    if(!mcPath || mcPath.length === 0) {
        return await locateMinecraft();
    }

    return mcPath;
}

async function locateMinecraft() {
    let mcPath: string | undefined;
    switch (os.platform()) {
        case 'win32':
            mcPath = path.resolve(os.homedir(), "AppData", "Roaming", ".minecraft");
            break;
        case 'darwin':
            mcPath = path.resolve(os.homedir(), "Application Support", "minecraft");
            break;
        case 'linux':
            mcPath = path.resolve(os.homedir(), ".minecraft");
            break;
        default:
            mcPath = undefined;
    }

    if(!mcPath || !await utils.isDirectory(mcPath)) {
        throw new Error("Couldn't locate minecraft");
    }

    return mcPath;
}

export function getSelectedConfigFile() {
    const config: string | undefined = vscode.workspace.getConfiguration("beet").get("selectedConfigFile");
    return config ? vscode.Uri.file(config) : undefined;
}

export function setSelectedConfigFile(uri: vscode.Uri) {
    vscode.workspace.getConfiguration("beet").update("selectedConfigFile", uri.fsPath);
}