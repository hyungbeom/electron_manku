import Input from "antd/lib/input";
import Password from "antd/lib/input/Password";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Button from "antd/lib/button";
import message from "antd/lib/message";
import React, {useState} from "react";
import {getData} from "@/manage/function/api";

export default function SignUp(){

    const [info , setInfo] = useState({adminName : '', password : '', passwordConfirm : '', name : '', position : '', email : '', contactNumber : '', faxNumber : ''});

    function infoChange(e){
        let bowl = {}
        bowl[e.target.id] = e.target.value
        setInfo(v=>{
            return {...v, ...bowl}
        })
    }

    function getSignUp(){

        if(!info['adminName']){
           return message.warn('아이디를 입력해주세요')
        }else if(!info['password']){
            return message.warn('비밀번호를 입력해주세요')
        }else if(!info['passwordConfirm']){
            return message.warn('비밀번호 확인을 입력해주세요')
        }else if(info['password'] !== info['passwordConfirm']){
            return message.warn('두 비밀번호가 일치하지 않습니다')
        }

        getData.post('account/join',info).then(v=>{
            if(v.data.code === 1) {
                message.success('관리자에게 회원가입 요청이 완료되었습니다.')
            }else{
                message.error(v.data.message)
            }
        },err=>console.log(err,':::'))

    }


    return <>
        <Input id={'adminName'} value={info['adminName']} onChange={infoChange} style={{borderRadius: 5}} placeholder={'input your id'}/>
        <Password id={'password'} value={info['password']} onChange={infoChange} style={{borderRadius: 5}} placeholder={'input your password'}/>
        <Password id={'passwordConfirm'} value={info['passwordConfirm']} onChange={infoChange} style={{borderRadius: 5}} placeholder={'input your confirm password'}/>
        <Input id={'name'} value={info['name']} onChange={infoChange} style={{borderRadius: 5}} placeholder={'input your name'}/>
        <Input id={'position'} value={info['position']} onChange={infoChange} style={{borderRadius: 5}} placeholder={'input your part'}/>
        <Input id={'email'} value={info['email']} onChange={infoChange} style={{borderRadius: 5}} placeholder={'input your email'}/>
        <Input id={'contactNumber'} value={info['contactNumber']} onChange={infoChange} style={{borderRadius: 5}} placeholder={'input your manager phone number'}/>
        <Input id={'faxNumber'} value={info['faxNumber']} onChange={infoChange} style={{borderRadius: 5}} placeholder={'input your fax number'}/>




        <Button type={'primary'} style={{height: '100%', borderRadius: 5}} onClick={getSignUp}>SIGN UP</Button>

    </>
}