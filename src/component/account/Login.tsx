import Input from "antd/lib/input";
import Password from "antd/lib/input/Password";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Button from "antd/lib/button";
import React, {useState} from "react";
import {useRouter} from "next/router";
import {getData} from "@/manage/function/api";
import {setCookies} from "@/manage/function/cookie";
import message from "antd/lib/message";

export default function Login() {
    const router = useRouter();

    const [info, setInfo] = useState({adminName: '', password: ''});


    function infoChange(e) {
        let bowl = {}
        bowl[e.target.id] = e.target.value
        setInfo(v => {
            return {...v, ...bowl}
        })
    }


    function getLogin() {

        if(!info['adminName']){
            return message.warn('아이디를 입력해주세요')
        }else if(!info['password']){
            return message.warn('비밀번호를 입력해주세요')
        }

        getData.post('account/login',info).then(v=>{
            if(v.data.code === 1){
                const {accessToken} = v?.data?.entity;
                setCookies(null, 'token', accessToken)
               return router.push('/main')
            }

            message.warn(v.data.message)
        })
    }

    return <>
        <Input id={'adminName'} value={info['adminName']} onChange={infoChange} style={{borderRadius: 5}}
               placeholder={'input your id'}/>
        <Password id={'password'} value={info['password']} onChange={infoChange} style={{borderRadius: 5}}
                  placeholder={'input your password'}/>
        <div style={{textAlign: 'left'}}>
            <Checkbox style={{color: 'gray'}}>아이디저장</Checkbox>
        </div>

        <Button type={'primary'} style={{height: '100%', borderRadius: 5}} onClick={getLogin}>LOGIN</Button>
    </>
}