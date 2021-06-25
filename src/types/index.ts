
export type Category = 'me'
    | 'friend'
    | 'friend-friend+follower'
    | 'friend-friend'
    | 'friend-friend-friend'
    | 'friend-friend-friend+follower'
    | 'friend-following+follower'

export interface Node {
    name: string;
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

export interface Option {
    follow: boolean
    moreThanOne: boolean
    showFriendFriend: boolean
    showFriendFriendFriend: boolean
}
