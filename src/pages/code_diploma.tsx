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
import {CopyOutlined, EditOutlined, FileExcelOutlined, SearchOutlined,} from "@ant-design/icons";
import * as XLSX from "xlsx";
import message from "antd/lib/message";

import {
    modalCodeDiplomaColumn,
    rfqReadColumns,
    tableCodeDomesticPurchaseColumns,
    tableCodeDomesticSalesColumns,
    tableCodeOverseasPurchaseColumns,
} from "@/utils/columnList";
import {
    codeDiplomaReadInitial,
    codeDomesticPurchaseInitial,
    tableCodeDomesticSalesInitial,
    tableCodeOverseasSalesInitial,
} from "@/utils/initialList";
import Radio from "antd/lib/radio";
import TableGrid from "@/component/tableGrid";
import Search from "antd/lib/input/Search";
import {useRouter} from "next/router";
import DatePicker from "antd/lib/date-picker";

const {RangePicker} = DatePicker

export default function codeOverseasPurchase({dataList}) {
    const gridRef = useRef(null);
    const router=useRouter();

    const {officialDocumentList} = dataList;
    const [info, setInfo] = useState(codeDiplomaReadInitial);
    const [tableData, setTableData] = useState(officialDocumentList);


    useEffect(() => {
        const copyData: any = {...info}
        copyData['searchDate'] = [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
        setInfo(copyData);
    }, [])


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    async function searchInfo() {

        const copyData: any = {...info}
        const {searchDate}: any = copyData;
        if (searchDate) {
            copyData['searchStartDate'] = searchDate[0];
            copyData['searchEndDate'] = searchDate[1];
        }
        const result = await getData.post('officialDocument/getOfficialDocumentList',
            {...copyData, "page": 1, "limit": -1});
        setTableData(result?.data?.entity?.officialDocumentList)

    }

    return <LayoutComponent>
        <div style={{display: 'grid', gridTemplateRows: 'auto 1fr', height: '100vh', gridColumnGap: 5}}>
            <Card size={'small'} title={'공문서 관리'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                <Card size={'small'} style={{
                    fontSize: 13,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                }}>
                    <div style={{display: 'grid', gridTemplateColumns: '300px 1fr 100px'}}>
                        <div>
                            <div style={{paddingBottom: 3}}>조회일자</div>
                            <RangePicker style={{width: '100%'}}
                                         value={[moment(info['searchDate']?.[0]), moment(info['searchDate']?.[1])]}
                                         id={'searchDate'} size={'small'} onChange={(date, dateString) => {
                                onChange({
                                    target: {
                                        id: 'searchDate',
                                        value: date ? [moment(date[0]).format('YYYY-MM-DD'), moment(date[1]).format('YYYY-MM-DD')] : [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
                                    }
                                })
                            }
                            }/>
                        </div>

                        <div style={{marginTop: 8}}>
                            <div style={{marginBottom: 3}}>문서번호</div>
                            <Input id={'searchDocumentNumber'} value={info['searchDocumentNumber']}
                                   onChange={onChange}
                                   size={'small'}/>
                        </div>

                    </div>

                    <div style={{paddingTop: 8, textAlign: 'right'}}>
                        <Button type={'primary'} onClick={searchInfo}><SearchOutlined/>조회</Button>
                        <Button type={'primary'} style={{backgroundColor:'green', border: 'none', marginLeft:10}}
                                onClick={() => router?.push('/code_diploma_write')}><EditOutlined/>신규작성</Button>
                    </div>

                </Card>
            </Card>

            <TableGrid
                gridRef={gridRef}
                columns={modalCodeDiplomaColumn}
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

    const result = await getData.post('officialDocument/getOfficialDocumentList', {
        "searchStartDate": moment().subtract(1, 'years').format('YYYY-MM-DD'),              // 작성일자 시작일
        "searchEndDate": moment().format('YYYY-MM-DD'),
        "searchDocumentNumber": "",           // 문서번호 검색
        "page": 1,
        "limit": -1
    });

    console.log(result?.data?.entity,'result?.data?.entity:')

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