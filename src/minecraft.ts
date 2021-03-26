import * as vscode from 'vscode';
import * as path from 'path';
import * as utils from './utils';
import * as config from './config.js';

export async function getSaves() {
    let minecraftDir = await config.getMinecraftPath();

    let savesDir = path.resolve(minecraftDir, "saves");
    let saves = await utils.listDir(savesDir);
    return saves.map((f) => path.resolve(savesDir, f))
        .filter(async(f) => await utils.isDirectory(f))
        .map((f) => vscode.Uri.file(f));
}