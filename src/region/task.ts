import {getMeInfo, getUserApi} from "../github-api";
import {setCurrentId} from './currentId';
import {emitNodesAndLinks} from './nodesAndLinks';
import {getFriends, addEdge, initVertex, getVertex, updateVertexInfo} from '../dataStructures/Entities';
import {setDescription} from "./description";
import {pushException} from "./exception";

// 防止并发过多，增加一个队列
let currentPromise = Promise.resolve();

const addTask = (task: () => Promise<void>) => {
    const onFulfilled = () => new Promise<void>(resolve =>  resolve(task()));
    currentPromise = currentPromise.then(onFulfilled, onFulfilled);
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
    setDescription(`加载 ${id}（你的 ${depth} 度好友）的信息`);
    const info = await apiGetInfo();
    initVertex(id);
    updateVertexInfo(id, info);
    const prefixText = `加载 ${id}（你的 ${depth} 度好友）的好友列表`;
    const followingsPage = Math.ceil(getVertex(id).info!.following / 100);

    // 非本人，且关注了太多人的用户跳过
    if (depth > 0 && followingsPage > 100) {
        pushException(`没有加载 ${id} 的关注列表，关注了太多人`);
    } else {
        for (let page = 1; page <= followingsPage; page++) {
            setDescription(`${prefixText}：followings ${page}/${followingsPage}`);
            const followings = await apiGetFollowings(page);
            insertFollowings(id, followings);
        }
    }

    const followersPage = Math.ceil(getVertex(id).info!.followers / 100);

    // 非本人，且关注者众多的用户跳过
    if (depth > 0 && followersPage > 10) {
        pushException(`没有加载 ${id} 的关注者列表，被太多人关注`);
        // 如果 depth >= 2 不发 follower 请求，二度好友直接可以统计好友关系，但不能查到三度好友
    } else {
        for (let page = 1; page <= followersPage; page++) {
            setDescription(`${prefixText}：followers ${page}/${followersPage}`);
            const followers = await apiGetFollowers(page);
            insertFollowers(id, followers);
        }
    }

    if (depth <= 1) {
        const friends = getFriends(id);
        for (let i = 0; i < friends.length; i++) {
            const friend = friends[i];
            const friendId = friend.getKey();

            // 添加至队列
            addTask(() => loadUserFollowing(friendId, depth +  1));
        }
    }
};

export const start = async (token: string) => {
    const me = await getMeInfo(token);
    const currentId = me.login;
    setCurrentId(currentId);

    // 添加至队列
    addTask(() => loadUserFollowing(currentId, 0));
};
