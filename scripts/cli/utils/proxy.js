import { execSync } from "node:child_process";

/**
 * Auto-detect system proxy from Windows registry or environment variables.
 * Returns the proxy URL string or null if not found.
 */
export function detectProxy() {
  // 1. Check environment variables first
  const envProxy =
    process.env.HTTPS_PROXY ||
    process.env.HTTP_PROXY ||
    process.env.https_proxy ||
    process.env.http_proxy;
  if (envProxy) return envProxy;

  // 2. Check Git global config
  try {
    const gitProxy = execSync("git config --global --get http.proxy", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
    if (gitProxy) return gitProxy;
  } catch {}

  // 3. Try to read from Windows registry (Clash/V2RayN default ports)
  try {
    const result = execSync(
      'reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyServer',
      { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
    );
    const match = result.match(/ProxyServer\s+REG_SZ\s+(.+)/);
    if (match) {
      let proxy = match[1].trim();
      if (!proxy.startsWith("http")) proxy = `http://${proxy}`;
      return proxy;
    }
  } catch {}

  // 4. Try common local proxy ports
  const commonPorts = [7890, 7891, 7892, 1080, 10808, 10809, 33210];
  for (const port of commonPorts) {
    try {
      execSync(
        `netstat -ano | findstr :${port} | findstr LISTENING`,
        { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
      );
      return `http://127.0.0.1:${port}`;
    } catch {}
  }

  return null;
}

/**
 * Set git proxy config.
 */
export function setGitProxy(proxyUrl) {
  if (!proxyUrl) return;
  execSync(`git config --global http.proxy "${proxyUrl}"`, { stdio: "pipe" });
  execSync(`git config --global https.proxy "${proxyUrl}"`, { stdio: "pipe" });
}

/**
 * Unset git proxy config.
 */
export function unsetGitProxy() {
  try {
    execSync("git config --global --unset http.proxy", { stdio: "pipe" });
    execSync("git config --global --unset https.proxy", { stdio: "pipe" });
  } catch {}
}
