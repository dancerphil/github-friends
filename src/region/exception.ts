import {createRegion} from 'region-core';

const exceptionsRegion = createRegion<string[]>([]);

export const pushException = (message: string) => {
    exceptionsRegion.set(array => array.includes(message) ? array : [...array, message]);
};

export const useExceptions = exceptionsRegion.useValue;
