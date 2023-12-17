import { makeAutoObservable, runInAction } from "mobx";
import { IActivity } from "../models/activity"
import agent from "../api/agent";
import { v4 as uuid } from 'uuid';

export default class ActivityStore {
    activitiesRegistry = new Map<string, IActivity>();
    selectedActivity: IActivity | undefined = undefined;
    editMode = false;
    loading = false;
    loadInitial = true;

    constructor() {
        makeAutoObservable(this);
    }

    get activitiesByDates() {
        return Array.from(this.activitiesRegistry.values()).sort(x => Date.parse(x.date));
    }

    loadActicitvies = async () => {
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {activities.forEach(activity => {
                activity.date = activity.date.split('T')[0];
                this.activitiesRegistry.set(activity.id, activity)
            });});
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

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectedActivity()
        this.editMode = true;
    }

    closeForm = () => this.editMode = false;

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
    }

    deleteActivity = async (id: string) => {
        this.setLoading(true);
        try {
            await agent.Activities.delete(id);
            if (this.selectedActivity?.id == id) {
                this.cancelSelectedActivity();
                this.closeForm();
            }
            runInAction(() => { this.activitiesRegistry.delete(id) })
        } catch (error) {
            console.log(error)
        }
        finally {
            this.setLoading(false);
        }
    }
}