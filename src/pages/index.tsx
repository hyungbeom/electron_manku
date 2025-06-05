import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Tabs from "antd/lib/tabs";
import Login from "@/component/account/Login";
import SignUp from "@/component/account/SignUp";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import {getCookie, setCookies} from "@/manage/function/cookie";
import message from "antd/lib/message";

export default function Home() {


    const router = useRouter();

    const [page, setPage] = useState('login');

    const pageChange = (e) => {
        setPage(e)
    };

    useEffect(() => {
        // window.electron?.resizeWindow(600, 868)
    }, []);


    return (
        <div>
            <video style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: -1
            }}
                   autoPlay
                   muted
                   loop
                   playsInline
            >
                <source src="/login_back.mp4" type="video/mp4"/>
            </video>
            <div className={'container'} style={{paddingTop: 100}}>
                <div style={{
                    marginTop: 100,
                    width: 330,
                    margin: '0 auto',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: 20,
                    borderRadius: 10
                }}>

                    <div style={{textAlign: 'center'}}>
                        <div><span
                            style={{fontSize: 33, fontWeight: 500, color: 'white'}}>

                    MANKU ERP</span></div>


                        <div style={{fontSize: 14, opacity: 0.8, color: 'white'}}>manku erp will take care of your
                            convenience
                        </div>
                    </div>


                    <div style={{
                        display: 'grid',
                        gridTemplateRows: `repeat(${page === 'login' ? 5 : 7}, 40px)`,
                        rowGap: 20,
                        textAlign: 'center',
                        paddingTop: 60
                    }}>

                        <Tabs defaultActiveKey="login" centered={true} style={{color: 'white'}} items={[
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


                    </div>


                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        textAlign: 'center',
                        alignItems: 'center',
                        color: 'white'
                    }}>
                        <div style={{position: 'absolute', bottom: 30}}>
                            <div style={{color: 'white'}}>Manku ERP program <img src="/manku_logo.png" alt=""
                                                                                 width={30}/> Manku Solution
                            </div>
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <svg viewBox="64 64 896 896" focusable="false" data-icon="copyright" width="1em"
                                     height="1em" fill="currentColor" aria-hidden="true">
                                    <path
                                        d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm5.6-532.7c53 0 89 33.8 93 83.4.3 4.2 3.8 7.4 8 7.4h56.7c2.6 0 4.7-2.1 4.7-4.7 0-86.7-68.4-147.4-162.7-147.4C407.4 290 344 364.2 344 486.8v52.3C344 660.8 407.4 734 517.3 734c94 0 162.7-58.8 162.7-141.4 0-2.6-2.1-4.7-4.7-4.7h-56.8c-4.2 0-7.6 3.2-8 7.3-4.2 46.1-40.1 77.8-93 77.8-65.3 0-102.1-47.9-102.1-133.6v-52.6c.1-87 37-135.5 102.2-135.5z"></path>
                                </svg>
                                &nbsp; Powered by manku Solution
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}


// @ts-ignore
export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {

    let message = ''

    await initialServerRouter(ctx, store);
    const {query} = ctx; // URL 쿼리 파라미터
    const {code, redirect_to} = query;

    if (code) {

        const codeVerifier = getCookie(ctx, "code_verifier");

        try {
            const v = await getData.post('account/microsoftLogin', {
                authorizationCode: code,
                codeVerifier: codeVerifier,
                // redirectUri: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://server.progist.co.kr'
                redirectUri: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://manku.progist.co.kr'
            });


            const codeCheck = v?.data?.code;

            if (codeCheck === 1) {
                const {accessToken} = v?.data?.entity;
                if (accessToken) {
                    setCookies(ctx, 'token', accessToken);
                    return {
                        redirect: {
                            destination: '/main?first=true',
                        },
                    };
                }

            }
        } catch (error) {
            console.error("Microsoft Login failed:", error);
            // 필요시 로그인 실패 처리를 할 수 있습니다.
        }
    }else{
        const state = store.getState();

        // userInfo 추출
        const userInfo = state.user.userInfo;
        if(userInfo?.accessToken){
            return {
                redirect: {
                    destination: '/main?first=true',
                },
            };
        }
    }

});