import React from "react";
import { useMsal } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";

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
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }

    const handleLogin = async () => {
        const clientId = "5eaeda3e-c0f3-4ecf-8848-a776f63a9ce4";
        const redirectUri = "http://localhost:3000";
        const authority = "https://login.microsoftonline.com/a4f5fe9e-ff2c-4466-b78a-af1ef5748673/oauth2/v2.0/authorize";
        const scopes = ["User.Read", "offline_access"];

        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        // code_verifier를 localStorage에 저장
        localStorage.setItem("code_verifier", codeVerifier);

        const authUrl = `${authority}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&response_mode=query&scope=${scopes.join(" ")}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

        // Azure AD 로그인 페이지로 리디렉션
        window.location.href = authUrl;
    };

    return <button onClick={handleLogin}>로그인</button>;
}

export default LoginButton;