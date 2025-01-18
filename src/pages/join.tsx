import Input from "antd/lib/input";
import Password from "antd/lib/input/Password";
import React, {useEffect, useState} from "react";
import message from "antd/lib/message";
import {getData} from "@/manage/function/api";
import Button from "antd/lib/button";
import {useRouter} from "next/router";
import {apiManage} from "@/utils/commonManage";
import {getCookie} from "@/manage/function/cookie";

export default function joint(){
    const router = useRouter();
    const { query } = router;
    const [microsoftId , setMicrosoftId] = useState('');
    const [info , setInfo] = useState({adminName : '', password : '', passwordConfirm : '', name : '', position : '', email : '', contactNumber : '', faxNumber : ''});

    function infoChange(e){
        let bowl = {}
        bowl[e.target.id] = e.target.value
        setInfo(v=>{
            return {...v, ...bowl}
        })
    }


    useEffect( () => {

        const {code, redirect_to} = query; // 로그인 요청 시 전달받은 redirect_to 사용

        if (code) {
            loginTest(code)

        }
    },[query])


    async function loginTest(authorizationCode) {



        const codeVerifier =  getCookie(null, 'code_verifier');
        const result = await getData.post('account/microsoftLogin',
            {
                authorizationCode: authorizationCode,
                codeVerifier: codeVerifier,
                redirectUri : 'https://manku.progist.co.kr/join'
            });

        const {code, entity} = result?.data
        if(code === -10007){
            // 가입 가능
            setMicrosoftId(entity)
        }else if(code === 1){
            alert('이미 등록된 계정입니다.');
            window.location.href = '/'
        } else{
            window.location.href = '/'
        }
    }

    async function getSignUp() {

        if (!info['adminName']) {
            return message.warn('아이디를 입력해주세요')
        } else if (!info['password']) {
            return message.warn('비밀번호를 입력해주세요')
        } else if (!info['passwordConfirm']) {
            return message.warn('비밀번호 확인을 입력해주세요')
        } else if (info['password'] !== info['passwordConfirm']) {
            return message.warn('두 비밀번호가 일치하지 않습니다')
        }

        const {code, redirect_to} = query; // 로그인 요청 시 전달받은 redirect_to 사용

        if (code) {


            const result = await getData.post('account/microsoftJoin',
                {...info, microsoftId : microsoftId});

            console.log(result,'??')
            if(result?.data?.code === 1){
                alert('가입성공');
                window.location.href = '/'
            }
        } else {
            getData.post('account/join', info).then(v => {
                if (v.data.code === 1) {
                    message.success('관리자에게 회원가입 요청이 완료되었습니다.')
                } else {
                    message.error(v.data.message)
                }
            }, err => console.log(err, ':::'))
        }
    }

    return <>
        <div style={{maxWidth : 800, margin : '100px auto'}}>
        <Input id={'adminName'} value={info['adminName']} onChange={infoChange} style={{borderRadius: 5}} placeholder={'input your id'}/>
        <Password id={'password'} value={info['password']} onChange={infoChange} style={{borderRadius: 5}} placeholder={'input your password'}/>
        <Password id={'passwordConfirm'} value={info['passwordConfirm']} onChange={infoChange} style={{borderRadius: 5}} placeholder={'input your confirm password'}/>
        <Input id={'name'} value={info['name']} onChange={infoChange} style={{borderRadius: 5}} placeholder={'input your name'}/>
        <Input id={'position'} value={info['position']} onChange={infoChange} style={{borderRadius: 5}} placeholder={'input your part'}/>
        <Input id={'email'} value={info['email']} onChange={infoChange} style={{borderRadius: 5}} placeholder={'input your email'}/>
        <Input id={'contactNumber'} value={info['contactNumber']} onChange={infoChange} style={{borderRadius: 5}} placeholder={'input your manager phone number'}/>
        <Input id={'faxNumber'} value={info['faxNumber']} onChange={infoChange} style={{borderRadius: 5}} placeholder={'input your fax number'}/>

            <Button onClick={getSignUp}>
                Regist
            </Button>
        </div>

    </>
}