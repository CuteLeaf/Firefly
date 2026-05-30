export type Project = {
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
};

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  contentHtml?: string;
  headings?: {
    slug: string;
    text: string;
    depth: number;
  }[];
  coverImageUrl?: string;
  publishDate: string;
  featured?: boolean;
  tags?: string[];
};

export type Profile = {
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
};

export type Work = {
  id: number;
  name: string;
  description?: string;
  url: string;
  imageUrl?: string;
  videoUrl?: string;
  tags?: string[];
  isShow?: boolean;
  sortOrder?: number;
};

export type MediaAsset = {
  id: number;
  originalFilename: string;
  relativePath: string;
  publicUrl: string;
  mimeType?: string;
  sizeInBytes?: number;
  category?: string;
};
