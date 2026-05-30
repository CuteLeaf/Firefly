import { runtimeConfig } from "@/lib/runtime-config";
import type { BlogPost, Project, Profile, Work } from "@/lib/blogspring-types";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${runtimeConfig.publicApiBaseUrl}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  const text = await response.text();
  if (!text) {
    return null as T;
  }
  return JSON.parse(text) as T;
}

export const apiClient = {
  fetchProjects() {
    return request<Project[]>("/projects");
  },
  fetchBlogPosts() {
    return request<BlogPost[]>("/blog-posts");
  },
  fetchBlogPost(slug: string) {
    return request<BlogPost>(`/blog-posts/${slug}`);
  },
  fetchProfile() {
    return request<Profile | null>("/profile");
  },
  fetchWorks() {
    return request<Work[]>("/works");
  },
};

export type { BlogPost, Project, Profile, Work } from "@/lib/blogspring-types";
