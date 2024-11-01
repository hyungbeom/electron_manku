import React, {useEffect, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import {rfqReadColumns, tableEstimateReadColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {estimateReadInitial, tableEstimateReadInitial, tableOrderReadInitial} from "@/utils/initialList";
import {tableEstimateReadInfo, tableOrderReadInfo} from "@/utils/modalDataList";
import Select from "antd/lib/select";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {getData} from "@/manage/function/api";
import {setUserInfo} from "@/store/user/userSlice";
import moment from "moment/moment";
import {transformData} from "@/utils/common/common";
import * as XLSX from "xlsx";
import Button from "antd/lib/button";
import {CopyOutlined, FileExcelOutlined, SearchOutlined} from "@ant-design/icons";
import TableGrid from "@/pages/tableGrid";

const {RangePicker} = DatePicker

const TwinInputBox = ({children}) => {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 5, paddingTop: 8}}>
        {children}
    </div>
}

export default function EstimateRead({dataList}) {

    let checkList = []

    const {estimateList, pageInfo} = dataList;
    const [info, setInfo] = useState(estimateReadInitial)
    const [tableInfo, setTableInfo] = useState(estimateList)
    const [paginationInfo, setPaginationInfo] = useState(pageInfo)

    console.log(estimateList, 'tableEstimateReadColumns')

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
        setTableInfo(transformData(estimateList, 'estimateId', 'estimateDetailList'));
    }, [])

    async function searchInfo() {
        const copyData: any = {...info}
        const {searchDate}: any = copyData;
        if (searchDate) {
            copyData['searchStartDate'] = searchDate[0];
            copyData['searchEndDate'] = searchDate[1];
        }
        const result = await getData.post('estimate/getEstimateList', copyData);
        setTableInfo(transformData(result?.data?.entity?.estimateList, 'estimateId', 'estimateDetailList'));
        setPaginationInfo(result?.data?.entity?.pageInfo)
    }

    function deleteList() {
        let copyData = {...info}
        const result = copyData['estimateDetailList'].filter(v => !checkList.includes(v.serialNumber))

        copyData['estimateDetailList'] = result
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
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };


    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateColumns: '350px 1fr', height: '100%', gridColumnGap: 5}}>
                <Card title={'견적서 조회'} style={{fontSize: 12, border: '1px solid lightGray'}}>
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

                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>검색조건</div>
                            <Select id={'searchType'} size={'small'} value={info['searchType']}  defaultValue={0} options={[
                                {value: 0, label: '전체'},
                                {value: 1, label: '주문'},
                                {value: 2, label: '미주문'}
                            ]} style={{width: '100%'}}>
                            </Select>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>문서번호</div>
                            <Input id={'searchDocumentNumber'} value={info['searchDocumentNumber']}  size={'small'} onChange={onChange}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>거래처명</div>
                            <Input id={'searchCustomerName'} value={info['searchCustomerName']}  size={'small'} onChange={onChange}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>MAKER</div>
                            <Input id={'searchMaker'} value={info['searchMaker']} size={'small'} onChange={onChange}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>MODEL</div>
                            <Input id={'searchModel'} value={info['searchModel']} size={'small'} onChange={onChange}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>ITEM</div>
                            <Input id={'searchItem'} value={info['searchItem']} size={'small'} onChange={onChange}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>등록직원명</div>
                            <Input id={'searchCreatedBy'} value={info['searchCreatedBy']} size={'small'} onChange={onChange}/>
                        </div>
                        <div style={{paddingTop: 20, textAlign: 'right'}}>
                            <Button onClick={searchInfo} type={'primary'} style={{marginRight: 8}}>
                                <SearchOutlined/>조회</Button>
                        </div>
                    </Card>


                </Card>

                <TableGrid
                    columns={tableEstimateReadColumns}
                    data={tableInfo}
                    setDatabase={setInfo}
                    setTableInfo={setTableInfo}
                    rowSelection={rowSelection}
                    pageInfo={paginationInfo}
                    setPaginationInfo={setPaginationInfo}
                    visible={true}
                    excel={true}
                    funcButtons={<><Button type={'primary'} size={'small'} style={{fontSize: 11}}>
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


                {/*<CustomTable columns={tableEstimateReadColumns}*/}
                {/*             initial={tableEstimateReadInitial}*/}
                {/*             dataInfo={tableEstimateReadInfo}*/}
                {/*             info={tableInfo}*/}
                {/*             setDatabase={setInfo}*/}
                {/*             setTableInfo={setTableInfo}*/}
                {/*             rowSelection={rowSelection}*/}
                {/*             pageInfo={paginationInfo}*/}
                {/*             visible={true}*/}
                {/*             setPaginationInfo={setPaginationInfo}*/}

                {/*             subContent={<><Button type={'primary'} size={'small'} style={{fontSize: 11}}>*/}
                {/*                 <CopyOutlined/>복사*/}
                {/*             </Button>*/}
                {/*                 /!*@ts-ignored*!/*/}
                {/*                 <Button type={'danger'} size={'small'} style={{fontSize: 11}} onClick={deleteList}>*/}
                {/*                     <CopyOutlined/>삭제*/}
                {/*                 </Button>*/}
                {/*                 <Button type={'dashed'} size={'small'} style={{fontSize: 11}} onClick={downloadExcel}>*/}
                {/*                     <FileExcelOutlined/>출력*/}
                {/*                 </Button></>}*/}
                {/*/>*/}


            </div>
        </LayoutComponent>
    </>
}



// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    const result = await getData.post('estimate/getEstimateList', {
        "searchType": "",                   // 검색조건 1: 회신, 2: 미회신
        "searchStartDate": "",              // 작성일자 시작일
        "searchEndDate": "",                // 작성일자 종료일
        "searchDocumentNumber": "",         // 문서번호
        "searchCustomerName": "",           // 거래처명
        "searchMaker": "",                  // MAKER
        "searchModel": "",                  // MODEL
        "searchItem": "",                   // ITEM
        "searchCreatedBy": "",              // 등록직원명
        "page": 1,
        "limit": 100
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