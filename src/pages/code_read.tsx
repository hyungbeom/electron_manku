import React, {useEffect, useState} from "react";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import {getData} from "@/manage/function/api";
import moment from "moment";
import * as XLSX from "xlsx";
import {transformData} from "@/utils/common/common";
import message from "antd/lib/message";

import Input from "antd/lib/input/Input";
import Select from "antd/lib/select";
import Card from "antd/lib/card/Card";
import TextArea from "antd/lib/input/TextArea";
import Button from "antd/lib/button";

import LayoutComponent from "@/component/LayoutComponent";
import CustomTable from "@/component/CustomTable";
import {
    CopyOutlined,
    FileExcelOutlined,
    RetweetOutlined,
    SaveOutlined,
    SearchOutlined
} from "@ant-design/icons";

import {tableCodeReadColumns,} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {codeReadInitial, codeSaveInitial,} from "@/utils/initialList";
import {tableCodeReadInfo} from "@/utils/modalDataList";


const {RangePicker} = DatePicker

const TwinInputBox = ({children}) => {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 5, paddingTop: 8}}>
        {children}
    </div>
}


const CodeRead = ({dataList}) => {

    let checkList = []

    const {estimateRequestList, pageInfo} = dataList;
    const [saveInfo, setSaveInfo] = useState(codeSaveInitial);
    const [info, setInfo] = useState(codeReadInitial);
    const [tableInfo, setTableInfo] = useState(estimateRequestList)
    const [paginationInfo, setPaginationInfo] = useState(pageInfo)

    // console.log(pageInfo,'pageInfo:')
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
        // setTableInfo(transformData(estimateRequestList));

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
        const result = await getData.post('estimate/getEstimateRequestList', copyData);
        // setTableInfo(transformData(result?.data?.entity?.estimateRequestList));
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

            await getData.post('estimate/addEstimateRequest', copyData).then(v => {
                console.log(v, ':::::')
            });
        }

    }

    return (
        <>
            <LayoutComponent>
                <div style={{display: 'grid', gridTemplateColumns: '350px 1fr', height: '100%', gridColumnGap: 5}}>
                    <Card title={'HS-code 관리'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                        <Card size={'small'} title={'조회/저장'} style={{
                            fontSize: 13,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>
                            <div>
                                <div style={{paddingBottom: 3}}>ITEM</div>
                                <Input id={'item'} value={saveInfo['item']} onChange={onSaveChange} size={'small'}/>
                            </div>
                            <div style={{paddingTop: 8}}>
                                <div style={{paddingBottom: 3}}>HSCODE</div>
                                <Input id={'hsCode'} value={saveInfo['hsCode']} onChange={onSaveChange} size={'small'}/>
                            </div>
                            <div style={{paddingTop: 20, textAlign: 'right'}}>
                                {/*@ts-ignored*/}
                                <Button onClick={() => setSaveInfo(codeReadInitial)} type={'danger'} style={{marginRight: 8, letterSpacing: -2}}>
                                    <RetweetOutlined/>초기화</Button>
                                <Button type={'primary'} style={{marginRight: 8}}
                                        onClick={saveFunc}><SaveOutlined/>저장</Button>
                            </div>
                        </Card>
                        <Card  size={'small'} title={'검색'} style={{
                            fontSize: 13,  marginTop:8,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>
                            <div>
                                <Input id={'searchText'} value={info['searchText']} onChange={onChange} size={'small'}/>
                            </div>
                            <div style={{paddingTop: 20, textAlign: 'right'}}>
                                {/*@ts-ignored*/}
                                <Button onClick={searchInfo} type={'primary'} style={{marginRight: 8}}>
                                    <SearchOutlined/>검색</Button>
                            </div>
                        </Card>


                    </Card>


                    <CustomTable columns={tableCodeReadColumns}
                                 initial={codeSaveInitial}
                                 dataInfo={tableCodeReadInfo}
                                 info={tableInfo}
                                 setDatabase={setInfo}
                                 setTableInfo={setTableInfo}
                                 rowSelection={rowSelection}
                                 pageInfo={paginationInfo}
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
    )
}

export default CodeRead;

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

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