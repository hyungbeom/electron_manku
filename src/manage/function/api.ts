import axios from "axios";
import {getCookie} from "@/manage/function/cookie";
import https from 'https';



//DEV
// export const API_URL = 'https://manku.progist.co.kr/api';
// export const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3002/api' : 'https://server.progist.co.kr/api'
export const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3002/api' : 'https://manku.progist.co.kr/api'
// export const API_URL = 'http://175.125.92.183:8080/api';
// export const API_URL = 'http://49.175.200.55:3002/api';
// export const API_URL = 'http://localhost:3002/api';


const agent = new https.Agent({
    rejectUnauthorized: false, // SSL 검증 비활성화 (개발 환경 전용)
});


export const getData = axios.create({
    baseURL: API_URL,
    httpsAgent: agent,
    headers: {
        authorization: `Bearer ${getCookie(null, 'token')}`,
        "Content-Type": `application/json`,
        "Accept-Language": getCookie(null, 'lang') ? getCookie(null, 'lang') : 'ko-KR',
        "refresh_token": getCookie(null, 'refreshToken'),
    }
});


export const getLoginData = axios.create({
    baseURL: API_URL,
    httpsAgent: agent,
    headers: {
        authorization: `Bearer ${getCookie(null, 'token')}`,
        "Content-Type": `application/json`,
        "Accept-Language": getCookie(null, 'lang') ? getCookie(null, 'lang') : 'ko-KR',
        // @ts-ignore
        "refresh_token": getCookie(null, 'refreshToken'),
    }
});


export const getFormData = axios.create({
    baseURL: API_URL,
    httpsAgent: agent,
    headers: {
        authorization: `Bearer ${getCookie(null, 'token')}`,
        "Accept-Language": getCookie(null, 'lang') ? getCookie(null, 'lang') : 'ko-KR',
        // @ts-ignore
        "refresh_token": getCookie(null, 'refreshToken'),
    },
    transformRequest: [(data) => {
        if (!(data instanceof FormData) && typeof data === 'object') {
            const formData = new FormData();
            for (const key in data) {
                const value = data[key];
                if (Array.isArray(value)) {
                    value.forEach((item, i) => {
                        for (const subKey in item) {
                            formData.append(`${key}[${i}].${subKey}`, item[subKey] ?? '');
                        }
                    });
                } else {
                    formData.append(key, value ?? '');
                }
            }
            return formData;
        }
        return data;
    }]
});


getFormData.interceptors.request.use((config) => {

    const token = getCookie(null, 'token');
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }

    const lang = getCookie(null, 'lang');
    if (lang) {
        config.headers['Accept-Language'] = lang;
    }

    return config;
});

getData.interceptors.request.use((config) => {

    const token = getCookie(null, 'token');
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }
    const lang = getCookie(null, 'lang');
    if (lang) {
        config.headers['Accept-Language'] = lang;
    }
    return config;
});

getLoginData.interceptors.request.use((config) => {

    const token = getCookie(null, 'token');
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }
    const lang = getCookie(null, 'lang');
    if (lang) {
        config.headers['Accept-Language'] = lang;
    }
    return config;
});
