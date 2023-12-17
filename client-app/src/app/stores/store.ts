import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";

interface IStore {
    activityStore: ActivityStore
}

export const Store: IStore = {
    activityStore: new ActivityStore()
}

export const StoreContext = createContext(Store);

export function useStore() {
    return useContext(StoreContext);
}