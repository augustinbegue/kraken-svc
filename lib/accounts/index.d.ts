export type ClientSession =
    | (Session & {
          profile: Profile & {
              groups: Group[];
          };
      })
    | {
          state: string;
      };
