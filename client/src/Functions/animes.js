import {checkToken, clearToken} from "./auth";
import {ApiIP} from "../config";

const axios = require('axios');


export function getTrending(limit){
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
                .get(`/anime/popular/${limit}`)
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });
        }
    })
}
export function getWatched(){
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
                .get(`/anime/watched`)
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });
        }
    })
}