---
title: 用cloudflare Images做图片自转换
published: 2026-07-09
description: 这篇文章记录了博客图片方案的三次迭代：从依赖第三方 GitHub 镜像源的不稳定，到迁移至 Cloudflare R2 并手动转换 AVIF/WebP，再到最终利用 Cloudflare Images 实现图片自动格式转换、缩放与 CDN 长期缓存。同时分享了一段配合 Astro 的 rehype 插件代码，可在部署时自动为图片 URL 生成响应式 srcset 与最优格式，省去本地预处理步骤。
tags:
  - cloudflare
  - 记录
  - 优化博客
  - AI
category: cloudflare
draft: false
lang: zh_CN
series: cloudflare
---

# 用cloudflare Images做图片自转换
图片自动转换一直是我备忘录中的一条
自动转换大小，格式，然后长时间缓存在cdn。
## 旧旧方案
[本博客](https://blog.mckero.com/)最初用的是纯链接
> 图片储存在github→第三方镜像源→链接

这样做的好处是方便管理，没那么麻烦。
> 但是，过程中的**第三方github镜像源**，**在中国大陆方向优化实在是不理想**。

所以**我就迁移到cloudflare r2了**

## 旧方案
在用**cloudflare r2**做图床的时候，我每次都创建文件夹（**一个文章一个**）
图片都在**本地完成格式转换**（**90%转AVIF，10%转webP**），全部长时间缓存在cdn。

但是，我看到了一个github项目（懒得翻找了，想找的可以去我的github仓库列表找）他可以部署在**cloudflare worker**上
通过在url层面的处理，就可以实现自动格式转换，裁剪，缩放。

> 其实我就是闲着没事干，才用cloudflare Images，有开源的我不用，闲着没事跑来用有可能让我付费的

### url处理
既然它是用url来处理的，那我的静态博客就要在部署事就把所有我原来在r2上的不是webp和avif的图片url进行处理。

这时候我问claude，它给我推荐了一个`rehypeImageOptimization`插件
这个插件可以通过配置文件来处理特定url
```mjs title="./rehype-image-optimization.mjs"
import { visit } from 'unist-util-visit';

export function rehypeImageOptimization() {
  return (tree) => {
    visit(tree, 'element', (node) => {

      // 1. 基础防御：只处理 img 标签且有属性的
      if (node.tagName !== 'img' || !node.properties) return;

      const src = node.properties.src;
      if (!src) return;

      let urlObj;
      try {
        urlObj = new URL(src);
      } catch (e) {
        node.properties.loading = 'lazy';
        node.properties.decoding = 'async';
        return;
      }

      // 2. 业务逻辑：只处理 img.mckero.com
      if (urlObj.hostname !== 'img.mckero.com') {
        node.properties.loading = 'lazy';
        node.properties.decoding = 'async';
        return;
      }

      // 3. 不再跳过 WebP/AVIF —— Cloudflare 可以对任意源格式做尺寸缩放，
      //    并通过 format=auto 自动为浏览器输出最优格式，所以全部走转换

      // ============================================================
      // ✅ 使用 Cloudflare Image Transformations（/cdn-cgi/image/）
      // 直接在 img.mckero.com 上生效，不再依赖 opt.mckero.com Worker
      // ============================================================
      const generateCdnUrl = (targetWidth) => {
        const options = `width=${targetWidth},format=auto,quality=80`;
        return `https://img.mckero.com/cdn-cgi/image/${options}${urlObj.pathname}`;
      };

      // 生成四档 srcset
      node.properties.src = generateCdnUrl(800);
      const s500 = generateCdnUrl(500);
      const s800 = generateCdnUrl(800);
      const s1200 = generateCdnUrl(1200);
      const s1600 = generateCdnUrl(1600);

      node.properties.srcset = `${s500} 500w, ${s800} 800w, ${s1200} 1200w, ${s1600} 1600w`;
      node.properties.sizes = '(max-width: 600px) 100vw, 800px';
      node.properties.loading = 'lazy';
      node.properties.decoding = 'async';
    });
  };
}
```
> 这是最新的代码（cloudflare Images图片实时转换的，想参考旧代码请去看github的提交记录

![提交记录](https://img.mckero.com/cloudflare-Images/github-rehypeImageOptimization-git.jpg)

> 这个代码是AI写的，说实话我本身就不会写代码

> 如何给astro装插件可以问AI，我只是说可以，没说一定，我也不对这句话产生的一切后果或问题（包括间接产生的）负责！当你使用或者参考了这段代码或者我说的话，代表你已经阅读了本站的隐私政策和免责声明！
> 请勿用于生产环境，个人使用或者借鉴请审查！请仔细阅读本站隐私政策！

## 新方案
新方案是我在闲着没事的时候想到可以这样玩。
> 我其实是在逛cloudflare的时候看到了这个Images，还有每月免费转换额度。😃

我就请ai改了插件代码，然后就可以用了
> 代码看上方的

![统计](https://img.mckero.com/cloudflare-Images/cloudflare-Images-result.jpg)

**以下来自cloudflare 文档，原文是英文的，我用ai翻译成Zh_cn，不具参考意义！**

> 文档索引  
> 在以下地址获取完整的文档索引：https://developers.cloudflare.com/images/llms.txt  
> 在深入探索之前，请使用此文件发现所有可用的页面。

[跳转到内容](#%5Ftop) 

# 功能

Cloudflare 使开发者能够通过实时动态生成不同版本来大规模优化图像。

本指南介绍了所有可用于调整图像大小、裁剪、处理和应用视觉效果的参数。

## 如何应用优化

通过以下方式使用 Cloudflare 的图像优化功能：

* **URL 接口** — 直接在图像 URL 中应用参数，以指定在向浏览器提供图像时应如何进行优化。
* **Workers** — 将 Images API 直接绑定到您的 Worker，或在 `fetch` 子请求中设置 `cf.image` 选项，以构建程序化的图像工作流。

### URL 接口

根据您是优化 [远程](https://developers.cloudflare.com/images/optimization/transformations/overview/) 图像还是 [托管](https://developers.cloudflare.com/images/optimization/hosted-images/serve-uploaded-images/) 图像，Cloudflare 使用不同的 URL 结构：

* [ 远程图像（转换） ](#tab-panel-9344)
* [ 托管图像 ](#tab-panel-9345)

在优化 Images 之外的图像时，默认的转换 URL 使用以下结构：

```txt
https://<ZONE>/cdn-cgi/image/<OPTIONS>/<SOURCE-IMAGE>
```

URL 构成说明

| 部分            | 描述                                                                                                                                                                                                                                                    |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <ZONE>          | 您在 Cloudflare 的域名。可以在每个启用了转换功能的 Cloudflare 区域上请求转换。                                                                                                                                                                                                    |
| /cdn-cgi/image/ | 一个固定的前缀，用于标识此路径是优化图像的请求。要隐藏此部分，您可以设置 [转换规则](https://developers.cloudflare.com/images/optimization/transformations/rewrite-rules/) 以从自定义路径提供图像。 |
| <OPTIONS>       | 优化参数列表，用逗号分隔。一个有效的 URL 必须至少指定一个参数。                                                                                                                                                      |
| <SOURCE-IMAGE>  | 您要转换的原始图像。您可以使用源服务器上的绝对路径或以 https:// 或 http:// 开头的绝对 URL。                                                                                                                                                                    |

对于存储在 Cloudflare Images 中的图像，请使用带有变体或自定义选项的交付 URL：

```txt
https://imagedelivery.net/<ACCOUNT_HASH>/<IMAGE-ID>/<VARIANT-OR-OPTIONS>
```

URL 构成说明

| 部分                 | 描述                                                                                                                                                                                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| imagedelivery.net    | 用于优化 Images 中托管的图像的共享 Cloudflare 域名。作为替代方案，您也可以 [从自己的域名提供图像](https://developers.cloudflare.com/images/optimization/hosted-images/serve-from-custom-domains/)。                 |
| <ACCOUNT\_HASH>      | 您 Cloudflare 账户的唯一标识符。您可以在 [Cloudflare 仪表板 ↗](https://dash.cloudflare.com/?to=/:account/images/hosted) 的 **Images** > **Developer Resources** 下找到您的账户哈希值。                                                   |
| <IMAGE-ID>           | 托管图像的唯一标识符。当您上传到 Images 时，Cloudflare 会自动生成一个图像 ID。您也可以设置 [自定义 ID](https://developers.cloudflare.com/images/storage/upload-images/upload-custom-path/) 以使用您自己的路径结构。 |
| <VARIANT-OR-OPTIONS> | 在此处，您可以指定一个 [预定义的变体](https://developers.cloudflare.com/images/optimization/hosted-images/create-variants/) 或用逗号分隔的优化参数列表。一个有效的 URL 必须指定一个变体或至少一个参数。     |

### Workers

当使用 [Images with Workers](https://developers.cloudflare.com/images/optimization/transformations/transform-via-workers/) 时，您可以：

* 应用自定义逻辑来设置优化操作的顺序。例如，默认情况下，Images 会在 `rotate` 之前应用 `flip`；相反，您可以使用 Images 绑定来自定义优化工作流，以在翻转图像之前旋转它。
* 使用自定义 URL 方案来代替默认的 URL 结构。
* 实施内容协商，以根据设备和网络状况动态调整图像大小、格式和质量。

---

## 参数

### `anim`

指定是否保留输入文件中的动画帧。

* `true`（默认）— 输出包含所有帧的动画图像。
* `false` — 将动画输入的第一帧转换为静态图像。

在放大图像或处理任意用户上传的内容时，建议使用此设置，因为动画 GIF 的文件大小可能很大，从而增加页面加载时间。使用 `format=json` 时，设置 `anim=false` 也很有用，可以更快速地获取响应，而无需帧数信息。

| ![原始动画](https://developers.cloudflare.com/_astro/anim.B4kULVAW.gif) | ![anim=false 输出](https://developers.cloudflare.com/_astro/anim.Cxswk-aF.png) |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **原始**                                                                      | anim=false                                                                       |

* [ URL 格式 ](#tab-panel-9296)
* [ Workers ](#tab-panel-9297)

```txt
anim=false
```

**JavaScript**

```js
cf: {image: {anim: false}}
```

### `background`

指定一种不透明或透明的颜色来填充图像中的空白或透明像素。默认值为 `%23FFFFFF`（白色）。

接受以下属性：

* HEX 颜色代码，格式为 `%23RRGGBB`。
* CSS 颜色名称，例如 `white` 或 `red`。
* `rgb()` 或 `rgba()` CSS 颜色函数，例如 `rgba(250,40,145,0.5)`。

背景颜色在具有透明像素的图像中可见，包括使用 `fit=pad` 调整大小的图像。

| ![原始图像](https://developers.cloudflare.com/_astro/original.DuemPfHh.jpg) | ![background=red 输出](https://developers.cloudflare.com/_astro/background-red.BDIBWvns.jpg) |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **原始**1080 x 720                                                            | **输出**1080 x 900                                                                           |

* [ URL 格式 ](#tab-panel-9298)
* [ Workers ](#tab-panel-9299)

```txt
background=%23ff0000
background=red
background=rgb%28240%2C40%2C145%29
```

**JavaScript**

```js
cf: {image: {background: "#RRGGBB"}}
cf: {image: {background: "rgba(240,40,145,0)"}}
```

### `blur`

对图像应用模糊半径。接受从 `0`（无模糊）到 `250`（最大模糊）的整数。默认值为 `0`。

当通过 URL 进行优化时，不应使用此参数来可靠地模糊图像内容，因为可以修改 URL 以移除模糊参数。相反，您可以通过 Workers [限制对原始图像的访问](https://developers.cloudflare.com/images/optimization/transformations/transform-via-workers/)。

| ![原始图像](https://developers.cloudflare.com/_astro/original.DuemPfHh.jpg) | ![blur=50 输出](https://developers.cloudflare.com/_astro/blur-50.CHVCNtdi.jpg) |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **原始**                                                                      | blur=50                                                                          |

* [ URL 格式 ](#tab-panel-9300)
* [ Workers ](#tab-panel-9301)

```txt
blur=50
```

**JavaScript**

```js
cf: {image: {blur: 50}}
```

### `border`

在图像周围添加边框。

注意

此功能仅适用于 Workers。

接受以下属性：

* `color` — 设置边框的颜色。接受任何有效的 CSS 颜色值，例如 `#FF0000`、`rgb(0,0,0)` 或 `red`。
* `width` — 在所有四边设置统一的边框宽度（像素）。
* `top`、`right`、`bottom`、`left` — 为单独的边设置边框宽度（像素）。

