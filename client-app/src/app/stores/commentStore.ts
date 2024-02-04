import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatComment } from "../models/comments";
import { makeAutoObservable, runInAction } from "mobx";
import { Store } from "./store";

export default class CommentStore {
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    /**
     *
     */
    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        if (Store.activityStore.selectedActivity) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl('http://localhost:5000/chat?activityId=' + activityId, {
                    accessTokenFactory: () => Store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this.hubConnection?.start().catch(error => console.log('Error establishing the connection ', error));

            this.hubConnection?.on('LoadComments', (comments: ChatComment[]) => {
                runInAction(() => {
                    comments.forEach(comment => {
                        comment.createdAt = new Date(comment.createdAt + 'Z');
                    })

                    this.comments = comments
                })
            });

            this.hubConnection?.on('ReceiveComment', (comment: ChatComment) => {
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt);
                    this.comments.unshift(comment)
                })
            });
        }

    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error stopping connection: ', error));
    }

    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (body: string) => {
        try {
            if (body) {

                const extendedComment = { body, activityId: Store.activityStore.selectedActivity?.id };
                await this.hubConnection?.invoke('SendComment', extendedComment);
            }
        } catch (error) {
            console.log(error);
        }
    }
}