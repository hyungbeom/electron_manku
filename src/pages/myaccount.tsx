import React, {useState} from "react";
import LayoutComponent from "@/component/LayoutComponent";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {inputAntdForm, inputForm, inputPasswordForm} from "@/utils/commonForm";
import Button from "antd/lib/button";
import {commonManage} from "@/utils/commonManage";
import {useAppSelector} from "@/utils/common/function/reduxHooks";

export default function myaccount() {
    const userInfo = useAppSelector((state) => state.user);


    const [info, setInfo] = useState(userInfo);


    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }


    return <LayoutComponent>
        <div style={{maxWidth: 500, margin: '0px auto'}}>
            <div style={{fontSize: 30, fontWeight: 500, textAlign: 'center', padding: '50px 0px 30px 0px'}}>개인정보 수정
            </div>


            {inputAntdForm({
                title: 'ID',
                id: 'adminName',
                onChange: onChange,
                data: info,
                placeHolder: '아이디를 입력해 주세요',
                size: 'large'
            })}



            {inputAntdForm({
                title: 'NAME',
                id: 'name',
                onChange: onChange,
                data: info,
                placeHolder: '이름를 입력해 주세요',
                size: 'middle'
            })}
            {inputAntdForm({
                title: 'POSITION',
                id: 'position',
                onChange: onChange,
                data: info,
                placeHolder: '부서를를 입력해 주세요',
                size: 'middle'
            })}


            {inputAntdForm({
                title: 'EMAIL',
                id: 'email',
                onChange: onChange,
                data: info,
                placeHolder: '이메일을 입력해 주세요',
                size: 'middle'
            })}


            {inputAntdForm({
                title: 'CONTACT NUMBER',
                id: 'contactNumber',
                onChange: onChange,
                data: info,
                placeHolder: '연락처 입력해 주세요',
                size: 'middle'
            })}

            {inputAntdForm({
                title: 'FAX',
                id: 'faxNumber',
                onChange: onChange,
                data: info,
                placeHolder: '팩스번호를 입력해 주세요',
                size: 'middle'
            })}


            <Button type={'primary'} size={'large'} style={{
                margin: '30px auto',
                width: '100%',
                height: 40,
                borderRadius: 5,
                fontSize: 16,
                fontWeight: 500
            }}>
                수 정
            </Button>
        </div>
    </LayoutComponent>
}


// @ts-ignore
export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    if (codeInfo < 0) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    } else {
        store.dispatch(setUserInfo(userInfo));
    }

    // return {props: {dataInfo: 'asdf'}}
})