import * as vscode from 'vscode';

export function createTask(python: string, taskName: string, taskArgs: string[], configFile: string | undefined = undefined) {
    let args: string[] = [];

    if(configFile) {
        args.push("-c", configFile);
    }
    args = args.concat(taskArgs);

    let task = new vscode.Task(
        {type: "beet", "task": taskName},
        vscode.TaskScope.Workspace,
        taskName,
        "beet",
        new vscode.ProcessExecution(python, ["-m", "beet"].concat(args)),
    );

    task.presentationOptions.clear = true;

    return task;
}

export async function build(pythonPath: string, configFile: string | undefined = undefined) {
    return vscode.tasks.executeTask(createTask(pythonPath, "build", ["build"], configFile));
}

export async function link(pythonPath: string, target: string) {
    return await vscode.tasks.executeTask(createTask(pythonPath, "build", ["link", target]));
}

export async function getConfigFiles() {
    let configFiles = await vscode.workspace.findFiles("**/beet*.{json,yml,yaml}");
    configFiles = configFiles.concat(await vscode.workspace.findFiles("**/pyproject.toml"));
    return configFiles;
}