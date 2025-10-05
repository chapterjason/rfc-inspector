#!/usr/bin/env node

import {build as esbuild, context as createContext} from "esbuild";
import {rm, mkdir} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const scriptFile = fileURLToPath(import.meta.url);
const scriptDirectory = path.dirname(scriptFile);
const projectDirectory = path.resolve(scriptDirectory, "..");
const packagesDirectory = path.resolve(projectDirectory, "..");
const repositoryRoot = path.resolve(packagesDirectory, "..");
const nodeModulesDirectory = path.join(repositoryRoot, "node_modules");
const distDirectory = path.join(projectDirectory, "dist");
const srcDirectory = path.join(projectDirectory, "src");

const workerEntryPoints = [
    "vs/language/json/json.worker.js",
    "vs/language/typescript/ts.worker.js",
    "vs/editor/editor.worker.js"
];

const workerBuildOptions = {
    entryPoints: workerEntryPoints.map((entryPoint) => path.join(nodeModulesDirectory, "monaco-editor/esm", entryPoint)),
    bundle: true,
    format: "iife",
    outbase: path.join(nodeModulesDirectory, "monaco-editor/esm"),
    outdir: distDirectory,
    platform: "browser",
    target: "es2020"
};

const appBuildOptions = {
    entryPoints: [
        path.join(srcDirectory, "index.tsx"),
    ],
    bundle: true,
    format: "esm",
    outdir: distDirectory,
    platform: "browser",
    target: "es2020",
    loader: {
        ".ttf": "file"
    }
};

(async () => {
    const mode = process.argv[2] ?? "build";

    if (mode === "build") {
        await runBuild();
        return;
    }

    if (mode === "watch") {
        await runWatch();
        return;
    }

    if (mode === "serve") {
        await runServe();
        return;
    }

    console.error(`Unknown command: ${mode}`);
    process.exitCode = 1;
})();

async function runBuild() {
    await cleanDist();
    await Promise.all([
        esbuild(workerBuildOptions),
        esbuild(appBuildOptions)
    ]);
}

async function runWatch() {
    await cleanDist();
    const workerContext = await createContext(workerBuildOptions);
    const appContext = await createContext(appBuildOptions);

    await Promise.all([
        workerContext.watch(),
        appContext.watch()
    ]);

    handleSignals(workerContext, appContext);
}

async function runServe() {
    await cleanDist();
    const workerContext = await createContext(workerBuildOptions);
    const appContext = await createContext(appBuildOptions);

    await workerContext.watch();
    const server = await appContext.serve({
        servedir: projectDirectory
    });

    console.log(`Serving on http://${server.host || "localhost"}:${server.port}`);

    handleSignals(workerContext, appContext, server);
}

async function cleanDist() {
    await rm(distDirectory, {recursive: true, force: true});
    await mkdir(distDirectory, {recursive: true});
}

function handleSignals(workerContext, appContext, server) {
    const shutdown = async () => {
        await Promise.all([workerContext.dispose(), appContext.dispose()]);
        if (server) {
            server.stop();
        }
        process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}
