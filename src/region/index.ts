import * as _ from 'lodash';
import {getMeInfo, getUserApi} from "../github-api";
import {Info, Link, Node} from '../types';
import {forceUpdate, getOption} from './utils';
import {createRegion} from "region-core";

const duration = 99;
const maxFollowPage = 8;

let currentPromise = Promise.resolve();

// not concurrent for now
const addTask = (task: () => Promise<void>) => {
    const onFulfilled = () => new Promise<void>(resolve => {
        setTimeout(() => {
            const nextPromise = task();
            nextPromise.catch(() => addTask(task));
            resolve(nextPromise)
        }, duration);
    });
    currentPromise = currentPromise.then(onFulfilled, onFulfilled);
};

interface Entity {
    info: Info,
    followersList: string[][],
    followingList: string[][],
    friends: string[],
}

interface EntityMap {
    [id: string]: Entity
}

const entities: EntityMap = {};

const getFollowers = (id: string) => {
    const followers = _.flatten(entities[id].followersList).filter(item => item);
    return followers;
};

const getFollowing = (id: string) => {
    const following = _.flatten(entities[id].followingList).filter(item => item);
    return following;
};

export const getNodesAndLinks = (id: string): [Node[], Link[]] => {
    // 第一次渲染时不要 fixed，等到得到了位置之后再 fixed
    if (!entities[id]) {
        return [[{id, category: 'me'}], []];
    }
    const option = getOption();

    const nodes: Node[] = [];
    const links: Link[] = [];

    nodes.push({id, category: 'me', fixed: true} as Node);

    const followers = getFollowers(id);
    // const following = getFollowing(id);
    const friends: string[] = entities[id].friends;

    friends.forEach(friendId => {
        nodes.push({id: friendId, category: 'friend'});
        links.push({source: id, target: friendId});
    });

    friends.forEach(friendId => {
        const friendInfo = entities[friendId];
        if (friendInfo) {
            friendInfo.friends.forEach(friendFriendId => {
                links.push({source: friendId, target: friendFriendId});
                if (nodes.find(item => item.id === friendFriendId)) {
                    // 重复的 id
                } else {
                    if (option.follow && followers.includes(friendFriendId)) {
                        nodes.push({id: friendFriendId, category: 'friend-friend+follower'});
                    } else if (option.moreThanOne && links.filter(link => link.target === friendFriendId).length > 1) {
                        nodes.push({id: friendFriendId, category: 'friend-friend'});
                    } else if (option.all) {
                        nodes.push({id: friendFriendId, category: 'friend-friend'});
                    }
                }
            })
        }
    });

    return [nodes, links];
};

export const getProgressDescription = (id: string): string => {
    if (!entities[id]) {
        return '初始化...';
    }
    const followers = getFollowers(id);
    const following = getFollowing(id);
    if (followers.length + following.length < entities[id].info.followers + entities[id].info.following) {
        const percent = ((followers.length + following.length) / (entities[id].info.followers + entities[id].info.following) * 100).toFixed(0);
        return `加载一度好友中，${percent}%`;
    }
    let infoCount = 0;
    let num = 0;
    let sum = 0;
    entities[id].friends.forEach(friendId => {
        if (entities[friendId]) {
            infoCount++;
            const followers = getFollowers(friendId);
            const following = getFollowing(friendId);
            num += followers.length + following.length;
            sum += Math.min(maxFollowPage * 100, entities[friendId].info.followers);
            sum += Math.min(maxFollowPage * 100, entities[friendId].info.following);
        }
    });

    const friendsLength = entities[id].friends.length;
    if (infoCount < friendsLength) {
        const percent = sum === 0 ? 0 : (infoCount / friendsLength * 100).toFixed(0);
        return `加载好友信息中，${percent}%`;
    }
    const percent = sum === 0 ? 0 : (num / sum * 100).toFixed(0);
    if (percent === '100') {
        return '已完成';
    }
    return `加载二度好友中，${percent}%`;
};

const initUser = (id: string, info: Info) => {
    if (!entities[id]) {
        entities[id] = {
            info,
            followersList: [],
            followingList: [],
            friends: [],
        };
        forceUpdate();
    }
};

const insertFollowers = (id: string, page: number, appendFollowers: string[]) => {
    const {friends} = entities[id];
    entities[id].followersList[page - 1] = appendFollowers;
    const followers = getFollowers(id);
    const following = getFollowing(id);
    entities[id].friends = _.intersection(followers, following);
    if (!_.isEqual(friends, entities[id].friends)) {
        forceUpdate();
    }
};

const insertFollowing = (id: string, page: number, appendFollowing: string[]) => {
    const {friends} = entities[id];
    entities[id].followingList[page - 1] = appendFollowing;
    const followers = getFollowers(id);
    const following = getFollowing(id);
    entities[id].friends = _.intersection(followers, following);
    if (!_.isEqual(friends, entities[id].friends)) {
        forceUpdate();
    }
};

const loadUserFollow = (id: string) => {
    const {
        apiGetFollowers,
        apiGetFollowing,
    } = getUserApi(id);

    const followersPage = Math.min(maxFollowPage, Math.ceil(entities[id].info.followers / 100));
    const followingPage = Math.min(maxFollowPage, Math.ceil(entities[id].info.following / 100));

    for (let page = 1; page <= Math.max(followersPage, followingPage); page++) {
        if (page <= followersPage) {
            const task = () => apiGetFollowers(page).then(followers => insertFollowers(id, page, followers));
            addTask(task);
        }
        if (page <= followingPage) {
            const task = () => apiGetFollowing(page).then(following => insertFollowing(id, page, following));
            addTask(task);
        }
    }
};

const currentIdRegion = createRegion<string>();
export const useCurrentId = currentIdRegion.useValue;
const setCurrentId = currentIdRegion.set;

export const start = async (token: string) => {
    const me = await getMeInfo(token);
    const currentId = me.login;
    setCurrentId(currentId);
    const callback = async () => {
        entities[currentId].friends.forEach(friendId => {
            const task = () => getUserApi(friendId).apiGetInfo().then(info => initUser(friendId, info));
            addTask(task);
        });
        entities[currentId].friends.forEach(friendId => {
            addTask(async () => loadUserFollow(friendId));
        });
    };

    const task = () => getUserApi(currentId).apiGetInfo().then(info => initUser(currentId, info));
    addTask(task);
    addTask(async () => {
        loadUserFollow(currentId);
        addTask(callback)
    });
};
