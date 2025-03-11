import {useEffect, useState} from "react";

export default function PanelSizeUtil({groupRef, storage}){


    const handleMouseUp = () => {
        if (groupRef.current) {
            localStorage.setItem(storage, JSON.stringify(groupRef.current.getLayout()));
        }
    };

    // 컴포넌트가 마운트될 때, 전역 마우스 업 이벤트를 추가
    useEffect(() => {
        window.addEventListener('pointerup', handleMouseUp);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener('pointerup', handleMouseUp);
        };
    }, []);


    return <></>
}