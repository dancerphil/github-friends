import {Category, Link, Node, Option} from "../types";
import {getVertex} from "./Entities";

// 搜索 Graph 生成 charts 数据
export const BFS = (rootId: string, option: Option): [Node[], Link[]] => {
    const root = getVertex(rootId);

    const visited: {[key: string]: boolean} = {};
    const nodes: Node[] = [];
    const edges: Link[] = [];

    interface QueueItem {
        id: string;
        depth: number;
    }
    const queue: QueueItem[] = [];

    const pushNode = (id: string, depth: number) => {
        visited[id] = true;
        const category: Category = ((): Category => {
            switch (depth) {
                case 0: return 'me';
                case 1: return 'friend';
                case 2: {
                    if (getVertex(id).getFollowings().includes(root)) {
                        return 'friend-friend+follower'
                    }
                    return 'friend-friend';
                }
                case 3: {
                    if (getVertex(id).getFollowings().includes(root)) {
                        return 'friend-friend-friend+follower'
                    }
                    return 'friend-friend-friend';
                }
                default: return 'friend-friend-friend'
            }
        })();

        nodes.push({
            name: id,
            category,
        });
    };

    const search = (id: string, depth: number) => {
        const friends = getVertex(id).getFriends();
        for (let i = 0; i < friends.length; i++) {
            const friend = friends[i];
            const friendId = friend.getKey();
            edges.push({source: id, target: friendId});
            if (!visited[friendId]) {
                if (!option.showFriendFriendFriend && depth === 2) {
                    // do nothing
                } else {
                    pushNode(friendId, depth + 1);
                    queue.push({id: friendId, depth: depth + 1});
                }
            }
        }
        const next = queue.splice(0, 1)[0];

        if (next) {
            search(next.id, next.depth);
        }
    };

    pushNode(rootId, 0);
    search(rootId, 0);

    if (nodes.length > 1) {
        // @ts-ignore
        nodes[0].fixed = true
    }

    return [nodes, edges];
};
