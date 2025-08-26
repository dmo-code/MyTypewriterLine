"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const obsidian_1 = require("obsidian");
const DEFAULT_SETTINGS = {
    scrollPaddingTop: "40",
    scrollPaddingBottom: "60"
};
class MyTypewriterLineSettingTab extends obsidian_1.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        // Standardwerte für das Plugin
        this.defaultSettings = {
            scrollPaddingTop: "40",
            scrollPaddingBottom: "60"
        };
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "CSS Plugin Settings" });
        containerEl.createEl("div", { text: "Note: The two values for scroll position (vh) should always add up to 100." });
        let warningEl = null;
        const validateAndSave = async (top) => {
            const topNum = Number(top);
            const bottomNum = 100 - topNum;
            if (warningEl)
                warningEl.remove();
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
        // Slider für Top scroll position
        new obsidian_1.Setting(containerEl)
            .setName("Top scroll position (vh)")
            .setDesc("Bestimmt, wie weit der Text beim Scrollen vom oberen Rand entfernt ist. (0–100)")
            .addSlider((slider) => {
            slider
                .setLimits(0, 100, 1)
                .setValue(topValue)
                .setDynamicTooltip()
                .onChange(async (value) => {
                topValue = value;
                await validateAndSave(topValue.toString());
                // Update Bottom-Anzeige
                if (bottomValueEl) {
                    bottomValueEl.setText(`${100 - topValue} (Bottom scroll position)`);
                }
            });
        });
        // Anzeige für Bottom scroll position (readonly)
        let bottomValueEl = null;
        new obsidian_1.Setting(containerEl)
            .setName("Bottom scroll position (vh)")
            .setDesc("Wird automatisch berechnet: 100 minus Top scroll position.")
            .addExtraButton(btn => {
            bottomValueEl = btn.extraSettingsEl.createSpan();
            bottomValueEl.setText(`${100 - topValue} (Bottom scroll position)`);
            btn.extraSettingsEl.style.pointerEvents = "none";
        });
        // Reset-Button
        new obsidian_1.Setting(containerEl)
            .addButton((btn) => btn.setButtonText("Reset to default")
            .setCta()
            .onClick(async () => {
            this.plugin.settings = { ...this.defaultSettings };
            await this.plugin.saveSettings();
            this.display(); // UI neu laden
        }));
    }
}
class MyTypewriterLinePlugin extends obsidian_1.Plugin {
    constructor() {
        super(...arguments);
        this.styleEl = null;
    }
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
exports.default = MyTypewriterLinePlugin;
