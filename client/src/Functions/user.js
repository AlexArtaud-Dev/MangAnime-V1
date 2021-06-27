import {checkToken, clearToken} from "./auth";
import {ApiIP} from "../config";

const axios = require('axios');

export function getServerInfos(){
    return checkToken().then(data => {
        if (data.status === 1){
            clearToken();
        }else{
            const instance = axios.create({
                baseURL: ApiIP,
                method: "get",
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `${data.token}`
                },
                data: {}
            });
            return instance
                .get(`/server/cpu`)
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });
        }
    })
}
export function getUserInfos(){
    return checkToken().then(data => {
        if (data.status === 1){
            clearToken();
        }else{
            const instance = axios.create({
                baseURL: ApiIP,
                method: "get",
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `${data.token}`
                },
                data: {}
            });
            return instance
                .get(`/users/`)
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });
        }
    })
}
export function searchUsers(nickname, email, letter){
    return checkToken().then(data => {
        if (data.status === 1){
            clearToken();
        }else{
            const instance = axios.create({
                baseURL: ApiIP,
                method: "post",
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `${data.token}`
                }
            });
            const body = {
                nickname: nickname,
                email: email,
                letter: letter
            }
            return instance
                .post(`/users/search`, body)
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });
        }
    })
}
export function elevate(userID){
    return checkToken().then(data => {
        if (data.status === 1){
            clearToken();
        }else{
            const instance = axios.create({
                baseURL: ApiIP,
                method: "patch",
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `${data.token}`
                },
                data: {}
            });
            return instance
                .patch(`/users/elevateToAdmin/${userID}`)
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });
        }
    })
}
export function demote(adminID, ownerPassword){
    return checkToken().then(data => {
        if (data.status === 1){
            clearToken();
        }else{
            const instance = axios.create({
                baseURL: ApiIP,
                method: "patch",
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `${data.token}`
                }
            });
            const body = {
                ownerPassword: ownerPassword
            }
            return instance
                .patch(`/users/demote/${adminID}`, body)
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });
        }
    })
}
export function deleteUserOrAdmin(userID, ownerPassword){
    return checkToken().then(data => {
        if (data.status === 1){
            clearToken();
        }else{
            const instance = axios.create({
                baseURL: ApiIP,
                method: "delete",
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `${data.token}`
                }
            });
            return instance
                .delete(`/users/${userID}/${ownerPassword}`)
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });
        }
    })
}
export function updateUser(nickname, email, password){
    return checkToken().then(data => {
        if (data.status === 1){
            clearToken();
        }else{
            const instance = axios.create({
                baseURL: ApiIP,
                method: "patch",
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `${data.token}`
                }
            });
            const body = {
                nickname: nickname,
                email: email,
                password: password
            }
            return instance
                .patch(`/users/`, body)
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });
        }
    })
}