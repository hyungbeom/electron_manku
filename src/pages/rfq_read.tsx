import React, {useEffect, useState} from "react";
import Input from "antd/lib/input/Input";
import Select from "antd/lib/select";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import {CopyOutlined, FileExcelOutlined, SearchOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {rfqReadColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {subRfqReadInitial} from "@/utils/initialList";
import {subRfqReadInfo} from "@/utils/modalDataList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import moment from "moment";
import * as XLSX from "xlsx";
import {transformData} from "@/utils/common/common";

const {RangePicker} = DatePicker


export default function rfqRead({dataList}) {
    let checkList = []


    const {estimateRequestList, pageInfo} = dataList;
    const [info, setInfo] = useState(subRfqReadInitial)
    const [tableInfo, setTableInfo] = useState(estimateRequestList)
    const [paginationInfo, setPaginationInfo] = useState(pageInfo)


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    useEffect(() => {
        const copyData: any = {...info}
        copyData['searchDate'] = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
        setInfo(copyData);
        setTableInfo(transformData(estimateRequestList, 'estimateRequestId', 'estimateRequestDetailList'));
    }, [])



    async function searchInfo() {
        const copyData: any = {...info}
        const {searchDate}: any = copyData;
        if (searchDate) {
            copyData['searchStartDate'] = searchDate[0];
            copyData['searchEndDate'] = searchDate[1];
        }
        const result = await getData.post('estimate/getEstimateRequestList', copyData);
        setTableInfo(transformData(result?.data?.entity?.estimateRequestList, 'estimateRequestId', 'estimateRequestDetailList'));
    }

    function deleteList() {
        let copyData = {...info}
        const result = copyData['estimateRequestDetailList'].filter(v => !checkList.includes(v.serialNumber))

        copyData['estimateRequestDetailList'] = result
        setInfo(copyData);
    }

    const downloadExcel = () => {

        const worksheet = XLSX.utils.json_to_sheet(tableInfo);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "example.xlsx");
    };

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {

            checkList  = selectedRowKeys

        },
        getCheckboxProps: (record) => ({
            disabled: record?.name === 'Disabled User',
            // Column configuration not to be checked
            name: record?.name,
        }),
    };

    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateColumns: '350px 1fr', height: '100%', gridColumnGap: 5}}>
                <Card title={'의뢰 조회'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                    <Card size={'small'} style={{
                        fontSize: 13,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>
                        <div>
                            <div style={{paddingBottom: 3}}>작성일자</div>
                            <RangePicker style={{width: '100%'}}
                                         value={[moment(info['searchDate'][0]), moment(info['searchDate'][1])]}
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
                            <div style={{paddingBottom: 3}}>검색조건</div>
                            <Select id={'searchType'}
                                    onChange={(src) => onChange({target: {id: 'searchType', value: src}})}
                                    size={'small'} value={info['searchType']} options={[
                                {value: '0', label: '전체'},
                                {value: '1', label: '회신'},
                                {value: '2', label: '미회신'}
                            ]} style={{width: '100%'}}>
                            </Select>
                        </div>
                        <div style={{marginTop: 8}}>
                            <div style={{paddingBottom: 3}}>문서번호</div>
                            <Input id={'searchDocumentNumber'} onChange={onChange} size={'small'}/>
                        </div>
                        <div style={{marginTop: 8}}>
                            <div style={{paddingBottom: 3}}>거래처명</div>
                            <Input id={'searchCustomerName'} onChange={onChange} size={'small'}/>
                        </div>
                        <div style={{marginTop: 8}}>
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
                        <div style={{marginTop: 8}}>
                            <div style={{paddingBottom: 3}}>등록직원명</div>
                            <Input id={'searchCreatedBy'} onChange={onChange} size={'small'}/>
                        </div>
                        <div style={{paddingTop: 20, textAlign: 'right'}}>
                            <Button type={'primary'} style={{marginRight: 8}}
                                    onClick={searchInfo}><SearchOutlined/>조회</Button>
                        </div>

                    </Card>

                </Card>


                <CustomTable columns={rfqReadColumns}
                             initial={subRfqReadInitial}
                             dataInfo={subRfqReadInfo}
                             info={tableInfo}
                             setDatabase={setInfo}
                             setTableInfo={setTableInfo}
                             rowSelection={rowSelection}
                             pageInfo={paginationInfo}
                             visible={true}
                             setPaginationInfo={setPaginationInfo}

                             subContent={<><Button type={'primary'} size={'small'} style={{fontSize: 11}}>
                                 <CopyOutlined/>복사
                             </Button>
                                 {/*@ts-ignored*/}
                                 <Button type={'danger'} size={'small'} style={{fontSize: 11}} onClick={deleteList}>
                                     <CopyOutlined/>삭제
                                 </Button>
                                 <Button type={'dashed'} size={'small'} style={{fontSize: 11}} onClick={downloadExcel}>
                                     <FileExcelOutlined/>출력
                                 </Button></>}
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
        "searchStartDate": "",              // 작성일자 시작일
        "searchEndDate": "",                // 작성일자 종료일
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
        "limit": 10
    });



    return {
        props: {dataList: result?.data?.entity}
    }
})