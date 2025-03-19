import React, {useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import {codeDomesticSalesWriteInitial, projectWriteInitial,} from "@/utils/initialList";
import {useRouter} from "next/router";
import {BoxCard, datePickerForm, inputForm, MainCard, textAreaForm} from "@/utils/commonForm";
import {commonFunc, commonManage, gridManage} from "@/utils/commonManage";
import _ from "lodash";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import Table from "@/component/util/Table";
import {OCInfo} from "@/utils/column/ProjectInfo";
import Spin from "antd/lib/spin";
import moment from "moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";

const listType = 'overseasCustomerManagerList'
export default function OverseasCustomerUpdate({ updateKey, getCopyPage}:any) {
    const notificationAlert = useNotificationAlert();
    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)

    const tableRef = useRef(null);
    const gridRef = useRef(null);
    const router = useRouter();

    const [mini, setMini] = useState(true);
    const [info, setInfo] = useState<any>({});
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('overseas_customer_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 20, 0]; // 기본값 [50, 50, 50]
    };

    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태

    async function getDataInfo() {

        const result = await getData.post('customer/getOverseasCustomerDetail', {
            "overseasCustomerId": updateKey['overseas_customer_update'],
            "overseasCustomerCode": ""
        });
        return result?.data?.entity;
    }

    useEffect(() => {
        setLoading(true)
        getDataInfo().then(v => {
            const {overseasCustomerDetail} = v;
            setInfo(overseasCustomerDetail);
            overseasCustomerDetail[listType] = [...overseasCustomerDetail[listType], ...commonFunc.repeatObject(OCInfo['write']['defaultData'], 1000 - overseasCustomerDetail[listType].length)];
            setTableData(overseasCustomerDetail[listType]);
            setLoading(false)
        })
    }, [updateKey['overseas_customer_update']])
    useEffect(() => {

        commonManage.setInfo(infoRef, info);
    }, [info]);


    async function saveFunc() {
        const dom = infoRef.current.querySelector('#customerName');
        let infoData = commonManage.getInfo(infoRef, OCInfo['defaultInfo']);
        infoData['overseasCustomerId'] = updateKey['overseas_customer_update']

        const tableList = tableRef.current?.getSourceData();

        const filterTableList = commonManage.filterEmptyObjects(tableList, ['managerName'])
        if (!filterTableList.length) {
            return message.warn('하위 데이터 1개 이상이여야 합니다');
        }
        infoData[listType] = filterTableList
        await getData.post('customer/updateOverseasCustomer', infoData).then(v => {
            if (v.data.code === 1) {
                notificationAlert('success', '💾해외고객사 수정완료',
                    <>
                        <div>Project No. : {dom.value}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    ,null,
                )
            } else {
                message.error('저장에 실패하였습니다.')
            }
        });

    }


    function deleteList() {

        const api = gridRef.current.api;

        // 전체 행 반복하면서 선택되지 않은 행만 추출
        const uncheckedData = [];
        for (let i = 0; i < api.getDisplayedRowCount(); i++) {
            const rowNode = api.getDisplayedRowAtIndex(i);
            if (!rowNode.isSelected()) {
                uncheckedData.push(rowNode.data);
            }
        }

        let copyData = {...info}
        copyData['customerManagerList'] = uncheckedData;

        setInfo(copyData);

    }


    function copyPage() {
        const totalList = gridManage.getAllData(gridRef)
        let copyInfo = _.cloneDeep(info)
        copyInfo[listType] = totalList

        const query = `data=${encodeURIComponent(JSON.stringify(copyInfo))}`;
        router.push(`/data/customer/overseas/customer_write?${query}`)
    }

    return <Spin spinning={loading}>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '365px' : '65px'} calc(100vh - ${mini ? 460 : 150}px)`,
            rowGap: 10,
        }}>
            <PanelSizeUtil groupRef={groupRef} storage={'overseas_customer_write'}/>
            <MainCard title={'해외 고객사 수정'} list={[
                {name: '수정', func: saveFunc, type: 'primary'},
                {name: '삭제', func: saveFunc, type: 'danger'},
                {name: '복제', func: copyPage, type: 'default'},
            ]} mini={mini} setMini={setMini}>


                {mini ? <div ref={infoRef}>
                    <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                                style={{gap: 0.5, paddingTop: 3}}>
                        <Panel defaultSize={sizes[0]} minSize={5}>
                            <BoxCard title={'INQUIRY & PO no'}>
                                {inputForm({title: '코드(약칭)', id: 'customerCode'})}
                                {inputForm({title: '지역', id: 'customerRegion'})}
                                {inputForm({title: 'FTA No', id: 'ftaNumber'})}
                                <div>
                                    <div style={{fontSize: 12, fontWeight: 700, paddingBottom: 5.5}}>화폐 단위</div>
                                    <select name="languages" id="currencyUnit"
                                            style={{
                                                outline: 'none',
                                                border: '1px solid lightGray',
                                                height: 23,
                                                width: '100%',
                                                fontSize: 12,
                                                paddingBottom: 0.5
                                            }}>
                                        <option value={'KRW'}>KRW</option>
                                        <option value={'EUR'}>EUR</option>
                                        <option value={'JPY'}>JPY</option>
                                        <option value={'USD'}>USD</option>
                                        <option value={'GBP'}>GBP</option>

                                    </select>
                                </div>
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[1]} minSize={5}>
                            <BoxCard title={'INQUIRY & PO no'}>
                                {datePickerForm({title: '거래시작일', id: 'tradeStartDate'})}
                                {inputForm({title: '상호', id: 'customerName'})}
                                {inputForm({title: '주소', id: 'address'})}
                                {inputForm({title: '홈페이지', id: 'homepage'})}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[2]} minSize={5}>
                            <BoxCard title={'INQUIRY & PO no'}>
                                {inputForm({title: '연락처', id: 'phoneNumber'})}
                                {inputForm({title: '팩스번호', id: 'faxNumber'})}
                                {inputForm({title: '만쿠 담당자', id: 'mankuTradeManager'})}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[3]} minSize={5}>
                            <BoxCard title={'INQUIRY & PO no'}>
                                {textAreaForm({title: '업체확인사항', rows: 4, id: 'companyVerification'})}
                                {textAreaForm({title: '비고란', rows: 4, id: 'remarks'})}
                            </BoxCard>
                        </Panel>
                        <PanelResizeHandle/>
                        <Panel defaultSize={sizes[4]} minSize={5}>
                        </Panel>
                    </PanelGroup>
                </div> : <></>}
            </MainCard>
            <Table data={tableData} column={OCInfo['write']} funcButtons={['print']} ref={tableRef}
                   type={'overseas_customer_write_column'}/>

        </div>
    </Spin>
}
