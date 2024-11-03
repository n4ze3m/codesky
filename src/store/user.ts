
import { ProfileViewDetailed } from '@atproto/api/src/client/types/app/bsky/actor/defs';
import { atom } from 'jotai';

export const atomUser = atom<{
    user: ProfileViewDetailed | null
}>({
    user: null 
});