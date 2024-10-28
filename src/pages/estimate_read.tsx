import React, {useEffect, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import Card from "antd/lib/card/Card";
import {estimateReadColumns, rfqReadColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {estimateWriteInitial, subRfqReadInitial, subRfqWriteInitial} from "@/utils/initialList";
import {subRfqReadInfo, subRfqWriteInfo} from "@/utils/modalDataList";
import Select from "antd/lib/select";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {getData} from "@/manage/function/api";
import {setUserInfo} from "@/store/user/userSlice";
import moment from "moment/moment";
import {transformData} from "@/utils/common/common";
import * as XLSX from "xlsx";
import Button from "antd/lib/button";
import {CopyOutlined, FileExcelOutlined} from "@ant-design/icons";

const {RangePicker} = DatePicker

const TwinInputBox = ({children}) => {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 5, paddingTop: 8}}>
        {children}
    </div>
}

export default function EstimateRead({dataList}) {

    let checkList = []

    const {estimateList, pageInfo} = dataList;
    const [info, setInfo] = useState(subRfqReadInitial)
    const [tableInfo, setTableInfo] = useState(estimateList)
    const [paginationInfo, setPaginationInfo] = useState(pageInfo)

    console.log(pageInfo,'pageInfo:')
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
        setTableInfo(transformData(estimateList));
    }, [])



    async function searchInfo() {
        const copyData: any = {...info}
        const {writtenDate}: any = copyData;
        if (writtenDate) {
            copyData['searchStartDate'] = writtenDate[0];
            copyData['searchEndDate'] = writtenDate[1];
        }
        const result = await getData.post('estimate/getEstimateList', copyData);
        setTableInfo(transformData(result?.data?.entity?.estimateRequestList));
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
                <Card title={'의뢰 작성'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                    <Card  size={'small'} style={{
                        fontSize: 13,
                        marginTop: 20,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                    }}>


                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>작성일자</div>
                            <RangePicker id={'searchStartDate'} size={'small'} style={{width : '100%'}} />
                        </div>

                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>검색조건</div>
                            <Select id={'searchType'} size={'small'} defaultValue={0} options={[
                                {value: 0, label: '전체'},
                                {value: 1, label: '주문'},
                                {value: 2, label: '미주문'}
                            ]} style={{width : '100%'}}>
                            </Select>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>문서번호</div>
                            <Input id={'searchDocumentNumber'} size={'small'} onChange={onChange}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>거래처명</div>
                            <Input id={'searchCustomerName'} size={'small'} onChange={onChange}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>MAKER</div>
                            <Input id={'searchMaker'} size={'small'} onChange={onChange}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>MODEL</div>
                            <Input id={'searchModel'} size={'small'} onChange={onChange}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>ITEM</div>
                            <Input id={'searchItem'} size={'small'} onChange={onChange}/>
                        </div>
                        <div style={{paddingTop: 8}}>
                            <div style={{paddingBottom: 3}}>등록직원명</div>
                            <Input id={'searchCreatedBy'} size={'small'} onChange={onChange}/>
                        </div>
                    </Card>



                </Card>


                {/*<CustomTable columns={estimateReadColumns} initial={subRfqWriteInitial} dataInfo={subRfqWriteInfo}/>*/}

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
        "limit": 10
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