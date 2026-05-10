import { browser } from "$app/environment";

const STORAGE_KEY = "glyphbridge-theme-mode";

export type ThemeMode = "dark" | "light";

function isThemeMode(value: string | null): value is ThemeMode {
	return value === "dark" || value === "light";
}

class ThemeController {
	mode = $state<ThemeMode>("dark");
	initialized = $state(false);

	initialize() {
		if (this.initialized) {
			this.apply();
			return;
		}

		if (browser) {
			const storedMode = window.localStorage.getItem(STORAGE_KEY);
			if (isThemeMode(storedMode)) {
				this.mode = storedMode;
			}

			this.apply();
		}

		this.initialized = true;
	}

	setMode(mode: ThemeMode) {
		this.mode = mode;
		this.persist();
	}

	toggle() {
		this.setMode(this.mode === "dark" ? "light" : "dark");
	}

	private persist() {
		if (!browser) return;

		window.localStorage.setItem(STORAGE_KEY, this.mode);
		this.apply();
	}

	private apply() {
		if (!browser) return;

		document.documentElement.dataset.theme = this.mode;
		document.documentElement.style.colorScheme = this.mode;
	}
}

export const theme = new ThemeController();
