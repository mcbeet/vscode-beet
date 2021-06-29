![](https://raw.githubusercontent.com/mcbeet/vscode-beet/main/images/banner.png)
[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/mcbeet.vscode-beet?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=mcbeet.vscode-beet)
[![GitHub](https://img.shields.io/github/license/mcbeet/vscode-beet)](https://raw.githubusercontent.com/mcbeet/vscode-beet/main/LICENSE)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Adds VS Code support for [`beet`](https://github.com/mcbeet/beet) projects.<br>
[`beet`](https://github.com/mcbeet/beet) is a development kit for creating Minecraft resource- and datapacks. It serves as a platform for a cooperative tooling ecosystem and its flexible composition model allows for customizable and user-friendly workflows.

- [Features](#Features)
    - [Linting and Completions](#Linting-and-Completions)
    - [Beet commands](#Beet-commands)
        - [Link world](#Link-world)
        - [Build](#Build)
        - [Other](#Other)
- [Changelog](https://github.com/mcbeet/vscode-beet/blob/main/CHANGELOG.md)

# Features
## Linting and Completions
### Json
Linting/Completions for Json config files matching `beet*.json` work automatically.

![](https://raw.githubusercontent.com/mcbeet/vscode-beet/main/images/demos/project_completion.gif)

### Yaml
Linting/Completions for Json config files matching `beet*.yaml` or `beet*.yml` require the [Red hat YAML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml).

### Toml
Linting/Completions for Toml config files is not yet supported

## Beet commands
### Link world
Link your project to a minecraft save:

![](https://raw.githubusercontent.com/mcbeet/vscode-beet/main/images/demos/link_world.gif)

### Build
Supports building from multiple project files:

![](https://raw.githubusercontent.com/mcbeet/vscode-beet/main/images/demos/build.gif)

### Other
![](https://raw.githubusercontent.com/mcbeet/vscode-beet/main/images/demos/commands.gif)