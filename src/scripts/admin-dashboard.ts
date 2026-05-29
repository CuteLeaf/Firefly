import { runtimeConfig } from "@/lib/runtime-config";
import type { BlogPost, Project, Profile, Work } from "@/lib/blogspring-types";

type MediaAsset = {
  relativePath: string;
  publicUrl: string;
  originalFilename: string;
  mimeType?: string;
  sizeInBytes?: number;
};

type StatusType = "info" | "success" | "error";

type AdminState = {
  token: string;
  projects: Project[];
  posts: BlogPost[];
  works: Work[];
  profile: Profile | null;
};

const state: AdminState = {
  token: "",
  projects: [],
  posts: [],
  works: [],
  profile: null
};

const storageKey = "portfolio-admin-token";
const mediaBase = runtimeConfig.mediaBaseUrl.replace(/\/$/, "");

const statusColors = {
  info: "text-neutral-600 dark:text-neutral-300",
  success: "text-green-600 dark:text-green-400",
  error: "text-red-600 dark:text-red-400"
} as const;

function setUploadStatus(selector: string, message: string) {
  const el = document.querySelector(selector) as HTMLElement | null;
  if (el) {
    el.textContent = message;
  }
}

function setStatus(message: string, type: StatusType = "info") {
  const box = document.getElementById("admin-status");
  if (!box) return;
  box.className = `mt-4 text-sm ${statusColors[type]}`;
  box.textContent = message;
}

function ensureToken() {
  if (!state.token) {
    throw new Error("请先填写后台 Token");
  }
}

function toRelativePath(url?: string | null): string {
  if (!url) return "";
  let normalized = url.trim().replace(/\/$/, "");
  while (normalized.startsWith(mediaBase)) {
    normalized = normalized.slice(mediaBase.length);
    normalized = normalized.replace(/^\/+/, "");
  }
  const marker = "/api/files/";
  const markerIndex = normalized.lastIndexOf(marker);
  if (markerIndex !== -1) {
    normalized = normalized.slice(markerIndex + marker.length);
  }
  return normalized.replace(/^\/+/, "");
}

async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  ensureToken();
  const response = await fetch(`${runtimeConfig.adminApiBaseUrl}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {})
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `请求失败: ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  const text = await response.text();
  if (!text) {
    return null as T;
  }
  return JSON.parse(text) as T;
}

function resetForm(form: HTMLFormElement) {
  form.reset();
  const idInput = form.elements.namedItem("id") as HTMLInputElement | null;
  if (idInput) {
    idInput.value = "";
  }
}

function tagsToString(tags?: string[]) {
  return tags && tags.length ? tags.join(", ") : "";
}

function stringToTags(value?: string | null) {
  if (!value) return [] as string[];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function loadProfile() {
  try {
    const profile = await adminFetch<Profile>("/profile");
    state.profile = profile;
    const form = document.getElementById("profile-form") as HTMLFormElement | null;
    if (profile && form) {
      (form.elements.namedItem("fullName") as HTMLInputElement).value = profile.fullName ?? "";
      (form.elements.namedItem("headline") as HTMLInputElement).value = profile.headline ?? "";
      (form.elements.namedItem("bio") as HTMLTextAreaElement).value = profile.bio ?? "";
      (form.elements.namedItem("email") as HTMLInputElement).value = profile.email ?? "";
      (form.elements.namedItem("phone") as HTMLInputElement).value = profile.phone ?? "";
      (form.elements.namedItem("wechat") as HTMLInputElement).value = profile.wechat ?? "";
      (form.elements.namedItem("location") as HTMLInputElement).value = profile.location ?? "";
      (form.elements.namedItem("jobTitle") as HTMLInputElement).value = profile.jobTitle ?? "";
      (form.elements.namedItem("heroImagePath") as HTMLInputElement).value = toRelativePath(profile.heroImageUrl);
      (form.elements.namedItem("resumePath") as HTMLInputElement).value = toRelativePath(profile.resumeUrl);
      (form.elements.namedItem("primaryCtaLabel") as HTMLInputElement).value = profile.primaryCtaLabel ?? "";
      (form.elements.namedItem("primaryCtaLink") as HTMLInputElement).value = profile.primaryCtaLink ?? "";
      (form.elements.namedItem("secondaryCtaLabel") as HTMLInputElement).value = profile.secondaryCtaLabel ?? "";
      (form.elements.namedItem("secondaryCtaLink") as HTMLInputElement).value = profile.secondaryCtaLink ?? "";
      (form.elements.namedItem("socialLinks") as HTMLTextAreaElement).value = profile.socialLinks
        ? JSON.stringify(profile.socialLinks)
        : "";
      setUploadStatus("#profile-hero-status", profile.heroImageUrl ? `已关联：${toRelativePath(profile.heroImageUrl)}` : "尚未上传");
      setUploadStatus("#profile-resume-status", profile.resumeUrl ? `已关联：${toRelativePath(profile.resumeUrl)}` : "尚未上传");
    }
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), "error");
  }
}

