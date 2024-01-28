import { makeAutoObservable, runInAction } from "mobx";
import { Photo, Profile, ProfileFormValues } from "../models/profile";
import agent from "../api/agent";
import { Store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loading: boolean = false;
    uploading: boolean = false;

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
            runInAction(() => this.profile = profile)
        }
        catch (error) {
            console.log(error);
        }
        finally {
            runInAction(() => this.loading = false);
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
}
