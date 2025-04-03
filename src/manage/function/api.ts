import axios from "axios";
import {getCookie} from "@/manage/function/cookie";
import https from 'https';


//DEV
export const API_URL = 'https://manku.progist.co.kr/api';
// export const API_URL = 'http://175.125.92.183:8080/api';


const agent = new https.Agent({
    rejectUnauthorized: false, // SSL 검증 비활성화 (개발 환경 전용)
});

export const getData = axios.create({
    baseURL: API_URL,
    httpsAgent: agent,
    headers: {
        authorization: `Bearer ${getCookie(null,'token')}`,
        "Content-Type": `application/json`,

        "Accept-Language": getCookie(null,'lang') ? getCookie(null,'lang') : 'ko-KR',
        // @ts-ignore
        "refresh_token": getCookie(null,'refreshToken'),
    }
});


export const getLoginData = axios.create({
    baseURL: API_URL,
    httpsAgent: agent,
    headers: {
        authorization: `Bearer ${getCookie(null,'token')}`,
        "Content-Type": `application/json`,

        "Accept-Language": getCookie(null,'lang') ? getCookie(null,'lang') : 'ko-KR',
        // @ts-ignore
        "refresh_token": getCookie(null,'refreshToken'),
    }
});



export const getFormData = axios.create({
    baseURL: API_URL,
    httpsAgent: agent,
    headers: {
        authorization: `Bearer ${getCookie(null,'token')}`,

        "Accept-Language": getCookie(null,'lang') ? getCookie(null,'lang') : 'ko-KR',
        // @ts-ignore
        "refresh_token": getCookie(null,'refreshToken'),
    }
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