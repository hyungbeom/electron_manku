import React, {useEffect, useRef, useState} from 'react';

const CLIENT_ID = '605055938380-og7sabqmh15e4i54auamh1fdql0gancq.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDoE504sIrq1UKXVCYzzij6jQ8q7Uv0deo';
const SCOPES = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.metadata.readonly';
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

    function updateSigninStatus(isSignedIn) {
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

    async function getDriveId() {
        try {
            const response = await window.gapi.client.drive.drives.list({
                pageSize: 10 // 필요한 경우 가져올 드라이브 수 조정
            });
            const drives = response?.result?.drives;
            if (drives && drives.length > 0) {
                console.log("Shared Drives:", drives);
                const mankuDrive = drives.find(drive => drive.name === "만쿠ERP");
                if (mankuDrive) {
                    console.log("MankuERP Drive ID:", mankuDrive.id);
                    return mankuDrive.id; // 만쿠ERP 드라이브 ID 반환
                } else {
                    console.error("MankuERP drive not found.");
                }
            } else {
                console.error("No shared drives found.");
            }
        } catch (error) {
            console.error("Error retrieving shared drives:", error);
        }
    }

    async function listFiles() {
        const driveId = await getDriveId();
        if (!driveId) return;

        try {
            const response = await window.gapi.client.drive.files.list({
                driveId: driveId,  // 만쿠ERP 드라이브의 ID
                supportsAllDrives: true,
                includeItemsFromAllDrives: true,
                corpora: "drive",  // 특정 공유 드라이브만 검색
                q: `'${driveId}' in parents and name contains '스크린샷'`  // 파일 이름에 "스크린샷"이 포함된 파일 검색 예시
            });
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

    async function downloadFile(fileId, fileName) {
        try {
            // 파일의 다운로드 URL을 가져옵니다.
            const response = await window.gapi.client.drive.files.get({
                fileId: fileId,
                alt: 'media',
            }, { responseType: 'blob' });

            // fetch를 사용해 파일을 직접 다운로드
            const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${API_KEY}`;
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${window.gapi.auth.getToken().access_token}`,
                },
            });

            // 다운로드된 파일을 Blob으로 변환
            const blob = await res.blob();

            // Blob을 사용하여 파일 다운로드 링크 생성
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = fileName;
            a.click();

            // 메모리 해제
            URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("Error downloading file:", error);
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
                            <li key={file.id}>
                                <button onClick={() => downloadFile(file.id, file.name)}>
                                    {file.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Please sign in to access your files.</p>
            )}
        </div>
    );
}