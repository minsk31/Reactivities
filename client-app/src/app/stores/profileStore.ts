import { makeAutoObservable, runInAction } from "mobx";
import { Photo, Profile, UserActivity } from "../models/profile";
import agent from "../api/agent";
import { Store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loading: boolean = false;
    loadingActivities: boolean = false;
    uploading: boolean = false;
    followings: Profile[] = [];
    activities: UserActivity[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    get IsCurrentUser() {
        if (this.profile && Store.userStore.user) {
            return this.profile.userName === Store.userStore.user.userName
        }

        return false;
    }

    loadProfile = async (username: string) => {
        this.loading = true;
        try {

            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
            })
        }
        catch (error) {
            console.log(error);
        }
        finally {
            runInAction(() => this.loading = false);
        }
    }

    loadActivities = async (username: string, predicate: string | undefined) => {
        this.loadingActivities = true;
        try {
            const activities = await agent.Profiles.getUserActivities(username, predicate);
            runInAction(() => this.activities = activities)
        }
        catch (error) {
            console.log(error);
        }
        finally {
            runInAction(() => this.loadingActivities = false);
        }
    }

    editProfile = async (profileFormValues: Partial<Profile>) => {
        this.loading = true;
        try {
            await agent.Profiles.update(profileFormValues);
            runInAction(() => {
                if (profileFormValues.displayName && profileFormValues.displayName !==
                    Store.userStore.user?.displayName) {
                    Store.userStore.setDisplayName(profileFormValues.displayName);
                }
                this.profile = { ...this.profile, ...profileFormValues as Profile };
            })
        } catch (error) {
            console.log(error);
        }
        finally {
            runInAction(() => this.loading = false);
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain && Store.userStore.user) {
                        Store.userStore.setImage(photo.image)
                    }
                }
            })
        }
        catch (error) {
            console.log(error);
        }
        finally {
            runInAction(() => this.uploading = false);
        }
    }

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;

        try {
            await agent.Profiles.setMainPhoto(photo.id);
            runInAction(() => {
                Store.userStore.setImage(photo.image);
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(x => x.isMain)!.isMain = false;
                    this.profile.photos.find(x => x.id == photo.id)!.isMain = true;
                    this.profile.image = photo.image;
                }
            })

        }
        catch (error) {
            console.log(error);
        }
        finally {
            runInAction(() => this.loading = false);
        }
    }

    deletePhoto = async (id: string) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(id).then(() => {
                runInAction(() => {
                    if (this.profile && this.profile.photos) {
                        this.profile.photos = this.profile.photos.filter(x => x.id != id);
                    }
                })

            }
            );
        }
        catch (error) {
            console.log(error);
        }
        finally {
            runInAction(() => this.loading = false);
        }
    }

    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(username);
            Store.activityStore.updateAttendeeFollowing(username);

            runInAction(() => {
                if (this.profile
                    && this.profile.userName !== Store.userStore.user?.userName
                    && this.profile.userName !== username) {
                    following ? this.profile.followersCount-- : this.profile.followersCount++;
                    this.profile.following = !this.profile.following
                }

                if (this.profile && this.profile.userName === Store.userStore.user?.userName) {
                    following ? this.profile.followingCount-- : this.profile.followingCount++
                }

                this.followings.forEach(profile => {
                    if (profile.userName === username) {
                        profile.following ? profile.followersCount-- : profile.followersCount++;
                        profile.following = !profile.following
                    }
                })
            })
        }
        catch (error) {
            console.log(error);
        }
        finally {
            runInAction(() => this.loading = false);
        }
    }

    loadFollowings = async (predicate: string) => {
        this.loading = true;
        const followings = await agent.Profiles.listFollowings(this.profile?.userName!, predicate);

        try {
            runInAction(() => {
                this.followings = followings;
            })
        }
        catch (error) {
            console.log(error);
        }
        finally {
            runInAction(() => this.loading = false);
        }

        return followings;
    }
}
