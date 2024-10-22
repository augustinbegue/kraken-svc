import type { Profile, Session, Group } from "@prisma/client";

export type ClientSession =
    | (Session & {
        profile: Profile & {
            groups: Group[];
        };
    })
    | {
        state: string;
    };
