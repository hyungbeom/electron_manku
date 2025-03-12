import axios from "axios";
import {getCookie, removeCookie} from "@/manage/function/cookie";
import https from 'https';
import message from "antd/lib/message";


//DEV
export const API_URL = 'https://manku.progist.co.kr/api';
export const IMAGE_URL = 'https://image.season-market.co.kr/SeasonMarket/';


// 1. 공통 Axios 인스턴스 생성
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

const responseInterceptor = (response) => {
    const status = response.status;
    const responseData = response.data;


    if (responseData.code = -10006) {
        removeCookie(null, 'token');
        message.error("다른기기에서 로그인이 감지 되었습니다.");
        window.location.href = "/";
    }

    return response; // 정상적인 응답 반환
};

// ✅ 에러 응답 인터셉터 (HTTP 오류 코드 처리)
const errorInterceptor = (error) => {
    console.log(error,'error:')
    if (error.response) {
        const status = error.response.status;

        if (status === 401 || status === 403) {
            alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
            window.location.href = "/login"; // ✅ 로그인 페이지로 이동
        } else if (status === 500) {
            alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    return Promise.reject(error);
};


getData.interceptors.response.use(responseInterceptor, errorInterceptor);