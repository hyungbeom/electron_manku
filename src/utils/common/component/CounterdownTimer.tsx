import React, { useState, useEffect } from 'react';
import colorList from "@/utils/common/colorList";
import clockIcon from "@/resources/image/icon/clock.svg";

const CountdownTimer = ({ targetDate, mobile=false }) => {
    const calculateTimeLeft = () => {
        const target = new Date(targetDate);
        const difference = target.getTime() - new Date().getTime(); // 타겟 날짜와 현재 시간의 차이 계산
        let timeLeft = {};

        if (difference > 0) {
            // 남은 시간, 분, 초 계산
            const totalSeconds = Math.floor(difference / 1000);
            timeLeft = {
                hours: Math.floor(totalSeconds / 3600).toString().padStart(2, '0'), // 총 남은 시간을 시간으로 변환
                minutes: Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0'), // 나머지를 분으로 변환
                seconds: (totalSeconds % 60).toString().padStart(2, '0'), // 나머지를 초로 변환
            };
        } else {
            timeLeft = { hours: '00', minutes: '00', seconds: '00' }; // 시간이 다 되면 00:00:00으로 설정
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState<any>(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
    }, [targetDate]);

    // @ts-ignore
    return (
        <div style={{ position: mobile? 'absolute':'static', top:0, borderRadius: mobile? 0:6, display: 'flex', alignItems:'center', justifyContent:'center',
            gap:10, color: 'white', fontSize:mobile? 15: 24, lineHeight:2.1, textAlign: 'center', width:mobile?'40%':'100%', height:mobile? '36px':'50px', backgroundColor:colorList['mainGreen']}} >
            <img style={{width:mobile? '18px':''}} src={clockIcon.src} alt='clock'/>
            {`${timeLeft?.hours} : ${timeLeft?.minutes} : ${timeLeft?.seconds}`}
        </div>
    );
};

export default CountdownTimer;