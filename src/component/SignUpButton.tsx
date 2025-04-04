import React, {useEffect} from "react";
import {useRouter} from "next/router";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import axios from "axios";
import {setCookies} from "@/manage/function/cookie";

//test
function SignUpButton() {

    const router = useRouter();
    const { query } = router;

    useEffect(() => {
        const { code } = query;

        if (code) {

            // 백엔드 API Route로 인증 코드 전달
            // sendCodeToBackend(code);
        }
    }, [query]);

    const sendCodeToBackend = async (code) => {
        try {
            const response = await axios.post("/api/auth/callback", { code });


            // 성공 시 사용자 페이지로 리디렉션
            router.push("/dashboard");
        } catch (error) {
            console.error("Error sending code to backend:", error);
            // 에러 페이지로 리디렉션
            router.push("/error");
        }
    };

    // code_verifier 생성 함수
    function generateCodeVerifier() {
        const array = new Uint32Array(56 / 2);
        window.crypto.getRandomValues(array);
        return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
    }

// code_challenge 생성 함수
    async function generateCodeChallenge(codeVerifier) {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await window.crypto.subtle.digest("SHA-256", data);
        // @ts-ignore
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }

    const handleLogin = async () => {
        const clientId = "045c4017-c001-4d09-b0e2-a1bb0c222b3f";
        const redirectUri = (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://manku.progist.co.kr') + '/join'
        const authority = "https://login.microsoftonline.com/a4f5fe9e-ff2c-4466-b78a-af1ef5748673/oauth2/v2.0/authorize";
        const scopes =["User.Read", "offline_access", "Files.Read","Tasks.ReadWrite","Calendars.ReadWrite", "Contacts.Read", "People.Read"];

        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        // code_verifier를 localStorage에 저장
        setCookies(null,"code_verifier", codeVerifier);

        const authUrl = `${authority}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&response_mode=query&scope=${scopes.join(" ")}&code_challenge=${codeChallenge}&code_challenge_method=S256&prompt=consent`;


        // Azure AD 로그인 페이지로 리디렉션
        window.location.href = authUrl;
    };

    return <div
        style={{textAlign: 'center', cursor: 'pointer', width: '100%', backgroundColor: '#2f2f2f', borderRadius: 5}}
        onClick={handleLogin}>
        <img  width={'100%'} style={{ height : 40}}
            src={'https://learn.microsoft.com/ko-kr/entra/identity-platform/media/howto-add-branding-in-apps/ms-symbollockup_signin_dark.svg'}
            alt=""/>
    </div>
}

export default SignUpButton;
