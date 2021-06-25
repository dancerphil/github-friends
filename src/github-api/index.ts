// @ts-nocheck
import {client as getClient} from 'octonode';
import {Info} from '../types';

let client;

// 为了防止 github ban ip，所有请求先 delay 一段时间
const duration = 200;

const delay = () => new Promise(resolve => setTimeout(resolve, duration));

const withDelayAndRetry = <T>(asyncFunction: T): T  => {
    // let retry = 0;
    const func: T = async (params: T1) => {
        try {
            await delay();
            const result = await asyncFunction(params);
            return result;
        } catch (e) {
            // test retry
            // if (retry < 3) {
            //     retry ++;
            //     func(params);
            // }
        }
    };
    return func;
};

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
        apiGetInfo: withDelayAndRetry(apiGetInfo),
        apiGetFollowers: withDelayAndRetry(apiGetFollowers),
        apiGetFollowings: withDelayAndRetry(apiGetFollowings),
    }
};