function renderList(
  containerId: string,
  items: Array<{ id: number; title: string; subtitle?: string; status?: string; extra?: string }>,
  type: "project" | "post" | "work"
) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!items.length) {
    container.innerHTML = `<p class="text-sm text-neutral-500 dark:text-neutral-400">暂无数据，先新增一条吧。</p>`;
    return;
  }

  const LIST_LIMIT = 5;
  const listId = `${containerId}-items`;
  const showAll = container.dataset.showAll === "true";
  const displayItems = showAll ? items : items.slice(0, LIST_LIMIT);
  const hasMore = items.length > LIST_LIMIT;

  const rows = displayItems
    .map(
      (item) => `
        <tr data-entity="${type}" data-id="${item.id}">
          <td>
            <div class="font-medium text-sm">${item.title}</div>
            ${item.subtitle ? `<div class="text-xs text-neutral-500 dark:text-neutral-400 truncate" style="max-width: 200px;" title="${item.subtitle}">${item.subtitle}</div>` : ""}
          </td>
          <td class="text-sm">${item.status || ""}</td>
          <td class="text-xs text-neutral-500">${item.extra || ""}</td>
          <td>
            <div class="admin-table-actions">
              <button type="button" data-edit-${type}="${item.id}" class="text-xs">编辑</button>
              <button type="button" data-delete-${type}="${item.id}" class="text-xs">删除</button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");

  container.innerHTML = `
    <div class="mb-2 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
      <span>共 ${items.length} 条${showAll ? "" : `，显示前 ${displayItems.length} 条`}</span>
      ${hasMore ? `<button type="button" class="text-primary hover:underline" onclick="this.closest('[id]').dataset.showAll='${!showAll}'; ${type === 'project' ? 'window.loadProjects' : type === 'post' ? 'window.loadPosts' : 'window.loadWorks'}();">${showAll ? '收起' : '显示全部'}</button>` : ''}
    </div>
    <div class="admin-table-wrapper" id="${listId}">
      <table class="admin-table">
        <thead>
          <tr>
            <th>标题</th>
            <th>状态</th>
            <th>备注</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

async function loadProjects() {
  try {
    const projects = await adminFetch<Project[]>("/projects");
    state.projects = projects;
    renderList(
      "projects-list",
      projects.map((project) => ({
        id: project.id,
        title: project.title,
        subtitle: project.link,
        status: project.published ? "已发布" : "隐藏",
        extra: project.featured ? "精选" : ""
      })),
      "project"
    );
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), "error");
  }
}

async function loadPosts() {
  try {
    const posts = await adminFetch<BlogPost[]>("/blog-posts");
    state.posts = posts;
    renderList(
      "posts-list",
      posts.map((post) => ({
        id: post.id,
        title: post.title,
        subtitle: post.slug,
        status: post.published ? "已发布" : "草稿",
        extra: post.featured ? "精选" : ""
      })),
      "post"
    );
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), "error");
  }
}

