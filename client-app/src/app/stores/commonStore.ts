import { makeAutoObservable } from "mobx";
import { ErrorException } from "../models/errorException";

export default class CommonStore {
    error: ErrorException | undefined;

    constructor() {
        makeAutoObservable(this);
    }

    setError = (error: ErrorException) => {
        this.error = error;
    }
}