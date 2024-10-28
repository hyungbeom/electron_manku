import React, {useEffect, useState} from "react";
import moment from "moment/moment";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import CustomTable from "@/component/CustomTable";
import Input from "antd/lib/input/Input";

import Button from "antd/lib/button";
import {
    CopyOutlined,
    FileExcelOutlined,
    RetweetOutlined,
    SaveOutlined, SearchOutlined,
} from "@ant-design/icons";
import {transformData} from "@/utils/common/common";
import * as XLSX from "xlsx";
import message from "antd/lib/message";
import Select from "antd/lib/select";

import {
    tableCodeDomesticPurchaseColumns, tableCodeDomesticSalesColumns,
} from "@/utils/columnList";
import {
    subRfqReadInfo,
    subRfqWriteInfo,
    tableCodeDomesticPurchaseInfo,
    tableCodeDomesticSalesInfo,
} from "@/utils/modalDataList";
import {
    codeDomesticPurchaseInitial,
    subRfqReadInitial, subRfqWriteInitial, tableCodeDomesticPurchaseInitial, tableCodeDomesticSalesInitial,
} from "@/utils/initialList";
import Radio from "antd/lib/radio";
import TableModal from "@/utils/TableModal";


const TwinInputBox = ({children}) => {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 5, paddingTop: 8}}>
        {children}
    </div>
}
export default function codeOverseasSales({dataList}) {

    let checkList = []

    const {agencyList,pageInfo} = dataList;
    const [saveInfo, setSaveInfo] = useState(codeDomesticPurchaseInitial);
    const [info, setInfo] = useState(codeDomesticPurchaseInitial);
    const [tableInfo, setTableInfo] = useState(agencyList);
    const [paginationInfo, setPaginationInfo] = useState(pageInfo);

    console.log(dataList,'dataList:')
    // console.log(saveInfo,'saveInfo:')


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    function onSaveChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setSaveInfo(v => {
            return {...v, ...bowl}
        })
    }


    useEffect(() => {
        const copyData: any = {...info}
        copyData['searchDate'] = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
        setInfo(copyData);
        // setTableInfo(transformData(agencyList));

        const copySaveData: any = {...saveInfo}
        copySaveData['searchDate'] = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
        setSaveInfo(copyData);
    }, [])


    async function searchInfo() {
        const copyData: any = {...info}
        const {writtenDate}: any = copyData;
        if (writtenDate) {
            copyData['searchStartDate'] = writtenDate[0];
            copyData['searchEndDate'] = writtenDate[1];
        }
        const result = await getData.post('agency/getAgencyList', copyData);
        // setTableInfo(transformData(result?.data?.entity?.agencyList));
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
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    async function saveFunc() {
        if (!saveInfo['estimateRequestDetailList'].length) {
            message.warn('하위 데이터 1개 이상이여야 합니다')
        } else {
            const copyData = {...saveInfo}
            copyData['writtenDate'] = moment(saveInfo['writtenDate']).format('YYYY-MM-DD');

            await getData.post('agency/getAgencyList', copyData).then(v => {
                console.log(v, ':::::')
            });
        }

    }
    return <LayoutComponent>
        <div style={{display: 'grid', gridTemplateColumns: '320px 1fr', height: '100%', gridColumnGap: 5}}>
            <Card size={'small'} title={'국내거래처(매출)'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                <Card size={'small'} style={{
                    fontSize: 13,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                }}>
                    <div>
                        <div style={{paddingBottom: 3}}>조회구분</div>
                        <Radio.Group onChange={onChange} defaultValue={2} id={'searchType'} value={info['searchType']}>
                            <Radio style={{marginRight:-2}} value={1}>코드</Radio>
                            <Radio style={{marginRight:-2}} value={2}>상호명</Radio>
                            <Radio style={{marginRight:-2}} value={3}>지역</Radio>
                            <Radio style={{marginRight:-2, letterSpacing:-2}} value={4}>전화번호</Radio>
                        </Radio.Group>
                    </div>
                    <div style={{marginTop: 8}}>
                        <div style={{paddingBottom: 3}}>검색어</div>
                        <Input id={'searchText'} value={info['searchText']} onChange={onChange} size={'small'}/>
                    </div>
                    <div style={{paddingTop: 20, textAlign: 'right'}}>
                        {/*@ts-ignored*/}
                        <Button onClick={searchInfo} type={'primary'} style={{marginRight: 8}}>
                            <SearchOutlined/>조회</Button>
                    </div>

                </Card>
            </Card>
            <CustomTable columns={tableCodeDomesticSalesColumns}
                         initial={tableCodeDomesticPurchaseInitial}
                         dataInfo={tableCodeDomesticSalesInfo}
                         info={tableInfo}
                         setDatabase={setInfo}
                         setTableInfo={setTableInfo}
                         rowSelection={rowSelection}
                         pageInfo={paginationInfo}
                         setPaginationInfo={setPaginationInfo}
                         content={<TableModal title={'데이터 추가'} data={tableCodeDomesticSalesInitial}
                                              dataInfo={tableCodeDomesticSalesInfo}
                                              setInfoList={setInfo}/>}
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
}

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    const result = await getData.post('agency/getAgencyList', {
        "searchType": "1",      // 1: 코드, 2: 상호명, 3: MAKER
        "searchText": "K0",
        "page": 1,
        "limit": 20
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