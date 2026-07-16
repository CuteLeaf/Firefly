export async function onRequest(context) {
  const { env, request } = context;
  const baseUrl = env.BASE_URL || new URL(request.url).origin;
  const repo = env.GITHUB_REPO || "jeio258/Firefly";
  const branch = env.GITHUB_BRANCH || "master";

  const config = `
backend:
  name: github
  repo: ${repo}
  branch: ${branch}
  base_url: ${baseUrl}
  auth_endpoint: auth

locale: 'zh'
site_url: ${baseUrl}
display_url: ${baseUrl}
logo_url: ${baseUrl}/favicon.svg

publish_mode: simple
media_folder: "public/images/posts"
public_folder: "/images/posts"

collections:
  - name: "posts"
    label: "文章"
    label_singular: "文章"
    folder: "src/content/posts"
    create: true
    slug: "{{slug}}"
    fields:
      - { name: "title", label: "标题", widget: "string", required: true }
      - { name: "pubDate", label: "发布日期", widget: "datetime", format: "yyyy-MM-dd", default: "" }
      - { name: "tags", label: "标签", widget: "list" }
      - name: "category"
        label: "分类"
        widget: "select"
        options: ["技术笔记", "生活随笔", "学习记录"]
        required: false
      - { name: "description", label: "摘要", widget: "string", required: false }
      - { name: "published", label: "发布时间", widget: "datetime", format: "yyyy-MM-dd", default: "" }
      - { name: "draft", label: "草稿模式", widget: "boolean", default: false }
      - { name: "cover", label: "封面图", widget: "image", required: false }
      - { name: "body", label: "正文", widget: "markdown", required: true }
`.trim();

  return new Response(config, {
    headers: {
      "Content-Type": "text/yaml; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    }
  });
}
