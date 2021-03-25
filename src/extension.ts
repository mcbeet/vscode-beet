import * as vscode from 'vscode';
import * as beet from './beet.js';

let cacheTask: vscode.Task;
let clearCacheTask: vscode.Task;
let linkTask: vscode.Task;
let clearLinkTask: vscode.Task;
let watchTask: vscode.Task;

export function activate(ctx: vscode.ExtensionContext) {
    updateBeetTasks();
    registerCommands(ctx);

    ctx.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration("beet.pythonPath") || e.affectsConfiguration("python.pythonPath")) {
            updateBeetTasks();
        }
    }));
}

export function deactivate() {}

function registerCommands(ctx: vscode.ExtensionContext) {
    ctx.subscriptions.push(
        vscode.commands.registerCommand("vscode-beet.build", () => {
            beet.getConfigFiles()
                .then((files) => pickFile(files))
                .then((cfgFile) => beet.build(getPythonPath(), cfgFile?.fsPath));
        }),
        vscode.commands.registerCommand("vscode-beet.inspect-cache", () => vscode.tasks.executeTask(cacheTask)),
        vscode.commands.registerCommand("vscode-beet.clear-cache", () => vscode.tasks.executeTask(clearCacheTask)),
        vscode.commands.registerCommand("vscode-beet.link", () => vscode.tasks.executeTask(linkTask)),
        vscode.commands.registerCommand("vscode-beet.clear-link", () => vscode.tasks.executeTask(clearLinkTask)),
        vscode.commands.registerCommand("vscode-beet.watch", () => vscode.tasks.executeTask(watchTask))
    );
}

function updateBeetTasks() {
    let python = getPythonPath();

    cacheTask = beet.createTask(python, "inspect cache", ["cache"]);
    clearCacheTask = beet.createTask(python, "clear cache", ["cache", "-c"]);
    linkTask = beet.createTask(python, "link", ["link"]);
    clearLinkTask = beet.createTask(python, "clear link", ["link", "-c"]);
    watchTask = beet.createTask(python, "watch", ["watch"]);
}


function getPythonPath(): string {
    let path: string | undefined = vscode.workspace.getConfiguration("beet").get("pythonPath");

    if(!path || path.length === 0) {
        path = vscode.workspace.getConfiguration("python").get("pythonPath", "python");
    }

    return path;
}

async function pickFile(files: vscode.Uri[]): Promise<vscode.Uri | undefined> {
    if(files.length <= 1) {
        return undefined;
    }

    let options: {[key: string]: (vscode.Uri)} = {};
    files.filter((f) => f.scheme === "file").forEach((f) => {
        options[vscode.workspace.asRelativePath(f.path)] = f;
    });

    return vscode.window.showQuickPick(Object.keys(options).map((label) => ({label})), {placeHolder: "Pick beet config file"}).then((selection) => {
        if(selection) {
            return options[selection.label];
        }
    });
}
