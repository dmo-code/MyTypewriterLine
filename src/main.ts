import { App, Plugin, PluginSettingTab, Setting } from "obsidian";


interface MyTypewriterLineSettings {
	scrollPaddingTop: string;
	scrollPaddingBottom: string;
}


const DEFAULT_SETTINGS: MyTypewriterLineSettings = {
	scrollPaddingTop: "40",
	scrollPaddingBottom: "60"
};

class MyTypewriterLineSettingTab extends PluginSettingTab {
	// Default values for the plugin
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

				// Section heading (avoid top-level h2)
				const heading = new Setting(containerEl)
					.setName("Scrolling")
					.setDesc("Top and bottom (vh) always add up to 100.");
				heading.setHeading?.();

				let warningEl: HTMLElement | null = null;

				const validateAndSave = async (top: string) => {
					const topNum = Number(top);
					const bottomNum = 100 - topNum;
					if (warningEl) warningEl.remove();
					if (isNaN(topNum) || topNum < 0 || topNum > 100) {
						warningEl = containerEl.createEl("div", { text: "Value must be between 0 and 100!", cls: "mod-warning" });
						return false;
					}
					this.plugin.settings.scrollPaddingTop = topNum.toString();
					this.plugin.settings.scrollPaddingBottom = bottomNum.toString();
					await this.plugin.saveSettings();
					return true;
				};

				let topValue = Number(this.plugin.settings.scrollPaddingTop);

				// Slider for top scroll position (0–100)
				new Setting(containerEl)
					.setName("Top scroll position (vh)")
					.setDesc("Determines how far the text is from the top when scrolling.")
					.addSlider((slider) => {
						slider
							.setLimits(0, 100, 1)
							.setValue(topValue)
							.setDynamicTooltip()
							.onChange(async (value: number) => {
								topValue = value;
								await validateAndSave(topValue.toString());
								// Update bottom read-only field
								if (bottomText) bottomText.setValue(String(100 - topValue));
							});
					});

				// Read-only display for bottom scroll position
				let bottomText: import("obsidian").TextComponent | null = null;
				new Setting(containerEl)
					.setName("Bottom scroll position (vh)")
					.setDesc("Automatically calculated as 100 minus Top.")
					.addText((text) => {
						bottomText = text;
						text.setValue(String(100 - topValue)).setDisabled(true);
					});

				// Reset button
				new Setting(containerEl)
					.addButton((btn) =>
						btn.setButtonText("Reset to default")
							.setCta()
							.onClick(async () => {
								this.plugin.settings = { ...this.defaultSettings };
								await this.plugin.saveSettings();
								this.display(); // Reload UI
							})
					);
			}
}

export default class MyTypewriterLinePlugin extends Plugin {
	settings!: MyTypewriterLineSettings;

       async onload() {
	       await this.loadSettings();
	       this.addSettingTab(new MyTypewriterLineSettingTab(this.app, this));
	       // Enable class and apply CSS variables
	       document.body.classList.add("mtl-enabled");
	       this.applyCss();
       }

	onunload() {
		// Remove class and custom properties
		document.body.classList.remove("mtl-enabled");
		document.body.style.removeProperty("--mtl-scroll-padding-top");
		document.body.style.removeProperty("--mtl-scroll-padding-bottom");
	}

       async loadSettings() {
	       this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
       }

	async saveSettings() {
		await this.saveData(this.settings);
		this.applyCss();
	}

	applyCss() {
		// Update CSS custom properties instead of injecting styles
		document.body.style.setProperty("--mtl-scroll-padding-top", `${this.settings.scrollPaddingTop}vh`);
		document.body.style.setProperty("--mtl-scroll-padding-bottom", `${this.settings.scrollPaddingBottom}vh`);
	}
}
