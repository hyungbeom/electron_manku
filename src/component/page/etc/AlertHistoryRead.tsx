import React, {memo, useEffect, useState} from "react";
import Button from "antd/lib/button";
import _ from "lodash";
import Drawer from "antd/lib/drawer";
import {getData} from "@/manage/function/api";
import {Timeline} from "antd";
import {useAppDispatch, useAppSelector} from "@/utils/common/function/reduxHooks";
import {setHistoryList} from "@/store/history/historySlice";


function AlertHistoryRead({open, setOpen, getPropertyId}) {
    const {userInfo, adminList} = useAppSelector((state) => state.user);
    const {historyList} = useAppSelector((state) => state.history);
    const [list, setList] = useState([])
    // 만쿠 관리자 리스트 store에 추가
    const dispatch = useAppDispatch();

    async function getInfo() {
        await getData.post('history/getHistoryReceiveList').then(v => {


            console.log('check??')
            const rawData = v?.data

            if (rawData?.length) {
                const groupedByDate = rawData?.reduce((acc, curr) => {
                    const date = curr.writtenDate;
                    if (!acc[date]) {
                        acc[date] = [];
                    }
                    acc[date].push(curr);
                    return acc;
                }, {});
                dispatch(setHistoryList(groupedByDate))

            }
        })
    }

    // @ts-ignore
    useEffect(async () => {
        getInfo()
    }, []);

    async function getHistoryList() {
//         await getData.post('history/getHistoryReceiveList').then(v => {
//
//
//             const rawData = v?.data
//
// // 날짜 기준으로 묶기
//
//             if(rawData?.length) {
//                 const groupedByDate = rawData?.reduce((acc, curr) => {
//                     const date = curr.writtenDate;
//                     if (!acc[date]) {
//                         acc[date] = [];
//                     }
//                     acc[date].push(curr);
//                     return acc;
//                 }, {});
//
//                 setList(groupedByDate);
//             }
//         })
    }

    function confirmClick(id){
        getData.post('history/updateHistoryConfirm',{historyId : id}).then(v=>{
            console.log(v,'::')
            if(v.data.code === 1){
                getInfo();
            }
        })
    }

    return <Drawer title={'요청목록'} open={open} onClose={() => setOpen(false)}>
        <>

            {Object.entries(historyList).map(([date, items]:any) => (
                <div key={date}>
                    <h3>{date}</h3>
                    {items.map((v) => {
                        const findMember = adminList.find(src => src.adminId === v.senderId);
                        return <>
                            <div style={{textAlign :"right", fontSize : 12}}>{v.confirm === 'FALSE' ? <span style={{color : 'blueviolet', cursor : 'pointer'}} onClick={()=>confirmClick(v.historyId)}>확인</span> : <></> }</div>
                            <div style={{padding: 5, border: '1px solid lightGray', borderRadius: 5, marginTop: 5}}>
                            <div><span style={{fontWeight: 800}}>요청자</span> : {findMember?.name} &nbsp;&nbsp;&nbsp;
                                <span
                                    style={{fontWeight: 800}}>제목</span> : {v.title}</div>
                            <Button style={{width : '100%', whiteSpace: 'pre-line', height : '100%', fontSize : 12, textAlign : 'left'}} type={'primary'} onClick={() => {
                                if (v.title === '[회신알림]') {
                                    setOpen(false)
                                    getPropertyId('rfq_update', v?.pk);
                                }
                            }}>
                                {v.message}
                            </Button></div></>
                    })}
                </div>
            ))}

        </>
    </Drawer>
}


export default memo(AlertHistoryRead, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});