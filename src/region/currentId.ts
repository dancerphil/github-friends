import {createRegion} from "region-core";

const currentIdRegion = createRegion<string>();

export const getCurrentId = currentIdRegion.getValue;

export const useCurrentId = currentIdRegion.useValue;

export const setCurrentId = currentIdRegion.set;
