import type { NavBarConfig, NavBarLink } from "../types/config";
import { LinkPreset } from "../types/config";
import { siteConfig } from "./siteConfig";

// 根据页面开关动态生成导航栏配置
const getDynamicNavBarConfig = (): NavBarConfig => {
  const links: (NavBarLink | LinkPreset)[] = [
    LinkPreset.Home,
    LinkPreset.Archive,
  ];

  // 根据配置决定是否添加追番页面
  if (siteConfig.pages.anime) {
    links.push(LinkPreset.Anime);
  }

  // 支持自定义导航栏链接,并且支持多级菜单
  links.push({
    name: "链接",
    url: "/links/",
    icon: "material-symbols:link",
    children: [
      {
        name: "GitHub",
        url: "https://github.com/xingmih",
        external: true,
        icon: "fa6-brands:github",
      },
      {
        name: "Bilibili",
        url: "https://b23.tv/EscDwn5",
        external: true,
        icon: "fa6-brands:bilibili",
      },
    ],
  });

  links.push(LinkPreset.Friends);

  // 根据config的页面开关动态生成项目、技能、经历菜单项
  const otherChildren: NavBarLink[] = [];

  if (siteConfig.pages.projects) {
    otherChildren.push({
      name: "我的项目",
      url: "/projects/",
      icon: "material-symbols:work",
    });
  }

  if (siteConfig.pages.skills) {
    otherChildren.push({
      name: "我的技能",
      url: "/skills/",
      icon: "material-symbols:psychology",
    });
  }

  if (siteConfig.pages.timeline) {
    otherChildren.push({
      name: "我的经历",
      url: "/timeline/",
      icon: "material-symbols:timeline",
    });
  }

  links.push({
    name: "关于",
    url: "/content/",
    icon: "material-symbols:info",
    children: [LinkPreset.About, ...otherChildren],
  });
  return { links };
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
