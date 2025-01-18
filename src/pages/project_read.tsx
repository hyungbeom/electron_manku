import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {projectReadColumn, tableEstimateReadColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {estimateReadInitial, projectReadInitial, subRfqReadInitial} from "@/utils/initialList";
import Select from "antd/lib/select";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {getData} from "@/manage/function/api";
import {setUserInfo} from "@/store/user/userSlice";
import moment from "moment/moment";
import * as XLSX from "xlsx";
import Button from "antd/lib/button";
import {CopyOutlined, FileExcelOutlined, SearchOutlined} from "@ant-design/icons";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {deleteEstimate, deleteRfq, searchEstimate, searchProject} from "@/utils/api/mainApi";
import _ from "lodash";
import {commonManage} from "@/utils/commonManage";
import {BoxCard, datePickerForm, inputForm, MainCard, TopBoxCard} from "@/utils/commonForm";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import {useRouter} from "next/router";

const {RangePicker} = DatePicker


export default function ProjectRead({dataInfo}) {

    const router = useRouter();
    const gridRef = useRef(null);
    const [mini, setMini] = useState(true);
    const copyInit = _.cloneDeep(projectReadInitial)
    const infoInit = {
        ...copyInit,
        searchDate: [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    }
    const [info, setInfo] = useState(infoInit)
    const [tableData, setTableData] = useState(dataInfo)

    // =============================================================================




    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo()
        }
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }


    async function searchInfo() {
        const copyData: any = {...info}
        const {searchDate}: any = copyData;
        if (searchDate) {
            copyData['searchStartDate'] = searchDate[0];
            copyData['searchEndDate'] = searchDate[1];
        }
        const result = await getData.post('estimate/getEstimateList',
            {...copyData, "page": 1, "limit": -1});
        setTableData(result?.data?.entity?.estimateList)
    }

    async function deleteList() {
        const api = gridRef.current.api;

        let bowl = {
            deleteList: []
        }

        if (api.getSelectedRows().length < 1) {
            message.error('삭제할 데이터를 선택해주세요.')
        } else {
            for (const item of api.getSelectedRows()) {
                const {estimateId, estimateDetailId} = item;
                console.log(item, 'item:')
                bowl['deleteList'].push({
                    "estimateId": estimateId,
                    "estimateDetailId": estimateDetailId
                })
            }
            await deleteEstimate({data: bowl, returnFunc: searchInfo});
        }
    }

    const downloadExcel = () => {
        commonManage.excelDownload(tableData)
    };


    /**
     * @description 테이블 우측상단 관련 기본 유틸버튼
     */
    const subTableUtil = <div><Button type={'primary'} size={'small'} style={{fontSize: 11}}>
        <CopyOutlined/>복사
    </Button>
        {/*@ts-ignored*/}
        <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5}} onClick={deleteList}>
            <CopyOutlined/>삭제
        </Button>
        <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft: 5}} onClick={downloadExcel}>
            <FileExcelOutlined/>출력
        </Button></div>


    async function saveFunc() {
        let copyData = await searchProject({data: info});
        setTableData(copyData)
    }

    function clearAll() {
        setInfo(infoInit)
    }

    function moveRegist() {
        router.push('/project_write')
    }

    return <>
        <LayoutComponent>
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? 'auto' : '65px'} 1fr`,
                height: '100vh',
                columnGap: 5
            }}>

                <MainCard title={'프로젝트 조회'} list={[
                    {name: '조회', func: saveFunc, type: 'primary'},
                    {name: '초기화', func: clearAll, type: 'danger'},
                    {name: '신규작성', func: moveRegist, type: 'default'}
                ]} mini={mini} setMini={setMini}>

                    {mini ? <div>
                            <TopBoxCard title={'기본 정보'} grid={'1fr 1fr 1fr 1fr'}>

                                {inputForm({title: '작성자', id: 'searchManagerAdminName', onChange : onChange, data : info})}
                                {datePickerForm({title: '작성일자', id: 'writtenDate', onChange : onChange, data : info, })}
                                {inputForm({title: '담당자', id: 'searchManagerAdminName', onChange : onChange, data : info})}

                            </TopBoxCard>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: "200px 250px 1fr 300px ",
                                gap: 10,
                                marginTop: 10
                            }}>
                                <BoxCard title={'프로젝트 정보'}>
                                    {inputForm({title: 'PROJECT NO.', id: 'searchDocumentNumberFull', onChange : onChange, data : info})}
                                    {inputForm({title: '프로젝트 제목', id: 'searchProjectTitle', onChange : onChange, data : info})}
                                    {datePickerForm({title: 'Inquiry No.', id: 'searchConnectInquiryNo', onChange : onChange, data : info})}
                                </BoxCard>
                                <BoxCard title={'매입처'}>

                                    {inputForm({title: '매입처명', id: 'searchAgencyName'})}
                                    {inputForm({title: '매입처 담당자명', id: 'searchAgencyManagerName', onChange : onChange, data : info})}
                                    {inputForm({title: '담당자 전화번호', id: 'searchAgencyManagerPhone', onChange : onChange, data : info})}
                                    {inputForm({title: '담당자 이메일', id: 'searchAgencyManagerEmail', onChange : onChange, data : info})}
                                </BoxCard>
                                <BoxCard title={'거래처 정보'}>
                                    {inputForm({title: '거래처명', id: 'searchCustomerName', onChange : onChange, data : info})}
                                    {inputForm({title: '거래처 담당자명', id: 'searchCustomerManagerName', onChange : onChange, data : info})}
                                    {inputForm({title: '담당자 전화번호', id: 'searchCustomerPhone', onChange : onChange, data : info})}
                                    {inputForm({title: '담당자 이메일', id: 'searchCustomerEmail', onChange : onChange, data : info})}
                                </BoxCard>
                            </div>
                        </div>
                        : <></>}
                </MainCard>

                <TableGrid
                    gridRef={gridRef}
                    columns={projectReadColumn}
                    tableData={tableData}
                    funcButtons={subTableUtil}
                />

            </div>
        </LayoutComponent>
    </>
}


export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    if (codeInfo < 0) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    } else {
        store.dispatch(setUserInfo(userInfo));
        let copyData = await searchProject({data: {}});
        return {
            props: {dataInfo: copyData}
        }
    }
})