import * as vscode from 'vscode';

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
        vscode.commands.registerCommand("vscode-beet.build", buildTask),
        vscode.commands.registerCommand("vscode-beet.inspect-cache", () => vscode.tasks.executeTask(cacheTask)),
        vscode.commands.registerCommand("vscode-beet.clear-cache", () => vscode.tasks.executeTask(clearCacheTask)),
        vscode.commands.registerCommand("vscode-beet.link", () => vscode.tasks.executeTask(linkTask)),
        vscode.commands.registerCommand("vscode-beet.clear-link", () => vscode.tasks.executeTask(clearLinkTask)),
        vscode.commands.registerCommand("vscode-beet.watch", () => vscode.tasks.executeTask(watchTask))
    );
}

function updateBeetTasks() {
    let python = getPythonPath();

    cacheTask = createBeetTask(python, "inspect cache", ["cache"]);
    clearCacheTask = createBeetTask(python, "clear cache", ["cache", "-c"]);
    linkTask = createBeetTask(python, "link", ["link"]);
    clearLinkTask = createBeetTask(python, "clear link", ["link", "-c"]);
    watchTask = createBeetTask(python, "watch", ["watch"]);
}

function createBeetTask(python: string, taskName: string, beetArgs: string[] = []) {
    let task = new vscode.Task(
        {type: "beet", "task": taskName},
        vscode.TaskScope.Workspace,
        taskName,
        "beet",
        new vscode.ProcessExecution(python, ["-m", "beet"].concat(beetArgs)),
    );

    task.presentationOptions.clear = true;

    return task;
}

function getPythonPath(): string {
    let path: string | undefined = vscode.workspace.getConfiguration("beet").get("pythonPath");

    if(!path || path.length === 0) {
        path = vscode.workspace.getConfiguration("python").get("pythonPath", "python");
    }

    return path;
}

async function buildTask() {
    vscode.workspace.findFiles("**/beet*.json").then((files) => {
        if(files.length === 0) {
            return;
        }

        let options: {[key: string]: (vscode.Uri)} = {};
        files.filter((f) => f.scheme === "file").forEach((f) => {
            options[vscode.workspace.asRelativePath(f.path)] = f;
        });

        vscode.window.showQuickPick(Object.keys(options).map((label) => ({label})), {placeHolder: "Pick beet config file"}).then(async (selection) => {
            if(selection) {
                let cfgFilePath = options[selection.label].fsPath;
                vscode.tasks.executeTask(createBeetTask(getPythonPath(), "build", ["-c", cfgFilePath, "build"]));
            }
        });
    });
}