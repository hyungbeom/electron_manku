export {}; // 모듈 스코프를 유지하기 위해 필요

declare global {
    interface Window {
        gapi: any; // gapi 타입 정의, any로 설정 (또는 정확한 타입 정의가 있으면 사용 가능)
    }
}