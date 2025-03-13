import React, {useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import LayoutComponent from "@/component/LayoutComponent";

import Button from "antd/lib/button";
import message from "antd/lib/message";

import {tableCodeReadColumns,} from "@/utils/columnList";
import {codeSaveInitial, orderReadInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import {inputForm, MainCard, TopBoxCard} from "@/utils/commonForm";
import {commonManage, gridManage} from "@/utils/commonManage";
import Spin from "antd/lib/spin";
import {CopyOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {deleteHsCodeList, searchHSCode, searchMaker} from "@/utils/api/mainApi";
import Popconfirm from "antd/lib/popconfirm";
import moment from "moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";


export default function HcodeRead({getPropertyId}) {
    const notificationAlert = useNotificationAlert();
    const gridRef = useRef(null);
    const [mini, setMini] = useState(true);

    const [info, setInfo] = useState({
        searchText: '',
        item: '',
        hsCode: ''
    })

    const [totalRow, setTotalRow] = useState(0);
    const [loading, setLoading] = useState(false);

    const onGridReady = async (params) => {
        gridRef.current = params.api;
        await searchHSCode({data: orderReadInitial}).then(v => {
            params.api.applyTransaction({add: v.data});
            setTotalRow(v.pageInfo.totalRow)
        })
    };


    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }


    async function saveFunc() {

        setLoading(true);
        await getData.post('hsCode/addHsCode', info).then(v => {
            const code = v.data.code;
            if (code === 1) {
                notificationAlert('success', '💾HS-CODE 등록완료',
                    <>
                        <div>Item : {info['item']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    ,null,
                    {}
                )
            } else {
                message.error('등록에 실패하였습니다.')
            }
            returnFunc(code === 1)
        })
    }

    function returnFunc(e) {
        setLoading(e)
        if (e) {
            searchInfo();
        }
    }


    async function searchInfo(e?) {

        if (e) {
            setLoading(true)


            await searchHSCode({
                data: {
                    "searchText": info['item'] ? info['item'] : info['hsCode'],
                    "page": 1,
                    "limit": -1
                }
            }).then(v => {
                gridManage.resetData(gridRef, v.data);
                setTotalRow(v.pageInfo.totalRow)
                setLoading(false)
            })
        }
        setLoading(false)
    }





    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }


        const selectedRows = gridRef.current.getSelectedRows();
        const deleteList = selectedRows.map(v => v.hsCodeId)
        await deleteHsCodeList({data: {hsCodeIdList: deleteList}}).then(v=>{
            console.log(v,'v:::::')
            if(v.code === 1){
                searchInfo(true);
                notificationAlert('success', '🗑️발주서 삭제완료',
                    <>
                        <div>Inquiry No.
                            - {selectedRows[0]?.documentNumberFull} {selectedRows.length > 1 ? ('외' + " " + (selectedRows.length - 1) + '개') : ''} 이(가)
                            삭제되었습니다
                        </div>
                        {/*<div>프로젝트 제목 - {selectedRows[0].projectTitle} `${selectedRows.length > 1 ? ('외' + (selectedRows.length - 1)) + '개' : ''}`가 삭제되었습니다 </div>*/}
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , function () {
                    },
                )
            }
        })
    }

    function clearAll() {
        setInfo(codeSaveInitial)
        gridRef.current.deselectAll();
    }

    function moveRegist() {

    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo(true)
        }
    }

    return <Spin spinning={loading} tip={'HS-CODE 조회중...'}>
        <>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? '150px' : '65px'} calc(100vh - ${mini ? 280 : 195}px)`,
                columnGap: 5
            }}>
                <MainCard title={'HS-CODE 조회'} list={[
                    {name: '조회', func: searchInfo, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'}
                ]} mini={mini} setMini={setMini}>
                    {mini ? <>
                        <TopBoxCard title={''} grid={"150px 250px 80px 1fr"}>
                            {inputForm({
                                title: 'Item',
                                id: 'item',
                                onChange: onChange,
                                handleKeyPress : handleKeyPress,
                                data: info
                            })}
                            {inputForm({
                                title: 'HSCODE',
                                id: 'hsCode',
                                onChange: onChange,
                                handleKeyPress : handleKeyPress,
                                data: info
                            })}
                            {/*하단정렬*/}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                flexDirection: 'column',
                                marginBottom: 10
                            }}>
                                <Button size={'small'} style={{fontSize: 11}} type={'primary'}
                                        onClick={saveFunc}>추가</Button>
                            </div>
                        </TopBoxCard>
                    </> : null}
                </MainCard>
                {/*@ts-ignored*/}
                <TableGrid deleteComp={<Popconfirm
                    title="삭제하시겠습니까?"
                    onConfirm={deleteList}
                    icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>

                    {/*@ts-ignored*/}
                    <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}>삭제</Button>
                </Popconfirm>
                }
                           totalRow={totalRow}
                           gridRef={gridRef}
                           columns={tableCodeReadColumns}
                           onGridReady={onGridReady}
                           getPropertyId={getPropertyId}
                           funcButtons={['agPrint']}/>
            </div>
        </>
    </Spin>
}
