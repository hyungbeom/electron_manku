import React, {useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import Select from "antd/lib/select";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {CopyOutlined, FileExcelOutlined, FileSearchOutlined, SearchOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import {projectReadColumn, rfqReadColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {subRfqReadInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import moment from "moment";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {BoxCard, TopBoxCard} from "@/utils/commonForm";
import _ from "lodash";
import {deleteRfq, searchRfq} from "@/utils/api/mainApi";
import {commonManage} from "@/utils/commonManage";

const {RangePicker} = DatePicker


export default function projectRead({dataList}) {

    const gridRef = useRef(null);


    const {estimateRequestList = []} = dataList;
    const copyInit = _.cloneDeep(subRfqReadInitial)
    const infoInit = {
        ...copyInit,
        searchDate: [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    }
    const [info, setInfo] = useState(infoInit);
    const [tableData, setTableData] = useState(estimateRequestList);

    const inputForm = ({title, id, disabled = false, suffix = null}) => {
        let bowl = info;


        return <div>
            <div>{title}</div>
            <Input id={id} value={bowl[id]} disabled={disabled}
                   onChange={onChange}
                   size={'small'}
                   onKeyDown={handleKeyPress}
                   suffix={suffix}
            />
        </div>
    }

    const datePickerForm = ({title, id, disabled = false}) => {
        return <div>
            <div>{title}</div>
            {/*@ts-ignore*/}
            <DatePicker value={info[id] ? moment(info[id]) : ''} style={{width: '100%'}}
                        disabledDate={commonManage.disabledDate}
                        onChange={(date) => onChange({
                            target: {
                                id: id,
                                value: date
                            }
                        })
                        }
                        disabled={disabled}
                        id={id} size={'small'}/>
        </div>
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo()
        }
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }


    /**
     * @description 검색조건에 의해서 검색 조회 api
     */
    async function searchInfo() {
        const copyData: any = {...info}
        const {searchDate}: any = copyData;

        const result = await searchRfq({
            data: {
                ...copyData,
                searchStartDate: searchDate[0],
                searchEndDate: searchDate[1]
            }
        });

        setTableData(result?.estimateRequestList);
    }


    async function deleteList() {
        const api = gridRef.current.api;

        let bowl = {
            deleteList: []
        }

        if (api.getSelectedRows().length < 1) {
            message.error('삭제할 데이터를 선택해주세요?.')
        } else {
            for (const item of api.getSelectedRows()) {
                const {estimateRequestId, estimateRequestDetailId} = item;
                bowl['deleteList'].push({
                    "estimateRequestId": estimateRequestId,
                    "estimateRequestDetailId": estimateRequestDetailId
                })
            }
            await deleteRfq({data: bowl, returnFunc: searchInfo});
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
        <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5,}}
                onClick={deleteList}>
            <CopyOutlined/>삭제
        </Button>
        <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft: 5,}}
                onClick={downloadExcel}>
            <FileExcelOutlined/>출력
        </Button></div>


    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateRows: 'auto 1fr', height: '100vh', columnGap: 5}}>

                <Card title={<div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{fontSize: 14, fontWeight: 550}}>프로젝트 조회</div>
                    <div style={{textAlign: 'right'}}>
                        <Button type={'primary'} size={'small'} onClick={searchInfo}><SearchOutlined/>조회</Button>
                    </div>


                </div>}
                      headStyle={{marginTop: -10, height: 30}}
                      style={{border: '1px solid lightGray',}} bodyStyle={{padding: '10px 24px'}}>
                    <TopBoxCard title={'기본 정보'} grid={'1fr 1fr 1fr'}>

                        {inputForm({title: '작성자', id: 'adminName', disabled: true})}
                        {inputForm({title: '담당자', id: 'managerAdminName'})}
                        {datePickerForm({title: '작성일자', id: 'writtenDate'})}

                    </TopBoxCard>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', width: '100%', columnGap: 20, marginTop : 10}}>

                        <BoxCard title={'프로젝트 정보'}>
                            {inputForm({title: 'PROJECT NO.', id: 'agencyName'})}
                            {inputForm({title: '프로젝트 제목', id: '매입처담당자', placeholder: '매입처 당담자 입력 필요'})}
                            {datePickerForm({title: '마감일자', id: 'writtenDate'})}
                        </BoxCard>

                        <BoxCard title={'거래처 정보'}>
                            {inputForm({title: '거래처명', id: 'managerName'})}
                            {inputForm({title: '거래처 담당자명', id: 'phoneNumber'})}
                            {inputForm({title: '담당자 전화번호', id: 'faxNumber'})}
                            {inputForm({title: '담당자 이메일', id: 'customerManagerEmail'})}
                        </BoxCard>

                        <BoxCard title={'매입처 정보'}>
                            {inputForm({title: '매입처명', id: 'managerName'})}
                            {inputForm({title: '매입처 담당자명', id: 'phoneNumber'})}
                            {inputForm({title: '매입처 전화번호', id: 'faxNumber'})}
                            {inputForm({title: '매입처 이메일', id: 'customerManagerEmail'})}
                        </BoxCard>

                    </div>
                </Card>

                <TableGrid
                    gridRef={gridRef}
                    columns={projectReadColumn}
                    tableData={tableData}
                    type={'read'}
                    funcButtons={subTableUtil}
                />

            </div>
        </LayoutComponent>
    </>
}

export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    console.log(codeInfo,'codeInfo:')
    if (codeInfo < 0) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    } else {
        store.dispatch(setUserInfo(userInfo));

        const result = await searchRfq({data: {}});

        return {
            props: {dataList: result}
        }
    }

})