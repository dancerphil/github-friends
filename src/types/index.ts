
export interface Node {
    name: string;
    category: Category
}

export type Category = 'me'
    | 'friend'
    | 'friend-friend+follower'
    | 'friend-friend+common'
    | 'friend-friend'
    | 'friend-friend-friend+follower'
    | 'friend-friend-friend+common'
    | 'friend-friend-friend'

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

export type Option = Partial<Record<Category, boolean>>
