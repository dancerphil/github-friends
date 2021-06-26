import {createRegion} from 'region-core';

const descriptionRegion = createRegion<string>('')

export const setDescription = descriptionRegion.set

export const useDescription = descriptionRegion.useValue
