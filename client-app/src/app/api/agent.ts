import axios, { AxiosError, AxiosResponse } from "axios"
import { IActivity } from "../models/activity";
import { toast } from "react-toastify";
import { router } from "../router/Router";
import {Store} from "../stores/store"
import { User } from "../models/user";
import { Login } from "../models/login";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use(config => {
    const token = Store.commonStore.token;
    if( token && config.headers){
        config.headers.Authorization = `Bearer ${token}`;
        
    }
    return config;
})
axios.interceptors.response.use(async response => {
    await sleep(500);
    return response;
}, (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse;

    switch (status) {
        case 400:
            if(config.method === 'get' && Object.prototype.hasOwnProperty.call(data.errors, 'id')){
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
    list: () => requests.get<IActivity[]>('/activities'),
    details: (id: string) => requests.get<IActivity>(`/activities/${id}`),
    create: (activity: IActivity) => requests.post<IActivity>('/activities', activity),
    update: (id: string, activity: IActivity) => requests.put<IActivity>(`/activities/${id}`, activity),
    delete: (id: string) => requests.del<IActivity>(`/activities/${id}`)
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: Login) =>  requests.post<User>('/account/login', user),
    register: (user: Login) =>  requests.post<User>('/account/register', user)
}

const agent = {
    Activities,
    Account
}

export default agent;