import {checkToken, clearToken} from "./auth";
import {ApiIP} from "../config";

const axios = require('axios');

export function generateKeyRequest(){
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
                },
                data: {}
            });
            return instance
                .post(`/key/generate`)
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });
        }
    })
}
export function deleteKeyRequest(key){
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
                },
                data: {}
            });
            return instance
                .delete(`/key/${key}`)
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    console.log(error.response)
                    return error.response;
                });
        }
    })
}
export function getAllKeysRequest(){
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
                .get(`/key/all`)
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });
        }
    })
}