import axios, { AxiosError, AxiosResponse } from "axios"
import { ActivityFormValues, IActivity } from "../models/activity";
import { toast } from "react-toastify";
import { router } from "../router/Router";
import { Store } from "../stores/store"
import { User } from "../models/user";
import { Login } from "../models/login";
import { Photo, Profile, UserActivity } from "../models/profile";
import { PaginationResult } from "../models/pagination";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use(config => {
    const token = Store.commonStore.token;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;

    }
    return config;
})
axios.interceptors.response.use(async response => {
    await sleep(500);

    const pagination = response.headers['pagination'];
    if (pagination) {
        response.data = new PaginationResult(response.data, JSON.parse(pagination));

        return response as AxiosResponse<PaginationResult<any>>
    }
    return response;
}, (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse;

    switch (status) {
        case 400:
            if (config.method === 'get' && Object.prototype.hasOwnProperty.call(data.errors, 'id')) {
                router.navigate('/not-found');
            }
            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            } else {
                toast.error('Bad request')
            }
            break;
        case 401:
            toast.error('Unauthorized')
            break;
        case 403:
            toast.error('Forbidden')
            break;
        case 404:
            toast.error('Not found')
            router.navigate('/not-found')
            break;
        case 500:
            Store.commonStore.setError(data);
            toast.error('Server error');
            router.navigate('/server-error');
            break;
    }

    return Promise.reject(error);
})

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
    list: (params: URLSearchParams) => axios.get<PaginationResult<IActivity[]>>('/activities', { params }).then(responseBody),
    details: (id: string) => requests.get<IActivity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<IActivity>('/activities', activity),
    update: (id: string, activity: ActivityFormValues) => requests.put<IActivity>(`/activities/${id}`, activity),
    delete: (id: string) => requests.del<IActivity>(`/activities/${id}`),
    attend: (id: string) => requests.post<IActivity>(`/activities/${id}/attend`, {})
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: Login) => requests.post<User>('/account/login', user),
    register: (user: Login) => requests.post<User>('/account/register', user)
}

const Profiles = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    getUserActivities: (username: string, predicate: string | null = null) => requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`),
    update: (profileFormValues: Partial<Profile>) => requests.put('/profiles', profileFormValues),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);

        return axios.post<Photo>('photo', formData, {
            headers: { 'Content-type': 'multipart/form-data' }
        })
    },
    setMainPhoto: (id: string) => requests.post(`/photo/${id}/setmain`, {}),
    deletePhoto: (id: string) => requests.del(`/photo/${id}`),
    updateFollowing: (userName: string) => requests.post(`/follow/${userName}`, {}),
    listFollowings: (userName: string, predicate: string) =>
        requests.get<Profile[]>(`/follow/${userName}?predicate=${predicate}`)
}
const agent = {
    Activities,
    Account,
    Profiles
}

export default agent;