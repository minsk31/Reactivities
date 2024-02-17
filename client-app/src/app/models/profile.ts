import { User } from "./user"

export interface IProfile {
    userName: string,
    displayName: string,
    image?: string,
    bio?: string,
    following: boolean,
    followersCount: number,
    followingCount: number,
    photos?: Photo[],
    userActivities?: UserActivity[]
}

export interface Photo {
    id: string,
    image: string,
    isMain: boolean,
    bytes: string
}

export interface UserActivity {
  id: string
  title: string
  date: Date | null
  category: string
  hostUserName: string
}

export class Profile implements IProfile{
    constructor(user: User) {
       this.displayName = user.displayName,
       this.userName = user.userName,
       this.image = user.image
       this.photos = user.photos
    }

    photos?: Photo[]
    userName: string
    displayName: string
    image?: string | undefined
    bio?: string | undefined
    following: boolean = false
    followersCount: number = 0
    followingCount: number = 0
    userActivities: UserActivity[] = []
}

export class ProfileFormValues {
    displayName: string = ''
    bio?: string = ''
  
    constructor(profile?: Profile) {
      if (profile) {
        this.displayName = profile.displayName
        this.bio = profile.bio
      }
    }
  }