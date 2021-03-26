import * as vscode from 'vscode';
import * as beet from './beet';
import * as config from './config';

let cacheTask: vscode.Task;
let clearCacheTask: vscode.Task;
let linkTask: vscode.Task;
let clearLinkTask: vscode.Task;
let watchTask: vscode.Task;

export function activate(ctx: vscode.ExtensionContext) {
    config.checkPythonPath();
    updateBeetTasks();
    registerCommands(ctx);

    ctx.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration("beet.pythonPath") || e.affectsConfiguration("python.pythonPath")) {
            config.checkPythonPath();
            updateBeetTasks();
        }
    }));
}

export function deactivate() {}

function registerCommands(ctx: vscode.ExtensionContext) {
    ctx.subscriptions.push(
        vscode.commands.registerCommand("vscode-beet.build", build),
        vscode.commands.registerCommand("vscode-beet.inspect-cache", () => vscode.tasks.executeTask(cacheTask)),
        vscode.commands.registerCommand("vscode-beet.clear-cache", () => vscode.tasks.executeTask(clearCacheTask)),
        vscode.commands.registerCommand("vscode-beet.link", () => vscode.tasks.executeTask(linkTask)),
        vscode.commands.registerCommand("vscode-beet.clear-link", () => vscode.tasks.executeTask(clearLinkTask)),
        vscode.commands.registerCommand("vscode-beet.watch", () => vscode.tasks.executeTask(watchTask))
    );
}

function updateBeetTasks() {
    let python = config.getPythonPath();

    cacheTask = beet.createTask(python, "inspect cache", ["cache"]);
    clearCacheTask = beet.createTask(python, "clear cache", ["cache", "-c"]);
    linkTask = beet.createTask(python, "link", ["link"]);
    clearLinkTask = beet.createTask(python, "clear link", ["link", "-c"]);
    watchTask = beet.createTask(python, "watch", ["watch"]);
}

async function pickFile(files: vscode.Uri[], placeHolder: string): Promise<vscode.Uri | undefined> {
    if (files.length === 0) {
        return undefined;
    } else if(files.length === 1) {
        return files[0];
    }

    let options: { [key: string]: (vscode.Uri) } = {};
    files.filter((f) => f.scheme === "file").forEach((f) => {
        options[vscode.workspace.asRelativePath(f.path)] = f;
    });

    return vscode.window.showQuickPick(Object.keys(options).map((label) => ({ label })), { placeHolder }).then((selection) => {
        if (selection) {
            return options[selection.label];
        }
    });
}

async function build() {
    let configFiles = await beet.getConfigFiles();

    let configFile: vscode.Uri;
    switch(configFiles.length) {
        case 0:
            vscode.window.showErrorMessage("Beet: No config files found");
            return;
        case 1:
            configFile = configFiles[0];
        default:
            let selection = await pickFile(configFiles, "Pick beet config file");
            if(!selection) {
                return;
            }
            configFile = selection;
    }

    beet.build(config.getPythonPath(), configFile.fsPath);
}