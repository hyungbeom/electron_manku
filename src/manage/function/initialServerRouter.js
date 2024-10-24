// import {getCookie, setCookie} from "./cookie";

// import {getData} from "./api";
// import {userInformation} from "../../../store/auth/authSlice";


import  {getCookie} from "@/manage/function/cookie.js";
import {parseCookies} from "nookies";
import {getData} from "@/manage/function/api";

export default async function (ctx, store) {
    const cookies = parseCookies(ctx,'token');
    // let userState = false;
    // let deployResponse = {};
    let userInfo = null;


    if (ctx.req) {
    //
    //     console.log('잘됨?')
    //     // token header setting

        getData.defaults.headers["authorization"] = `Bearer ${getCookie(ctx,'token')}`;
    //     // refresh_token header setting
        getData.defaults.headers["refresh_token"] = getCookie(ctx,"refreshToken");
    //     // ====> header 값을 기준으로 백엔드에서는 토큰의 유효성 검사 후 리턴해준다.


        await getData.post("admin/getMyAccount").then((res) => {

            const result = res?.data?.entity;
            userInfo = result;


    //         // user 토근값 유효했을시....
    //         const {result} = res.data.userInfo;
    //         // redux 에 저장...
    //         // store.dispatch(userInformation(result));
    //         userInfo = result;
        }, async err => {
    //         if(err.response?.status === 503) {
    //             deployResponse = {status: err.response.status, data: err.response.data};
    //         }
    //



            await getData.get("api/account/refresh").then((res) => {

    //             const {accessToken, refreshToken} = res.data;
    //
    //             setCookie(ctx, "token", accessToken);
    //             setCookie(ctx, "refreshToken", refreshToken);
    //             const {result} = res.data.userInfo;
    //             store.dispatch(userInformation(result));
    //             userState = !result.role.includes("guest");
    //             userInfo = result;
            }, err => {

                // 아니면 아닌 처리
            });
        });
    }


    return { userInfo: userInfo};
}


