import { makeAutoObservable, runInAction } from "mobx";
import { Activity, ActivityFormValues, IActivity } from "../models/activity"
import agent from "../api/agent";
import { v4 as uuid } from 'uuid';
import { Store } from "./store";
import { Profile } from "../models/profile";

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
        return Array.from(this.activitiesRegistry.values()).sort(x => x.date?.getTime() ?? 0);
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDates.reduce((activities, activity) => {

                if (activity.date) {
                    const date = activity.date.getDay();
                    activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                }

                return activities;
            }, {} as { [key: string]: IActivity[] }))
    }
    loadActicitvies = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach(activity => {
                    this.setActivity(activity);
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

    upsertActivity = async (activity: ActivityFormValues) => {

        try {
            if (activity.id) {
                await agent.Activities.update(activity.id, activity);
                const oldActivity = await this.loadActivity(activity.id!)
                runInAction(() => {
                    const updatedActivity = { ...oldActivity, ...activity };
                    this.activitiesRegistry.set(activity.id!, updatedActivity as unknown as Activity)
                    this.setActivity(updatedActivity as unknown as Activity);
                    this.selectedActivity = updatedActivity as unknown as Activity
                })
            } else {
                const user = Store.userStore.user;
                const attendee = new Profile(user!);
                const newActivity = new Activity(activity)
                activity.id = uuid();
                await agent.Activities.create(activity)

                runInAction(() => {
                    newActivity.hostUserName = user!.userName;
                    newActivity.attendees = [attendee];
                    this.setActivity(newActivity);
                    this.selectedActivity = newActivity
                })
            }

        }
        catch (error) {
            console.log(error);
        }
        finally {
            this.selectActivity(activity.id!);
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
                const user = Store.userStore.user;

                if (user) {
                    activity.isGoing = activity.attendees?.some(x =>
                        x.userName === user.userName
                    )
                    activity.isHost = activity.hostUserName === user.userName;
                    activity.host = activity.attendees?.find(x => x.userName == activity?.hostUserName);
                }
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

    updateAttendance = async () => {
        this.setLoading(true);

        try {
            const user = Store.userStore.user;
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(x => x.userName != user?.userName);

                } else {
                    const attendee = new Profile(user!)
                    this.selectedActivity?.attendees?.push(attendee);
                }

                this.selectedActivity!.isGoing = !this.selectedActivity!.isGoing;
                this.activitiesRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })

        }
        catch (error) {
            console.log(error);
        }
        finally {
            this.setLoading(false);
        }
    }

    cancelActivity = async () => {
        this.setLoading(true);
        try {
            await agent.Activities.attend(this.selectedActivity!.id);

            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled
                this.activitiesRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        }
        catch (error) {
            console.log(error);
        }
        finally {
            this.setLoading(false);
        }

    }

    private setActivity(activity: IActivity) {
        const user = Store.userStore.user;

        if (user) {
            activity.isGoing = activity.attendees?.some(x =>
                x.userName === user.userName
            )
            activity.isHost = activity.hostUserName === user.userName;
            activity.host = activity.attendees?.find(x => x.userName == activity.hostUserName);
        }
        activity.date = new Date(activity.date!);
        this.activitiesRegistry.set(activity.id, activity);
    }
}