import * as vscode from 'vscode';

let buildTask: vscode.Task;
let cacheTask: vscode.Task;
let clearCacheTask: vscode.Task;
let linkTask: vscode.Task;
let clearLinkTask: vscode.Task;
let watchTask: vscode.Task;

export function activate(ctx: vscode.ExtensionContext) {
    generateBeetTasks();
    registerBeetTasks(ctx);

    vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration("python.pythonPath")) {
            generateBeetTasks();
        }
    });
}

export function deactivate() {}

function generateBeetTasks() {
    let python = vscode.workspace.getConfiguration("python").get("pythonPath", "python");

    buildTask = createBeetTask(python, "build");
    cacheTask = createBeetTask(python, "cache");
    clearCacheTask = createBeetTask(python, "cache", ["-c"]);
    linkTask = createBeetTask(python, "link");
    clearLinkTask = createBeetTask(python, "link", ["-c"]);
    watchTask = createBeetTask(python, "watch");
}

function registerBeetTasks(ctx: vscode.ExtensionContext) {
    ctx.subscriptions.push(vscode.commands.registerCommand("vscode-beet.build", () => {
        vscode.tasks.executeTask(buildTask);
    }));

    ctx.subscriptions.push(vscode.commands.registerCommand("vscode-beet.cache", () => {
        vscode.tasks.executeTask(cacheTask);
    }));

    ctx.subscriptions.push(vscode.commands.registerCommand("vscode-beet.clear-cache", () => {
        vscode.tasks.executeTask(clearCacheTask);
    }));

    ctx.subscriptions.push(vscode.commands.registerCommand("vscode-beet.link", () => {
        vscode.tasks.executeTask(linkTask);
    }));

    ctx.subscriptions.push(vscode.commands.registerCommand("vscode-beet.clear-link", () => {
        vscode.tasks.executeTask(clearLinkTask);
    }));

    ctx.subscriptions.push(vscode.commands.registerCommand("vscode-beet.watch", () => {
        vscode.tasks.executeTask(watchTask);
    }));
}

function createBeetTask(python: string, taskName: string, args: string[] = []) {
    let task = new vscode.Task(
        {type: "beet", "task": taskName},
        vscode.TaskScope.Workspace,
        taskName,
        "beet",
        new vscode.ProcessExecution(python, ["-m", "beet", taskName].concat(args)),
    );

    task.presentationOptions.clear = true;

    return task;
}
