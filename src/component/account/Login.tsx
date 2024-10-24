import Input from "antd/lib/input";
import Password from "antd/lib/input/Password";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Button from "antd/lib/button";
import React, {useState} from "react";
import {useRouter} from "next/router";

export default function Login() {
    const router = useRouter();

    const [info, setInfo] = useState({memberId: '', memberPwd: ''});


    function infoChange(e) {
        let bowl = {}
        bowl[e.target.id] = e.target.value
        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    const onChange = (e) => {
        console.log(e, '::')
        // console.log(`checked = ${e.target.checked}`);
    };

    function getLogin() {

        router.push('/main')
    }

    return <>
        <Input id={'memberId'} value={info['memberId']} onChange={infoChange} style={{borderRadius: 5}}
               placeholder={'input your id'}/>
        <Password id={'memberPwd'} value={info['memberPwd']} onChange={infoChange} style={{borderRadius: 5}}
                  placeholder={'input your password'}/>
        <div style={{textAlign: 'left'}}>
            <Checkbox onChange={onChange} style={{color: 'gray'}}>아이디저장</Checkbox>
        </div>

        <Button type={'primary'} style={{height: '100%', borderRadius: 5}} onClick={getLogin}>LOGIN</Button>
    </>
}