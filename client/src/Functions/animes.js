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
export function searchAnime(name){
    return checkToken().then(data => {
        if (data.status === 1){
            clearToken();
        }else{
            const instance = axios.create({
                baseURL: ApiIP,
                method: "get",
                timeout: 120000,
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `${data.token}`
                }
            });
            return instance
                .get(`/anime/search/${name}`)
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });
        }
    })
}
export function getAnimeByName(name){
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
                }
            });
            return instance
                .get(`/anime/${name}`)
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });
        }
    })
}
export function upvoteAnime(name, url){
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
                "name": name,
                "url": url
            }
            return instance
                .patch(`/anime/up`, body)
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });
        }
    })
}
export function getEpisode(name, episode){
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
                }
            });

            return instance
                .get(`/anime/${name}/${episode}`)
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