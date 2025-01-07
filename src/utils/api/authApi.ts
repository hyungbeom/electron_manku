import {getData} from "@/manage/function/api";
import message from "antd/lib/message";

export const microLogin = async ({data}) => {
    await getData.post('account/microsoftLogin', {
        authorizationCode: code,
        codeVerifier: codeVerifier,
        redirectUri: 'http://localhost:3000',
    }).then(v => {
        if (v.data.code === 1) {
            message.success('수정되었습니다')
        } else {
            message.error('수정에 실패하였습니다.')
        }
    });
};
