import { encrypt, decrypt } from '@devoxa/aes-encryption'
import {ApiIP} from "../config";
const axios = require('axios');
const {SALT_HASH} = require("./config")
const {IP} = require("../config")

export async function checkToken(){
    const token = localStorage.getItem("_to")
    const expiration = localStorage.getItem("_ex")
    const remember = localStorage.getItem("_re")
    if (!token || !expiration || !remember) return {status: 1, message:"Invalid Token"};
    const decryptedToken = decrypt(SALT_HASH, token)
    const decryptedExpiration = decrypt(SALT_HASH, expiration)
    const decryptedRemember = decrypt(SALT_HASH, remember)
    return checkTokenRequest(decryptedToken).then(res => {
        if (res.data.status === false) return {status: 1, message:"Invalid Token"}
        if (decryptedRemember === 'true'){
            return {status: 0, message:"Valid Token", token: decryptedToken}
        }else{
            if (parseInt(decryptedExpiration) <= Date.now()){
                localStorage.removeItem("_to");
                localStorage.removeItem("_ex");
                localStorage.removeItem("_re")
                window.location.replace("/")
            }else{
                return {status: 0, message:"Valid Token", token: decryptedToken}
            }
        }
    })
}
export function clearToken(){
    localStorage.removeItem("_to");
    localStorage.removeItem("_ex");
    localStorage.removeItem("_re")
    window.location.replace("/")
}
export function checkTokenRequest(token){
    const instance = axios.create({
        baseURL: ApiIP,
        method: "post",
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'auth-token': `${token}`
        },
        data: {}
    });
    return instance
        .post('/user/checkToken')
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        });
}
export function mangAnimeRegister(nickname, email, password, passwordConfirmation, key){
    const instance = axios.create({
        baseURL: ApiIP,
        method: "post",
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
    let data = {
        "key": key,
        "nickname": nickname,
        "email": email,
        "password": password,
        "passwordConfirmation": passwordConfirmation
    }
    return instance
        .post('/user/register', data)
        .then((response) => {
            return {status: response.status, message: "Registered"}
        })
        .catch((error) => {
            return {status: error.response.status, message: error.response.data.error}
        });
}
export function mangAnimeLogin(email, password, remember){
    const instance = axios.create({
        baseURL: ApiIP,
        method: "post",
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
    let data = {
        "email": email,
        "password": password
    }
    return instance
        .post('/user/login', data)
        .then((response) => {
            const encryptedToken = encrypt(SALT_HASH, response.data);
            const encryptedDate = encrypt(SALT_HASH, (Date.now() + 3600000).toString());
            const encryptedRemember = encrypt(SALT_HASH, remember.toString());

            localStorage.setItem("_to", encryptedToken)
            localStorage.setItem("_ex", encryptedDate)
            localStorage.setItem("_re", encryptedRemember)
            return {status: response.status, message: "Connected"}
        })
        .catch((error) => {
            console.log(error)
            return {status: error.response.status, message: error.response.data.error}
        });
}
export function getQRCode(){
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
                .get(`/user/generate/qr`)
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    return error.response;
                });
        }
    })
}
export function logout(){
    localStorage.removeItem("_to")
    localStorage.removeItem("_ex")
    localStorage.removeItem("_re")
    localStorage.setItem("noLoading", "true");
    window.location.replace("/")
}