import Input from "antd/lib/input";
import Password from "antd/lib/input/Password";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Button from "antd/lib/button";
import React, {useState} from "react";

export default function SignUp(){

    const [info , setInfo] = useState({memberId : '', memberPwd : '', memberConfirmPwd : '', company : '', homepage : '', note : ''});

    function infoChange(e){
        let bowl = {}
        bowl[e.target.id] = e.target.value
        setInfo(v=>{
            return {...v, ...bowl}
        })
    }


    return <>
        <Input id={'memberId'} value={info['memberId']} onChange={infoChange} style={{borderRadius: 5}} placeHolder={'input your id'}/>
        <Password id={'memberPwd'} value={info['memberPwd']} onChange={infoChange} style={{borderRadius: 5}} placeHolder={'input your password'}/>
        <Password id={'memberConfirmPwd'} value={info['memberConfirmPwd']} onChange={infoChange} style={{borderRadius: 5}} placeHolder={'input your confirm password'}/>
        <Input id={'company'} value={info['company']} onChange={infoChange} style={{borderRadius: 5}} placeHolder={'input your company'}/>
        <Input id={'homepage'} value={info['homepage']} onChange={infoChange} style={{borderRadius: 5}} placeHolder={'input your homepage'}/>
        <Input id={'note'} value={info['note']} onChange={infoChange} style={{borderRadius: 5}} placeHolder={'input your note'}/>




        <Button type={'primary'} style={{height: '100%', borderRadius: 5}}>SIGN UP</Button>

    </>
}