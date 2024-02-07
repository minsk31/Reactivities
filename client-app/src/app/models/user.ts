import { Photo } from "./profile";

export interface User {
    userName: string;
    displayName: string;
    token: string;
    image?: string;
    following: boolean,
    followersCount: number,
    folowingCount: number,
    photos?: Photo[];
  }