边框是在图像调整大小之后应用的。边框宽度会随 [dpr](https://developers.cloudflare.com/images/optimization/features#dpr) 参数自动缩放，以确保在高分辨率屏幕上的清晰度。

* [ Workers ](#tab-panel-9293)

**JavaScript**

```js
cf: {image: {border: {color: "rgb(0,0,0,0)", top: 5, right: 10, bottom: 5, left: 10}}}
cf: {image: {border: {color: "#FFFFFF", width: 10}}}
```

### `brightness`

使用乘数调整图像的整体亮度。

* `1`（默认）— 对原始亮度无更改。
* `< 1.0` — 使图像变暗，例如 `0.5` 表示亮度为一半。
* `> 1.0` — 使图像变亮，例如 `2` 表示亮度为两倍。

| ![原始图像](https://developers.cloudflare.com/_astro/original.DuemPfHh.jpg) | ![brightness=0.5 输出](https://developers.cloudflare.com/_astro/brightness-0.5.D3jxMNxf.jpg) | ![brightness=2 输出](https://developers.cloudflare.com/_astro/brightness-2.D-IbGyod.jpg) |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **原始**                                                                      | brightness=0.5                                                                                 | brightness=2                                                                               |

* [ URL 格式 ](#tab-panel-9302)
* [ Workers ](#tab-panel-9303)

```txt
brightness=0.5
```

**JavaScript**

```js
cf: {image: {brightness: 0.5}}
```

### `compression`

选择压缩速度最快的输出格式。接受 `fast`。默认为 none。

`compression=fast` 选项优先考虑编码速度，而不是输出质量和文件大小，并且通常会覆盖 `format` 参数，选择 JPEG 而不是更高效的格式（如 AVIF 或 WebP）。这会略微减少缓存未命中时的延迟，但可能会导致文件大小增加和图像质量降低。

除非在特殊情况下（例如调整不可缓存的动态生成图像的大小），否则不建议使用此选项。

* [ URL 格式 ](#tab-panel-9304)
* [ Workers ](#tab-panel-9305)

```txt
compression=fast
```

**JavaScript**

```js
cf: {image: {compression: "fast"}}
```

### `contrast`

使用乘数调整图像最暗和最亮部分之间的整体差异。

* `1`（默认）— 对原始对比度无更改。
* `< 1.0` — 降低对比度，使阴影变浅，高光变深。
* `> 1.0` — 增加对比度，将阴影推向黑色，将高光推向白色。

| ![原始图像](https://developers.cloudflare.com/_astro/original.DuemPfHh.jpg) | ![contrast=0.5 输出](https://developers.cloudflare.com/_astro/contrast-0.5.BJSw_Q0N.jpg) | ![contrast=2 输出](https://developers.cloudflare.com/_astro/contrast-2.yLjBBcQQ.jpg) |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| **原始**                                                                      | contrast=0.5                                                                               | contrast=2                                                                             |

* [ URL 格式 ](#tab-panel-9306)
* [ Workers ](#tab-panel-9307)

```txt
contrast=0.5
```

**JavaScript**

```js
cf: {image: {contrast: 0.5}}
```

### `dpr`

通过乘数缩放输出分辨率以匹配用户的特定屏幕密度（例如 Retina 或 4K）。默认值为 `1`，它以请求的精确宽度和高度提供图像。支持的最大值为 `2`。

现代设备的物理像素多于 CSS 像素。如果您在高 DPR 智能手机的 300px 容器中提供 300px 的图像，它看起来会很模糊。使用 `dpr=2` 告诉 Cloudflare 为同一个 300px 容器发送 600px 的图像，从而产生更清晰、更锐利的图像。

`dpr` 参数可以与 `srcset` 一起使用，以 [提供响应式图像](https://developers.cloudflare.com/images/optimization/make-responsive-images/)。

| ![dpr=1 输出](https://developers.cloudflare.com/_astro/dpr-1.kw44tjdd.jpg) | ![dpr=2 输出](https://developers.cloudflare.com/_astro/dpr-2.frEHI63e.jpg) |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| width=300,height=200,dpr=1                                                   | width=300,height=200,dpr=2                                                   |

* [ URL 格式 ](#tab-panel-9308)
* [ Workers ](#tab-panel-9309)

```txt
dpr=1
```

**JavaScript**

```js
cf: {image: {dpr: 1}}
```

### `fit`

指定图像如何适应目标区域。

适应操作是在设置图像的 [width](#width) 和 [height](#height) 尺寸之后执行的。

| 选项               | 结果                                                        | 保持原始纵横比 | 放大 |
| -------------------- | ------------------------------------------------------------- | --------------------------- | -------- |
| scale-down (默认) | 显示整个图像而不裁剪或放大               | Yes                         | No       |
| contain              | 显示整个图像而不裁剪                            | Yes                         | Yes      |
| cover                | 填充整个请求区域，必要时进行裁剪            | No                          | Yes      |
| crop                 | 填充整个请求区域，但从不放大            | No                          | No       |
| aspect-crop          | 裁剪以匹配目标纵横比，但从不放大     | No                          | No       |
| pad                  | 适应目标区域，为剩余区域添加空间   | Yes                         | Yes      |
| squeeze              | 缩放到精确尺寸，必要时进行扭曲               | No                          | Yes      |
| scale-up             | 放大时显示整个图像，但从不缩小 | Yes                         | Yes      |

* [ URL 格式 ](#tab-panel-9310)
* [ Workers ](#tab-panel-9311)

```txt
fit=pad
```

**JavaScript**

```js
cf: {image: {fit: "pad"}}
```

#### `scale-down`

调整图像大小以适应指定的尺寸，同时保持其原始纵横比，但从不放大图像。这是默认的 `fit` 行为。

当原始图像小于目标区域时，它以其原始尺寸返回。例如，请求以 2000x2000 提供 1080x720 的图像将返回 1080x720 的图像。

当较大时，它会缩小图像以适应目标区域，同时匹配原始纵横比。

在下面的示例中，1080x720 的图像被调整为适应 500x500 的目标区域。由于 `scale-down` 保持了原始纵横比（3:2），因此输出图像的最终尺寸为 500x333。

| ![原始图像](https://developers.cloudflare.com/_astro/pete-landscape.C1O-FBM1.jpg) | ![目标区域](https://developers.cloudflare.com/_astro/1296x1296.BYEj6EvB.png) | ![fit=scale-down 输出](https://developers.cloudflare.com/_astro/pete-contain.B_qfOwMN.png) |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **原始**1080 x 720 (3:2)                                                            | **请求**500 x 500 (1:1)                                                    | **输出**500 x 333 (3:2)                                                                    |

#### `contain`

调整图像大小，使其在目标 `width` 和 `height` 尺寸内尽可能大，同时保持其原始纵横比。

当原始图像大于目标区域时，它会缩小以适应目标区域（像 `scale-down`）。

当较小时，它会放大（像 `scale-up`）。与 [upscale](#upscale) 参数配合使用以控制放大图像的算法。要避免放大，请使用 `scale-down`。

#### `cover`

填充整个目标区域，必要时缩小或放大图像。输出区域始终与请求的 `width` 和 `height` 尺寸完全匹配。

当原始纵横比与目标纵横比不同时，图像会被调整大小以覆盖整个目标区域，并且任何溢出部分都会被裁剪。使用 [gravity](#gravity) 参数控制裁剪期间保留图像的哪一部分。

与 [upscale](#upscale) 参数配合使用以控制放大图像的算法。

在下面的示例中，1080×720 的图像首先被调整为 750×500（匹配请求的高度）以适应目标区域，然后从左右边缘裁剪到其最终的 500x500 尺寸。

| ![原始图像](https://developers.cloudflare.com/_astro/pete-landscape.C1O-FBM1.jpg) | ![目标区域](https://developers.cloudflare.com/_astro/1296x1296.BYEj6EvB.png) | ![fit=cover 输出](https://developers.cloudflare.com/_astro/pete-cover.ZWLczl5t.png) |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **原始**1080 x 720 (3:2)                                                            | **请求**500 x 500 (1:1)                                                    | **输出**500 x 500 (1:1)                                                             |

当原始图像小于目标区域时，它会放大。要避免放大，请使用 `crop`。

#### `crop`

调整图像大小以填充目标区域而不放大。

当原始图像小于目标区域时，它保持其原始大小和纵横比（像 `scale-down`）。

在下面的示例中，原始图像（1080x720）小于目标区域（1296x1296），因此它保持其原始大小和纵横比。

| ![原始图像](https://developers.cloudflare.com/_astro/pete-landscape.C1O-FBM1.jpg) | ![目标区域](https://developers.cloudflare.com/_astro/1296x1296.BYEj6EvB.png) | ![fit=crop 输出](https://developers.cloudflare.com/_astro/pete-landscape.C1O-FBM1.jpg) |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **原始**1080 x 720 (3:2)                                                            | **请求**1296 x 1296 (1:1)                                                  | **输出**1080 x 720 (3:2)                                                               |

当原始图像大于目标区域时，它的行为类似于 `cover`（填充目标区域并裁剪其余部分）。

#### `aspect-crop`

裁剪图像以匹配目标纵横比，必要时缩小但从不放大。

当原始图像大于目标区域时，它会缩小到仍然填充目标尺寸的最小尺寸，然后被裁剪以匹配目标纵横比（像 `cover`）。

当原始图像小于目标区域时，它保持其原始大小，但被裁剪以匹配目标纵横比。与保留较小图像的原始大小和尺寸的 `crop` 不同，`aspect-crop` 始终强制执行目标纵横比。

例如，在 1920x1120 处请求的 612x613 图像不会被放大。相反，它保持其原始大小并被裁剪为 612x357，匹配 1920:1120 的纵横比。使用 [gravity](#gravity) 参数控制裁剪期间保留图像的哪一部分。

#### `pad`

调整图像大小，使其在尺寸内尽可能大。如果适用，输出区域将被扩展以完全匹配 `width` 和 `height` 尺寸。

与 `background` 参数配合使用以填充任何空白或透明像素。但是，对于 Web 应用程序，您通常可以通过将 `contain` 选项与 CSS `object-fit: contain` 属性一起使用来实现相同的视觉效果，从而避免将填充像素编码到图像本身中。

在下面的示例中，原始图像（1080x720）小于目标区域（1080x1080），因此它为剩余像素创建空间。

| ![原始图像](https://developers.cloudflare.com/_astro/pete-landscape.C1O-FBM1.jpg) | ![目标区域](https://developers.cloudflare.com/_astro/1296x1296.BYEj6EvB.png) | ![fit=pad 输出](https://developers.cloudflare.com/_astro/pete-pad.Ci9pnK3M.png) |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **原始**1080 x 720 (3:2)                                                            | **请求**1080 x 1080 (1:1)                                                  | **输出**1080 x 1080 (1:1)                                                       |

#### `squeeze`

将图像调整为精确匹配请求的宽度和高度，而不裁剪边缘或约束部分。

当原始纵横比与目标纵横比不同时，图像将被扭曲以适应目标区域。

| ![原始图像](https://developers.cloudflare.com/_astro/pete-landscape.C1O-FBM1.jpg) | ![fit=squeeze 输出](https://developers.cloudflare.com/_astro/pete-squeeze.BalgFHoW.jpg) |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **原始**1080 x 720                                                                  | **输出**1080 x 540                                                                      |

| ![原始图像](https://developers.cloudflare.com/_astro/abstract.D7Gt8U3T.jpg) | ![fit=squeeze 输出](https://developers.cloudflare.com/_astro/abstract-squeeze.COdyKF4Z.jpg) |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **原始**1080 x 1080                                                           | **输出**1080 x 540                                                                          |

#### `scale-up`

调整图像大小以适应指定的尺寸，同时保持其原始纵横比，但从不缩小图像。这与 `scale-down` 相反。

当原始图像大于目标区域时，它以其原始尺寸返回。

当原始图像小于目标区域时，它会放大以适应目标尺寸。使用 [upscale](#upscale) 参数控制用于放大图像的算法 — 将 `upscale=generate` 设置为 AI 驱动的放大，或将 `upscale=interpolate`（默认）设置为双三次插值。

### `flip`

水平、垂直或双向翻转图像。

接受以下值：

* `h` — 水平翻转图像。
* `v` — 垂直翻转图像。
* `hv` — 水平和垂直翻转图像。

Flip 可以与 `rotate` 参数一起使用来设置图像的方向。翻转在旋转之前执行。例如，如果您应用 `flip=h,rotate=90`，则图像将先水平翻转，然后旋转 90 度。

| ![原始图像](https://developers.cloudflare.com/_astro/original.DuemPfHh.jpg) | ![flip=h 输出](https://developers.cloudflare.com/_astro/flip-h.Qc63pcHu.jpg) | ![flip=v 输出](https://developers.cloudflare.com/_astro/flip-v.DuCcWsSK.jpg) |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| **原始**                                                                      | flip=h                                                                         | flip=v                                                                         |

* [ URL 格式 ](#tab-panel-9312)
* [ Workers ](#tab-panel-9313)

```txt
flip=h
```

**JavaScript**

```js
cf: {image: {flip: "h"}}
```

### `format` | `f`

指定图像的输出格式。

接受以下值：

* `auto` — 自动提供请求浏览器支持的最有效格式。当您提供 [托管图像](https://developers.cloudflare.com/images/optimization/hosted-images/create-variants/) 时，这是默认的 `format` 选项。
* `avif` — 如果可能，将图像转码为 AVIF。AVIF 编码可能比编码为其他格式慢一个数量级。如果图像太大而无法快速编码为 AVIF，Cloudflare 将回退到 WebP 或 JPEG。
* `webp` — 将图像转码为 Google WebP 格式。使用 `quality=100` 返回 WebP 无损格式。
* `jpeg` — 以隔行渐进式 JPEG 格式对图像进行转码，其中数据以逐渐更高细节的多次传递进行压缩。
* `baseline-jpeg` — 以基线顺序 JPEG 格式对图像进行转码。应在目标设备不支持渐进式 JPEG 或其他现代文件格式的情况下使用。
* `json` — 将有关图像的信息作为 JSON 对象输出。这包含诸如图像大小（调整大小前后）、源图像的 MIME 类型和文件大小之类的数据。

* [ URL 格式 ](#tab-panel-9314)
* [ Workers ](#tab-panel-9315)

```txt
format=auto
f=auto
```

**JavaScript**

```js
cf: {image: {format: "avif"}}
```

要将 `format=auto` 与自定义 Worker 一起使用，您需要解析 `Accept` 标头。有关如何设置图像转换 Worker 的完整概述，请参阅 [此示例 Worker](https://developers.cloudflare.com/images/optimization/transformations/transform-via-workers/#an-example-worker)。

**用于使用 format:auto 进行图像调整大小的自定义 Worker**

```js
const accept = request.headers.get("accept");
let image = {};


if (/image\/avif/.test(accept)) {
  image.format = "avif";
} else if (/image\/webp/.test(accept)) {
  image.format = "webp";
}


return fetch(url, { cf: { image } });
```

### `gamma`

使用乘数调整图像的曝光。Gamma 控制中间调亮度，而不影响图像的最暗或最亮部分。

* `0` 和 `1`（默认）— 对原始伽玛值无更改。
* `< 1.0` — 增加中间调亮度，使图像整体看起来更亮。
* `> 1.0` — 降低中间调亮度，使图像整体看起来更暗。

| ![原始图像](https://developers.cloudflare.com/_astro/original.DuemPfHh.jpg) | ![gamma=0.5 输出](https://developers.cloudflare.com/_astro/gamma-0.5.Bcga364K.jpg) | ![gamma=2 输出](https://developers.cloudflare.com/_astro/gamma-2.BrZb1hEC.jpg) |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| **原始**                                                                      | gamma=0.5                                                                            | gamma=2                                                                          |

* [ URL 格式 ](#tab-panel-9316)
* [ Workers ](#tab-panel-9317)

```txt
gamma=0.5
```

**JavaScript**

```js
cf: {image: {gamma: 0.5}}
```

### `gravity` | `g`

指定当与 `fit=cover` 和 `fit=crop` 一起使用时应如何裁剪图像。默认情况下，Cloudflare 将朝向原始图像的中心点裁剪。

接受 `auto`、`face`、一个侧边（`left`、`right`、`top`、`bottom`）和相对坐标（`XxY`）。

* [ URL 格式 ](#tab-panel-9318)
* [ Workers ](#tab-panel-9319)

```txt
gravity=auto
g=auto
gravity=face
gravity=left
gravity=0.5x1
```

**JavaScript**

```js
cf: {image: {gravity: "auto"}}
cf: {image: {gravity: "face"}}
cf: {image: {gravity: "left"}}
cf: {image: {gravity: {x:0.5, y:0.2}}}
```

#### `auto`

使用显着性算法自动设置焦点，以检测视觉上最有趣的像素。

当您提前不知道图像内容时（例如对于用户生成的内容），这很有用。对于大型图像库（例如电子商务产品画廊），此功能消除了为每个图像手动设置焦点的需要。

| ![原始图像](https://developers.cloudflare.com/_astro/coffee-base.B2l8XteX.jpg) | ![不带 gravity=auto 的输出](https://developers.cloudflare.com/_astro/coffee-crop.BrOCyoCE.jpg) | ![带 gravity=auto 的输出](https://developers.cloudflare.com/_astro/coffee-auto.DAQPvZHc.jpg) |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **原始**                                                                         | **默认裁剪**                                                                                  | gravity=auto                                                                                   |

#### `face`

根据图像中的人脸自动设置焦点。

这可以与 [zoom](https://developers.cloudflare.com/images/optimization/features#zoom) 参数结合使用，以指定图像应裁剪到人脸的紧密程度。

| ![原始图像](https://developers.cloudflare.com/_astro/suad-kamardeen.O8gS5wPQ.jpeg) | ![不带 gravity=face 的输出](https://developers.cloudflare.com/_astro/suad-kamardeen-crop.Btvf-dvP.jpeg) | ![带 gravity=face 的输出](https://developers.cloudflare.com/_astro/suad-kamardeen-face.3ZHIZdIY.jpeg) |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **原始**                                                                             | **默认裁剪**                                                                                           | gravity=face                                                                                            |

_照片来自 [Suad Kamardeen (@suadkamardeen) 在 Unsplash 上 ↗](https://unsplash.com/photos/woman-in-black-cardigan-standing-beside-pink-flowers-UO-82DJ3rcc)_

#### `left`、`right`、`top`、`bottom`

设置图像不应被裁剪的一侧。

在下面的示例中，1080x720 的图像被裁剪为 1080x400 的区域，从其底部边缘开始：

| ![原始图像](https://developers.cloudflare.com/_astro/pete-landscape.C1O-FBM1.jpg) | ![不带 gravity=auto 的输出](https://developers.cloudflare.com/_astro/pete-bottom.BD_YS29E.jpg) |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **原始**                                                                            | gravity=bottom                                                                                    |

#### `XxY`

设置焦点 (X,Y)，以便输出图像的相对坐标定位在原始图像的相对坐标处。接受格式为 `XxY` 的坐标对，其中 X 和 Y 是介于 `0.0` 和 `1.0` 之间的小数值。

![使用相对坐标更改焦点](https://developers.cloudflare.com/_astro/xxy.pMA7L7Ny_2dl5dr.webp) 
* **水平值 (X)** — `0.0` 是图像的左边缘，`1.0` 是图像的右边缘。
* **垂直值 (Y)** — `0.0` 是图像的上边缘，`1.0` 是图像的下边缘。

下面的示例使用 0.33x0.5 重力点将 900x900 的图像裁剪为 300x900：

* 原始图像和目标区域都将设置距离左边缘 1/3 宽度和距离上边缘 1/2 高度的重力点。
* 输出重力点的相对坐标定位在原始图像的相对坐标处。也就是说，定位目标区域，使其重力点位于原始图像中的相同相对位置 (0.33, 0.5)。
* 图像的变暗部分显示请求输出之外的区域，该区域将被裁剪。
* 最终裁剪结果捕获围绕重力点 (0.33, 0.5) 的 300x900 内容。

| ![原始图像](https://developers.cloudflare.com/_astro/base.DwQU1Wiz.png) | ![在原始图像和目标区域上对齐重力点](https://developers.cloudflare.com/_astro/rel-points.tebmJ081.png) | ![使用新重力点裁剪](https://developers.cloudflare.com/_astro/rel-alignment.u2L4c77x.png) | ![最终输出](https://developers.cloudflare.com/_astro/rel-output.1DSTik2r.png) |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **原始**                                                                  | **对齐**                                                                                                             | **裁剪**                                                                                             | **输出**                                                                        |

通过 Workers 进行优化时，请使用对象 `{x, y}` 指定坐标。例如，`{fit: "cover", gravity: {x:0.5, y:0.2}}` 将裁剪每一侧，以在原始图像高度的 20% 处的点周围保留尽可能多的内容。

### `height` | `h`

使用正整数值设置输出图像的高度（像素）。默认情况下，Cloudflare 使用输入图像的原始高度。

设置 `height` 时，具体行为取决于 `fit` 参数。

* [ URL 格式 ](#tab-panel-9320)
* [ Workers ](#tab-panel-9321)

```txt
height=250
h=250
```

**JavaScript**

```js
cf: {image: {height: 250}}
```

### `metadata`

控制应为 JPEG 图像保留的不可见元数据 (EXIF) 的数量。对于所有其他输出格式（例如 WebP 或 PNG），所有元数据将始终被丢弃。

即使丢弃元数据，也会对图像应用颜色配置文件和 EXIF 旋转。

注意

如果启用了 [Polish](https://developers.cloudflare.com/images/polish/)，则所有元数据可能已被删除，此选项将不起作用。

接受以下值：

* `copyright`（默认）— 丢弃除 EXIF 版权标签之外的所有元数据。
* `keep` — 保留大部分 EXIF 元数据，包括 GPS 位置（如果存在）。
* `none` — 丢弃所有不可见的 EXIF 元数据。

* [ URL 格式 ](#tab-panel-9322)
* [ Workers ](#tab-panel-9323)

```txt
metadata=none
```

**JavaScript**

```js
cf: {image: {metadata: "none"}}
```

### `onerror`

当致命错误阻止图像转换时，将最终用户重定向到原始源图像的 URL。接受 `redirect`。默认为 none。

注意

此功能仅通过 URL 接口优化远程图像时可用。不支持托管图像。

此选项仅当图像位于同一区域（接受子域）时才有效。如果原始图像来自不同的区域，则该选项不起任何作用。

这在图像需要用户身份验证且无法通过 Workers 匿名获取图像的情况下可能很有用。但是，如果源图像非常大，则不建议使用此选项。

* [ URL 格式 ](#tab-panel-9294)

```txt
onerror=redirect
```

### `quality` | `q`

指定 JPEG、WebP 和 AVIF 格式图像的输出质量，表示为固定值或感知质量级别。默认值为 `85`。

* **固定质量** — 接受从 `1`（低质量，小文件大小）到 `100`（高质量，大文件大小）的正整数。
* **感知质量** — 接受 `high`、`medium-high`、`medium-low` 和 `low`。

当输出格式为 PNG 时，显式的 `quality` 设置允许使用格式的 PNG8（调色板）变体。

* [ URL 格式 ](#tab-panel-9324)
* [ Workers ](#tab-panel-9325)

```txt
quality=50
quality=low
q=50
```

**JavaScript**

```js
cf: {image: {quality: 50}}
cf: {image: {quality: "high"}}
```

### `rotate`

将图像旋转一定度数。接受 `90`、`180` 或 `270`。默认值为 `0`（无旋转）。

旋转在调整大小之前执行；`width` 和 `height` 选项将指图像旋转后的轴。

| ![原始图像](https://developers.cloudflare.com/_astro/original.DuemPfHh.jpg) | ![rotate=180 输出](https://developers.cloudflare.com/_astro/rotate-180.Dx3iw1mv.jpg) |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **原始**                                                                      | rotate=180                                                                             |

* [ URL 格式 ](#tab-panel-9326)
* [ Workers ](#tab-panel-9327)

```txt
rotate=90
```

**JavaScript**

```js
cf: {image: {rotate: 90}}
```

### `saturation`

使用乘数调整图像的颜色饱和度。

* `0` — 完全去饱和（灰度）。
* `< 1.0` — 降低颜色强度。例如，`0.5` 表示饱和度为一半。
* `1`（默认）— 对原始饱和度无更改。
* `> 1.0` — 增加颜色强度。例如，`2` 表示饱和度为两倍。

| ![原始图像](https://developers.cloudflare.com/_astro/original.DuemPfHh.jpg) | ![saturation=0 输出](https://developers.cloudflare.com/_astro/saturation-0.Cn9J5pmH.jpg) | ![saturation=2 输出](https://developers.cloudflare.com/_astro/saturation-2.B7Pl0-wE.jpg) |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| **原始**                                                                      | saturation=0                                                                               | saturation=2                                                                               |

* [ URL 格式 ](#tab-panel-9328)
* [ Workers ](#tab-panel-9329)

```txt
saturation=0.5
```

**JavaScript**

```js
cf: {image: {saturation: 0.5}}
```

### `segment`

通过用透明像素替换背景，自动分离图像的主体。接受 `foreground`。默认为 none。

此功能通过 [Workers AI](https://developers.cloudflare.com/workers-ai/) 使用名为 BiRefNet 的开源模型。阅读更多关于 Cloudflare 的 [负责任的 AI 方法 ↗](https://www.cloudflare.com/trust-hub/responsible-ai/) 的信息。

| ![原始图像](https://developers.cloudflare.com/_astro/original.DuemPfHh.jpg) | ![segment=foreground 输出](https://developers.cloudflare.com/_astro/segment-foreground.B6UYNLDs.png) |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **原始**                                                                      | segment=foreground                                                                                     |

* [ URL 格式 ](#tab-panel-9330)
* [ Workers ](#tab-panel-9331)

```txt
segment=foreground
```

**JavaScript**

```js
cf: {image: {segment: "foreground"}}
```

### `sharpen`

应用锐化滤镜以增强图像中的边缘定义。接受从 `0`（无锐化）到 `10`（最大锐化）的小数值。默认值为 `0`。缩小图像的推荐值为 `1`。

| ![原始图像](https://developers.cloudflare.com/_astro/original.DuemPfHh.jpg) | ![sharpen=5 输出](https://developers.cloudflare.com/_astro/sharpen-5.CyEreNja.jpg) |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **原始**                                                                      | sharpen=5                                                                            |

* [ URL 格式 ](#tab-panel-9332)
* [ Workers ](#tab-panel-9333)

```txt
sharpen=2
```

**JavaScript**

```js
cf: {image: {sharpen: 2}}
```

### `slow-connection-quality` | `scq`

每当检测到慢速连接时，覆盖 `quality` 值。接受与 [quality](#quality) 相同的固定或感知设置。默认为 none。

注意

此功能仅通过 URL 接口在基于 Chromium 的浏览器（如 Chrome、Edge 和 Opera）上进行优化时可用。

要检测慢速连接，请通过标头中的 HTTP 启用以下任何客户端提示：

```txt
accept-ch: rtt, save-data, ect, downlink
```

当存在客户端提示并且满足以下任何条件时，将应用 `slow-connection-quality`：

* [rtt ↗](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/RTT)：大于 150ms。
* [save-data ↗](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Save-Data)：值为 "on"。
* [ect ↗](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/ECT)：值为 `slow-2g|2g|3g` 之一。
* [downlink ↗](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Downlink)：小于 5Mbps。

* [ URL 格式 ](#tab-panel-9295)

```txt
slow-connection-quality=50
scq=50
```

### `trim`

移除图像周围的像素。

此功能可用于根据边框颜色或根据指定数量的像素从图像的一侧或多侧修剪图像。

Trim 会考虑 [dpr](#dpr) 参数，并在调整大小和旋转之前执行。

#### `border`

根据其边框颜色自动修剪图像的边缘。

可以使用以下参数进一步调整 `trim=border` 选项：

* `trim.border.color` — 选择要修剪的边框颜色。接受使用 CSS4 现代语法的任何 CSS 颜色。如果省略，则自动检测颜色。
* `trim.border.tolerance` — 设置检测到的像素在颜色上必须匹配的程度。接受介于 `0`（不需要匹配）和 255（必须完全匹配）之间的整数。
* `trim.border.keep` — 指定要保留不修剪的原始边框的像素数。

#### `top;right;bottom;left`

指定要从图像边缘移除的像素数。接受四个值，用分号分隔，以便一次设置图像所有四边的修剪。

所有修剪值接受整数（像素数）或介于 `0` 和 `1` 之间的小数，表示图像尺寸的一部分。例如，`0.25` 从该侧修剪 25%。

也可以使用以下参数将 Trim 应用于特定侧边：

* `trim.top` — 从图像顶部移除像素。
* `trim.left` — 从图像左侧移除像素。
* `trim.height` — 从图像上边缘设置图像的高度，然后修剪其下方的所有内容。
* `trim.width` — 从图像左边缘设置图像的宽度，然后修剪其右侧的所有内容。

* [ URL 格式 ](#tab-panel-9334)
* [ Workers ](#tab-panel-9335)

```txt
trim=border
trim.height=800
// 这将图像的高度从图像顶部设置为 800 像素，然后修剪该点下方的所有内容


trim.left=800
// 这从图像左侧移除 800 像素


trim=0.1;0.2;0.1;0.2
// 这从顶部和底部修剪 10%，从左侧和右侧修剪 20%


trim.top=0.25
// 这从顶部修剪图像高度的 25%
```

**JavaScript**

```js
cf: {image: {trim: {top: 12, right: 78, bottom: 34, left: 56, width: 678, height: 678}}}
// 使用小数从每侧修剪 10%：
cf: {image: {trim: {top: 0.1, right: 0.1, bottom: 0.1, left: 0.1}}}
```

### `upscale`

控制需要放大图像时使用的算法。此参数适用于任何放大的 [fit](#fit) 模式，例如 [contain](#contain)、[cover](#cover) 和 [scale-up](#scale-up)。当 `fit=scale-down` 或目标尺寸小于源尺寸时，它不起作用。

接受以下值：

* `interpolate`（默认）— 使用双三次插值，这可能会降低图像质量。这是未指定 `upscale` 时的默认行为。
* `generate` — 使用 AI 放大 ([ESRGAN ↗](https://github.com/xinntao/ESRGAN)) 在放大图像时产生更锐利、更详细的结果。

指定 `upscale=generate` 时，AI 模型在最近支持的比例（2x 或 4x）运行一次，然后调整为精确的目标尺寸。超过 4x 的比例因子通过 AI 放大到 4x 处理，其余部分使用双三次插值。

注意

由于 GPU 推理，`upscale=generate` 的延迟高于 `upscale=interpolate`。结果按照与其他优化相同的 [缓存规则](https://developers.cloudflare.com/images/optimization/features/#caching) 进行缓存。

* [ URL 格式 ](#tab-panel-9336)
* [ Workers ](#tab-panel-9337)

```txt
upscale=generate
```

**JavaScript**

```js
cf: {image: {upscale: "generate"}}
```

### `width` | `w`

使用正整数值设置输出图像的宽度（像素）。默认情况下，Cloudflare 使用输入图像的原始宽度。

设置 `width` 时，具体行为取决于 `fit` 参数。

接受以下值：

* 以像素为单位的数字（例如，`250`）。
* `auto` — 根据有关浏览器和设备的可用信息，自动以最佳宽度提供图像。接受 `wbreakpoints`（客户端提示）、`wmobile`（用户代理检测）和 `wdesktop`（用户代理检测）作为子参数。

* [ URL 格式 ](#tab-panel-9338)
* [ Workers ](#tab-panel-9339)

```txt
width=250
w=250
```

**JavaScript**

```js
cf: {image: {width: 250}}
```

#### `width=auto` 子参数

指定 `width=auto` 时，Cloudflare 使用来自客户端提示（由浏览器发送）的信息或通过用户代理检测作为回退来调整图像大小。

您可以使用以下子参数自定义 `width=auto` 行为：

| 子参数 | 描述                                                                   | 默认          |
| ------------- | ----------------------------------------------------------------------------- | ---------------- |
| wbreakpoints  | 覆盖默认断点宽度，以像素为单位（客户端提示）                  | 320;768;960;1200 |
| wmobile       | 覆盖移动设备的默认宽度，以像素为单位（用户代理检测）  | 768              |
| wdesktop      | 覆盖桌面设备的默认宽度，以像素为单位（用户代理检测） | 1200             |

使用 `width=auto` 优化远程图像时，每个唯一的宽度都算作单独的 [可计费转换](https://developers.cloudflare.com/images/pricing/#images-transformed)。

要了解 `width=auto` 的工作原理，请参阅我们关于 [提供响应式图像](https://developers.cloudflare.com/images/optimization/make-responsive-images/) 的指南。

* [ URL 格式 ](#tab-panel-9340)
* [ Workers ](#tab-panel-9341)

```txt
wbreakpoints=320;768;960;1920 // 将最大断点更改为 1920 像素
wbreakpoints=320;768;960;1200;1920 // 在 1920 像素处添加另一个断点
```

**JavaScript**

```js
cf: {image: {wbreakpoints: "320;768;960;1920"}}
```

### `zoom` | `face-zoom`

指定当与 `gravity=face` 选项结合使用时，图像朝向检测到的人脸裁剪的紧密程度。接受介于 `0.0`（尽可能包含更多背景）和 `1.0`（尽可能紧密地朝向人脸裁剪图像）之间的有效范围。默认值为 `0`。

* [ URL 格式 ](#tab-panel-9342)
* [ Workers ](#tab-panel-9343)

```txt
zoom=0.1
```

**JavaScript**

```js
cf: {image: {zoom: 0.5}}
```

## 推荐的图像尺寸

理想情况下，图像尺寸应与其在页面上显示的尺寸完全匹配。如果页面包含带有 `<img width="200" …>` 等标记的缩略图，则应将图像调整为 `width=200`。

要 [提供响应式图像](https://developers.cloudflare.com/images/optimization/make-responsive-images/)，您可以使用 HTML `srcset` 属性让提供商选择最佳尺寸。如果您不能使用 `<img srcset>` 标记并且必须硬编码特定的最大尺寸，Cloudflare 建议使用以下尺寸：

* 桌面浏览器最大 1920 像素。
* 平板电脑最大 960 像素。
* 手机最大 640 像素。

例如，`fit=scale-down,width=1920` 设置最大尺寸为 1920px，并确保图像不会被不必要地放大。

您可以通过 [缓存规则](https://developers.cloudflare.com/cache/how-to/cache-rules/examples/cache-device-type/) 启用 `CF-Device-Type` 标头来检测设备类型。

## 缓存

使用 Images 进行优化时，原始图像将从源服务器获取并缓存 — 遵循 HTTP 缓存、`Cache-Control` 标头等的常规规则。请求多个不同图像大小可能会重用缓存的原始图像，而不会导致来自源服务器的额外传输。

如果对源图像使用了 [自定义缓存键](https://developers.cloudflare.com/cache/how-to/cache-keys/)，则源图像可能不会被缓存，并且可能会导致对源的更多调用。

优化图像遵循其调整大小的原始图像相同的缓存规则，但最小缓存时间为 1 小时。如果您需要更频繁地更新图像，请将 `must-revalidate` 添加到 `Cache-Control` 标头。Images 服务支持缓存重新验证，因此我们建议提供带有 `Etag` 标头的图像。有关更多信息，请参阅 [缓存文档](https://developers.cloudflare.com/cache/concepts/cache-control/#revalidation)。

Cloudflare 不支持单独清除优化的图像。无法清除以 `/cdn-cgi/` 开头的 URL。但是，清除原始图像的 URL 也将清除其所有优化版本。

```json
{"@context":"https://schema.org","@type":"TechArticle","@id":"https://developers.cloudflare.com/images/optimization/features/#page","headline":"Features · Cloudflare Images docs","description":"Available Cloudflare Images optimization parameters for resizing, cropping, format conversion, and visual effects.","url":"https://developers.cloudflare.com/images/optimization/features/","inLanguage":"en","image":"https://developers.cloudflare.com/dev-products-preview.png","dateModified":"2026-06-16","publisher":{"@type":"Organization","name":"Cloudflare","url":"https://www.cloudflare.com/"},"isPartOf":{"@type":"WebSite","@id":"https://developers.cloudflare.com/#website","name":"Cloudflare Docs","url":"https://developers.cloudflare.com/"}}
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"item":{"@id":"/directory/","name":"Directory"}},{"@type":"ListItem","position":2,"item":{"@id":"/images/","name":"Cloudflare Images"}},{"@type":"ListItem","position":3,"item":{"@id":"/images/optimization/","name":"Optimization"}},{"@type":"ListItem","position":4,"item":{"@id":"/images/optimization/features/","name":"Features"}}]}
```