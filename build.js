import dts from "bun-plugin-dts";

// build process
await Bun.build({
	entrypoints: ["./src/index.ts"],
	outdir: "./dist",
	minify: true,
	splitting: false,
	sourcemap: "external",
	target: "bun",
	plugins: [dts()],
}).catch(console.error);
