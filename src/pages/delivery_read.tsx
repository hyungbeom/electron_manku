import React, {useRef, useState} from "react";
import Input from "antd/lib/input/Input";
import LayoutComponent from "@/component/LayoutComponent";
import DatePicker from "antd/lib/date-picker";
import {searchOrderInitial} from "@/utils/initialList";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {getData} from "@/manage/function/api";
import {setUserInfo} from "@/store/user/userSlice";
import moment from "moment/moment";
import Button from "antd/lib/button";
import {CopyOutlined, FileExcelOutlined} from "@ant-design/icons";
import message from "antd/lib/message";
import {deleteEstimate, getDeliveryList, searchEstimate} from "@/utils/api/mainApi";
import _ from "lodash";
import {commonManage} from "@/utils/commonManage";
import {BoxCard, MainCard, TopBoxCard} from "@/utils/commonForm";
import TableGrid from "@/component/tableGrid";
import {delilveryReadColumn, rfqReadColumns, tableEstimateReadColumns} from "@/utils/columnList";

const {RangePicker} = DatePicker


export default function delivery_read({data}) {


    const gridRef = useRef(null);

    const [mini, setMini] = useState(true);

    const copyInit = _.cloneDeep(searchOrderInitial)

    const [info, setInfo] = useState(copyInit)
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
        let result = await getDeliveryList({data: copyData});

        console.log(result,'result')
        setTableData(result)
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
            <div style={{
                display: 'grid',
                gridTemplateRows: `${mini ? 'auto' : '65px'} 1fr`,
                height: '100vh',
                columnGap: 5
            }}>
                <MainCard title={'배송조회'} list={[
                    {name: '조회', func: searchInfo, type: 'primary'},
                ]} mini={mini} setMini={setMini}>
                    {mini ? <div>
                            <TopBoxCard title={'기본 정보'} grid={'1.5fr 1fr 1fr'}>
                                <div>
                                    <div style={{paddingBottom: 3,}}>출고일자</div>
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
                                {inputForm({title: 'Inquiry No.', id: 'searchConnectInquiryNo'})}
                            </TopBoxCard>


                            <div style={{display: 'grid', gridTemplateColumns: "350px 350px 200px 180px 1fr 300px"}}>

                                <BoxCard title={'받는분 정보'}>
                                    {inputForm({title: '고객사명', id: 'searchCustomerName'})}
                                    {inputForm({title: '받는분 전화번호', id: 'searchRecipientPhone'})}
                                </BoxCard>

                                <BoxCard title={'기타 정보'}>
                                    {inputForm({title: '확인여부', id: 'searchIsConfirm'})}
                                    {inputForm({title: '운송장번호', id: 'searchTrackingNumber'})}
                                </BoxCard>

                            </div>
                        </div>
                        : <></>}
                </MainCard>

                <TableGrid
                    gridRef={gridRef}
                    columns={delilveryReadColumn}
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

    if (codeInfo < 0) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    } else {
        store.dispatch(setUserInfo(userInfo));


        let result = await getDeliveryList({data: searchOrderInitial});

        return {
            props: {data: result}
        }
    }
})