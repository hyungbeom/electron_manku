import axios from "axios";
import {getCookie} from "@/manage/function/cookie";


//DEV
export const API_URL = 'http://223.130.154.113:8080/api/';
export const IMAGE_URL = 'https://image.season-market.co.kr/SeasonMarket/';
// export const API_URL = 'http://1.234.53.100:8083/';

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


// getData.interceptors.request.use(
//     config => {
//         // console.log("축하드려요 호출 성공")
//         if (config.url?.includes('?')) {
//             const urls = config.url?.split('?');
//             config.url = urls[0] + '?' + AesEncrypt(urls[1]);
//         } else {
//             if (config.data)
//                 config.data = AesEncryptForm(config.data);
//         }
//         return config;
//     }
// );
//
// getData.interceptors.response.use(
//     function (response) {
//         // console.log(response,'축하드려요 api res 성공');
//         const authToken = response.headers['authorization'];
//         const refreshToken = response.headers['refresh_token'];
//         if(authToken){
//             setCookie(null, 'token', authToken);
//             if(refreshToken){
//                 setCookie(null, 'refreshToken', refreshToken);
//             }
//             setCookie(null, 'updateRole', "1");
//         }
//
//         return AesDecrypt(response);
//         return response;
//     },
//     async (error) => {
//         const {
//             config,
//             response,
//         } = error;
//         if(response?.status == 303)
//         {
//             removeCookie(null, 'token');
//             removeCookie(null, 'refreshToken');
//             window.location.href = '/';
//             return Promise.reject();
//         }
//         const refreshToken = getCookie(null, 'refreshToken');
//         if (config.url !== 'auth/userinfo' && config !== 'guest/userguest/refresh-token' && response?.status === 401 && refreshToken && refreshToken != "") {
//             const originalRequest = config;
//             await getData.get('guest/userguest/refresh-token').then(async res => {
//                 if (res.data.accessToken) {
//                     setCookie(null, 'token', res.data.accessToken);
//                     originalRequest.headers.authorization = `Bearer ${res.data.accessToken}`;
//                 }
//                 if (res.data.refreshToken) {
//                     setCookie(null, 'refreshToken', res.data.refreshToken);
//                     originalRequest.headers['refresh_token'] = `Bearer ${res.data.refreshToken}`;
//                 }
//             }, error => {
//                 //refresh-token 실패하면 나가
//                 removeCookie(null, 'token');
//                 removeCookie(null, 'refreshToken');
//                 window.location.href = '/';
//                 return Promise.reject();
//             })
//
//
//             const get = await axios(originalRequest);
//             return AesDecrypt(get);
//         }
//
//         const res = AesDecrypt(error.response);
//         error.response.data = res.data;
//         return Promise.reject(error);
//     }
// );