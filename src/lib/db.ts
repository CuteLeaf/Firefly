import Redis from "ioredis";

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL!);
  }
  return redis;
}

async function kvGet<T>(key: string): Promise<T | null> {
  const data = await getRedis().get(key);
  return data ? JSON.parse(data) : null;
}

async function kvSet(key: string, value: unknown): Promise<void> {
  await getRedis().set(key, JSON.stringify(value));
}

export interface Profile {
  id: number;
  fullName: string;
  headline?: string;
  bio?: string;
  email?: string;
  phone?: string;
  wechat?: string;
  location?: string;
  jobTitle?: string;
  heroImageUrl?: string;
  resumeUrl?: string;
  primaryCtaLabel?: string;
  primaryCtaLink?: string;
  secondaryCtaLabel?: string;
  secondaryCtaLink?: string;
  socialLinks?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  link: string;
  coverImageUrl?: string;
  videoUrl?: string;
  tags?: string[];
  featured?: boolean;
  published?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  contentHtml?: string;
  headings?: { slug: string; text: string; depth: number }[];
  coverImageUrl?: string;
  publishDate?: string;
  featured?: boolean;
  published?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Work {
  id: number;
  name: string;
  description?: string;
  url: string;
  imageUrl?: string;
  videoUrl?: string;
  tags?: string[];
  isShow?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

const KEYS = {
  profile: "blog:profile",
  projects: "blog:projects",
  blogPosts: "blog:posts",
  works: "blog:works",
  counters: "blog:counters",
} as const;

async function getCounters(): Promise<{ projects: number; posts: number; works: number }> {
  return (await kvGet<{ projects: number; posts: number; works: number }>(KEYS.counters)) || { projects: 0, posts: 0, works: 0 };
}

async function saveCounters(counters: { projects: number; posts: number; works: number }) {
  await kvSet(KEYS.counters, counters);
}

// Profile
export async function getProfile(): Promise<Profile | null> {
  return kvGet<Profile>(KEYS.profile);
}

export async function saveProfile(data: Partial<Profile>): Promise<Profile> {
  const existing = await kvGet<Profile>(KEYS.profile);
  const now = new Date().toISOString();
  const profile: Profile = existing
    ? { ...existing, ...data, updatedAt: now }
    : { id: 1, fullName: "", ...data, createdAt: now, updatedAt: now };
  await kvSet(KEYS.profile, profile);
  return profile;
}

// Projects
export async function getProjects(): Promise<Project[]> {
  return (await kvGet<Project[]>(KEYS.projects)) || [];
}

export async function getPublishedProjects(): Promise<Project[]> {
  const all = await getProjects();
  return all.filter((p) => p.published !== false);
}

export async function getProject(id: number): Promise<Project | undefined> {
  const all = await getProjects();
  return all.find((p) => p.id === id);
}

export async function createProject(data: Omit<Project, "id">): Promise<Project> {
  const all = await getProjects();
  const counters = await getCounters();
  counters.projects++;
  await saveCounters(counters);
  const now = new Date().toISOString();
  const project: Project = { id: counters.projects, ...data, createdAt: now, updatedAt: now };
  all.push(project);
  await kvSet(KEYS.projects, all);
  return project;
}

export async function updateProject(id: number, data: Partial<Project>): Promise<Project | null> {
  const all = await getProjects();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() };
  await kvSet(KEYS.projects, all);
  return all[idx];
}

export async function deleteProject(id: number): Promise<boolean> {
  const all = await getProjects();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  all.splice(idx, 1);
  await kvSet(KEYS.projects, all);
  return true;
}

// Blog Posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  return (await kvGet<BlogPost[]>(KEYS.blogPosts)) || [];
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const all = await getBlogPosts();
  return all.filter((p) => p.published !== false);
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const all = await getBlogPosts();
  return all.find((p) => p.slug === slug);
}

export async function getBlogPostById(id: number): Promise<BlogPost | undefined> {
  const all = await getBlogPosts();
  return all.find((p) => p.id === id);
}

export async function createBlogPost(data: Omit<BlogPost, "id">): Promise<BlogPost> {
  const all = await getBlogPosts();
  const counters = await getCounters();
  counters.posts++;
  await saveCounters(counters);
  const now = new Date().toISOString();
  const post: BlogPost = { id: counters.posts, ...data, createdAt: now, updatedAt: now };
  all.push(post);
  await kvSet(KEYS.blogPosts, all);
  return post;
}

export async function updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost | null> {
  const all = await getBlogPosts();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() };
  await kvSet(KEYS.blogPosts, all);
  return all[idx];
}

export async function deleteBlogPost(id: number): Promise<boolean> {
  const all = await getBlogPosts();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  all.splice(idx, 1);
  await kvSet(KEYS.blogPosts, all);
  return true;
}

// Works
export async function getWorks(): Promise<Work[]> {
  return (await kvGet<Work[]>(KEYS.works)) || [];
}

export async function getVisibleWorks(): Promise<Work[]> {
  const all = await getWorks();
  return all.filter((w) => w.isShow !== false);
}

export async function getWork(id: number): Promise<Work | undefined> {
  const all = await getWorks();
  return all.find((w) => w.id === id);
}

export async function createWork(data: Omit<Work, "id">): Promise<Work> {
  const all = await getWorks();
  const counters = await getCounters();
  counters.works++;
  await saveCounters(counters);
  const now = new Date().toISOString();
  const work: Work = { id: counters.works, ...data, createdAt: now, updatedAt: now };
  all.push(work);
  await kvSet(KEYS.works, all);
  return work;
}

export async function updateWork(id: number, data: Partial<Work>): Promise<Work | null> {
  const all = await getWorks();
  const idx = all.findIndex((w) => w.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() };
  await kvSet(KEYS.works, all);
  return all[idx];
}

export async function deleteWork(id: number): Promise<boolean> {
  const all = await getWorks();
  const idx = all.findIndex((w) => w.id === id);
  if (idx === -1) return false;
  all.splice(idx, 1);
  await kvSet(KEYS.works, all);
  return true;
}
