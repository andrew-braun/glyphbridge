import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import svelte from "eslint-plugin-svelte";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
	{
		ignores: [
			"build/**",
			".svelte-kit/**",
			"coverage/**",
			"node_modules/**",
			"playwright-report/**",
			"test-results/**",
		],
	},
	js.configs.recommended,
	tseslint.configs.recommended,
	svelte.configs.recommended,
	svelte.configs.prettier,
	eslintConfigPrettier,
	{
		files: ["**/*.{js,cjs,mjs,ts,cts,mts,svelte}"],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: {
			"simple-import-sort": simpleImportSort,
			"unused-imports": unusedImports,
		},
		rules: {
			"svelte/no-navigation-without-resolve": "off",
			"svelte/no-useless-children-snippet": "off",
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"svelte/require-each-key": "off",
			"simple-import-sort/exports": "error",
			"simple-import-sort/imports": [
				"error",
				{
					groups: [["^\\u0000"], ["^node:"], ["^@?\\w"], ["^\\$"], ["^"], ["^\\."]],
				},
			],
			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": [
				"warn",
				{
					args: "after-used",
					argsIgnorePattern: "^_",
					vars: "all",
					varsIgnorePattern: "^_",
				},
			],
		},
	},
	{
		files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
		languageOptions: {
			parserOptions: {
				extraFileExtensions: [".svelte"],
				parser: tseslint.parser,
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
);
