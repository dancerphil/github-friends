import {createRegion} from "region-core";

const currentIdRegion = createRegion<string>();

export const getCurrentId = currentIdRegion.getValue;

export const useCurrentId = currentIdRegion.useValue;

export const setCurrentId = currentIdRegion.set;

interface Option {
    follow: boolean
    moreThanOne: boolean
    all: boolean
}

const optionRegion = createRegion<Option>({
    follow: true,
    moreThanOne: true,
    all: true,
});

export const getOption = optionRegion.getValue;

export const useOption = optionRegion.useValue;

export const handleFollowChange = (e: any) => {
    if (e.target.checked) {
        optionRegion.set(state => ({follow: true, moreThanOne: state.moreThanOne, all: false}))
    } else {
        optionRegion.set(state => ({follow: false, moreThanOne: state.moreThanOne, all: false}))
    }
};

export const handleMoreThanOneChange = (e: any) => {
    if (e.target.checked) {
        optionRegion.set(state => ({follow: state.follow, moreThanOne: true, all: false}))
    } else {
        optionRegion.set(state => ({follow: state.follow, moreThanOne: false, all: false}))
    }
};

export const handleAllChange = (e: any) => {
    if (e.target.checked) {
        optionRegion.set(state => ({follow: true, moreThanOne: true, all: true}))
    } else {
        optionRegion.set(state => ({follow: true, moreThanOne: true, all: false}))
    }
};
