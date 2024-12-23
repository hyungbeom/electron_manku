import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Tabs from "antd/lib/tabs";
import Login from "@/component/account/Login";
import SignUp from "@/component/account/SignUp";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import nookies from "nookies";
import {setCookies} from "@/manage/function/cookie";
import LoginButton from "@/component/Sample";

export default function Home(props) {

    const router = useRouter();

    const [page, setPage] = useState('login');


    const pageChange = (e) => {
        setPage(e)
    };


    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const authorizationCode = urlParams.get("code");

        console.log(authorizationCode,'   authorizationCode:')
        if (authorizationCode) {
            // code_verifier 가져오기
            const codeVerifier = localStorage.getItem("code_verifier");

            console.log(codeVerifier,'   codeVerifier:')

            // Authorization Code와 code_verifier를 백엔드로 전송
            fetch("/api/exchange-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: authorizationCode, code_verifier: codeVerifier }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Access Token:", data.access_token);
                })
                .catch(error => {
                    console.error("Token exchange error:", error);
                });
        }
    }, []);

    return (

        <div className={'container'}>
            <div style={{paddingTop: 100, width: 330, margin: '0 auto'}}>

                <div style={{textAlign: 'center'}}>
                    <div><img src={'/manku_logo.png'} alt="" style={{width: 80}}/><span
                        style={{fontSize: 33, fontWeight: 300}}>

                    MANKU ERP</span></div>


                    <div style={{fontSize: 14, color: '#000000', opacity: 0.6}}>manku erp will take care of your
                        convenience
                    </div>
                </div>


                <div style={{
                    display: 'grid',
                    gridTemplateRows: `repeat(${page === 'login' ? 5 : 10}, 40px)`,
                    rowGap: 20,
                    textAlign: 'center',
                    paddingTop: 60
                }}>

                    <Tabs defaultActiveKey="login" centered={true} items={[
                        {
                            key: 'login',
                            label: 'LOGIN',
                        },
                        {
                            key: 'signup',
                            label: ' SIGN UP',
                        }
                    ]} onChange={pageChange}/>

                    {page === 'login' ? <Login/> : <SignUp/>}

                    <div style={{textAlign : 'center'}}>or</div>
                    <LoginButton/>
                </div>


                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    textAlign: 'center',
                    alignItems: 'center'
                }}>
                    <div style={{position: 'absolute', bottom: 30}}>
                        <div style={{color: 'gray'}}>Manku ERP program <img src="/manku_logo.png" alt=""
                                                                            width={30}/> Manku Trading
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="copyright" width="1em"
                                 height="1em" fill="currentColor" aria-hidden="true">
                                <path
                                    d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm5.6-532.7c53 0 89 33.8 93 83.4.3 4.2 3.8 7.4 8 7.4h56.7c2.6 0 4.7-2.1 4.7-4.7 0-86.7-68.4-147.4-162.7-147.4C407.4 290 344 364.2 344 486.8v52.3C344 660.8 407.4 734 517.3 734c94 0 162.7-58.8 162.7-141.4 0-2.6-2.1-4.7-4.7-4.7h-56.8c-4.2 0-7.6 3.2-8 7.3-4.2 46.1-40.1 77.8-93 77.8-65.3 0-102.1-47.9-102.1-133.6v-52.6c.1-87 37-135.5 102.2-135.5z"></path>
                            </svg>
                            &nbsp; Powered by manku trading
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}


export const getServerSideProps:any = wrapper.getStaticProps((store: any) => async (ctx: any) => {
    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    if (!(codeInfo < 0)) {
        return {
            redirect: {
                destination: '/main',
                permanent: false,
            },
        };
    }
    store.dispatch(setUserInfo(userInfo));
})