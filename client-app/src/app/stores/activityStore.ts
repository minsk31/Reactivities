import { makeAutoObservable, runInAction } from "mobx";
import { IActivity } from "../models/activity"
import agent from "../api/agent";
import { v4 as uuid } from 'uuid';

export default class ActivityStore {
    activitiesRegistry = new Map<string, IActivity>();
    selectedActivity: IActivity | undefined = undefined;
    editMode = false;
    loading = false;
    loadInitial = false;

    constructor() {
        makeAutoObservable(this);
    }

    get activitiesByDates() {
        return Array.from(this.activitiesRegistry.values()).sort(x => Date.parse(x.date));
    }

    get groupedActivities(){
        return Object.entries(
        this.activitiesByDates.reduce((activities, activity) => {
            const date = activity.date;
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            
            return activities;
        }, {} as {[key: string]: IActivity[]}))
    }
    loadActicitvies = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach(activity => {
                    activity.date = activity.date.split('T')[0];
                    this.activitiesRegistry.set(activity.id, activity)
                });
            });
        }
        catch (error) {
            console.log(error)
        }
        finally {
            this.setLoadingInitial(false);
        }
    }

    setLoadingInitial = (state: boolean) => {
        this.loadInitial = state;
    }

    setLoading = (state: boolean) => {
        this.loading = state;
    }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activitiesRegistry.get(id)
    }

    upsertActivity = async (activity: IActivity) => {
        this.setLoading(true);

        try {
            if (activity.id) {
                await agent.Activities.update(activity.id, activity);

            } else {
                activity.id = uuid();
                await agent.Activities.create(activity)
            }
            runInAction(() => { this.activitiesRegistry.set(activity.id, activity) })
        }
        catch (error) {
            console.log(error);
        }
        finally {
            this.selectActivity(activity.id);
            this.setLoading(false);
        }
        return activity.id
    }

    deleteActivity = async (id: string) => {
        this.setLoading(true);
        try {
            await agent.Activities.delete(id);
            runInAction(() => { this.activitiesRegistry.delete(id) })
        } catch (error) {
            console.log(error)
        }
        finally {
            this.setLoading(false);
        }
    }

    loadActivity = async (id: string) => {
        this.setLoadingInitial(true);
        let activity = this.activitiesRegistry.get(id)
            ?? await this.tryCatchAsync<IActivity>(() => agent.Activities.details(id));

        runInAction(() => {
            if (activity) {
                this.activitiesRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
            }
        })
        this.setLoadingInitial(false);
        return activity;
    }

    tryCatchAsync = <T>(action: () => Promise<T>) => {

        try {
            return action();
        } catch (error) {
            console.log(error);
        } finally {

        }
    }

}