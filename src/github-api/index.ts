// @ts-nocheck
import {client as getClient} from 'octonode';
import {Info} from '../types';

const client = getClient('2dc94bbd29451f930a2ffd7c2607c11d7030f8d7');

export const getUserApi = (id: string) => {
    const user = client.user(id);
    const apiGetInfo = async (): Promise<Info> => {
        const [info] = await user.infoAsync();
        return info;
    };
    const apiGetFollowers = async (page = 1): Promise<string[]> => {
        const [list] = await user.followersAsync({page, per_page: 100});
        return list.map(item => item.login)
    };
    const apiGetFollowing = async (page = 1): Promise<string[]> => {
        const [list] = await user.followingAsync({page, per_page: 100});
        return list.map(item => item.login)
    };
    return {
        apiGetInfo,
        apiGetFollowers,
        apiGetFollowing,
    }
};
