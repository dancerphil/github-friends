
export type Category = 'me' | 'friend' | 'friend-friend+follower' | 'friend-friend' | 'friend-following+follower'

export interface Node {
    id: string;
    category: Category
}

export interface Link {
    source: string;
    target: string
}

export interface Info {
    avatar_url: string;
    name: string; // 可以不要
    login: string;
    followers: number;
    following: number;
}
