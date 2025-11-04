import type { FriendLink } from "../types/config";

// 可以在src/content/spec/friends.md中编写友链页面下方的自定义内容

// 友链配置
export const friendsConfig: FriendLink[] = [
  {
    title: "阿荣博客",
    imgurl:
      "https://q1.qlogo.cn/g?b=qq&nk=2296488511&s=640",
    desc: "总有一场相遇，是互相喜欢的！",
    siteurl: "https://blog.wuenrong.com",
    tags: ["Blog", "生活"],
    weight: 10, // 权重，数字越大排序越靠前
    enabled: true, // 是否启用
  },
  {
    title: "百度",
    imgurl: "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
    desc: "百度一下,你就知道",
    siteurl: "https://www.baidu.com/",
    tags: ["搜索"],
    weight: 9,
    enabled: true,
  },

];

// 获取启用的友链并按权重排序
export const getEnabledFriends = (): FriendLink[] => {
  return friendsConfig
    .filter((friend) => friend.enabled)
    .sort((a, b) => b.weight - a.weight); // 按权重降序排序
};
