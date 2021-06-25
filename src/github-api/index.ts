// @ts-nocheck
import {client as getClient} from 'octonode';
import {Info} from '../types';

let client;

export const getMeInfo = async (token: string) => {
    client = getClient(token);
    const [me] = await client.me().infoAsync();
    return me
};

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
    const apiGetFollowings = async (page = 1): Promise<string[]> => {
        const [list] = await user.followingAsync({page, per_page: 100});
        return list.map(item => item.login)
    };
    return {
        apiGetInfo,
        apiGetFollowers,
        apiGetFollowings,
    }
};
