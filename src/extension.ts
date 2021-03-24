import * as vscode from 'vscode';

let buildTask = beetTask("build");
let cacheTask = beetTask("cache");
let clearCacheTask = beetTask("cache", ["-c"]);
let linkTask = beetTask("link");
let clearLinkTask = beetTask("link", ["-c"]);
let watchTask = beetTask("watch");

export function activate(ctx: vscode.ExtensionContext) {
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

export function deactivate() {}

function beetTask(taskName: string, args: string[] = []) {
    let task = new vscode.Task(
        {type: "beet", "task": taskName},
        vscode.TaskScope.Workspace,
        taskName,
        "beet",
        new vscode.ProcessExecution("${config:python.pythonPath}", ["-m", "beet", taskName].concat(args)),
    );

    task.presentationOptions.clear = true;

    return task;
}
