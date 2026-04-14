import { cp, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = process.cwd();
const distDir = path.join(repoRoot, "dist");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: "inherit",
    shell: false,
    ...options,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function capture(command, args, { allowFailure = false } = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: false,
  });

  if (result.status !== 0) {
    if (allowFailure) {
      return "";
    }
    const stderr = result.stderr?.trim();
    if (stderr) {
      console.error(stderr);
    }
    process.exit(result.status ?? 1);
  }

  return result.stdout.trim();
}

const remoteUrl = capture("git", ["config", "--get", "remote.origin.url"]);
const userName =
  capture("git", ["config", "--get", "user.name"], { allowFailure: true }) ||
  "github-pages-bot";
const userEmail =
  capture("git", ["config", "--get", "user.email"], { allowFailure: true }) ||
  "github-pages-bot@users.noreply.github.com";

const tempDir = await mkdtemp(path.join(os.tmpdir(), "hr-pages-"));

try {
  await cp(distDir, tempDir, { recursive: true });
  await writeFile(path.join(tempDir, ".nojekyll"), "");

  run("git", ["init"], { cwd: tempDir });
  run("git", ["checkout", "-b", "gh-pages"], { cwd: tempDir });
  run("git", ["config", "user.name", userName], { cwd: tempDir });
  run("git", ["config", "user.email", userEmail], { cwd: tempDir });
  run("git", ["remote", "add", "origin", remoteUrl], { cwd: tempDir });
  run("git", ["add", "."], { cwd: tempDir });
  run("git", ["commit", "-m", "Deploy to GitHub Pages"], { cwd: tempDir });
  run("git", ["push", "--force", "origin", "gh-pages"], { cwd: tempDir });
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
