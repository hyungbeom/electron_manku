import React, {useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import Button from "antd/lib/button";
import {
    CopyOutlined, DownCircleFilled, EditOutlined, RetweetOutlined, SaveOutlined, UpCircleFilled,
} from "@ant-design/icons";
import message from "antd/lib/message";
import {
    tableCodeDomesticAgencyWriteColumns, tableCodeOverseasAgencyWriteColumns,
} from "@/utils/columnList";
import {
    codeDomesticAgencyWriteInitial, codeOverseasAgencyWriteInitial,
} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import {useRouter} from "next/router";
import moment from "moment/moment";
import DatePicker from "antd/lib/date-picker";
import Input from "antd/lib/input/Input";
import Select from "antd/lib/select";
import initialServerRouter from "@/manage/function/initialServerRouter";
import nookies from "nookies";
import {setUserInfo} from "@/store/user/userSlice";
import {wrapper} from "@/store/store";
import {BoxCard, datePickerForm, inputForm, inputNumberForm, MainCard, selectBoxForm} from "@/utils/commonForm";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import {updateDomesticAgency} from "@/utils/api/mainApi";
import Spin from "antd/lib/spin";
import _ from "lodash";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import Table from "@/component/util/Table";
import {DCInfo, OAInfo} from "@/utils/column/ProjectInfo";
import {useNotificationAlert} from "@/component/util/NoticeProvider";

const listType = 'overseasAgencyManagerList'
export default function OverseasAgencyUpdate({ updateKey, getCopyPage}:any) {
    const notificationAlert = useNotificationAlert();
    const gridRef = useRef(null);
    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)
    const tableRef = useRef(null);

    const router=useRouter();

    const [mini, setMini] = useState(true);
    const [info, setInfo] = useState<any>([])


    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('overseas_agency_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 20, 0]; // 기본값 [50, 50, 50]
    };

    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태


    const [loading, setLoading] = useState<any>(false)

    const [tableData, setTableData] = useState([]);



    async function getDataInfo() {

        const result = await getData.post('agency/getOverseasAgencyDetail', {
            "overseasAgencyId": updateKey['overseas_agency_update'],
            "overseasAgencyCode": ""
        });
        console.log(result,'result:')
        return result?.data?.entity;
    }

    useEffect(() => {
        // setLoading(true)
        getDataInfo().then(v => {
            console.log(v,':::::')
            // const {customerDetail} = v;
            // setInfo(customerDetail);
            // customerDetail[listType] = [...customerDetail[listType], ...commonFunc.repeatObject(DCInfo['write']['defaultData'], 100 - customerDetail[listType].length)];
            // setTableData(customerDetail[listType]);
            // setLoading(false)
        })
    }, [updateKey['overseas_agency_update']])

    useEffect(() => {
        commonManage.setInfo(infoRef, info);
    }, [info]);


    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {

        if(!info['agencyCode']){
            return message.error('코드(약칭)이 누락되었습니다.')
        }
        setLoading(true)
        await updateDomesticAgency({data : info, returnFunc : returnFunc})
    }

    function returnFunc(){
        setLoading(false)
    }


    function clearAll() {
        setInfo(codeOverseasAgencyWriteInitial);
        gridManage.deleteAll(gridRef)
    }

    function copyPage() {
        const totalList = gridManage.getAllData(gridRef)
        let copyInfo = _.cloneDeep(info)
        copyInfo[listType] = totalList

        const query = `data=${encodeURIComponent(JSON.stringify(copyInfo))}`;
        router.push(`/data/agency/overseas/agency_write?${query}`)
    }
    return <Spin spinning={loading} tip={'견적의뢰 등록중...'}>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '365px' : '65px'} calc(100vh - ${mini ? 460 : 160}px)`,
            rowGap: 10
        }}>
            <PanelSizeUtil groupRef={groupRef} storage={'overseas_agency_write'}/>
            <MainCard title={'해외 매입처 등록'} list={[
                {name: '저장', func: saveFunc, type: 'primary'},
                {name: '초기화', func: clearAll, type: 'danger'}
            ]} mini={mini} setMini={setMini}>


                {mini ? <div ref={infoRef}>
                        <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                                    style={{gap: 0.5, paddingTop: 3}}>
                            <Panel defaultSize={sizes[0]} minSize={5}>
                                <BoxCard title={'코드 정보'}>
                                    {inputForm({title: '코드(약칭)', id: 'agencyCode'})}
                                    {inputForm({title: '상호', id: 'agencyName'})}
                                    {inputForm({title: '아이템', id: 'item'})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle id={'resize'} className={'ground'}/>
                            <Panel defaultSize={sizes[1]} minSize={5}>
                                <BoxCard title={'매입처 정보'}>
                                    {inputForm({title: '딜러/제조', id: 'dealerType'})}
                                    {/*{selectBoxForm({*/}
                                    {/*    title: '등급', id: 'grade',     list: [*/}
                                    {/*        {value: 'A', label: 'A'},*/}
                                    {/*        {value: 'B', label: 'B'},*/}
                                    {/*        {value: 'C', label: 'C'},*/}
                                    {/*        {value: 'D', label: 'D'},*/}
                                    {/*    ]*/}
                                    {/*})}*/}
                                    {inputNumberForm({title: '마진', id: 'margin', suffix: '%'})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle id={'resize'} className={'ground'}/>
                            <Panel defaultSize={sizes[2]} minSize={5}>
                                <BoxCard title={'ETC'}>
                                    {inputForm({title: '송금중개은행', id: 'intermediaryBank'})}
                                    {inputForm({title: '주소', id: 'address'})}
                                    {inputForm({title: 'IBan Code', id: 'ibanCode'})}
                                    {inputForm({title: 'SWIFT CODE', id: 'swiftCode'})}
                                </BoxCard>
                            </Panel>

                            <PanelResizeHandle id={'resize'} className={'ground'}/>
                            <Panel defaultSize={sizes[3]} minSize={5}>
                                <BoxCard title={'ETC'}>
                                    {inputForm({title: '국가', id: 'country',})}
                                    {inputForm({title: 'ACCOUNT NO', id: 'bankAccountNumber'})}
                                    {inputForm({title: '화폐단위', id: 'currencyUnit'})}
                                    {inputForm({title: 'FTA NO', id: 'ftaNumber'})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle id={'resize'} className={'ground'}/>
                            <Panel defaultSize={sizes[4]} minSize={5}>
                                <BoxCard title={'ETC'}>
                                    {datePickerForm({title: '거래시작일', id: 'tradeStartDate'})}
                                    {inputForm({title: '담당자', id: 'manager'})}
                                    {inputForm({title: '홈페이지', id: 'homepage'})}
                                </BoxCard>
                            </Panel>
                            <PanelResizeHandle id={'resize'} className={'ground'}/>
                            <Panel defaultSize={sizes[5]} minSize={5}>
                            </Panel>
                        </PanelGroup>
                    </div>
                    : <></>}
            </MainCard>
            {}
            <Table data={tableData} column={OAInfo['write']} funcButtons={['print']} ref={tableRef}
                   type={'overseas_agency_write_column'}/>
        </div>
    </Spin>
}