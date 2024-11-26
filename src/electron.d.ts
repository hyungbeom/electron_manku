interface Window {
    electron: {
        onNavigate: (callback: (event: Event, route: string) => void) => void;
        // 필요한 추가 속성 정의 가능
    };
}