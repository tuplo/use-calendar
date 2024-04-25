import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import unicorn from "eslint-plugin-unicorn";
import vitest from "eslint-plugin-vitest";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	unicorn.configs["flat/recommended"],
	prettier,
	{
		plugins: {
			perfectionist,
		},
		rules: {
			...perfectionist.configs["recommended-alphabetical"].rules,
			"perfectionist/sort-imports": "off",
		},
	},
	{
		files: ["**/*.tsx"],
		languageOptions: {
			parserOptions: {
				ecmaFeatures: { jsx: true },
			},
		},
		plugins: {
			react,
			"react-hooks": reactHooks,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			...react.configs.recommended.rules,
		},
		settings: {
			react: { version: "detect" },
		},
	},
	{
		files: ["*.test.ts*"],
		languageOptions: {
			globals: { ...vitest.environments.env.globals },
		},
		plugins: {
			vitest,
		},
		rules: {
			...vitest.configs.recommended.rules,
		},
	},
	{
		rules: {
			"react/react-in-jsx-scope": "off",
			"unicorn/numeric-separators-style": "off",
			"unicorn/prefer-top-level-await": "off",
			"unicorn/prevent-abbreviations": "off",
		},
	},
];
