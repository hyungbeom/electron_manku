import React, {memo, useEffect, useState} from "react";
import Button from "antd/lib/button";
import _ from "lodash";
import Drawer from "antd/lib/drawer";
import {getData} from "@/manage/function/api";
import {Timeline} from "antd";
import {useAppSelector} from "@/utils/common/function/reduxHooks";


function AlertHistoryRead({open, setOpen, getPropertyId}) {
    const {userInfo, adminList} = useAppSelector((state) => state.user);
    const [list, setList] = useState([])
    useEffect(() => {

        if (open) {
            getHistoryList()
        }
    }, [open]);

    async function getHistoryList() {
        await getData.post('history/getHistoryReceiveList').then(v => {


            const rawData = v?.data

// 날짜 기준으로 묶기
            const groupedByDate = rawData.reduce((acc, curr) => {
                const date = curr.writtenDate;
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(curr);
                return acc;
            }, {});

            setList(groupedByDate);
        })
    }

    return <Drawer title={'요청목록'} open={open} onClose={() => setOpen(false)}>
        <>

            {Object.entries(list).map(([date, items]) => (
                <div key={date}>
                    <h3>{date}</h3>
                    {items.map((v) => {
                        const findMember = adminList.find(src => src.adminId === v.senderId);
                        return <div style={{padding: 5, border: '1px solid lightGray', borderRadius: 5, marginTop: 5}}>
                            <div><span style={{fontWeight: 800}}>요청자</span> : {findMember?.name} &nbsp;&nbsp;&nbsp;
                                <span
                                    style={{fontWeight: 800}}>제목</span> : {v.title}</div>
                            <Button type={'primary'} onClick={() => {
                                if (v.title === '견적의뢰 알림') {
                                    setOpen(false)
                                    getPropertyId('rfq_update', v?.pk);
                                }
                            }}>
                                {v.message}
                            </Button></div>
                    })}
                </div>
            ))}

        </>
    </Drawer>
}


export default memo(AlertHistoryRead, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});