import { encrypt, decrypt } from '@devoxa/aes-encryption'
const axios = require('axios');
const {SALT_HASH} = require("./config")

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
            return {status: 0, message:"Valid Token"}
        }else{
            if (parseInt(decryptedExpiration) <= Date.now()){
                localStorage.removeItem("_to");
                localStorage.removeItem("_ex");
                localStorage.removeItem("_re")
                window.location.replace("https://localhost:3000/")
            }else{
                return {status: 0, message:"Valid Token"}
            }
        }
    })
}
export function checkTokenRequest(token){
    const instance = axios.create({
        baseURL: 'https://localhost:5000/api',
        method: "post",
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json',
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
export function goLocalLogin(email, password, remember){
    const instance = axios.create({
        baseURL: 'https://localhost:5000/api',
        method: "post",
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json'
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
            return {status: error.response.status, message: error.response.data.error}
        });
}