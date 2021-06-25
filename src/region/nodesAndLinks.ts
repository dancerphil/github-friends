import {useSubscription} from "use-subscription";
import {Link, Node} from "../types";
import {getCurrentId, getOption} from "./utils";
import {getVertex, getFriends, getFollowings, BFS} from "../dataStructures/Entities";

type Listener = () => void

const listeners: Listener[] = [];

interface Ref {
    current: [Node[], Link[]]
}

const nodeAndLinksRef: Ref = {
    current: [[], []]
};

const subscribe = (listener: Listener) => {
    listeners.push(listener);
    return () => {
        listeners.splice(listeners.indexOf(listener), 1);
    }
};

const subscription = {
    getCurrentValue: () => nodeAndLinksRef.current,
    subscribe,
};

const getNodesAndLinks = (): [Node[], Link[]] => {
    const currentId = getCurrentId();
    if(!currentId) {
        return [[], []];
    }
    return BFS(currentId);
    // // 第一次渲染时不要 fixed，等到得到了位置之后再 fixed
    // if (!currentId || !getVertex(currentId)) {
    //     return [[{name: currentId, category: 'me'}], []];
    // }
    // const option = getOption();
    //
    // const nodes: Node[] = [];
    // const links: Link[] = [];
    //
    // nodes.push({name: currentId, category: 'me'});
    //
    // const friends = getFriends(currentId);
    //
    // friends.forEach(friend => {
    //     const friendId = friend.getKey();
    //     nodes.push({name: friendId, category: 'friend'});
    //     links.push({source: currentId, target: friendId});
    //
    //     const friendFriends = getFriends(friendId);
    //     friendFriends.forEach(friendFriend => {
    //         const friendFriendId = friendFriend.getKey();
    //         links.push({source: friendId, target: friendFriendId});
    //         if (nodes.find(item => item.name === friendFriendId)) {
    //             // 重复的 id
    //         } else {
    //             const friendFriendFlowing = getFollowings(friendFriendId);
    //
    //             if (option.follow && friendFriendFlowing.includes(getVertex(currentId))) {
    //                 nodes.push({name: friendFriendId, category: 'friend-friend+follower'});
    //             } else if (option.moreThanOne && links.filter(link => link.target === friendFriendId).length > 1) {
    //                 nodes.push({name: friendFriendId, category: 'friend-friend'});
    //             } else if (option.all) {
    //                 nodes.push({name: friendFriendId, category: 'friend-friend'});
    //             }
    //         }
    //         // 如果二度好友与已知好友相互认识，则显示 edge
    //         // const friendFriendFriends = getFriends(friendFriendId);
    //         // friendFriendFriends.forEach(friendFriendFriend => {
    //         //     const friendFriendFriendId = friendFriendFriend.getKey();
    //         //     if (nodes.find(item => item.name === friendFriendFriendId)) {
    //         //         // links.push({source: friendFriendId, target: friendFriendFriendId});
    //         //     }
    //         // })
    //     })
    // });
    //
    // if (nodes.length > 1) {
    //     // @ts-ignore
    //     nodes[0].fixed = true
    // }
    //
    // return [nodes, links];
};

export const emitNodesAndLinks = () => {
    const value = getNodesAndLinks();
    const prevValue = nodeAndLinksRef.current;
    nodeAndLinksRef.current = value;

    if (value[0].length !== prevValue[0].length || value[1].length !== prevValue[1].length) {
        listeners.forEach(listener => listener())
    }
};

export const useNodesAndLinks = () => {
    return useSubscription(subscription)
};
