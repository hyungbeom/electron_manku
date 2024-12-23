import axios from "axios";
import {getCookie} from "@/manage/function/cookie";


//DEV
export const API_URL = 'http://175.125.92.183:8080/api/';
export const IMAGE_URL = 'https://image.season-market.co.kr/SeasonMarket/';


export const getData = axios.create({
    baseURL: API_URL,
    headers: {
        authorization: `Bearer ${getCookie(null,'token')}`,
        "Content-Type": `application/json`,

        "Accept-Language": getCookie(null,'lang') ? getCookie(null,'lang') : 'ko-KR',
        // @ts-ignore
        "refresh_token": getCookie(null,'refreshToken'),
    }
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