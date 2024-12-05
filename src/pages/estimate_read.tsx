import React, {useEffect, useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import {tableEstimateReadColumns} from "@/utils/columnList";
import DatePicker from "antd/lib/date-picker";
import {estimateReadInitial, subRfqReadInitial} from "@/utils/initialList";
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
import {deleteEstimate, deleteRfq, searchEstimate} from "@/utils/api/mainApi";
import _ from "lodash";
import {commonManage} from "@/utils/commonManage";
import {BoxCard} from "@/utils/commonForm";

const {RangePicker} = DatePicker


export default function EstimateRead({data}) {

    const gridRef = useRef(null);

    const copyInit = _.cloneDeep(estimateReadInitial)
    const infoInit = {
        ...copyInit,
        searchDate: [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    }
    const [info, setInfo] = useState(infoInit)
    const [tableData, setTableData] = useState(data)


    // =============================================================================

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
                console.log(item,'item:')
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
        <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5,}} onClick={deleteList}>
            <CopyOutlined/>삭제
        </Button>
        <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft: 5,}} onClick={downloadExcel}>
            <FileExcelOutlined/>출력
        </Button></div>

    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateRows: 'auto 1fr', height: '100vh', columnGap: 5}}>
                <Card title={<span style={{fontSize: 12,}}>견적서 조회</span>} headStyle={{marginTop: -10, height: 30}}
                      style={{fontSize: 12, border: '1px solid lightGray'}} bodyStyle={{padding: '10px 24px'}}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', width: '100%', columnGap: 20}}>

                        <BoxCard title={''}>
                            <div>
                                <div style={{paddingBottom: 3}}>작성일자</div>
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
                                <div style={{paddingBottom: 3}}>주문 여부</div>
                                <Select onChange={(src) => onChange({target: {id: 'searchType', value: src}})}
                                        id={'searchType'} size={'small'} value={info['searchType']} defaultValue={0}
                                        options={[
                                            {value: 0, label: '전체'},
                                            {value: 1, label: '주문'},
                                            {value: 2, label: '미주문'}
                                        ]} style={{width: '100%'}}>
                                </Select>
                            </div>


                        </BoxCard>
                        <BoxCard title={''}>

                            {inputForm({title: '문서번호', id: 'searchDocumentNumber'})}
                            {inputForm({title: '등록직원명', id: 'searchCreatedBy'})}
                            {inputForm({title: '고객사명', id: 'searchCustomerName'})}

                        </BoxCard>
                        <BoxCard title={''}>

                            {inputForm({title: 'MAKER', id: 'searchMaker'})}
                            {inputForm({title: 'MODEL', id: 'searchModel'})}
                            {inputForm({title: 'ITEM', id: 'searchItem'})}

                        </BoxCard>
                    </div>
                    <div style={{marginTop: 8, textAlign: 'right'}}>
                        <Button onClick={searchInfo} type={'primary'}><SearchOutlined/>조회</Button>
                    </div>
                </Card>

                <TableGrid
                    gridRef={gridRef}
                    listType={'estimateId'}
                    columns={tableEstimateReadColumns}
                    tableData={tableData}
                    funcButtons={subTableUtil}
                />

            </div>
        </LayoutComponent>
    </>
}


export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    if (codeInfo === -90009) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    } else {
        store.dispatch(setUserInfo(userInfo));
        let copyData = await searchEstimate({data: {}});
        return {
            props: {data: copyData}
        }
    }
})