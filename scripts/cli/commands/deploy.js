import { runCommand } from "../utils/run.js";
import { detectProxy, setGitProxy } from "../utils/proxy.js";

export default async function deploy(args, flags) {
  const target = args.trim() || "git";

  console.log(`\n  Deploying via ${target}...\n`);

  // Auto-detect and configure proxy for git operations
  if (target === "git") {
    const proxy = detectProxy();
    if (proxy) {
      console.log(`  Detected proxy: ${proxy}`);
      setGitProxy(proxy);
    } else {
      console.log("  No proxy detected, using direct connection.");
    }
  }

  if (target === "vercel") {
    await runCommand("pnpm", ["build"]);
    await runCommand("npx", ["vercel", "--prod"]);
  } else if (target === "cloud") {
    await runCommand("pnpm", ["build"]);
    await runCommand("npx", ["wrangler", "deploy"]);
  } else {
    // 先提交并推送代码
    await runCommand("git", ["add", "."]);
    await runCommand("git", ["commit", "-m", "update"]);
    await runCommand("git", ["push"]);

    // 推送后立即用 vercel --prod 部署最新代码到生产环境
    await runCommand("pnpm", ["build"]);
    await runCommand("npx", ["vercel", "--prod"]);
  }

  console.log("\n  Deploy done!");
}
