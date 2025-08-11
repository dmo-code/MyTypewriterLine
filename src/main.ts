
import { App, Plugin, PluginSettingTab, Setting, TextComponent } from "obsidian";


interface MyTypewriterLineSettings {
	scrollPaddingTop: string;
	scrollPaddingBottom: string;
}


const DEFAULT_SETTINGS: MyTypewriterLineSettings = {
	scrollPaddingTop: "40",
	scrollPaddingBottom: "60"
};

class MyTypewriterLineSettingTab extends PluginSettingTab {
	       // Standardwerte für das Plugin
	       private readonly defaultSettings = {
		       scrollPaddingTop: "40",
		       scrollPaddingBottom: "60"
	       };
       plugin: MyTypewriterLinePlugin;

       constructor(app: App, plugin: MyTypewriterLinePlugin) {
	       super(app, plugin);
	       this.plugin = plugin;
       }

			display(): void {
				const { containerEl } = this;
				containerEl.empty();

						containerEl.createEl("h2", { text: "CSS Plugin Settings" });
						containerEl.createEl("div", { text: "Note: The two values for scroll position (vh) should always add up to 100." });



						let warningEl: HTMLElement | null = null;

						const validateAndSave = async (top: string, bottom: string) => {
							const sum = Number(top) + Number(bottom);
							if (warningEl) warningEl.remove();
							if (sum !== 100) {
								warningEl = containerEl.createEl("div", { text: "The sum of both values must be 100!", cls: "mod-warning" });
								return false;
							}
							this.plugin.settings.scrollPaddingTop = top;
							this.plugin.settings.scrollPaddingBottom = bottom;
							await this.plugin.saveSettings();
							return true;
						};

						let topValue = this.plugin.settings.scrollPaddingTop;
						let bottomValue = this.plugin.settings.scrollPaddingBottom;

						new Setting(containerEl)
							.setName("Top scroll position (vh)")
							.setDesc("Determines how far the text is from the top when scrolling. Default: 40.")
							.addText((text: TextComponent) => {
								text.setPlaceholder("40")
									.setValue(topValue)
									.onChange(async (value: string) => {
										topValue = value;
										await validateAndSave(topValue, bottomValue);
									});
							});

						new Setting(containerEl)
							.setName("Bottom scroll position (vh)")
							.setDesc("Determines how far the text is from the bottom when scrolling. Default: 60.")
							.addText((text: TextComponent) => {
								text.setPlaceholder("60")
									.setValue(bottomValue)
									.onChange(async (value: string) => {
										bottomValue = value;
										await validateAndSave(topValue, bottomValue);
									});
							});

						// Reset-Button
						new Setting(containerEl)
							.addButton((btn) =>
								btn.setButtonText("Reset to default")
									.setCta()
									.onClick(async () => {
										this.plugin.settings = { ...this.defaultSettings };
										await this.plugin.saveSettings();
										this.display(); // UI neu laden
									})
							);
			}
}

export default class MyTypewriterLinePlugin extends Plugin {
	settings!: MyTypewriterLineSettings;
	styleEl: HTMLStyleElement | null = null;

       async onload() {
	       await this.loadSettings();
	       this.addSettingTab(new MyTypewriterLineSettingTab(this.app, this));
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
			       /* Typewriter-Scrolling: universell für iPhone, iPad, Mac und PC */
			       .markdown-source-view.mod-cm6.is-live-preview .cm-scroller,
			       .markdown-source-view.mod-cm6 .cm-scroller,
			       .markdown-source-view .cm-scroller,
			       .workspace-leaf-content .cm-scroller {
				       scroll-padding-top: ${this.settings.scrollPaddingTop}vh !important;
				       scroll-padding-bottom: ${this.settings.scrollPaddingBottom}vh !important;
				       scroll-behavior: smooth;
			       }

			       /* Optional: Feintuning für sehr kleine Bildschirme (iPhone) */
			       @media (max-height: 700px) {
				       .markdown-source-view.mod-cm6.is-live-preview .cm-scroller,
				       .markdown-source-view.mod-cm6 .cm-scroller,
				       .markdown-source-view .cm-scroller {
					       scroll-padding-top: 45vh !important;
					       scroll-padding-bottom: 45vh !important;
					       scroll-behavior: smooth;
				       }
			       }
		       `;
		       if (!this.styleEl) {
			       this.styleEl = document.createElement("style");
			       document.head.appendChild(this.styleEl);
		       }
		       this.styleEl.textContent = css;
	       }
}
