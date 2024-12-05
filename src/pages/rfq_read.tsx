import React, {useRef, useState} from "react";
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
import moment from "moment";
import TableGrid from "@/component/tableGrid";
import message from "antd/lib/message";
import {BoxCard} from "@/utils/commonForm";
import _ from "lodash";
import {deleteRfq, searchRfq} from "@/utils/api/mainApi";
import {commonManage} from "@/utils/commonManage";

const {RangePicker} = DatePicker


export default function rfqRead({dataList}) {

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
                    <div style={{fontSize: 14, fontWeight: 550}}>견적의뢰 조회</div>
                    <div style={{textAlign: 'right'}}>
                        <Button type={'primary'} size={'small'} onClick={searchInfo}><SearchOutlined/>조회</Button>
                    </div>


                </div>}
                      headStyle={{marginTop: -10, height: 30}}
                      style={{border: '1px solid lightGray',}} bodyStyle={{padding: '10px 24px'}}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', width: '100%', columnGap: 20}}>

                        <BoxCard title={''}>
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
                            <div style={{marginTop: 8}}>
                                <div style={{paddingBottom: 3}}>회신 여부</div>
                                <Select id={'searchReplyStatus'} defaultValue={0}
                                        onChange={(src) => onChange({target: {id: 'searchReplyStatus', value: src}})}
                                        size={'small'} value={info['searchReplyStatus']} options={[
                                    {value: 0, label: '전체'},
                                    {value: 1, label: '회신'},
                                    {value: 2, label: '미회신'}
                                ]} style={{width: '100%',}}/>
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
                </Card>

                <TableGrid
                    gridRef={gridRef}
                    columns={rfqReadColumns}
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

    if (codeInfo === -90009) {
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