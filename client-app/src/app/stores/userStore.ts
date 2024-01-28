import { makeAutoObservable, runInAction } from "mobx";
import { User } from "../models/user";
import { Login } from "../models/login";
import agent from "../api/agent";
import { Store } from "./store";
import { router } from "../router/Router";

export default class UserStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn(){
        return !!this.user;
    }

    login = async (creds: Login) => {
        const user = await agent.Account.login(creds);
        Store.commonStore.setToken(user.token);
        runInAction(() => this.user = user);
        Store.modalStore.closeModal()
        router.navigate('/activities');
    }

    register = async (creds: Login) => {
        const user = await agent.Account.register(creds);
        Store.commonStore.setToken(user.token);
        runInAction(() => this.user = user);
        Store.modalStore.closeModal()
        router.navigate('/activities');
    }

    logout = () => {
        Store.commonStore.removeToken();
        this.user = null;
        router.navigate('/');
    }

    getUser = async() => {
        try {
            const user = await agent.Account.current();
            runInAction(() => {
                this.user = user;
            })
        } catch (error) {
            console.log(error);
        }
    }

    setImage = (image: string) => {
        if(this.user) this.user.image = image
    }

    setDisplayName = (displayName: string) => {
        if(this.user) this.user.displayName = displayName
    }
}