async function loadWorks() {
  try {
    const works = await adminFetch<Work[]>("/works");
    state.works = works;
    renderList(
      "works-list",
      works.map((work) => ({
        id: work.id,
        title: work.name,
        subtitle: work.url,
        status: work.isShow ? "显示" : "隐藏",
        extra: `排序: ${work.sortOrder ?? 0}`
      })),
      "work"
    );
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), "error");
  }
}

function fillProjectForm(id: number) {
  const project = state.projects.find((item) => item.id === id);
  const form = document.getElementById("project-form") as HTMLFormElement | null;
  if (!project || !form) return;
  (form.elements.namedItem("id") as HTMLInputElement).value = String(project.id ?? "");
  (form.elements.namedItem("title") as HTMLInputElement).value = project.title ?? "";
  (form.elements.namedItem("link") as HTMLInputElement).value = project.link ?? "";
  (form.elements.namedItem("description") as HTMLTextAreaElement).value = project.description ?? "";
  (form.elements.namedItem("coverImagePath") as HTMLInputElement).value = toRelativePath(project.coverImageUrl);
  (form.elements.namedItem("videoPath") as HTMLInputElement).value = toRelativePath(project.videoUrl);
  (form.elements.namedItem("tags") as HTMLInputElement).value = tagsToString(project.tags);
  (form.elements.namedItem("sortOrder") as HTMLInputElement).value = String(project.sortOrder ?? 0);
  (form.elements.namedItem("featured") as HTMLInputElement).checked = Boolean(project.featured);
  (form.elements.namedItem("published") as HTMLInputElement).checked = project.published !== false;
  setUploadStatus("#project-cover-status", project.coverImageUrl ? `已关联：${toRelativePath(project.coverImageUrl)}` : "尚未上传");
  setUploadStatus("#project-video-status", project.videoUrl ? `已关联：${toRelativePath(project.videoUrl)}` : "尚未上传");
}

function fillPostForm(id: number) {
  const post = state.posts.find((item) => item.id === id);
  const form = document.getElementById("post-form") as HTMLFormElement | null;
  if (!post || !form) return;
  (form.elements.namedItem("id") as HTMLInputElement).value = String(post.id ?? "");
  (form.elements.namedItem("title") as HTMLInputElement).value = post.title ?? "";
  (form.elements.namedItem("slug") as HTMLInputElement).value = post.slug ?? "";
  (form.elements.namedItem("summary") as HTMLTextAreaElement).value = post.summary ?? "";
  (form.elements.namedItem("content") as HTMLTextAreaElement).value = post.content ?? "";
  (form.elements.namedItem("coverImagePath") as HTMLInputElement).value = toRelativePath(post.coverImageUrl);
  if (post.publishDate) {
    const dateInput = form.elements.namedItem("publishDate") as HTMLInputElement;
    dateInput.value = new Date(post.publishDate).toISOString().slice(0, 16);
  }
  (form.elements.namedItem("tags") as HTMLInputElement).value = tagsToString(post.tags);
  (form.elements.namedItem("featured") as HTMLInputElement).checked = Boolean(post.featured);
  (form.elements.namedItem("published") as HTMLInputElement).checked = post.published !== false;
  setUploadStatus("#post-cover-status", post.coverImageUrl ? `已关联：${toRelativePath(post.coverImageUrl)}` : "尚未上传");
  if (post.content) {
    setUploadStatus("#post-markdown-status", "已载入当前文章内容，可重新选择 Markdown 文件覆盖");
  }
}

