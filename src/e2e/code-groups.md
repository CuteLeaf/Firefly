# Code group fixture

Test fixture for `CodeGroupManager.spec.ts`. It is only built when `FIREFLY_E2E` is set and covers the syntaxes documented in `docs/code-groups.md`.

## Label syntax

::: code-group labels=[code.js, code.py, code.html]

```js
export function greet(name) {
  return `Hello, ${name}!`;
}
```

```py
def greet(name):
    return f"Hello, {name}!"
```

```html
<p>Hello, Firefly!</p>
```

:::

::: code-group labels=[:package: npm, :package: pnpm, :yarn: yarn]

```bash
npm create astro@latest
```

```bash
pnpm create astro@latest
```

```bash
yarn create astro
```

:::

## Rich tabs

:::: code-group label="Installation choices"

::: code-tab label="npm"

Install dependencies before starting the development server.

```sh
npm install
npm run dev
```

Keep the terminal open while you preview the site.

:::

::: code-tab label="pnpm"

Install and start the project with pnpm.

```sh
pnpm install
pnpm dev
```

- Requires a recent Node.js release.
- Uses the pnpm version pinned by the project.

:::

::::

## Fence labels

::: code-group

```sh [:package: npm]
npm install rehype-code-group
```

```sh [:package: pnpm]
pnpm add rehype-code-group
```

:::

## npm2yarn

```sh npm2yarn
npm install rehype-code-group
```

## Sync, persistence and vertical layout

:::: code-group label="Install dependencies" sync="firefly-package-manager" persist="local"

::: code-tab label="npm" value="npm"

```sh
npm install
```

:::

::: code-tab label="pnpm" value="pnpm"

```sh
pnpm install
```

:::

::::

:::: code-group label="Start development server" sync="firefly-package-manager" persist="local" orientation="vertical"

::: code-tab label="npm" value="npm"

```sh
npm run dev
```

:::

::: code-tab label="pnpm" value="pnpm"

```sh
pnpm dev
```

:::

::::
