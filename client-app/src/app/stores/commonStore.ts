import { makeAutoObservable, reaction } from "mobx";
import { ErrorException } from "../models/errorException";

export default class CommonStore {
    error: ErrorException | undefined;
    token: string | null = localStorage.getItem('jwt');
    appLoaded = false

    constructor() {
        makeAutoObservable(this);
        reaction(
            () => this.token,
            token => {
                if (token) {
                    localStorage.setItem('jwt', token)
                } else {
                    localStorage.removeItem('jwt')
                }
            })
    }

    setError = (error: ErrorException) => {
        this.error = error;
    }

    setToken = (token: string | null) => {
        this.token = token;
    }

    removeToken = () => {
        this.token = null;
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }
}