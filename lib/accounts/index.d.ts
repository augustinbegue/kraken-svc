import type { Profile, Session, Group } from "@prisma/client";

export type ClientSession =
    {
        id: string;
        login: string;
    };
