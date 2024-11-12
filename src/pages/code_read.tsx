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
    FileExcelOutlined,
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
import {
    codeDomesticPurchaseInitial, codeReadInitial,
    tableCodeDomesticSalesInitial,
    tableCodeOverseasSalesInitial,
} from "@/utils/initialList";
import Radio from "antd/lib/radio";
import TableGrid from "@/component/tableGrid";
import Search from "antd/lib/input/Search";


export default function codeRead({dataList}) {
    const gridRef = useRef(null);
    const [mini, setMini] = useState(true);

    const {hsCodeList, } = dataList;
    const [saveInfo, setSaveInfo] = useState(codeReadInitial);
    const [info, setInfo] = useState(codeReadInitial);
    const [tableData, setTableData] = useState(hsCodeList);

    console.log(hsCodeList,'saveInfo:')


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    async function onSearch() {
        const result = await getData.post('hsCode/getHsCodeList', info);
        console.log(result?.data?.entity?.hsCodeList,'result:')
        if(result?.data?.code === 1){
            setTableData(result?.data?.entity?.hsCodeList)
        }
    }

    function deleteList() {

        const api = gridRef.current.api;

        // 전체 행 반복하면서 선택되지 않은 행만 추출
        const uncheckedData = [];
        for (let i = 0; i < api.getDisplayedRowCount(); i++) {
            const rowNode = api.getDisplayedRowAtIndex(i);
            if (!rowNode.isSelected()) {
                uncheckedData.push(rowNode.data);
            }
        }

        let copyData = {...info}
        copyData['overseasCustomerManagerList'] = uncheckedData;
        console.log(copyData, 'copyData::')
        setInfo(copyData);

    }


    function addRow() {
        let copyData = {...info};
        copyData['overseasCustomerManagerList'].push({
            "managerName": "",       // 담당자명
            "directTel": "",     // 직통전화
            "faxNumber": "",   // 팩스번호
            "mobileNumber": "", // 휴대폰번호
            "email": "",        // 이메일
            "remarks": ""
        })

        setInfo(copyData)
    }


    return <LayoutComponent>
        <div
            style={{display: 'grid', gridTemplateRows: `${mini ? 'auto' : '65px'} 1fr`, height: '100%', columnGap: 5,}}>
            <Card title={'해외 거래처 등록'} style={{fontSize: 12, border: '1px solid lightGray'}}
                  extra={<span style={{fontSize: 20, cursor: 'pointer'}} onClick={() => setMini(v => !v)}> {!mini ?
                      <UpCircleFilled/> : <DownCircleFilled/>}</span>}>
                {mini ? <>
                    <div style={{display: 'grid', gridTemplateColumns: '0.5fr 1.5fr 1.5fr 1.5fr', columnGap: 20}}>
                        <Card size={'small'}
                              style={{
                                  fontSize: 13,
                                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                              }}>

                            <div>
                                <div style={{paddingTop: 8}}>ITEM</div>
                                <Input id={'phoneNumber'} value={info['phoneNumber']} onChange={onChange}
                                       size={'small'}/>
                            </div>
                            <div>
                                <div style={{paddingTop: 8}}>HS-CODE</div>
                                <Input id={'faxNumber'} value={info['faxNumber']} onChange={onChange}
                                       size={'small'}/>
                            </div>

                        </Card>
                        <div>
                            {/*@ts-ignored*/}
                            <Button type={'primary'} size={'small'} style={{fontSize: 11, marginLeft: 5,}}
                                    onClick={addRow}>
                                <SaveOutlined/>추가
                            </Button>
                            {/*@ts-ignored*/}
                            <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5,}}
                                    onClick={deleteList}>
                                <CopyOutlined/>삭제
                            </Button>
                        </div>

                        <Search
                            onSearch={onSearch}
                            onChange={onChange}
                            id={'searchText'}
                            placeholder="input search text"
                            allowClear
                            enterButton={<><SearchOutlined/>&nbsp;&nbsp; 조회</>}
                        />

                    </div>
                </> : null}
            </Card>

            <TableGrid
                gridRef={gridRef}
                columns={tableCodeReadColumns}
                tableData={tableData}
                type={'read'}
                excel={true}
                // funcButtons={<div><Button type={'primary'} size={'small'} style={{fontSize: 11}}>
                //     <CopyOutlined/>복사
                // </Button>
                //     {/*@ts-ignored*/}
                //     <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft:5,}} onClick={deleteList}>
                //         <CopyOutlined/>삭제
                //     </Button>
                //     <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft:5,}} onClick={downloadExcel}>
                //         <FileExcelOutlined/>출력
                //     </Button></div>}
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