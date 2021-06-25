import {getMeInfo, getUserApi} from "../github-api";
import {Info} from '../types';
import {setCurrentId} from './utils';
import {emitNodesAndLinks} from './nodesAndLinks';
import {getFriends, addEdge, initVertex, getVertex} from '../dataStructures/Entities';
import {emitDescription} from "./description";

const duration = 200;

let currentPromise = Promise.resolve();

// not concurrent for now
const addTask = (task: () => Promise<void>) => {
    const onFulfilled = () => new Promise<void>(resolve => {

        // 暂时hack在这里
        emitNodesAndLinks();

        setTimeout(() => {
            const nextPromise = task();
            nextPromise.catch(() => addTask(task));
            resolve(nextPromise)
        }, duration);
    });
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
};

const insertFollowers = (id: string, followers: string[]) => {
    followers.forEach(follower => {
        addEdge(follower, id);
    });
};

const loadUserFollowing = async (id: string, depth: number) => {
    const {
        apiGetInfo,
        apiGetFollowings,
        apiGetFollowers,
    } = getUserApi(id);
    if (!getVertex(id)?.info) {
        emitDescription(`加载用户信息：${id}`);
        await apiGetInfo().then(info => {
            initVertex(id);
            updateUserInfo(id, info);
        });
    }
    const prefixText = `加载 ${depth + 1} 度好友信息（${id} 的好友）`;
    const followingsPage = Math.ceil(getVertex(id).info!.following / 100);

    for (let page = 1; page <= followingsPage; page++) {
        const task = () => {
            emitDescription(`${prefixText}：followings ${page}/${followingsPage}`);
            return apiGetFollowings(page).then(followings => insertFollowings(id, followings));
        };
        addTask(task);
    }

    const followersPage = Math.ceil(getVertex(id).info!.followers / 100);

    // 非本人，且关注者众多的用户跳过
    if (depth === 0 || followersPage <= 10) {
        for (let page = 1; page <= followersPage; page++) {
            const task = () => {
                emitDescription(`${prefixText}：followers ${page}/${followersPage}`);
                return apiGetFollowers(page).then(followers => insertFollowers(id, followers));
            };
            addTask(task);
        }
    }

    if (depth <= 0) {
        addTask(async () => {
            getFriends(id).forEach(friend => {
                const friendId = friend.getKey();
                addTask(() => loadUserFollowing(friendId, depth +  1))
            });
        })
    }
};

export const start = async (token: string) => {
    const me = await getMeInfo(token);
    const currentId = me.login;
    setCurrentId(currentId);

    addTask(async () => {
        loadUserFollowing(currentId, 0);
    });
};
