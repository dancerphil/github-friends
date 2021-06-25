import {createRegion} from "region-core";
import {Option} from '../types';

const currentIdRegion = createRegion<string>();

export const getCurrentId = currentIdRegion.getValue;

export const useCurrentId = currentIdRegion.useValue;

export const setCurrentId = currentIdRegion.set;

const optionRegion = createRegion<Option>({
    follow: true,
    moreThanOne: true,
    showFriendFriend: true,
    showFriendFriendFriend: false,
});

export const getOption = optionRegion.getValue;

export const useOption = optionRegion.useValue;

export const handleFollowChange = (e: any) => {
    if (e.target.checked) {
        optionRegion.set(state => ({
            follow: true,
            moreThanOne: state.moreThanOne,
            showFriendFriend: false,
            showFriendFriendFriend: false,
        }))
    } else {
        optionRegion.set(state => ({
            follow: false,
            moreThanOne: state.moreThanOne,
            showFriendFriend: false,
            showFriendFriendFriend: false,
        }))
    }
};

export const handleMoreThanOneChange = (e: any) => {
    if (e.target.checked) {
        optionRegion.set(state => ({
            follow: state.follow,
            moreThanOne: true,
            showFriendFriend: false,
            showFriendFriendFriend: false,
        }))
    } else {
        optionRegion.set(state => ({
            follow: state.follow,
            moreThanOne: false,
            showFriendFriend: false,
            showFriendFriendFriend: false,
        }))
    }
};

export const handleShowFriendFriendChange = (e: any) => {
    optionRegion.set(state => ({
        follow: true,
        moreThanOne: true,
        showFriendFriend: e.target.checked,
        showFriendFriendFriend: false,
    }))
};

export const handleShowFriendFriendFriendChange = (e: any) => {
    optionRegion.set(state => ({
        follow: true,
        moreThanOne: true,
        showFriendFriend: true,
        showFriendFriendFriend: e.target.checked,
    }))
};
