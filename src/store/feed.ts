import { atomWithStorage } from 'jotai/utils';

export const atomFeed = atomWithStorage<{
    name: string,
    value: string
}>('feed', {
    name: "Following",
    value: "following"
});