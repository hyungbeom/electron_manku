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
import {BoxCard, TopBoxCard} from "@/utils/commonForm";

const {RangePicker} = DatePicker


export default function delivery_read({data}) {

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
        <Button type={'danger'} size={'small'} style={{fontSize: 11, marginLeft: 5,}} onClick={deleteList}>
            <CopyOutlined/>삭제
        </Button>
        <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft: 5,}} onClick={downloadExcel}>
            <FileExcelOutlined/>출력
        </Button></div>

    return <>
        <LayoutComponent>
            <div style={{display: 'grid', gridTemplateRows: 'auto auto 1fr', height: '100vh', columnGap: 5}}>

                <TopBoxCard title={'기본 정보'} grid={'1fr 0.6fr 0.6fr 1fr 1fr 1fr'}>
                    <div>
                        <div style={{paddingBottom: 3}}>출고일자</div>
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

                    {inputForm({title: 'INQUIRY NO.', id: 'adminName'})}
                    {inputForm({title: '거래처명', id: 'managerAdminName'})}

                </TopBoxCard>

                <div style={{marginTop: 8, textAlign: 'right'}}>
                    <Button onClick={searchInfo} type={'primary'}><SearchOutlined/>조회</Button>
                </div>

                <TableGrid
                    gridRef={gridRef}
                    listType={'estimateId'}
                    columns={[{
                        headerName: '출고일짜',
                        field: '출고일짜',
                        width: 70,
                        pinned: 'left'
                    },
                        {
                            headerName: '운송타입',
                            field: '운송타입',
                            width: 70,
                            pinned: 'left'
                        },{
                            headerName: '연결 INQUIRY NO.',
                            field: '연결 INQUIRY NO.',
                            width: 70,
                            pinned: 'left'
                        },
                        {
                            headerName: '받는분 정보',
                            children: [
                                {
                                    headerName: '성명',
                                    field: '성명',
                                    minWidth: 70,
                                }, {
                                    headerName: '전화번호',
                                    field: '전화번호',
                                    minWidth: 70,
                                }, {
                                    headerName: '기타전화번호',
                                    field: '기타전화번호',
                                    minWidth: 70,
                                }, {
                                    headerName: '우편번호',
                                    field: '우편번호',
                                    minWidth: 70,
                                }, {
                                    headerName: '주소',
                                    field: '주소',
                                    minWidth: 70,
                                }, {
                                    headerName: '도착지',
                                    field: '도착지',
                                    minWidth: 70,
                                }
                            ]
                        },
                        {
                            headerName: '화물정보',
                            children: [
                                {
                                    headerName: '품목명',
                                    field: '품목명',
                                    minWidth: 70,
                                }, {
                                    headerName: '수량',
                                    field: '수량',
                                    minWidth: 70,
                                }, {
                                    headerName: '포장',
                                    field: '포장',
                                    minWidth: 70,
                                }, {
                                    headerName: '택배화물',
                                    field: '택배화물',
                                    minWidth: 70,
                                }, {
                                    headerName: '결재방식',
                                    field: '결재방식',
                                    minWidth: 70,
                                }, {
                                    headerName: '구분',
                                    field: '구분',
                                    minWidth: 70,
                                }, {
                                    headerName: '운송장번호',
                                    field: '운송장번호',
                                    minWidth: 70,
                                }, {
                                    headerName: '고객주문번호',
                                    field: '고객주문번호',
                                    minWidth: 70,
                                }, {
                                    headerName: '확인여부',
                                    field: '확인여부',
                                    minWidth: 70,
                                }
                            ]
                        },
                        ...tableEstimateReadColumns]}
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
        let copyData = await searchEstimate({data: {}});
        return {
            props: {data: copyData}
        }
    }
})