import stylelintOrder from "stylelint-order";

import baseConfig from "./stylelint.config.mjs";

/** @type {import('stylelint').Config} */
const config = {
	...baseConfig,
	plugins: [...(baseConfig.plugins ?? []), stylelintOrder],
	rules: {
		...(baseConfig.rules ?? {}),
		"order/properties-alphabetical-order": true,
	},
};

export default config;
