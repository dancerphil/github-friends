import {createRegion} from "region-core";
import {Option} from '../types';
import {emitNodesAndLinks} from "./nodesAndLinks";

const optionRegion = createRegion<Option>({
    'friend-friend+follower': true,
    'friend-friend+common': true,
    'friend-friend': true,
    'friend-friend-friend': false,
});

export const getOption = optionRegion.getValue;

export const useOption = optionRegion.useValue;

const setOption = (resultOrFunction: (state: Option) => Option) => {
    optionRegion.set(resultOrFunction);
    emitNodesAndLinks();
}

export const handleFollowerChange = (e: any) => {
    setOption(state => ({
        'friend-friend+follower': e.target.checked,
        'friend-friend+common': state['friend-friend+common'],
        'friend-friend': false,
        'friend-friend-friend+follower': false,
        'friend-friend-friend': false,
    }))
};

export const handleCommonChange = (e: any) => {
    setOption(state => ({
        'friend-friend+follower': state['friend-friend+follower'],
        'friend-friend+common': e.target.checked,
        'friend-friend': false,
        'friend-friend-friend+follower': false,
        'friend-friend-friend': false,
    }))
};

export const handleFriendFriendChange = (e: any) => {
    setOption(state => ({
        'friend-friend+follower': true,
        'friend-friend+common': true,
        'friend-friend': e.target.checked,
        'friend-friend-friend+follower': false,
        'friend-friend-friend': false,
    }))
};

export const handleFriendFriendFriendFollowerChange = (e: any) => {
    setOption(state => ({
        'friend-friend+follower': true,
        'friend-friend+common': true,
        'friend-friend': true,
        'friend-friend-friend+follower': e.target.checked,
        'friend-friend-friend': false,
    }))
};

export const handleFriendFriendFriendChange = (e: any) => {
    setOption(state => ({
        'friend-friend+follower': true,
        'friend-friend+common': true,
        'friend-friend': true,
        'friend-friend-friend+follower': true,
        'friend-friend-friend': e.target.checked,
    }))
};
