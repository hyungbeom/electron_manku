import React, {useEffect, useState} from "react";
import GoogleDrivePicker from 'react-google-drive-picker';


const CLIENT_ID = "605055938380-og7sabqmh15e4i54auamh1fdql0gancq.apps.googleusercontent.com";
const API_KEY = "AIzaSyDoE504sIrq1UKXVCYzzij6jQ8q7Uv0deo";
const SCOPES = "https://www.googleapis.com/auth/drive.file";

const GoogleDriveIntegration = () => {
    const [tokenClient, setTokenClient] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        // GIS 클라이언트 초기화
        const initializeGisClient = () => {
            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: (response) => {
                    if (response.access_token) {
                        setAccessToken(response.access_token);
                    } else {
                        console.error("OAuth2 token acquisition failed");
                    }
                },
            });
            setTokenClient(client);
        };

        // GAPI 클라이언트 초기화
        const initializeGapiClient = () => {
            window.gapi.load("client", async () => {
                try {
                    await window.gapi.client.init({
                        apiKey: API_KEY,
                    });
                    console.log("GAPI client initialized");
                } catch (error) {
                    console.error("Error initializing GAPI client:", error);
                }
            });
        };

        // GIS 및 GAPI 스크립트 로드
        const loadScripts = () => {
            const gisScript = document.createElement("script");
            gisScript.src = "https://accounts.google.com/gsi/client";
            gisScript.async = true;
            gisScript.defer = true;
            gisScript.onload = initializeGisClient;
            document.body.appendChild(gisScript);

            const gapiScript = document.createElement("script");
            gapiScript.src = "https://apis.google.com/js/api.js";
            gapiScript.async = true;
            gapiScript.defer = true;
            gapiScript.onload = initializeGapiClient;
            document.body.appendChild(gapiScript);
        };

        loadScripts();
    }, []);

    const handleLogin = () => {
        if (tokenClient) {
            tokenClient.requestAccessToken();
        }
    };

    const fetchFiles = async () => {
        if (!accessToken) {
            console.error("No access token available");
            return;
        }

        try {
            const response = await window.gapi.client.drive.files.list({
                pageSize: 10,
                fields: "nextPageToken, files(id, name, mimeType)",
            });
            setFiles(response.result.files);
            console.log("Fetched Files:", response.result.files);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    return (
        <div>
            <button onClick={handleLogin}>Login with Google</button>
            <button onClick={fetchFiles} disabled={!accessToken}>Fetch Google Drive Files</button>
            <ul>
                {files.map((file) => (
                    <li key={file.id}>
                        {file.name} (ID: {file.id}, Type: {file.mimeType})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GoogleDriveIntegration;