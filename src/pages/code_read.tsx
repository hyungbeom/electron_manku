import React, {useEffect, useRef, useState} from "react";
import moment from "moment/moment";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import Input from "antd/lib/input/Input";

import Button from "antd/lib/button";
import {
    CopyOutlined,
    DownCircleFilled,
    FileExcelOutlined, RetweetOutlined,
    SaveOutlined,
    SearchOutlined,
    UpCircleFilled,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import message from "antd/lib/message";

import {
    rfqReadColumns,
    tableCodeDomesticPurchaseColumns,
    tableCodeDomesticSalesColumns,
    tableCodeOverseasPurchaseColumns, tableCodeReadColumns,
} from "@/utils/columnList";
import {codeReadInitial, codeSaveInitial,} from "@/utils/initialList";
import Radio from "antd/lib/radio";
import TableGrid from "@/component/tableGrid";
import Search from "antd/lib/input/Search";


export default function codeRead({dataList}) {
    const gridRef = useRef(null);
    const [mini, setMini] = useState(true);

    const {hsCodeList} = dataList;
    const [searchData, setSearchData] = useState(codeReadInitial);
    const [saveData, setSaveData] = useState(codeSaveInitial);
    const [tableData, setTableData] = useState(hsCodeList);

    // console.log(hsCodeList,'saveInfo:')

    function onSearchChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setSearchData(v => {
            return {...v, ...bowl}
        })
    }

    function onSaveChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setSaveData(v => {
            return {...v, ...bowl}
        })
    }

    async function onSearch() {
        const result = await getData.post('hsCode/getHsCodeList', searchData);
        console.log(result?.data?.entity?.hsCodeList,'result:')
        if(result?.data?.code === 1){
            setTableData(result?.data?.entity?.hsCodeList)
        }
    }

    async function saveFunc() {

        console.log(saveData['hsCodeId'], 'hsCodeId')

        let api = '';

        if (saveData['hsCodeId'])
            api = 'hsCode/updateHsCode'
        else
            api = 'hsCode/addHsCode'

        await getData.post(api, saveData).then(v => {
            if (v.data.code === 1) {
                message.success('저장되었습니다.')
                setSaveData(codeSaveInitial);
            } else {
                message.error('저장에 실패하였습니다.')
            }
        });
        onSearch()

    }

    async function deleteList() {
        const api = gridRef.current.api;
        // console.log(api.getSelectedRows(),':::')

        if (api.getSelectedRows().length<1) {
            message.error('삭제할 데이터를 선택해주세요.')
        } else {
            for (const item of api.getSelectedRows()) {
                const response = await getData.post('hsCode/deleteHsCode', {
                    hsCodeId:item.hsCodeId
                });
                console.log(response)
                if (response.data.code===1) {
                    message.success('삭제되었습니다.')
                    window.location.reload();
                } else {
                    message.error('오류가 발생하였습니다. 다시 시도해주세요.')
                }
            }
        }
    }



    return <LayoutComponent>
        <div
            style={{display: 'grid', gridTemplateRows: `${mini ? 'auto' : '65px'} 1fr`, height: '100vh', columnGap: 5,}}>
            <Card title={'HS code 관리'} style={{fontSize: 12, border: '1px solid lightGray'}}
                  extra={<span style={{fontSize: 20, cursor: 'pointer'}} onClick={() => setMini(v => !v)}> {!mini ?
                      <UpCircleFilled/> : <DownCircleFilled/>}</span>}>
                {mini ? <>
                    <div style={{display: 'grid', gridTemplateColumns: '0.6fr 1fr', columnGap: 20}}>
                        <Card size={'small'} title={'조회'}
                              style={{
                                  fontSize: 13,
                                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',
                              }}>
                        <Search
                            style={{paddingTop:8}}
                            onSearch={onSearch}
                            onChange={onSearchChange}
                            id={'searchText'}
                            placeholder="input search text"
                            allowClear
                            enterButton={<><SearchOutlined/>&nbsp;&nbsp; 조회</>}
                        />
                        </Card>

                        <Card size={'small'} title={'추가'}
                              style={{
                                  fontSize: 13,
                                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',
                              }}>
                            <div style={{display:'grid', gridTemplateColumns: '1fr 1fr 0.7fr', columnGap:20}}>

                                <div>
                                    <div>ITEM</div>
                                    <Input id={'item'} value={saveData['item']} onChange={onSaveChange}
                                           size={'small'}/>
                                </div>
                                <div>
                                    <div>HS-CODE</div>
                                    <Input id={'hsCode'} value={saveData['hsCode']} onChange={onSaveChange}
                                           size={'small'}/>
                                </div>

                            <div style={{paddingTop: 18}}>
                                {/*@ts-ignored*/}
                                <Button type={'primary'} size={'small'} style={{fontSize: 11, marginLeft: 5,}}
                                        onClick={saveFunc}>
                                    <SaveOutlined/>{saveData['hsCodeId']? '수정':'추가'}
                                </Button>
                                {/*@ts-ignored*/}
                                <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5,}}
                                        onClick={() => setSaveData(codeSaveInitial)}><RetweetOutlined/>초기화</Button>
                                {/*@ts-ignored*/}
                                <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5,}}
                                        onClick={deleteList}>
                                    <CopyOutlined/>삭제
                                </Button>

                            </div>
                            </div>

                        </Card>



                    </div>
                </> : null}
            </Card>

            <TableGrid
                gridRef={gridRef}
                columns={tableCodeReadColumns}
                tableData={tableData}
                type={'hsCode'}
                excel={true}
                setInfo={setSaveData}
            />

        </div>
    </LayoutComponent>
}

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    const result = await getData.post('hsCode/getHsCodeList', {
        "searchType": "1",      // 1: 코드, 2: 상호명, 3: MAKER
        "searchText": "",
        "page": 1,
        "limit": -1
    });



    if (userInfo) {
        store.dispatch(setUserInfo(userInfo));
    }
    if (codeInfo !== 1) {
        param = {
            redirect: {
                destination: '/', // 리다이렉트할 대상 페이지
                permanent: false, // true로 설정하면 301 영구 리다이렉트, false면 302 임시 리다이렉트
            },
        };
    } else {
        // result?.data?.entity?.estimateRequestList
        param = {
            props: {dataList: result?.data?.entity}
        }
    }

    return param
})