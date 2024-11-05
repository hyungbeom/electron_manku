// pages/google-drive.js
import React, {useEffect, useRef, useState} from 'react';

const CLIENT_ID = '605055938380-og7sabqmh15e4i54auamh1fdql0gancq.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDoE504sIrq1UKXVCYzzij6jQ8q7Uv0deo';
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.metadata.readonly';
const REDIRECT_URI = 'http://localhost:3000';

let isGapiInitialized = false; // 컴포넌트 외부에 선언
export default function Sample() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [files, setFiles] = useState([]);
    const initClientCalled = useRef(false); // 초기화 중복 방지용 ref

    useEffect(() => {
        const loadGapiScript = async () => {
            if (!isGapiInitialized && !initClientCalled.current) {
                initClientCalled.current = true; // 초기화 중복 호출 방지
                const { loadGapiInsideDOM } = require('gapi-script');
                await loadGapiInsideDOM();
                window.gapi.load('client:auth2', initClient);
            }
        };

        loadGapiScript();
    }, []);

    function initClient() {
        if (isGapiInitialized) {
            console.log("gapi.auth2 already initialized.");
            updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
            return;
        }

        console.log("Initializing Google API client...");
        window.gapi.client
            .init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                scope: SCOPES,
                ux_mode: "redirect",
                redirect_uri: REDIRECT_URI,
            })
            .then(() => {
                console.log("Google API client initialized.");
                isGapiInitialized = true;
                return window.gapi.client.load("drive", "v3"); // Drive API 명시적 로드
            })
            .then(() => {
                const authInstance = window.gapi.auth2.getAuthInstance();
                updateSigninStatus(authInstance.isSignedIn.get());
                authInstance.isSignedIn.listen(updateSigninStatus);
            })
            .catch(error => {
                console.error("Error initializing gapi client", error);
            });
    }

    function updateSigninStatus(isSignedIn: boolean) {
        setIsSignedIn(isSignedIn);
        if (isSignedIn && isGapiInitialized) {
            listFiles(); // 로그인 상태와 초기화 완료 상태가 되면 파일 리스트를 불러옴
        }
    }

    const handleAuthClick = () => {
        window.gapi.auth2.getAuthInstance().signIn();
    };

    const handleSignOutClick = () => {
        window.gapi.auth2.getAuthInstance().signOut();
        setFiles([]); // 로그아웃 시 파일 목록 초기화
    };

    async function listFiles() {
        console.log(window.gapi.client)
        try {

            const response = await window.gapi.client.drive.files.list();
            console.log("API Response:", response); // 전체 응답 객체 확인
            const files = response?.result?.files;
            if (files) {
                console.log("Files:", files);
                setFiles(files); // 파일 목록 상태 업데이트
            } else {
                console.error("No files found in the response.");
                setFiles([]); // 파일이 없을 경우 빈 배열로 초기화
            }
        } catch (error) {
            console.error("Error retrieving file list:", error);
            setFiles([]); // 오류 발생 시 빈 배열로 초기화
        }
    }

    return (
        <div>
            <button onClick={handleAuthClick}>Sign In with Google</button>
            <button onClick={handleSignOutClick}>Sign Out</button>
            {isSignedIn ? (
                <div>
                    <p>Welcome! You are signed in.</p>
                    <h3>File List</h3>
                    <ul>
                        {files.map((file) => (
                            <li key={file.id}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Please sign in to access your files.</p>
            )}
        </div>
    );
}