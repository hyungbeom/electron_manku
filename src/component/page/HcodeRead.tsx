import React, {useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import LayoutComponent from "@/component/LayoutComponent";

import Button from "antd/lib/button";
import message from "antd/lib/message";

import {tableCodeReadColumns,} from "@/utils/columnList";
import {codeSaveInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import {inputForm, MainCard, TopBoxCard} from "@/utils/commonForm";
import {commonManage, gridManage} from "@/utils/commonManage";
import Spin from "antd/lib/spin";
import {CopyOutlined} from "@ant-design/icons";
import {deleteHsCodeList} from "@/utils/api/mainApi";


export default function HcodeRead({dataInfo=[], updateKey, getCopyPage}) {
    const gridRef = useRef(null);
    const [mini, setMini] = useState(true);

    const [info, setInfo] = useState({
        searchText: '',
        item: '',
        hsCode: ''
    })

    const [loading, setLoading] = useState(false);


    const onGridReady = async (params) => {
        gridRef.current = params.api;
        await getData.post('hsCode/getHsCodeList', {
            "searchType": "",      // 1: 코드, 2: 상호명, 3: MAKER
            "searchText": "",
            "page": 1,
            "limit": -1
        }).then(v=>{

            params.api.applyTransaction({add:  v?.data?.entity?.hsCodeList});
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
                message.success('등록되었습니다.')
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


    async function searchInfo() {
        setLoading(true)
        await getData.post('hsCode/getHsCodeList', {
            searchText: info['item'] ? info['item'] : info['hsCode'],
            page: 1,
            limit: -1
        }).then(v => {
            gridManage.resetData(gridRef, v.data.entity.hsCodeList)
            setLoading(false)
        })
    }

    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 데이터를 선택해주세요.')
        }


        const selectedRows = gridRef.current.getSelectedRows();
        const deleteList = selectedRows.map(v => v.hsCodeId)
        await deleteHsCodeList({data: {hsCodeIdList: deleteList}, returnFunc: searchInfo});
    }

    function clearAll() {
        setInfo(codeSaveInitial)
        gridRef.current.deselectAll();
    }

    function moveRegist() {

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
                                title: 'ITEM',
                                id: 'item',
                                onChange: onChange,
                                data: info
                            })}
                            {inputForm({
                                title: 'HSCODE',
                                id: 'hsCode',
                                onChange: onChange,
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
                <TableGrid deleteComp={<Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}}
                                               onClick={deleteList}>
                    <CopyOutlined/>삭제
                </Button>}
                           gridRef={gridRef}
                           columns={tableCodeReadColumns}
                           onGridReady={onGridReady}
                           funcButtons={['hsDelete', 'print']}/>
            </div>
        </>
    </Spin>
}
