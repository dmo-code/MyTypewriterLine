# My Typewriter Line

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![Open Issues](https://img.shields.io/github/issues-raw/dmo-code/myWriteLine?label=open%20issues)
![Stars](https://img.shields.io/github/stars/dmo-code/myWriteLine?style=social)
![Obsidian Plugin](https://img.shields.io/badge/Obsidian%20Plugin-Community-purple?logo=obsidian)

My Typewriter Line is an Obsidian plugin that lets you set custom top and bottom scroll padding in the editor, so your active line always stays in focus—just like a typewriter. Perfect for distraction-free, focused writing.

> **Note:** This plugin exclusively provides this single function (dynamic scroll padding adjustment via slider).

## Features

- Set custom top and bottom scroll padding (in vh) via a single slider
- Bottom value is automatically calculated (always 100 minus top)
- Keeps your cursor/active line centered or at your preferred position while typing
- Simple, distraction-free writing experience

---

## Installation

### From Obsidian Community Plugins

1. Open Obsidian and go to **Settings → Community plugins**.
2. Click on **Browse** and search for `My Typewriter Line`.
3. Click **Install** and then **Enable**.

### Manual Installation

1. Download the latest `main.js` and `manifest.json` from the [GitHub Releases](https://github.com/dmo-code/myWriteLine/releases) page.
2. Place these files in a new folder named `typewriter-scroll` inside your vault's `.obsidian/plugins/` directory.
3. Restart Obsidian and enable the plugin in **Settings → Community plugins**.

---

## Usage

1. Go to **Settings → My Typewriter Line**.
2. Adjust the **Top scroll position (vh)** using the slider. The **Bottom scroll position** is automatically set so that both always add up to 100.
3. Your active line will now stay at your preferred vertical position while you type.

---

## Example

![Example](img/image.png)

---

## Setup

![Plugin Setup](img/setup.png)

---

## Support & Feedback

- For issues or feature requests, open an issue on [GitHub](https://github.com/dmo-code/myWriteLine/issues).

---

## Developer Build Instructions

If you want to build the plugin yourself:

1. Make sure you have [Node.js](https://nodejs.org/) installed.
2. Clone this repository.
3. Run `npm install` to install dependencies.
4. Run `npm run build` to generate the `main.js` file in the `dist` folder.  
   The `manifest.json` will be copied automatically to `dist/` after build.
5. Copy `main.js` and `manifest.json` to your Obsidian plugins folder.

**Build notes:**

- The build uses TypeScript and outputs CommonJS modules for Obsidian compatibility.
- The `manifest.json` is automatically copied to the `dist` folder using a cross-platform tool.

---

## License

MIT