function fillWorkForm(id: number) {
  const work = state.works.find((item) => item.id === id);
  const form = document.getElementById("work-form") as HTMLFormElement | null;
  if (!work || !form) return;
  (form.elements.namedItem("id") as HTMLInputElement).value = String(work.id ?? "");
  (form.elements.namedItem("name") as HTMLInputElement).value = work.name ?? "";
  (form.elements.namedItem("url") as HTMLInputElement).value = work.url ?? "";
  (form.elements.namedItem("description") as HTMLTextAreaElement).value = work.description ?? "";
  (form.elements.namedItem("imagePath") as HTMLInputElement).value = toRelativePath(work.imageUrl);
  (form.elements.namedItem("videoPath") as HTMLInputElement).value = toRelativePath(work.videoUrl);
  (form.elements.namedItem("tags") as HTMLInputElement).value = tagsToString(work.tags);
  (form.elements.namedItem("sortOrder") as HTMLInputElement).value = String(work.sortOrder ?? 0);
  (form.elements.namedItem("isShow") as HTMLInputElement).checked = work.isShow !== false;
  setUploadStatus("#work-image-status", work.imageUrl ? `已关联：${toRelativePath(work.imageUrl)}` : "尚未上传");
  setUploadStatus("#work-video-status", work.videoUrl ? `已关联：${toRelativePath(work.videoUrl)}` : "尚未上传");
}

async function deleteEntity(type: "project" | "post" | "work", id: number) {
  const typeMap = {
    project: { name: "项目", endpoint: "projects" },
    post: { name: "文章", endpoint: "blog-posts" },
    work: { name: "作品", endpoint: "works" }
  };
  const config = typeMap[type];
  const confirmed = window.confirm(`确定删除该${config.name}吗？`);
  if (!confirmed) return;
  await adminFetch(`/${config.endpoint}/${id}`, { method: "DELETE" });
  setStatus("删除成功", "success");
  if (type === "project") {
    await loadProjects();
  } else if (type === "post") {
    await loadPosts();
  } else {
    await loadWorks();
  }
}

