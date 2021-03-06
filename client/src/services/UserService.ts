import axios from 'axios';
import { Experience, User } from '../models/Models';

const LOCAL_USER = 'loginInfo';

export function getLocalUser(): User | null {
    const localInfo = localStorage.getItem('loginInfo');
    return localInfo == null ? null : JSON.parse(localInfo);
}

export function setLocalUser(user: User | null) {
    if (user == null) {
        localStorage.removeItem(LOCAL_USER);
    } else {
        localStorage.setItem(LOCAL_USER, JSON.stringify(user));
    }
}

export function getUserDetail(username: string): Promise<User> {
    return new Promise((resolve, reject) =>
        axios
            .get(`/users/${username}`)
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}

export function saveClientExperiences(username: string, experiences: Experience[]): Promise<User> {
    return new Promise((resolve, reject) =>
        axios
            .post(`/users/${username}`, { experiences })
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}

export function saveClientSkills(username: string, skills: string[]): Promise<User> {
    return new Promise((resolve, reject) =>
        axios
            .post(`/users/${username}`, { skills })
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}

export function uploadAvatar(username: string, avatar: any): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', avatar);
    const options = {
        headers: { 'Content-Type': 'multipart/form-data' },
    };
    return new Promise((resolve, reject) =>
        axios
            .post(`/users/${username}/avatar`, formData, options)
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}

export function getUsersRanking(order?: string): Promise<User[]> {
    return new Promise((resolve, reject) =>
        axios
            .get(`/users/ranking`, { params: { order } })
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}
