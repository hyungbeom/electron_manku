import React from "react";

//test
function LoginButton() {

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
        const redirectUri = "http://localhost:3000";
        const authority = "https://login.microsoftonline.com/a4f5fe9e-ff2c-4466-b78a-af1ef5748673/oauth2/v2.0/authorize";
        const scopes = ["User.Read", "offline_access, Files.Read"];

        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        // code_verifier를 localStorage에 저장
        localStorage.setItem("code_verifier", codeVerifier);

        const authUrl = `${authority}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&response_mode=query&scope=${scopes.join(" ")}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

        // Azure AD 로그인 페이지로 리디렉션
        window.location.href = authUrl;
    };

    return <div style={{textAlign : 'center', cursor : 'pointer'}} onClick={handleLogin}>
        <img  src={'https://learn.microsoft.com/ko-kr/entra/identity-platform/media/howto-add-branding-in-apps/ms-symbollockup_signin_dark.svg'} alt=""/>
    </div>
}

export default LoginButton;