import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import Select from "antd/lib/select";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {CopyOutlined, FileExcelOutlined, SearchOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {rfqReadColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {subRfqReadInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import moment from "moment";
import * as XLSX from "xlsx";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";

const {RangePicker} = DatePicker


export default function rfqRead({dataList}) {

    const gridRef = useRef(null);

    const {estimateRequestList} = dataList;
    const [info, setInfo] = useState(subRfqReadInitial);
    const [tableData, setTableData] = useState(estimateRequestList);


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    useEffect(() => {
        const copyData: any = {...info}
        copyData['searchDate'] = [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
        setInfo(copyData);
    }, [info])

    async function searchInfo() {
        const copyData: any = {...info}
        const {searchDate}: any = copyData;
        if (searchDate) {
            copyData['searchStartDate'] = searchDate[0];
            copyData['searchEndDate'] = searchDate[1];
        }
        const result = await getData.post('estimate/getEstimateRequestList',
            {...copyData,   "page": 1, "limit": -1});
        setTableData(result?.data?.entity?.estimateRequestList);
    }

    async function deleteList() {
        const api = gridRef.current.api;
        console.log(api.getSelectedRows(),':::')

        if (api.getSelectedRows().length<1) {
            message.error('삭제할 데이터를 선택해주세요.')
        } else {
            for (const item of api.getSelectedRows()) {
                const response = await getData.post('estimate/deleteEstimateRequest', {
                    estimateRequestId:item.estimateRequestId
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


    const downloadExcel = () => {

        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "example.xlsx");
    };

    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateRows: 'auto 1fr', height: '100%', columnGap: 5}}>
                <Card title={<span style={{fontSize: 12,}}>견적의뢰 조회</span>} headStyle={{marginTop:-10, height:30}}
                      style={{border: '1px solid lightGray',}} bodyStyle={{padding: '10px 24px'}}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', width: '100%', columnGap: 20}}>

                        <Card size={'small'} style={{
                            fontSize: 11,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',
                        }}>
                                <div>
                                    <div style={{paddingBottom: 3,}}>작성일자</div>

                                    <RangePicker
                                        value={[moment(info['searchDate'][0]), moment(info['searchDate'][1])]}
                                        id={'searchDate'} size={'small'} onChange={(date, dateString) => {
                                        onChange({
                                            target: {
                                                id: 'searchDate',
                                                value: date ? [moment(date[0]).format('YYYY-MM-DD'), moment(date[1]).format('YYYY-MM-DD')] : [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
                                            }
                                        })
                                    }
                                    } style={{width: '100%',}}/>
                                </div>
                                <div>
                                    <div style={{paddingBottom: 3}}>회신 여부</div>
                                    <Select id={'searchType'}
                                            onChange={(src) => onChange({target: {id: 'searchType', value: src}})}
                                            size={'small'} value={info['searchType']} options={[
                                        {value: '0', label: '전체'},
                                        {value: '1', label: '회신'},
                                        {value: '2', label: '미회신'}
                                    ]} style={{width: '100%',}}/>
                                </div>
                        </Card>
                        <Card size={'small'} style={{
                            fontSize: 11,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',
                        }}>
                                <div>
                                    <div style={{paddingBottom: 3}}>문서번호</div>
                                    <Input id={'searchDocumentNumber'} onChange={onChange} size={'small'}/>
                                </div>
                                <div>
                                    <div style={{paddingBottom: 3}}>등록직원명</div>
                                    <Input id={'searchCreatedBy'} onChange={onChange} size={'small'}/>
                                </div>
                            <div>
                                <div style={{marginTop: 8, paddingBottom: 3}}>거래처명</div>
                                <Input id={'searchCustomerName'} onChange={onChange} size={'small'}/>
                            </div>
                        </Card>

                        <Card size={'small'} style={{
                            fontSize: 11,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',
                            marginBottom: 5
                        }}>
                            <div>
                                <div style={{paddingBottom: 3}}>MAKER</div>
                                <Input id={'searchMaker'} onChange={onChange} size={'small'}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>MODEL</div>
                                <Input id={'searchModel'} onChange={onChange} size={'small'}/>
                            </div>
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>ITEM</div>
                                <Input id={'searchItem'} onChange={onChange} size={'small'}/>
                            </div>

                        </Card>
                    </div>
                    <div style={{marginTop: 8, textAlign:'right'}}>
                        <Button type={'primary'} onClick={searchInfo}><SearchOutlined/>조회</Button>
                    </div>
                </Card>

                <TableGrid
                    gridRef={gridRef}
                    columns={rfqReadColumns}
                    tableData={tableData}
                    type={'read'}
                    excel={true}
                    funcButtons={<div><Button type={'primary'} size={'small'} style={{fontSize: 11}}>
                        <CopyOutlined/>복사
                    </Button>
                        {/*@ts-ignored*/}
                        <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft:5,}} onClick={deleteList}>
                            <CopyOutlined/>삭제
                        </Button>
                        <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft:5,}} onClick={downloadExcel}>
                            <FileExcelOutlined/>출력
                        </Button></div>}
                />

            </div>
        </LayoutComponent>
    </>
}


// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}

    const {userInfo} = await initialServerRouter(ctx, store);

    if (!userInfo) {
        return {
            redirect: {
                destination: '/', // 리다이렉트할 경로
                permanent: false, // true면 301 리다이렉트, false면 302 리다이렉트
            },
        };
    }

    store.dispatch(setUserInfo(userInfo));

    const result = await getData.post('estimate/getEstimateRequestList', {
        "searchEstimateRequestId": "",      // 견적의뢰 Id
        "searchType": "",                   // 검색조건 1: 회신, 2: 미회신
        "searchStartDate": moment().subtract(1, 'years').format('YYYY-MM-DD'),              // 작성일자 시작일
        "searchEndDate": moment().format('YYYY-MM-DD'),                // 작성일자 종료일
        "searchDocumentNumber": "",         // 문서번호
        "searchCustomerName": "",           // 거래처명
        "searchMaker": "",                  // MAKER
        "searchModel": "",                  // MODEL
        "searchItem": "",                   // ITEM
        "searchCreatedBy": "",              // 등록직원명
        "searchManagerName": "",            // 담당자명
        "searchMobileNumber": "",           // 담당자 연락처
        "searchBiddingNumber": "",          // 입찰번호(미완성)
        "page": 1,
        "limit": -1
    });


    return {
        props: {dataList: result?.data?.entity}
    }
})