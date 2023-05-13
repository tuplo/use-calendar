import * as shell from "@tuplo/shell";

async function main() {
	const $ = shell.$({ verbose: true });

	await $`rm -rf dist`;
	await $`tsc --project tsconfig.build.json`;

	const flags = ["--bundle", "--external:react"];

	await $`esbuild src/index.ts --format=cjs --outfile=dist/index.cjs ${flags}`;
	await $`esbuild src/index.ts --format=esm --outfile=dist/index.mjs ${flags}`;

	await $`cp src/use-calendar.d.ts dist/use-calendar.d.ts`;
}

main();
