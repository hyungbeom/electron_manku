import Input from "antd/lib/input";
import Password from "antd/lib/input/Password";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Button from "antd/lib/button";
import React, {useState} from "react";
import {useRouter} from "next/router";
import {getData} from "@/manage/function/api";
import {setCookies} from "@/manage/function/cookie";
import message from "antd/lib/message";
import LoginButton from "@/component/Sample";
import {DownCircleFilled, UpCircleFilled} from "@ant-design/icons";

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

        if (!info['adminName']) {
            return message.warn('아이디를 입력해주세요')
        } else if (!info['password']) {
            return message.warn('비밀번호를 입력해주세요')
        }

        getData.post('account/login', info).then(v => {
            if (v.data.code === 1) {
                const {accessToken} = v?.data?.entity;
                setCookies(null, 'token', accessToken)
                return router.push('/main?first=true')
            }
            message.warn(v.data.message)
        })
    }

    function handleKeyPressDoc(e) {
        if (e.key === 'Enter') {
            getLogin();
        }
    }

    const [adminLogin, setAdminLogin] = useState(true);

    return <>
        <Button style={{borderRadius : 5}} onClick={()=>{
            setAdminLogin(v=> !v)
        }}>일반유저 로그인 {!adminLogin? <DownCircleFilled/> : <UpCircleFilled />}</Button>
        {adminLogin ? <>
            <Input id={'adminName'} value={info['adminName']} onChange={infoChange} style={{borderRadius: 5}}
                   placeholder={'input your id'}/>
            <Password id={'password'} value={info['password']} onKeyDown={handleKeyPressDoc} onChange={infoChange}
                      style={{borderRadius: 5}}
                      placeholder={'input your password'}/>
            <div style={{textAlign: 'left'}}>
                <Checkbox style={{color: 'white', fontSize : 12}}>아이디저장</Checkbox>
            </div>
            <Button type={'primary'} style={{height: '100%', borderRadius: 5, border : '1px solid white', fontSize : 14}} size={'large'} onClick={getLogin}>로그인</Button>
            <div style={{textAlign: 'center',color: 'white', fontSize : 12}}>or</div>
        </> : <></>}
        <LoginButton/>
    </>
}