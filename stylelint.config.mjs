/** @type {import('stylelint').Config} */
const config = {
	extends: ["stylelint-config-recommended-scss"],
	overrides: [
		{
			name: "Svelte component styles",
			files: ["**/*.svelte"],
			extends: ["stylelint-config-html/svelte"],
		},
		{
			name: "Standalone SCSS files",
			files: ["**/*.scss"],
			customSyntax: "postcss-scss",
		},
	],
	reportInvalidScopeDisables: true,
	reportNeedlessDisables: true,
	rules: {
		"alpha-value-notation": null,
		"at-rule-empty-line-before": null,
		"color-function-alias-notation": null,
		"color-function-notation": null,
		"color-hex-length": null,
		"declaration-empty-line-before": null,
		"font-family-name-quotes": null,
		"keyframes-name-pattern": null,
		"no-invalid-position-declaration": null,
		"property-no-deprecated": null,
		"property-no-vendor-prefix": null,
		"rule-empty-line-before": null,
		"scss/comment-no-empty": null,
		"selector-class-pattern": null,
		"selector-pseudo-class-no-unknown": [
			true,
			{
				ignorePseudoClasses: ["global"],
			},
		],
		"value-keyword-case": null,
	},
};

export default config;
