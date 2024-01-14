import { User } from "./user"

export interface Profile {
    userName: string,
    displayName: string,
    image?: string
    bio?: string
}

export class Profile implements Profile{
    constructor(user: User) {
       this.displayName = user.displayName,
       this.userName = user.userName,
       this.image = user.image 
    }
}