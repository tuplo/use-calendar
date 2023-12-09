import * as shell from "@tuplo/shell";

async function main() {
	const $ = shell.$({ verbose: true });

	await $`rm -rf ./node_modules/.cache`;
	await $`rm -rf coverage/`;
	await $`rm -rf .nyc_output/`;

	await $`NODE_ENV=test LOG_LEVEL=silent nyc npm run test:ci -- --coverage true`;
}

main();
