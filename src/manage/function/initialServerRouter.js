import {getCookie} from "@/manage/function/cookie.js";
import {getData} from "@/manage/function/api";
import {setAdminList, setUserInfo} from "@/store/user/userSlice.js";

export default async function (ctx, store) {


    if (ctx.req) {
        getData.defaults.headers["authorization"] = `Bearer ${getCookie(ctx, 'token')}`;
        getData.defaults.headers["refresh_token"] = getCookie(ctx, "refreshToken");

        return await getData.post("account/getMyAccount").then(async (res) => {

            const {entity, code} = res?.data;

            if (code === 1) {

                store.dispatch(setUserInfo(entity));
                await getData.post('admin/getAdminList', {
                    "searchText": null,         // 아이디, 이름, 직급, 이메일, 연락처, 팩스번호
                    "searchAuthority": null,    // 1: 일반, 0: 관리자
                    "page": 1,
                    "limit": -1
                }).then(v => {
                    store.dispatch(setAdminList(v?.data?.entity?.adminList));
                })
            } else {
                console.log("여기로 와야할텐데?")
                return {
                    redirect: {
                        destination: '/',
                        permanent: false,
                    },
                };
            }


        }, async err => {

            console.log(":::::::::::")
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            };

            // console.log(err,'err')
            // await getData.get("account/refresh").then((res) => {
            //
            // }, err => {
            //
            //     // 아니면 아닌 처리
            // });
        });
    }

}


