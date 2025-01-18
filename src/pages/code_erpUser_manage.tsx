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
    SaveOutlined,
} from "@ant-design/icons";
import {transformData} from "@/utils/common/common";
import * as XLSX from "xlsx";
import message from "antd/lib/message";
import Select from "antd/lib/select";

import {TableCodeErpColumns,} from "@/utils/columnList";
import {tableCodeErpInfo,} from "@/utils/modalDataList";
import {codeErpSaveInitial,} from "@/utils/initialList";
import Checkbox from "antd/lib/checkbox/Checkbox";


const CodeErpUserManage = ({dataList}) => {

    let checkList = []

    const {estimateRequestList, pageInfo} = dataList;
    const [saveInfo, setSaveInfo] = useState(codeErpSaveInitial);
    const [info, setInfo] = useState(codeErpSaveInitial);
    const [tableInfo, setTableInfo] = useState(estimateRequestList);
    const [paginationInfo, setPaginationInfo] = useState(pageInfo);

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
        // const result = await getData.post('estimate/getEstimateRequestList', copyData);
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

            });
        }

    }

    return (
        <>
            <LayoutComponent>
                <div style={{display: 'grid', gridTemplateColumns: '350px 1fr', height: '100vh', gridColumnGap: 5}}>
                    <Card title={'ERP 계정 관리'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                        <Card title={'조회/저장'} size={'small'} style={{
                            fontSize: 13,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                        }}>
                            <div>
                                <div style={{paddingBottom: 3}}>ID</div>
                                <Input id={'id'} value={info['id']} onChange={onChange} size={'small'}/>
                            </div>
                            <div style={{paddingTop: 8}}>
                                <div style={{paddingBottom: 3}}>Password</div>
                                <Input id={'pw'} value={info['pw']} onChange={onChange} size={'small'}/>
                            </div>
                            <div style={{paddingTop: 8}}>
                                <div style={{paddingBottom: 3}}>이름</div>
                                <Input id={'name'} value={info['name']} onChange={onChange} size={'small'}/>
                            </div>
                            <div style={{paddingTop: 8}}>
                                <div style={{paddingBottom: 3}}>직급</div>
                                <Input id={'position'} value={info['position']} onChange={onChange} size={'small'}/>
                            </div>
                            <div style={{paddingTop: 8}}>
                                <div style={{paddingBottom: 3}}>권한</div>
                                <Select id={'right'}
                                        onChange={(src) => onChange({target: {id: 'right', value: src}})}
                                        size={'small'} value={info['right']} options={[
                                    {value: '0', label: '일반'},
                                    {value: '1', label: '관리자'},
                                ]} style={{width: '100%'}}>
                                </Select>
                            </div>
                            <div style={{paddingTop: 8}}>
                                <div style={{paddingBottom: 3}}>이메일</div>
                                <Input id={'email'} value={info['email']} onChange={onChange} size={'small'}/>
                            </div>
                            <div style={{paddingTop: 8}}>
                                <div style={{paddingBottom: 3}}>연락처</div>
                                <Input id={'phoneNumber'} value={info['phoneNumber']} onChange={onChange} size={'small'}/>
                            </div>
                            <div style={{paddingTop: 8}}>
                                <div style={{paddingBottom: 3}}>팩스번호</div>
                                <Input id={'faxNumber'} value={info['faxNumber']} onChange={onChange} size={'small'}/>
                            </div>
                            <div style={{paddingTop: 8}}>
                                <div style={{paddingBottom: 3}}>권한정보&nbsp;&nbsp;&nbsp;
                                    <Checkbox id={'rightInfo'} value={info['rightInfo']} style={{fontSize: 13}}
                                              onChange={onChange}>정산관리</Checkbox></div>
                            </div>
                            <div style={{paddingTop: 20, textAlign: 'right'}}>
                               {/*@ts-ignored*/}
                                <Button type={'danger'} style={{marginRight: 8, letterSpacing: -2}}>
                                    <RetweetOutlined/>초기화</Button>
                                <Button type={'primary'} style={{marginRight: 8}}
                                        onClick={searchInfo}><SaveOutlined/>저장</Button>
                            </div>

                        </Card>
                    </Card>

                    <CustomTable columns={TableCodeErpColumns}
                                 initial={codeErpSaveInitial}
                                 dataInfo={tableCodeErpInfo}
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
);
}


export default CodeErpUserManage;

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
        "searchCustomerName": "",           // 고객사명
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