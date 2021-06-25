import {useSubscription} from "use-subscription";
import {Link, Node} from "../types";
import {getCurrentId, getOption} from "./utils";
import {getVertex, getFriends, getFollowings} from "../dataStructures/Entities";

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
    // 第一次渲染时不要 fixed，等到得到了位置之后再 fixed
    if (!getVertex(currentId)) {
        return [[{id: currentId, category: 'me'}], []];
    }
    const option = getOption();

    const nodes: Node[] = [];
    const links: Link[] = [];

    nodes.push({id: currentId, category: 'me', fixed: true} as Node);

    // const followers = getFollowers(currentId);
    // const following = getFollowing(id);
    const friends = getFriends(currentId);

    friends.forEach(friend => {
        const friendId = friend.getKey();
        nodes.push({id: friendId, category: 'friend'});
        links.push({source: currentId, target: friendId});
    });

    friends.forEach(friend => {
        const friendId = friend.getKey();
        getFriends(friendId).forEach(friendFriend => {
            const friendFriendId = friendFriend.getKey();
            if (nodes.find(item => item.id === friendFriendId)) {
                // 重复的 id
            } else {
                const friendFriendFlowing = getFollowings(friendFriendId);

                if (option.follow && friendFriendFlowing.includes(getVertex(currentId))) {
                    nodes.push({id: friendFriendId, category: 'friend-friend+follower'});
                    links.push({source: friendId, target: friendFriendId});
                } else if (option.moreThanOne && links.filter(link => link.target === friendFriendId).length > 1) {
                    nodes.push({id: friendFriendId, category: 'friend-friend'});
                    links.push({source: friendId, target: friendFriendId});
                } else if (option.all) {
                    nodes.push({id: friendFriendId, category: 'friend-friend'});
                    links.push({source: friendId, target: friendFriendId});
                }
            }
        })
    });

    return [nodes, links];
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
