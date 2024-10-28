export const convertDateTimeToKoreanFormat = (datetimeString) => {
    if(datetimeString) {
        // 날짜와 시간 분리 (공백을 기준으로)
        const [date, time] = datetimeString?.split(' ');

        // 시간과 분을 ":"를 기준으로 분리, 초 부분 무시
        const [hours, minutes] = time.split(':').map(Number);

        // 오전/오후 구분
        const period = hours >= 12 ? '오후' : '오전';

        // 24시간 형식을 12시간 형식으로 변환
        const hour12Format = hours % 12 === 0 ? 12 : hours % 12;

        // 최종 결과 문자열 생성
        return `${date} ${period} ${hour12Format}시 ${minutes}분`;
    }
};