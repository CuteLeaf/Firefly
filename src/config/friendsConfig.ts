// src/config/friendsConfig.ts
import * as yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import type { FriendLink, FriendsPageConfig } from "@/types/friendsConfig";

// 标记此文件仅在服务端运行
export const prerender = true;

// 读取友链数据
const friendsPath = path.resolve(process.cwd(), 'public/data/friends.yaml');
let friendsConfig: FriendLink[] = [];

try {
    const file = fs.readFileSync(friendsPath, 'utf8');
    friendsConfig = yaml.load(file) as FriendLink[];
} catch (error) {
    console.warn('Failed to load friends.yaml:', error);
    friendsConfig = [];
}

export const friendsPageConfig: FriendsPageConfig = {
    title: "",
    description: "",
    showCustomContent: true,
    showComment: true,
    randomizeSort: false,
};

export const getEnabledFriends = (): FriendLink[] => {
    const friends = friendsConfig?.filter(f => f.enabled) || [];
    if (friendsPageConfig.randomizeSort) {
        return friends.sort(() => Math.random() - 0.5);
    }
    return friends.sort((a, b) => (b.weight || 0) - (a.weight || 0));
};

// 导出原始配置（用于需要完整数据的场景）
export { friendsConfig };