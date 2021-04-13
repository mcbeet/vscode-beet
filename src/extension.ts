import * as vscode from 'vscode';
import * as beet from './beet';
import * as config from './config';
import * as minecraft from './minecraft';
import * as utils from './utils';
import * as path from 'path';

let SAVES: minecraft.Save[];

let cacheTask: vscode.Task;
let clearCacheTask: vscode.Task;
let clearLinkTask: vscode.Task;
let watchTask: vscode.Task;

export function activate(ctx: vscode.ExtensionContext) {
    // Fetch worlds
    minecraft.getSaves().then((saves) => {
        SAVES = saves;
    });

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
        vscode.commands.registerCommand("vscode-beet.build", () => build()),
        vscode.commands.registerCommand("vscode-beet.inspect-cache", () => vscode.tasks.executeTask(cacheTask)),
        vscode.commands.registerCommand("vscode-beet.clear-cache", () => vscode.tasks.executeTask(clearCacheTask)),
        vscode.commands.registerCommand("vscode-beet.link-world", () => linkWorld()),
        vscode.commands.registerCommand("vscode-beet.clear-link", () => vscode.tasks.executeTask(clearLinkTask)),
        vscode.commands.registerCommand("vscode-beet.watch", () => vscode.tasks.executeTask(watchTask))
    );
}

function updateBeetTasks() {
    let python = config.getPythonPath();

    cacheTask = beet.createTask(python, "inspect cache", ["cache"]);
    clearCacheTask = beet.createTask(python, "clear cache", ["cache", "-c"]);
    clearLinkTask = beet.createTask(python, "clear link", ["link", "-c"]);
    watchTask = beet.createTask(python, "watch", ["watch"]);
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
            let selection = await utils.pickFile(configFiles, configFiles.map((f) => ({label: vscode.workspace.asRelativePath(f)})), "Pick beet config file");
            if(!selection) {
                return;
            }
            configFile = selection;
    }

    beet.build(config.getPythonPath(), configFile.fsPath);
}

async function linkWorld() {
    try {
        if(!SAVES) {
            SAVES = await minecraft.getSaves();
        }
    } catch(e) {
        vscode.window.showErrorMessage(`Beet: ${e.message}`);
        return;
    }

    if(SAVES.length === 0) {
        vscode.window.showErrorMessage("Beet: Minecraft saves folder doesn't contain any worlds");
        return;
    }

    const items = await Promise.all(SAVES.map(async (s) => ({label: path.basename(s.uri.fsPath), description: (await s.getVersion()).name})));
    const selectedWorld = await utils.pickFile(SAVES.map(s => s.uri), items, "Pick world to link");
    if(!selectedWorld) {
        return;
    }

    try {
        await beet.link(config.getPythonPath(), selectedWorld.fsPath);
    } catch(e) {

    }
}