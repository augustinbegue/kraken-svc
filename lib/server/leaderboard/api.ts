import { env } from '$env/dynamic/private';
import { prisma } from '$lib/server/db/prisma';
import type { Profile } from '@prisma/client';
import NodeCache from 'node-cache';

const url = new URL(env.API_URL);
url.searchParams.append('access_token', env.API_TOKEN);

const cache = new NodeCache();

export interface LeaderboardEntry {
    profile: Profile;
    points: number;
}
export interface Leaderboard {
    entries: LeaderboardEntry[];
    total: number;
}
const LeaderboardCacheName = 'leaderboard';
const LeaderboardTTL = 60;
export async function getLeaderboard(page?: number, limit?: number): Promise<Leaderboard> {
    if (!url) throw new Error('Could not find API_URL in environment variables');

    const cached = cache.get(`${LeaderboardCacheName}:${page}:${limit}`);
    if (cached) return cached as Leaderboard;

    let turl = new URL(url.toString());
    turl.pathname = '/leaderboard';
    if (page) {
        if (!limit) turl.searchParams.append('limit', '100');
        turl.searchParams.append('page', (page - 1).toString());
    }
    if (limit) turl.searchParams.append('limit', limit.toString());

    const res = await fetch(turl.toString());

    const data = (await res.json()) as {
        login: string,
        total_points: number
    }[];

    const logins = data.map((entry) => entry.login);
    const profiles = await prisma.profile.findMany({
        where: {
            preferred_username: {
                in: logins,
            },
        },
    });

    let entries = data.map((entry, i) => {
        const profile = profiles.find((profile) => profile.preferred_username === entry.login);
        return {
            profile,
            points: entry.total_points,
        };
    });

    entries = entries.filter((entry) => !!entry.profile);

    const leaderboard = {
        entries: entries.sort((a, b) => b.points - a.points) as LeaderboardEntry[],
        total: entries.length,
    };

    cache.set(LeaderboardCacheName, leaderboard, LeaderboardTTL);

    return leaderboard;
}
export async function getLeaderboardEntry(login: string): Promise<LeaderboardEntry | null> {
    if (!url) throw new Error('Could not find API_URL in environment variables');

    // const cached = cache.get(`${LeaderboardCacheName}:${login}`);
    // if (cached) return cached as LeaderboardEntry;

    url.pathname = `/leaderboard/user/${login}`;
    const res = await fetch(url.toString());

    if (res.ok) {
        const data = (await res.json()) as {
            login: string,
            total_points: number
        };

        const profile = await prisma.profile.findUnique({
            where: {
                preferred_username: login,
            },
        });

        const leaderboardEntry = {
            profile,
            points: data.total_points,
        };

        cache.set(`${LeaderboardCacheName}:${login}`, leaderboardEntry, LeaderboardTTL);

        return leaderboardEntry;
    }
    else {
        return null;
    }
}

export interface Reward {
    id: number;
    login: string;
    activity?: number;
    bonus: number;
}
export async function getRewards() {
    if (!url) throw new Error('Could not find API_URL in environment variables');

    url.pathname = '/items/rewards';
    const res = await fetch(url);
    const { data } = (await res.json()) as {
        data: Reward[];
    }
    return data;
}
/**
 * Create a new reward
 * @param login 
 * @param activity 
 * @param bonus_points 
 * @returns 
 */
export async function createReward(login: string, bonus_points: number, activity?: number): Promise<Reward> {
    if (!url) throw new Error('Could not find API_URL in environment variables');

    url.pathname = '/items/reward';
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            login,
            activity,
            bonus_points,
        }),
    });
    const data = await res.json();
    return data;
}

export interface Activity {
    id: number;
    name: string;
    category: number;
    points: number;
}
export async function getActivities() {
    if (!url) throw new Error('Could not find API_URL in environment variables');

    url.pathname = '/items/activity';
    const res = await fetch(url);
    const { data } = (await res.json()) as {
        data: Activity[];
    }
    return data;
}
/**
 * Create a new activity
 * @param name 
 * @param category 
 * @param points 
 * @returns 
 */
export async function createActivity(name: string, category: number, points: number): Promise<Activity> {
    if (!url) throw new Error('Could not find API_URL in environment variables');

    url.pathname = '/items/activity';
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            category,
            points,
        }),
    });
    const data = await res.json();
    return data;
}

export interface Category {
    id: number;
    name: string;
}
export async function getCategories() {
    if (!url) throw new Error('Could not find API_URL in environment variables');

    url.pathname = '/items/category';
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const { data } = (await res.json()) as {
        data: Category[];
    }
    return data;
}
/**
 * Create a new category
 * @param name 
 * @returns 
 */
export async function createCategory(name: string): Promise<Category> {
    if (!url) throw new Error('Could not find API_URL in environment variables');

    url.pathname = '/items/category';
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
        }),
    });
    const { data } = await res.json();
    return data;
}
