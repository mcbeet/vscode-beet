import * as vscode from 'vscode';
import * as path from 'path';
import * as utils from './utils';
import * as config from './config';
import * as nbt from 'prismarine-nbt';
import * as fs from 'fs';

export class Save {
    uri: vscode.Uri;
    private _levelData: nbt.NBT | undefined = undefined;

    constructor(uri: vscode.Uri) {
        this.uri = uri;
    }

    async getLevelData() {
        if(this._levelData) {
            return this._levelData;
        }

        const levelFile = path.resolve(this.uri.fsPath, "level.dat");

        const levelFileContent = fs.readFileSync(levelFile);
        const {parsed} = await nbt.parse(levelFileContent);

        this._levelData = parsed;
        return parsed;
    }

    async getVersion() {
        const levelData =  await this.getLevelData();
        const version =  (<Record<string, nbt.Tags["compound"]>> levelData.value.Data?.value)?.Version.value;
        return {name: <string>version.Name?.value, snapshot: Boolean(<number>version.Snapshot?.value)};
    }
}

export async function getSaves() {
    let minecraftDir = await config.getMinecraftPath();

    let savesDir = path.resolve(minecraftDir, "saves");
    let saves = await utils.listDir(savesDir);
    return saves.map((f) => path.resolve(savesDir, f))
        .filter(async(f) => await utils.isDirectory(f))
        .map((f) => new Save(vscode.Uri.file(f)));
}
