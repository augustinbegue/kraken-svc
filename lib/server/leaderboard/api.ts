import { env } from '$env/dynamic/private';
import type { Profile } from '@prisma/client';
import NodeCache from 'node-cache';

const host = env.API_URL;
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
export async function getLeaderboard() {
    if (!host) throw new Error('Could not find API_URL in environment variables');

    const cached = cache.get(LeaderboardCacheName);
    if (cached) return cached;

    const res = await fetch(`${host}/leaderboard`);
    const data = await res.json();

    cache.set(LeaderboardCacheName, data, LeaderboardTTL);

    return data;
}

export interface Activity {
    id: number;
    name: string;
    category: number;
    points: number;
}
export async function getActivities() {
    if (!host) throw new Error('Could not find API_URL in environment variables');

    const res = await fetch(`${host}/items/activity`);
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
    if (!host) throw new Error('Could not find API_URL in environment variables');

    const res = await fetch(`${host}/items/activity`, {
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
    if (!host) throw new Error('Could not find API_URL in environment variables');

    const res = await fetch(`${host}/items/category`);
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
    if (!host) throw new Error('Could not find API_URL in environment variables');

    const res = await fetch(`${host}/items/category`, {
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
