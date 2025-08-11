
import { App, Plugin, PluginSettingTab, Setting, TextComponent } from "obsidian";

interface MyPluginSettings {
	color: string;
	fontSize: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	color: "#ff0000",
	fontSize: "16px"
};

class MyPluginSettingTab extends PluginSettingTab {
	plugin: MyCssPlugin;

	constructor(app: App, plugin: MyCssPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("h2", { text: "CSS Plugin Einstellungen" });

		new Setting(containerEl)
			.setName("Farbe")
			.setDesc("Textfarbe für das Plugin")
			.addText((text: TextComponent) => text
				.setPlaceholder("#ff0000")
				.setValue(this.plugin.settings.color)
				.onChange(async (value: string) => {
					this.plugin.settings.color = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName("Schriftgröße")
			.setDesc("Schriftgröße für das Plugin")
			.addText((text: TextComponent) => text
				.setPlaceholder("16px")
				.setValue(this.plugin.settings.fontSize)
				.onChange(async (value: string) => {
					this.plugin.settings.fontSize = value;
					await this.plugin.saveSettings();
				}));
	}
}

export default class MyCssPlugin extends Plugin {
	settings!: MyPluginSettings;
	styleEl: HTMLStyleElement | null = null;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new MyPluginSettingTab(this.app, this));
		this.applyCss();
	}

	onunload() {
		if (this.styleEl && this.styleEl.parentNode) {
			this.styleEl.parentNode.removeChild(this.styleEl);
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.applyCss();
	}

	applyCss() {
		const css = `
			body {
				--myplugin-color: ${this.settings.color};
				--myplugin-font-size: ${this.settings.fontSize};
			}
			.myplugin-demo {
				color: var(--myplugin-color);
				font-size: var(--myplugin-font-size);
			}
		`;
		if (!this.styleEl) {
			this.styleEl = document.createElement("style");
			document.head.appendChild(this.styleEl);
		}
		this.styleEl.textContent = css;
	}
}
