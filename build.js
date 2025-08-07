import dts from "bun-plugin-dts";

// build process
await Bun.build({
	entrypoints: ["./src/index.ts"],
	outdir: "./dist",
	minify: true,
	splitting: false,
	sourcemap: "external",
	target: "node",
	banner: "#!/usr/bin/env node",
	plugins: [dts()],
});
