import Button from "antd/lib/button";
import React from "react";
import SignUpButton from "@/component/SignUpButton";
import {useRouter} from "next/router";

export default function SignUp(){

    const router = useRouter();


    function moveJoin(){
        window.location.href = '/join'
    }

    return <>



        <Button type={'primary'} style={{height: '100%', borderRadius: 5, fontSize : 14, border : '1px solid white'}} onClick={moveJoin}>SIGN UP</Button>
        <div style={{textAlign: 'center', display : 'flex', justifyContent : 'center', alignItems : 'center', color : 'white'}}>or</div>
        <SignUpButton/>

    </>
}