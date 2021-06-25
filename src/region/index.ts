import {getMeInfo, getUserApi} from "../github-api";
import {Info} from '../types';
import {setCurrentId} from './utils';
import {emitNodesAndLinks} from './nodesAndLinks';
import {getFriends, addEdge, initVertex, getVertex} from '../dataStructures/Entities';
import {emitDescription} from "./description";
import {pushException} from "./exception";

// const duration = 200;
//
let currentPromise = Promise.resolve();

// not concurrent for now
const addTask = (task: () => Promise<void>) => {
    const onFulfilled = () => new Promise<void>(resolve =>  resolve(task()));
    currentPromise = currentPromise.then(onFulfilled, onFulfilled);
};

const updateUserInfo = (id: string, info: Info) => {
    if (getVertex(id)) {
        getVertex(id).info = info;
    }
};

const insertFollowings = (id: string, followings: string[]) => {
    followings.forEach(following => {
        addEdge(id, following);
    });
    emitNodesAndLinks();
};

const insertFollowers = (id: string, followers: string[]) => {
    followers.forEach(follower => {
        addEdge(follower, id);
    });
    emitNodesAndLinks();
};

const loadUserFollowing = async (id: string, depth: number) => {
    const {
        apiGetInfo,
        apiGetFollowings,
        apiGetFollowers,
    } = getUserApi(id);
    if (getVertex(id)?.info) {
        return;
    }
    emitDescription(`加载 ${id}（你的 ${depth} 度好友）的信息`);
    const info = await apiGetInfo();
    initVertex(id);
    updateUserInfo(id, info);
    const prefixText = `加载 ${id}（你的 ${depth} 度好友）的好友列表`;
    const followingsPage = Math.ceil(getVertex(id).info!.following / 100);

    // 非本人，且关注了太多人的用户跳过
    if (depth === 0 || followingsPage <= 100) {
        for (let page = 1; page <= followingsPage; page++) {
            emitDescription(`${prefixText}：followings ${page}/${followingsPage}`);
            const followings = await apiGetFollowings(page);
            insertFollowings(id, followings);
        }
    } else {
        pushException(`没有加载 ${id} 的关注列表，关注了太多人`);
    }

    const followersPage = Math.ceil(getVertex(id).info!.followers / 100);

    // 非本人，且关注者众多的用户跳过
    if (depth === 0 || followersPage <= 10) {
        for (let page = 1; page <= followersPage; page++) {
            emitDescription(`${prefixText}：followers ${page}/${followersPage}`);
            const followers = await apiGetFollowers(page);
            insertFollowers(id, followers);
        }
    } else {
        pushException(`没有加载 ${id} 的关注者列表，被太多人关注`);
    }

    if (depth <= 1) {
        const friends = getFriends(id);
        for (let i = 0; i < friends.length; i++) {
            const friend = friends[i];
            const friendId = friend.getKey();
            addTask(() => loadUserFollowing(friendId, depth +  1));
        }
    }
};

export const start = async (token: string) => {
    const me = await getMeInfo(token);
    const currentId = me.login;
    setCurrentId(currentId);

    addTask(() => loadUserFollowing(currentId, 0));
};