export default function initAdminDashboard() {
  if (typeof window === "undefined") return;
  const tokenInput = document.getElementById("admin-token") as HTMLInputElement | null;
  if (!tokenInput) return;
  setupUploaders();

  (window as any).loadProjects = loadProjects;
  (window as any).loadPosts = loadPosts;
  (window as any).loadWorks = loadWorks;

  state.token = localStorage.getItem(storageKey) || "";
  if (state.token) {
    tokenInput.value = state.token;
    loadProfile();
    loadProjects();
    loadPosts();
    loadWorks();
  }

  tokenInput.addEventListener("input", () => {
    state.token = tokenInput.value.trim();
    if (state.token) {
      localStorage.setItem(storageKey, state.token);
      loadProfile();
      loadProjects();
      loadPosts();
      loadWorks();
    } else {
      localStorage.removeItem(storageKey);
    }
  });

  const profileForm = document.getElementById("profile-form") as HTMLFormElement | null;
  profileForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(profileForm);
      let socialLinks: { [key: string]: string } = {};
      const socialValue = formData.get("socialLinks")?.toString().trim();
      if (socialValue) {
        socialLinks = JSON.parse(socialValue);
      }
      const payload = {
        fullName: formData.get("fullName")?.toString().trim(),
        headline: formData.get("headline")?.toString().trim(),
        bio: formData.get("bio")?.toString().trim(),
        email: formData.get("email")?.toString().trim(),
        phone: formData.get("phone")?.toString().trim(),
        wechat: formData.get("wechat")?.toString().trim(),
        location: formData.get("location")?.toString().trim(),
        jobTitle: formData.get("jobTitle")?.toString().trim(),
        heroImagePath: formData.get("heroImagePath")?.toString().trim(),
        resumePath: formData.get("resumePath")?.toString().trim(),
        primaryCtaLabel: formData.get("primaryCtaLabel")?.toString().trim(),
        primaryCtaLink: formData.get("primaryCtaLink")?.toString().trim(),
        secondaryCtaLabel: formData.get("secondaryCtaLabel")?.toString().trim(),
        secondaryCtaLink: formData.get("secondaryCtaLink")?.toString().trim(),
        socialLinks
      };
      await adminFetch("/profile", { method: "PUT", body: JSON.stringify(payload) });
      setStatus("个人信息已更新", "success");
      await loadProfile();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error), "error");
    }
  });

  const projectForm = document.getElementById("project-form") as HTMLFormElement | null;
  projectForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(projectForm);
      const payload = {
        title: formData.get("title")?.toString().trim(),
        link: formData.get("link")?.toString().trim(),
        description: formData.get("description")?.toString().trim(),
        coverImagePath: formData.get("coverImagePath")?.toString().trim(),
        videoPath: formData.get("videoPath")?.toString().trim(),
        tags: stringToTags(formData.get("tags")?.toString()),
        sortOrder: Number(formData.get("sortOrder") || 0),
        featured: (projectForm.elements.namedItem("featured") as HTMLInputElement).checked,
        published: (projectForm.elements.namedItem("published") as HTMLInputElement).checked
      };
      const id = formData.get("id")?.toString();
      if (id) {
        await adminFetch(`/projects/${id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await adminFetch("/projects", { method: "POST", body: JSON.stringify(payload) });
      }
      setStatus("项目已保存", "success");
      resetForm(projectForm);
      await loadProjects();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error), "error");
    }
  });

  document.querySelector("[data-reset-project]")?.addEventListener("click", () => {
    if (projectForm) {
      resetForm(projectForm);
    }
  });

  const postForm = document.getElementById("post-form") as HTMLFormElement | null;
  postForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(postForm);
      const publishValue = formData.get("publishDate")?.toString();
      const payload = {
        title: formData.get("title")?.toString().trim(),
        slug: formData.get("slug")?.toString().trim(),
        summary: formData.get("summary")?.toString().trim(),
        content: formData.get("content")?.toString(),
        coverImagePath: formData.get("coverImagePath")?.toString().trim(),
        publishDate: publishValue ? new Date(publishValue).toISOString() : new Date().toISOString(),
        tags: stringToTags(formData.get("tags")?.toString()),
        featured: (postForm.elements.namedItem("featured") as HTMLInputElement).checked,
        published: (postForm.elements.namedItem("published") as HTMLInputElement).checked
      };
      const id = formData.get("id")?.toString();
      if (id) {
        await adminFetch(`/blog-posts/${id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await adminFetch("/blog-posts", { method: "POST", body: JSON.stringify(payload) });
      }
      setStatus("文章已保存", "success");
      resetForm(postForm);
      await loadPosts();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error), "error");
    }
  });

  document.querySelector("[data-reset-post]")?.addEventListener("click", () => {
    if (postForm) {
      resetForm(postForm);
    }
  });

  const workForm = document.getElementById("work-form") as HTMLFormElement | null;
  workForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(workForm);
      const payload = {
        name: formData.get("name")?.toString().trim(),
        url: formData.get("url")?.toString().trim(),
        description: formData.get("description")?.toString().trim(),
        imagePath: formData.get("imagePath")?.toString().trim(),
        videoPath: formData.get("videoPath")?.toString().trim(),
        tags: stringToTags(formData.get("tags")?.toString()),
        sortOrder: Number(formData.get("sortOrder") || 0),
        isShow: (workForm.elements.namedItem("isShow") as HTMLInputElement).checked
      };
      const id = formData.get("id")?.toString();
      if (id) {
        await adminFetch(`/works/${id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await adminFetch("/works", { method: "POST", body: JSON.stringify(payload) });
      }
      setStatus("作品已保存", "success");
      resetForm(workForm);
      await loadWorks();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error), "error");
    }
  });

  document.querySelector("[data-reset-work]")?.addEventListener("click", () => {
    if (workForm) {
      resetForm(workForm);
    }
  });

  document.getElementById("projects-list")?.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const editBtn = target.closest("[data-edit-project]") as HTMLElement | null;
    if (editBtn) {
      fillProjectForm(Number(editBtn.dataset.editProject));
      return;
    }
    const deleteBtn = target.closest("[data-delete-project]") as HTMLElement | null;
    if (deleteBtn) {
      await deleteEntity("project", Number(deleteBtn.dataset.deleteProject));
    }
  });

  document.getElementById("posts-list")?.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const editBtn = target.closest("[data-edit-post]") as HTMLElement | null;
    if (editBtn) {
      fillPostForm(Number(editBtn.dataset.editPost));
      return;
    }
    const deleteBtn = target.closest("[data-delete-post]") as HTMLElement | null;
    if (deleteBtn) {
      await deleteEntity("post", Number(deleteBtn.dataset.deletePost));
    }
  });

  document.getElementById("works-list")?.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const editBtn = target.closest("[data-edit-work]") as HTMLElement | null;
    if (editBtn) {
      fillWorkForm(Number(editBtn.dataset.editWork));
      return;
    }
    const deleteBtn = target.closest("[data-delete-work]") as HTMLElement | null;
    if (deleteBtn) {
      await deleteEntity("work", Number(deleteBtn.dataset.deleteWork));
    }
  });

  const uploadForm = document.getElementById("upload-form") as HTMLFormElement | null;
  uploadForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      ensureToken();
      const formData = new FormData(uploadForm);
      const response = await fetch(`${runtimeConfig.adminApiBaseUrl}/media/upload`, {
        method: "POST",
        headers: { "X-ADMIN-TOKEN": state.token },
        body: formData
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `上传失败: ${response.status}`);
      }
      const asset = await response.json();
      const resultBox = document.getElementById("upload-result");
      if (resultBox) {
        resultBox.innerHTML = `
          <p>上传成功，可引用路径：<code>${asset.relativePath}</code></p>
          <p>完整 URL：<a href="${asset.publicUrl}" target="_blank">${asset.publicUrl}</a></p>
        `;
      }
      uploadForm.reset();
      setStatus("文件上传成功", "success");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error), "error");
    }
  });
}

if (typeof window !== "undefined") {
  initAdminDashboard();
}

function setupUploaders() {
  const mediaInputs = document.querySelectorAll<HTMLInputElement>("[data-upload-target]");
  mediaInputs.forEach((input) => {
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;
      if (!state.token) {
        setStatus("请先输入后台 Token 再上传文件", "error");
        input.value = "";
        return;
      }
      const targetName = input.dataset.uploadTarget || "";
      const category = input.dataset.uploadCategory || "misc";
      const statusSelector = input.dataset.uploadStatus;
      const statusEl = statusSelector ? (document.querySelector(statusSelector) as HTMLElement | null) : null;
      if (statusEl) statusEl.textContent = "上传中...";
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category);
        const asset = await uploadMediaFile(formData);
        const hidden = input.form?.elements.namedItem(targetName) as HTMLInputElement | null;
        if (hidden) {
          hidden.value = asset.relativePath;
        }
        if (statusEl) {
          statusEl.textContent = `已上传：${asset.relativePath}`;
        }
      } catch (error) {
        if (statusEl) {
          statusEl.textContent = "上传失败";
        }
        setStatus(error instanceof Error ? error.message : String(error), "error");
      }
    });
  });

  const markdownInputs = document.querySelectorAll<HTMLInputElement>("[data-markdown-target]");
  markdownInputs.forEach((input) => {
    const statusSelector = input.dataset.uploadStatus;
    const statusEl = statusSelector ? (document.querySelector(statusSelector) as HTMLElement | null) : null;
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;
      const targetName = input.dataset.markdownTarget || "";
      const textarea = input.form?.elements.namedItem(targetName) as HTMLTextAreaElement | null;
      if (!textarea) return;
      if (statusEl) statusEl.textContent = "读取 Markdown 中...";
      const reader = new FileReader();
      reader.onload = () => {
        textarea.value = typeof reader.result === "string" ? reader.result : "";
        if (statusEl) statusEl.textContent = `已读取：${file.name}`;
      };
      reader.onerror = () => {
        if (statusEl) statusEl.textContent = "读取失败";
      };
      reader.readAsText(file, "utf-8");
    });
  });
}

async function uploadMediaFile(formData: FormData): Promise<MediaAsset> {
  ensureToken();
  const response = await fetch(`${runtimeConfig.adminApiBaseUrl}/media/upload`, {
    method: "POST",
    headers: { "X-ADMIN-TOKEN": state.token },
    body: formData
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `上传失败: ${response.status}`);
  }
  return (await response.json()) as MediaAsset;
}
