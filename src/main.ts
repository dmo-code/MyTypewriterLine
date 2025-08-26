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

		containerEl.createEl("h2", { text: "CSS Plugin Settings" });
		containerEl.createEl("div", { text: "Note: The two values for scroll position (vh) should always add up to 100." });



		let warningEl: HTMLElement | null = null;

		const validateAndSave = async (top: string) => {
			const topNum = Number(top);
			const bottomNum = 100 - topNum;
			if (warningEl) warningEl.remove();
			if (topNum < 0 || topNum > 100) {
				warningEl = containerEl.createEl("div", { text: "Value must be between 0 and 100!", cls: "mod-warning" });
				return false;
			}
			this.plugin.settings.scrollPaddingTop = topNum.toString();
			this.plugin.settings.scrollPaddingBottom = bottomNum.toString();
			await this.plugin.saveSettings();
			return true;
		};

		let topValue = Number(this.plugin.settings.scrollPaddingTop);

		// Slider for top scroll position
		new Setting(containerEl)
			.setName("Top scroll position (vh)")
			.setDesc("Determines how far the text is from the top when scrolling. (0–100)")
			.addSlider((slider) => {
				slider
					.setLimits(0, 100, 1)
					.setValue(topValue)
					.setDynamicTooltip()
					.onChange(async (value: number) => {
						topValue = value;
						await validateAndSave(topValue.toString());
						// Update bottom value display
						if (bottomValueEl) {
							bottomValueEl.setText(`${100 - topValue} (Bottom scroll position)`);
						}
					});
			});

		// Display for bottom scroll position (readonly)
		let bottomValueEl: HTMLElement | null = null;
		new Setting(containerEl)
			.setName("Bottom scroll position (vh)")
			.setDesc("Automatically calculated: 100 minus top scroll position.")
			.addExtraButton(btn => {
				bottomValueEl = btn.extraSettingsEl.createSpan();
				bottomValueEl.setText(`${100 - topValue} (Bottom scroll position)`);
				btn.extraSettingsEl.style.pointerEvents = "none";
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
			/* Typewriter scrolling: universal for iPhone, iPad, Mac, and PC */
			.markdown-source-view.mod-cm6.is-live-preview .cm-scroller,
			.markdown-source-view.mod-cm6 .cm-scroller,
			.markdown-source-view .cm-scroller,
			.workspace-leaf-content .cm-scroller {
				scroll-padding-top: ${this.settings.scrollPaddingTop}vh !important;
				scroll-padding-bottom: ${this.settings.scrollPaddingBottom}vh !important;
				scroll-behavior: smooth;
			}

			/* Optional: fine-tuning for very small screens (iPhone) */
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
